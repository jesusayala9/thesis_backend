const { sequelize } = require("../config/config.db");
const User = require("../models/user")(
  sequelize,
  require("sequelize").DataTypes
);
module.exports = (sequelize, DataTypes) => {
  const Preference = sequelize.define(
    "Preference",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: "id",
        },
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      marca: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cilindraje: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      precioMin: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      precioMax: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
    },
    {
      tableName: "preferences",
      timestamps: true,
    }
  );

  return Preference;
};