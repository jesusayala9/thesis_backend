const express = require('express');
const router = express.Router();
const preferenceController = require('../controllers/preferenceController');

// Definir la ruta para agregar preferencias
router.post('/user/addPreference', preferenceController.addPreference);

module.exports = router;