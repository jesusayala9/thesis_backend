const { getAllMotorcycles } = require("../services/motorcycle.services");

const getAllMotorcyclesController = async (req, res) => {
  try {
    const motorcycle = await getAllMotorcycles();
    res.status(200).json(motorcycle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllMotorcyclesController };
