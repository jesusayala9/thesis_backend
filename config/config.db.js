const { Sequelize } = require("sequelize");
const config = require("../config/config.env");

const dbName = config.dbName || "";
const dbUser = config.dbUser || "";
const dbPassword = config.dbPassword || "";
const dbHost = config.dbHost || "";
const dbPort = config.dbPort || "";

console.log("dbHost", dbHost);

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: Number(dbPort),
  dialect: "postgres",
  dialectOptions: {
    ssl: false,
  },
  logging: false,
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida correctamente.");
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
  }
}

module.exports = { sequelize, testConnection };
