module.exports = (sequelize, DataTypes) => {
    const Ratings = sequelize.define('Ratings', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        moto_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    });

    Ratings.associate = function (models) {
        Ratings.belongsTo(models.User, { foreignKey: 'user_id' });
        Ratings.belongsTo(models.Motos, { foreignKey: 'moto_id' });
    };

    return Ratings;
};