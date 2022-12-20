const asyncHandler = require("express-async-handler");

const userModel = require("../db/models/UserModel");
const {
  generateJwt,
  blacklistJwt,
  checkIfJwtIsBlacklisted,
  verifyJwt,
} = require("../utility/jwtUtils");
const sendEmail = require("../utility/sendEmail");
const hashPassword = require("../utility/hashPassword");
const config = require("../../config/config");

//tu1@gmail.com

// Helpers

const generateResetPasswordLinkForUser = (_id, email, expirationTime) => {
  const jwtPayload = {
    _id: _id,
    email: email,
  };

  const resetPasswordToken = generateJwt(jwtPayload, expirationTime);

  const resetPasswordLink =
    process.env.FRONTEND_BASE_URL +
    `/user/reset-password/${_id}/${resetPasswordToken}`;

  return resetPasswordLink;
};

const sendResetPasswordEmail = async (userEmail, signupReset = false) => {
  const userExists = await userModel.findOne({ email: userEmail });
  if (!userExists) {
    return {
      error: {
        errorCode: 1,
        message: "No user signed up with this email.",
      },
    };
  }

  tokenExpirationTime = signupReset
    ? process.env.FIRST_TIME_RESET_PASSWORD_JWT_EXPIRATION_TIME
    : process.env.RESET_PASSWORD_JWT_EXPIRATION_TIME;

  const resetPasswordLink = generateResetPasswordLinkForUser(
    userExists._id,
    userExists.email,
    tokenExpirationTime
  );

  let subject = "";
  let text = "";

  if (signupReset) {
    subject = "Reset your password.";
    text = `To reset your password, click on the following one-time link: ${resetPasswordLink}. The link will expire in 7 days.`;
  } else {
    subject = "Reset your password.";
    text = `To reset your password, click on the following one-time link: ${resetPasswordLink}. The link will expire in 15 minutes.`;
  }

  sendEmailInfo = await sendEmail(userEmail, subject, text);

  if (!sendEmailInfo.ok) {
    return {
      error: {
        errorCode: 2,
        message: "No user signed up with this email.",
      },
    };
  }

  return {
    message: "Email sent.",
  };
};

const verifyResetPasswordTokenAndIdAndGetUser = async (_id, token) => {
  const tokenVerificationResult = verifyJwt(token);

  if (!tokenVerificationResult.success) {
    if (tokenVerificationResult.error === "blacklisted") {
      return {
        success: false,
        error: {
          errorCode: 1,
          message: "Reset password token already used.",
        },
      };
    }

    if (tokenVerificationResult.error === "TokenExpiredError") {
      return {
        success: false,
        error: {
          errorCode: 2,
          message: "Reset password token expired.",
        },
      };
    }

    if (tokenVerificationResult.error === "JsonWebTokenError") {
      return {
        success: false,
        error: {
          errorCode: 3,
          message: "Invalid reset password token.",
        },
      };
    }

    return {
      success: false,
      error: {
        errorCode: 4,
        message: "Unknown token verification error.",
      },
    };
  }

  const tokenPayload = tokenVerificationResult.result.tokenPayload;

  if (_id != tokenPayload._id) {
    return {
      success: false,
      error: {
        errorCode: 3,
        message: "Invalid reset password token.",
      },
    };
  }

  const userExists = await userModel.findOne({ _id: _id });
  if (!userExists) {
    return {
      success: false,
      error: {
        errorCode: 3,
        message: "Invalid reset password token.",
      },
    };
  }

  if (tokenPayload.email != userExists.email) {
    return {
      success: false,
      error: {
        errorCode: 3,
        message: "Invalid reset password token.",
      },
    };
  }

  return {
    success: true,
    result: {
      userDetails: {
        _id: userExists._id,
        name: userExists.name,
        email: userExists.email,
      },
    },
  };
};

// Route Controllers

const requestResetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const emailSentOutput = await sendResetPasswordEmail(email, false);

  if (emailSentOutput.error) {
    if (emailSentOutput.error.errorCode === 1) {
      res.status(400);
    } else {
      res.status(500);
    }
  }

  res.json(emailSentOutput);
});

