const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfileImage, updateUserProfile } = require('../controllers/profileController');

router.get('/profile/:id', getUserProfile);
router.put('/profile/:id/image', updateUserProfileImage); // Cambiar la ruta para actualizar la imagen de perfil
router.put('/profile/:id', updateUserProfile); // Ruta para actualizar los datos del usuario

module.exports = router;