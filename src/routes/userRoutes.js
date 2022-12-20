const express = require("express");

const {} = require("../middlewares/authMiddleware");
const {
  requestResetPassword,
  verifyResetPasswordTokenAndId,
  resetPassword,
  signInUser,
  requestNewAccessToken,
  signOutUser,
} = require("../controllers/userControllers");

const router = express.Router();

router.put("/request-reset-password", requestResetPassword);
router.get(
  "/verify-reset-password-token-and-id",
  verifyResetPasswordTokenAndId
);
router.patch("/reset-password", resetPassword);
router.get("/sign-in", signInUser);
router.get("/request-new-access-token", requestNewAccessToken);
router.get("/sign-out", signOutUser);

module.exports = router;
