const { sequelize } = require("../config/config.db");
const Motorcycle = require("../models/motorcycle")(
  sequelize,
  require("sequelize").DataTypes
);

const getAllMotorcycles = async () => {
  try {
    const motorcycles = await Motorcycle.findAll();
    return motorcycles;
  } catch (error) {
    throw new Error("Error al obtener las motos: " + error.message);
  }
};

module.exports = { getAllMotorcycles };
