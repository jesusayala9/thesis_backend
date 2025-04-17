const express = require("express");
const axios = require("axios");
const ChatHistory = require("../models/ChatHistory"); // Importar el modelo ChatHistory

const router = express.Router(); // Crear una instancia de router

router.post("/", async (req, res) => {
    const { userId, question } = req.body;

    if (!question || !userId) {
        return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    try {
        // Realizar la solicitud a la API de Google Generative Language
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            { text: question } // Pregunta enviada por el usuario
                        ]
                    }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        // Inspeccionar la respuesta completa de la API
        console.log("Respuesta completa de la API:", response.data);

        // Verificar y extraer la respuesta generada por el modelo
        let answer = "No se pudo generar una respuesta.";
        if (
            response.data.candidates &&
            response.data.candidates[0] &&
            response.data.candidates[0].content &&
            response.data.candidates[0].content.parts
        ) {
            // Concatenar todas las partes del texto en una sola cadena
            answer = response.data.candidates[0].content.parts
                .map(part => part.text)
                .join(" ");
        }

        // Guardar la interacción en la base de datos
        await ChatHistory.create({
            userId,
            question,
            answer,
        });

        res.json({ answer });
    } catch (error) {
        console.error("Error en el ChatBot:", error.response?.data || error.message);
        res.status(500).json({
            error: "Error al procesar la solicitud del ChatBot",
            details: error.response?.data || error.message,
        });
    }
});

module.exports = router; // Exportar el router