const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/users_controller");

router.post("/signup", usersController.signup);
// POST /users/signup

// Content-Type: application/json
// RequestBody: {
//   "email": "example@example.com",
//   "password": "examplepassword"
// }

router.post("/login", usersController.login);
// POST /users/login

// Content-Type: application/json
// RequestBody: {
//   "email": "example@example.com",
//   "password": "examplepassword"
// }

router.post("/logout", usersController.logout);
// POST / users / logout;

// Authorization: "Bearer {{token}}";

router.get("/current", usersController.current);
// GET / users / current;

// Authorization: "Bearer {{token}}";

module.exports = router;
