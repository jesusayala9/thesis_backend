const jwt = require('jsonwebtoken');
const preferenceService = require("../services/preference.services");
const config = require("../config/config.env"); // Importar la configuración

exports.addPreference = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, config.secret_key); // Usar la clave secreta
    const userId = decoded.id;

    const { nombre, marca, cilindraje } = req.body;
    const preference = await preferenceService.addPreference({
      userId,
      nombre,
      marca,
      cilindraje,
    });
    res.status(201).json(preference);
  } catch (error) {
    console.error("Error agregando preferencia:", error);
    res.status(500).json({ error: error.message });
  }
};