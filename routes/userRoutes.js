const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/user/register", userController.register);
router.post("/user/login", authController.login);

module.exports = router;
