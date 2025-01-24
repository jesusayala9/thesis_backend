const express = require("express");
const router = express.Router();
const {
  recoverPasswordController,
} = require("../controllers/password-recovery");

router.post("/user/recover-password", recoverPasswordController);

module.exports = router;
