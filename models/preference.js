module.exports = (sequelize, DataTypes) => {
    const Preference = sequelize.define('Preference', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: true, // No obligatorio
        },
        marca: {
            type: DataTypes.STRING,
            allowNull: true, // No obligatorio
        },
        cilindraje: {
            type: DataTypes.FLOAT,
            allowNull: true, // No obligatorio
        },
    }, {
        tableName: 'preferences'
    });

    return Preference;
};