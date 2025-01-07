const db = require('../models');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    try {
        console.log('Solicitud de registro recibida:', req.body); // Log para verificar la solicitud
        const { nombre, correo, contraseña } = req.body;
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        const user = await db.User.create({
            nombre,
            correo,
            contraseña: hashedPassword,
        });
        console.log('Usuario registrado:', user); // Log para verificar el usuario registrado
        res.status(201).json(user);
    } catch (error) {
        console.error('Error registrando usuario:', error); // Log para verificar errores
        res.status(500).json({ error: error.message });
    }
};