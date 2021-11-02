const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/users_controller");
const guard = require("../../helpers/guard");
const loginLimiter = require("../../helpers/rate-limit-login");
const { validateUser, validateSubscriptionStatus } = require("./validation");

router.post("/signup", validateUser, usersController.signup);

router.post("/login", loginLimiter, validateUser, usersController.login);

router.post("/logout", guard, usersController.logout);

router.get("/current", guard, usersController.current);

router.patch(
  "/",
  guard,
  validateSubscriptionStatus,
  usersController.updateSubscription
);

module.exports = router;
