const { recoverPassword } = require("../services/password-recovery");

const recoverPasswordController = async (req, res) => {
  const { correo } = req.body;

  try {
    if (!correo) {
      return res.status(400).json({ error: "El correo es obligatorio." });
    }

    const message = await recoverPassword(correo);
    res.status(200).json({ message });
  } catch (error) {
    console.error("Error en la recuperación de contraseña:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { recoverPasswordController };
