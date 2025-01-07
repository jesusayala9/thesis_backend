const { sequelize } = require("../config/config.db");

const User = require("../models/user")(
  sequelize,
  require("sequelize").DataTypes
);

const Recommendations = require("../models/recommendations.js")(
  sequelize,
  require("sequelize").DataTypes
);

// Función para cargar los modelos y sincronizarlos
async function loadModels() {
  try {
    await User.sync();
    console.log("Modelo user cargado correctamente.");
    await Recommendations.sync();
    console.log("Modelo recommendations cargado correctamente.");
  } catch (error) {
    console.error("Error al cargar los modelos:", error);
  }
}

module.exports = { loadModels };
