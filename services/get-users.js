const { sequelize } = require("../config/config.db");
const User = require("../models/user")(
  sequelize,
  require("sequelize").DataTypes
);

const getAllUsers = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    throw new Error("Error al obtener usuarios: " + error.message);
  }
};

module.exports = { getAllUsers };
