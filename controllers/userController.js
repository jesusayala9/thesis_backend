const userService = require("../services/user.services");

exports.register = async (req, res) => {
  try {
    console.log("Solicitud de registro recibida:", req.body);
    const { nombre, correo, contraseña } = req.body;
    const user = await userService.registerUser(nombre, correo, contraseña);
    console.log("Usuario registrado:", user);
    res.status(201).json(user);
  } catch (error) {
    console.error("Error registrando usuario:", error);
    res.status(500).json({ error: error.message });
  }
};
