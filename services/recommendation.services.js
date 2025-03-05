const { sequelize } = require("../config/config.db");
const Recomendacion = require("../models/recommendations")(sequelize, require("sequelize").DataTypes);

const guardarRecomendaciones = async (userId, motoIds) => {
    try {
        const recomendaciones = motoIds.map(motoId => ({
            userId,
            motoId,
        }));
        console.log("Recomendaciones a guardar:", recomendaciones); // Agregar log para verificar los datos
        await Recomendacion.bulkCreate(recomendaciones);
    } catch (error) {
        throw new Error("Error al guardar las recomendaciones: " + error.message);
    }
};

const obtenerRecomendacionesPorUsuario = async (userId) => {
    try {
        const recomendaciones = await Recomendacion.findAll({ where: { userId } });
        return recomendaciones;
    } catch (error) {
        throw new Error("Error al obtener las recomendaciones: " + error.message);
    }
};

module.exports = { guardarRecomendaciones, obtenerRecomendacionesPorUsuario };