const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');

router.post('/recommendations', recommendationController.getRecommendations);
router.post('/recomendaciones', recommendationController.guardarRecomendaciones);

module.exports = router;