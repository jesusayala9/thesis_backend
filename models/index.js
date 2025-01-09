const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://usuario:12345@localhost:5432/sistema_recomendacionf');

const User = require('./user')(sequelize, DataTypes);
const Preference = require('./preference')(sequelize, DataTypes);
const Motorcycle = require('./motorcycle')(sequelize, DataTypes);

// Definir relaciones
User.hasMany(Preference, { foreignKey: 'userId' });
Preference.belongsTo(User, { foreignKey: 'userId' });

const db = {
    User,
    Preference,
    Motorcycle,
    sequelize,
    Sequelize
};

module.exports = db;