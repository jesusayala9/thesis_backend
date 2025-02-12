const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfileImage } = require('../controllers/profileController');

router.get('/profile/:id', getUserProfile);
router.put('/profile/:id', updateUserProfileImage); // Añadir la ruta para actualizar la imagen de perfil

module.exports = router;