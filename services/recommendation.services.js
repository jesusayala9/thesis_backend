const { sequelize } = require("../config/config.db");
const Recomendacion = require("../models/recommendations")(sequelize, require("sequelize").DataTypes);
const Motorcycle = require("../models/motorcycle")(sequelize, require("sequelize").DataTypes); // Corregir la importación del modelo

// Definir las asociaciones
Recomendacion.associate({ Motorcycle });
Motorcycle.associate({ Recomendacion });

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
        const recomendaciones = await Recomendacion.findAll({
            where: { userId },
            include: [{ model: Motorcycle, as: 'moto' }] // Corregir la referencia al modelo
        });
        return recomendaciones.map(rec => rec.moto);
    } catch (error) {
        throw new Error("Error al obtener las recomendaciones: " + error.message);
    }
};

module.exports = { guardarRecomendaciones, obtenerRecomendacionesPorUsuario };