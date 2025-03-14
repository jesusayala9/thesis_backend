module.exports = (sequelize, DataTypes) => {
  const Motorcycle = sequelize.define(
    "Motorcycle",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      peso: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      transmision: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      freno_delantero: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      freno_trasero: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      modelo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imagen: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      precio: {
        type: DataTypes.STRING,
        allowNull: false,
      }

    },
    {
      tableName: "motos",
      timestamps: false,
    }
  );

  Motorcycle.associate = (models) => {
    Motorcycle.hasMany(models.Recomendacion, {
      foreignKey: "motoId",
      as: "recomendaciones",
    });
  };

  return Motorcycle;
};