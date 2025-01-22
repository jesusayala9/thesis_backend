const express = require("express");
const router = express.Router();
const { getUsersController } = require("../controllers/get-users.controller");

// Ruta para obtener todos los usuarios
router.get("/users", getUsersController);

module.exports = router;
