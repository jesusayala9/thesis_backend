const { sequelize } = require("../config/config.db");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../models/user")(
  sequelize,
  require("sequelize").DataTypes
);

// Genera una contraseña aleatoria
const generateRandomPassword = () => {
  return crypto.randomBytes(8).toString("hex");
};

// Envía el correo con la nueva contraseña
const sendRecoveryEmail = async (email, newPassword) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Recuperación de Contraseña",
    text: `Tu contraseña ha sido restablecida. Tu nueva contraseña es: "${newPassword}" Por favor, cámbiala después de iniciar sesión.`,
  };

  await transporter.sendMail(mailOptions);
};

const recoverPassword = async (correo) => {
  const user = await User.findOne({ where: { correo: correo } });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const newPassword = generateRandomPassword();

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.contraseña = hashedPassword;
  await user.save();

  console.log(
    `Contraseña actualizada para el usuario ${correo}: ${newPassword}`
  );

  await sendRecoveryEmail(correo, newPassword);

  return "Correo enviado con la nueva contraseña.";
};

module.exports = { recoverPassword };
