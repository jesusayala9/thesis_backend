const bcrypt = require("bcrypt");
const { sequelize } = require("../config/config.db");

const User = require("../models/user")(
  sequelize,
  require("sequelize").DataTypes
);

const registerUser = async (nombre, correo, contraseña) => {
  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const user = await User.create({
      nombre,
      correo,
      contraseña: hashedPassword,
    });
    return user;
  } catch (error) {
    throw new Error("Error al registrar usuario: " + error.message);
  }
};

module.exports = { registerUser };
