require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sequelize, testConnection } = require("./config/config.db");
const { loadModels } = require("./modelLoader/modelLoader");
const userRoutes = require("./routes/userRoutes");
const config = require("./config/config.env");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api", userRoutes);

const PORT = config.port || 3002;

async function testServer() {
  try {
    await testConnection();
    await loadModels().then(() => {
      sequelize.sync().then(() => {
        app.listen(PORT, () => {
          console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
      });
    });
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
  }
}

testServer();
