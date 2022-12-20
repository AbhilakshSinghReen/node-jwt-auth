const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const userModel = require("../db/models/UserModel");
const { verifyJwt } = require("../utility/jwtUtils");

// Checks if the request has the Super Admin Secret Key in the Bearer Token
const requireSuperAdmin = asyncHandler(async (req, res, next) => {
  let token;

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return res.sendStatus(401);
    // throw new Error("No authorization token.");
  }

  try {
    token = req.headers.authorization.split(" ")[1];

    if (token !== process.env.SUPER_ADMIN_SECRET_KEY) {
      return res.sendStatus(401);
    }

    next();
  } catch (error) {
    return res.sendStatus(401);
    // throw new Error("Bad authorization token.");
  }
});

// UNTESTED
// Possible error at userId instead of _id
const requireAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const tokenVerificationResult = verifyJwt(token);

      if (!tokenVerificationResult.success) {
        if (tokenVerificationResult.error === "TokenExpiredError") {
          return res.status(401).json({
            success: false,
            error: {
              errorCode: 10,
              message: "Access token expired.",
            },
          });
        }

        return res.status(401).json({
          success: false,
          error: {
            errorCode: 11,
            message: "Invalid token.",
          },
        });
      }

      const { _id, tokenType } = tokenVerificationResult.result.tokenPayload;

      if (tokenType != "access") {
        return res.status(401).json({
          success: false,
          error: {
            errorCode: 11,
            message: "Invalid token.",
          },
        });
      }

      req.user = await userModel.findById(_id).select("-hashedPassword");

      next();
    } catch (error) {
      res.sendStatus(401);
      //   throw new Error("Bad authorization token.");
    }
  }

  if (!token) {
    res.status(401);
    // throw new Error("No authorization token.");
  }
});

module.exports = { requireAuth, requireSuperAdmin };