const verifyResetPasswordTokenAndId = asyncHandler(async (req, res) => {
  const { _id, token } = req.body;

  const resetPasswordTokenVerificationResullt =
    await verifyResetPasswordTokenAndIdAndGetUser(_id, token);

  if (!resetPasswordTokenVerificationResullt.success) {
    if (resetPasswordTokenVerificationResullt.error.errorCode == 4) {
      res.status(500);
    } else {
      res.status(400);
    }
  } else {
    res.status(200);
  }

  return res.json(resetPasswordTokenVerificationResullt);
});

const resetPassword = asyncHandler(async (req, res) => {
  const { _id, token, newPassword } = req.body; // get user id, reset token, and new password

  const resetPasswordTokenVerificationResullt =
    await verifyResetPasswordTokenAndIdAndGetUser(_id, token); // first we check if the id and token are still valid

  if (!resetPasswordTokenVerificationResullt.success) {
    // if not valid, we assign HTTP status code based on the error code and send the response
    if (resetPasswordTokenVerificationResullt.error.errorCode == 4) {
      res.status(500);
    } else {
      res.status(400);
    }

    return res.json(resetPasswordTokenVerificationResullt);
  }

  // The id and the token are valid, so we update the user's password
  const updatedUser = await userModel.findByIdAndUpdate(_id, {
    hashedPassword: await hashPassword(newPassword),
  });

  if (!updatedUser) {
    return res.status(500).json({
      success: false,
    });
  }

  blacklistJwt(token);

  return res.status(200).json({
    success: true,
    result: {
      message: "Password updated.",
    },
  });
});

const createNewUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await userModel.findOne({ email: email });
  if (userExists) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Email already taken.",
      },
    });
  }

  const newUser = await userModel.create({
    name: name,
    email: email,
    hashedPassword: await hashPassword(password),
    passwordResetCount: 0,
    isRestricted: false,
  });

  if (!newUser) {
    return res.status(500).json({
      success: false,
    });
  }

  res.status(201).json({
    success: true,
    result: {
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    },
  });
});

const signInUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userExists = await userModel.findOne({ email: email });
  if (!userExists || !(await userExists.checkPassword(password))) {
    return res.status(400).json({
      error: "Invalid credentials.",
    });
  }

  res.status(200).json({
    user: {
      _id: userExists._id,
      name: userExists.name,
      email: userExists.email,
    },
    tokens: {
      access: generateJwt(
        { _id: userExists._id, tokenType: "access" },
        process.env.ACCESS_TOKEN_EXPIRATION_TIME
      ),
      refresh: generateJwt(
        { _id: userExists._id, tokenType: "refresh" },
        process.env.REFRESH_TOKEN_EXPIRATION_TIME
      ),
    },
  });
});

const requestNewAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const tokenVerificationResult = verifyJwt(refreshToken);

  if (!tokenVerificationResult.success) {
    return res.status(401).json({
      success: false,
      error: {
        erroCode: 12,
        message: "Refresh token invalid, expired, or blacklisted.",
      },
    });
  }

  const { _id, tokenType } = tokenVerificationResult.result.tokenPayload;

  if (tokenType != "refresh") {
    return res.status(401).json({
      success: false,
      error: {
        errorCode: 13,
        message: "Invalid refresh token.",
      },
    });
  }

  const userExists = await userModel.findById(_id);
  if (!userExists) {
    return res.status(401).json({
      success: false,
      error: {
        errorCode: 13,
        message: "Invalid refresh token.",
      },
    });
  }

  res.status(200).json({
    user: {
      _id: userExists._id,
      name: userExists.name,
      email: userExists.email,
    },
    tokens: {
      access: generateJwt(
        { userId: userExists._id, tokenType: "access" },
        process.env.ACCESS_TOKEN_EXPIRATION_TIME
      ),
      refresh: refreshToken,
    },
  });
});

const signOutUser = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  blacklistJwt(refreshToken);

  res.status(200).json({
    success: true,
  });
});

module.exports = {
  createNewUser,
  requestResetPassword,
  verifyResetPasswordTokenAndId,
  resetPassword,
  signInUser,
  requestNewAccessToken,
  signOutUser,
};
