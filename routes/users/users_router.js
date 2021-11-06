const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/users_controller");
const guard = require("../../helpers/guard");
const loginLimiter = require("../../helpers/rate-limit-login");
const uploads = require("../../helpers/uploads");
const {
  validateUser,
  validateSubscriptionStatus,
  validateEmail,
} = require("./validation");
const wrapError = require("../../helpers/error_handler");

router.post("/signup", validateUser, wrapError(usersController.signup));
router.post(
  "/login",
  loginLimiter,
  validateUser,
  wrapError(usersController.login)
);
router.post("/logout", guard, wrapError(usersController.logout));
router.get("/current", guard, wrapError(usersController.current));
router.patch(
  "/",
  guard,
  validateSubscriptionStatus,
  wrapError(usersController.updateSubscription)
);
router.patch(
  "/avatars",
  guard,
  uploads.single("avatar"),
  wrapError(usersController.uploadAvatar)
);

router.get("/verify/:verificationToken", wrapError(usersController.verifyUser));
router.post(
  "/verify",
  validateEmail,
  wrapError(usersController.repeatEmailForVerifyUser)
);

module.exports = router;
