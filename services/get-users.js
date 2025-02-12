const { sequelize } = require("../config/config.db");
const User = require("../models/user")(sequelize, require("sequelize").DataTypes);

const getAllUsers = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    throw new Error("Error al obtener usuarios: " + error.message);
  }
};

const getUserById = async (id) => {
  try {
    const user = await User.findByPk(id);
    return user;
  } catch (error) {
    throw new Error("Error al obtener el usuario: " + error.message);
  }
};

const updateUserProfileImage = async (id, profileImage) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    user.profileImage = profileImage;
    await user.save();
    return user;
  } catch (error) {
    throw new Error("Error al actualizar la imagen de perfil: " + error.message);
  }
};

const updateUserProfile = async (id, { nombre, correo }) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    user.nombre = nombre;
    user.correo = correo;
    await user.save();
    return user;
  } catch (error) {
    throw new Error("Error al actualizar los datos del usuario: " + error.message);
  }
};

module.exports = { getAllUsers, getUserById, updateUserProfileImage, updateUserProfile };