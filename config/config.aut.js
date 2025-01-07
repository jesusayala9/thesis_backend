const dotenv = require("dotenv");
dotenv.config();

const config = {
  secret_key: process.env.SECRET_KEY,
};

module.exports = config;
