const db = require("../models");
const preferenceService = require("../services/preference.services");

exports.addPreference = async (req, res) => {
  try {
    const { userId, nombre, marca, cilindraje } = req.body;
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
