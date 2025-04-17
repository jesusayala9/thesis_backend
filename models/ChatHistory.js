const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/config.db");

const ChatHistory = sequelize.define("ChatHistory", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    question: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    answer: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

module.exports = ChatHistory;