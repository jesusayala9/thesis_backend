const express = require("express");
const router = express.Router();
const {
  getAllMotorcyclesController,
} = require("../controllers/motorcycleController");

// Ruta para obtener todos los usuarios
router.get("/motorcycle", getAllMotorcyclesController);

module.exports = router;
