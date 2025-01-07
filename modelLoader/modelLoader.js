const { sequelize } = require("../config/config.db");

const User = require("../models/user")(
  sequelize,
  require("sequelize").DataTypes
);
const Motorcycle = require("../models/motorcycle.js")(
  sequelize,
  require("sequelize").DataTypes
);
const Recommendations = require("../models/recommendations.js")(
  sequelize,
  require("sequelize").DataTypes
);
const Preference = require("../models/preference.js")(
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
    await Motorcycle.sync();
    console.log("Modelo motorcycle cargado correctamente.");
    await Preference.sync();
    console.log("Modelo preference cargado correctamente.");
  } catch (error) {
    console.error("Error al cargar los modelos:", error);
  }
}

module.exports = { loadModels };
