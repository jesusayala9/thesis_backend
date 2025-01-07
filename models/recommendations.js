const { sequelize } = require("../config/config.db");
const User = require("../models/user")(
  sequelize,
  require("sequelize").DataTypes
);

module.exports = (sequelize, DataTypes) => {
  const Recommendations = sequelize.define(
    "Recommendations",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: "id",
        },
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      marca: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      cilindraje: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      imagen: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      modelo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "recomendaciones",
    }
  );

  return Recommendations;
};
