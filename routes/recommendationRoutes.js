const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');

router.post('/recommendations', recommendationController.getRecommendations);
router.post('/recomendaciones', recommendationController.guardarRecomendaciones);
router.get('/recomendaciones/:userId', recommendationController.obtenerRecomendacionesPorUsuario);
router.delete('/recomendaciones/:searchId', recommendationController.eliminarRecomendacion); // Añadir esta línea

module.exports = router;