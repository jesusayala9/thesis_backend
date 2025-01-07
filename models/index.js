const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://usuario:12345@localhost:5432/sistema_recomendacionf');

const User = require('./user')(sequelize, DataTypes);
const Preference = require('./preference')(sequelize, DataTypes);
const Motorcycle = require('./motorcycle')(sequelize, DataTypes);

const db = {
    User,
    Preference,
    Motorcycle,
    sequelize,
    Sequelize
};

module.exports = db;