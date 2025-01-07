const express = require('express');
const router = express.Router();
const preferenceController = require('../controllers/preferenceController');

router.post('/addPreference', preferenceController.addPreference);

module.exports = router;