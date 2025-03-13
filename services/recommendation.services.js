const { sequelize } = require("../config/config.db");
const Recomendacion = require("../models/recommendations")(sequelize, require("sequelize").DataTypes);
const Motorcycle = require("../models/motorcycle")(sequelize, require("sequelize").DataTypes);
const { v4: uuidv4 } = require('uuid'); // Importar uuid para generar identificadores únicos

// Definir las asociaciones
Recomendacion.associate = (models) => {
    Recomendacion.belongsTo(models.Motorcycle, {
        foreignKey: "motoId",
        as: "moto",
    });
};

Motorcycle.associate = (models) => {
    Motorcycle.hasMany(models.Recomendacion, {
        foreignKey: "motoId",
        as: "recomendaciones",
    });
};

// Aplicar las asociaciones
Recomendacion.associate({ Motorcycle });
Motorcycle.associate({ Recomendacion });

const guardarRecomendaciones = async (userId, motoIds) => {
    try {
        const searchId = uuidv4(); // Generar un identificador único para la búsqueda
        const recomendaciones = motoIds.map(motoId => ({
            userId,
            motoId,
            searchId,
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
            include: [{ model: Motorcycle, as: 'moto' }]
        });
        return recomendaciones;
    } catch (error) {
        throw new Error("Error al obtener las recomendaciones: " + error.message);
    }
};

module.exports = { guardarRecomendaciones, obtenerRecomendacionesPorUsuario };