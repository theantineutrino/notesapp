const express = require("express");
const userController = require("../controller/userController");
const authController = require("../controller/authController");
const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

// router.route("/login").post();

// router.route("/").post(userController.createUser);

module.exports = router;
