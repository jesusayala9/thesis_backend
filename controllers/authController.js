const { loginUser } = require("../services/auth.services");

exports.login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    console.log("Solicitud de login recibida:", req.body);

    const { user, token } = await loginUser(correo, contraseña);

    res.status(200).json({
      message: "Login exitoso",
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
      },
      token: token,
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(400).json({ error: error.message });
  }
};
