const { recoverPassword } = require("../services/password-recovery");

const recoverPasswordController = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ error: "El correo es obligatorio." });
    }

    const message = await recoverPassword(email);
    res.status(200).json({ message });
  } catch (error) {
    console.error("Error en la recuperación de contraseña:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { recoverPasswordController };
