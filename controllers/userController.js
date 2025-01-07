const db = require('../models');

exports.registerUser = async (req, res) => {
    try {
        const { nombre, correo, contraseña } = req.body;
        const user = await db.User.create({
            nombre,
            correo,
            contraseña,
        });
        res.status(201).json(user);
    } catch (error) {
        console.error('Error registrando usuario:', error);
        res.status(500).json({ error: error.message });
    }
};