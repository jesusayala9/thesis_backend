const express = require("express");
const router = express.Router();
const preferenceController = require("../controllers/preferenceController");

router.post("/user/addPreference", preferenceController.addPreference);

module.exports = router;
