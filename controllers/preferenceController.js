const db = require('../models');

exports.addPreference = async (req, res) => {
    try {
        const { userId, nombre, marca, cilindraje } = req.body;
        const preference = await db.Preference.create({
            userId,
            nombre,
            marca,
            cilindraje,
        });
        res.status(201).json(preference);
    } catch (error) {
        console.error('Error agregando preferencia:', error);
        res.status(500).json({ error: error.message });
    }
};