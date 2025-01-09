const dotenv = require("dotenv");
dotenv.config();

const config = {
  port: process.env.PORT || 3001,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
  secret_key: process.env.SECRET_KEY,
};

module.exports = config;
