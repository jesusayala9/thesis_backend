const { sequelize } = require("../config/config.db");

const Preference = require("../models/preference")(
  sequelize,
  require("sequelize").DataTypes
);

const addPreference = async ({ userId, nombre, marca, cilindraje }) => {
  try {
    const preference = await Preference.create({
      userId,
      nombre,
      marca,
      cilindraje,
    });
    return preference;
  } catch (error) {
    console.error("Error en el servicio al agregar preferencia:", error);
    throw new Error("No se pudo agregar la preferencia");
  }
};

module.exports = { addPreference };
