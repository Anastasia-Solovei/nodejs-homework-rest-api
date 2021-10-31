const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/users_controller");
const guard = require("../../helpers/guard");
const { validateUser } = require("./validation");

router.post("/signup", validateUser, usersController.signup);

router.post("/login", validateUser, usersController.login);

router.post("/logout", guard, usersController.logout);

router.get("/current", guard, usersController.current);
// GET / users / current;

// Authorization: "Bearer {{token}}";

module.exports = router;
