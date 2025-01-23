const express = require("express");
const router = express.Router();
const {
  getAllMotorcyclesController,
} = require("../controllers/motorcycleController");

router.get("/motorcycle", getAllMotorcyclesController);

module.exports = router;
