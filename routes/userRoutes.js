const express = require("express");

const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router.post("/register", userController.register);

router.post("/user/register", userController.register);
router.post("/user/login", authController.login);

module.exports = router;
