const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sequelize } = require("../config/config.db");
const User = require("../models/user")(
  sequelize,
  require("sequelize").DataTypes
);
const config = require("../config/config.aut");

const loginUser = async (correo, contraseña) => {
  try {
    const user = await User.findOne({ where: { correo } });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const validPassword = await bcrypt.compare(contraseña, user.contraseña);

    if (!validPassword) {
      throw new Error("Contraseña incorrecta");
    }
    // Crear token
    const token = jwt.sign(
      { id: user.id, correo: user.correo },
      config.secret_key,
      { expiresIn: "1h" }
    );

    return { user, token };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { loginUser };
