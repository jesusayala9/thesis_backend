// filepath: /C:/Users/petus/Desktop/Trabajo de grado 2/thesis_frontend-main/thesis_frontend-main/thesis_backend-main/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);

module.exports = router;