const { Ratings, Motos } = require('../models');
const { recomendar_motocicletas_colaborativo } = require('../recommendation/svd_algoritm');

exports.addRating = async (user_id, moto_id, rating) => {
    return await Ratings.create({ user_id, moto_id, rating });
};

exports.getCollaborativeRecommendations = async (user_id, numRecomendaciones) => {
    return await recomendar_motocicletas_colaborativo(user_id, numRecomendaciones);
};