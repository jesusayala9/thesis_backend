const { sequelize } = require("../config/config.db");
const Preference = require("../models/preference")(sequelize, require("sequelize").DataTypes);

const addPreference = async ({ userId, nombre, marca, cilindraje, precioMin, precioMax }) => {
  try {
    const preference = await Preference.create({
      userId,
      nombre: nombre || null,
      marca: marca || null,
      cilindraje: cilindraje ? parseFloat(cilindraje) : null,
      precioMin: precioMin || null,
      precioMax: precioMax || null,
    });
    return preference;
  } catch (error) {
    console.error("Error en el servicio al agregar preferencia:", error);
    throw new Error("No se pudo agregar la preferencia");
  }
};

module.exports = { addPreference };