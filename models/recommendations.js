module.exports = (sequelize, DataTypes) => {
    const Recomendacion = sequelize.define(
        "Recomendacion",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            motoId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "recomendaciones",
            timestamps: false, // Desactivar las marcas de tiempo automáticas
        }
    );

    return Recomendacion;
};