const { Ratings } = require('../models');
const { recomendar_motocicletas_colaborativo } = require('../recommendation/svd_algoritm');

exports.addRating = async (req, res) => {
    try {
        const { user_id, moto_id, rating } = req.body;
        const newRating = await Ratings.create({ user_id, moto_id, rating });
        res.status(201).json(newRating);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCollaborativeRecommendations = async (req, res) => {
    try {
        const user_id = req.query.user_id;
        const numRecomendaciones = req.query.numRecomendaciones || 5;
        const recomendaciones = await recomendar_motocicletas_colaborativo(user_id, numRecomendaciones);
        res.status(200).json(recomendaciones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};