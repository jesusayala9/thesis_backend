const express = require("express");
const axios = require("axios");
const { sequelize } = require("../config/config.db");
const MotorcycleModel = require("../models/motorcycle");
const Motorcycle = MotorcycleModel(sequelize, require("sequelize").DataTypes);
const ChatHistory = require("../models/ChatHistory");
const validateQuestion = require("../utils/validateQuestion");

const router = express.Router();

// Lista de palabras clave para saludos
const generalGreetings = ["hola", "buenos días", "buenas tardes", "cómo estás", "qué tal"];

router.post("/", async (req, res) => {
    const { userId, question } = req.body;

    if (!question || !userId) {
        return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    try {
        // Detectar saludos
        const lowerCaseQuestion = question.toLowerCase();
        if (generalGreetings.some((greet) => lowerCaseQuestion.includes(greet))) {
            const answer = "¡Hola! ¿En qué puedo ayudarte hoy?";
            await ChatHistory.create({ userId, question, answer });
            return res.json({ answer });
        }

        // Recuperar el historial reciente del usuario
        const chatHistory = await ChatHistory.findAll({
            where: { userId },
            order: [["createdAt", "DESC"]],
            limit: 5,
        });

        // Determinar el contexto de la conversación
        let context = "";
        let lastRecommendedMoto = null;

        if (chatHistory.length > 0) {
            const lastInteraction = chatHistory[0];
            const recommendedMotoMatch = lastInteraction.answer.match(/\*\*(.*?)\*\*/);
            if (recommendedMotoMatch) {
                lastRecommendedMoto = recommendedMotoMatch[1];
                context = `La última moto mencionada fue: ${lastRecommendedMoto}. `;
            }
        }

        // Usar una variable temporal para manejar preguntas ambiguas
        let modifiedQuestion = question;
        if (question.toLowerCase().includes("esta moto") && lastRecommendedMoto) {
            modifiedQuestion = `Dame más características de la moto ${lastRecommendedMoto}`;
        }

        // Validar si la pregunta está relacionada con motos
        if (!validateQuestion(modifiedQuestion)) {
            return res.status(400).json({ error: "Solo puedo responder preguntas relacionadas con motos." });
        }

        // Consultar la base de datos para obtener información relevante
        const motos = await Motorcycle.findAll();
        const motosInfo = motos.map((moto) =>
            `* **${moto.nombre} (${moto.marca}, ${moto.modelo})**:\n  - Cilindraje: ${moto.cilindraje} cc\n  - Peso: ${moto.peso} kg\n  - Transmisión: ${moto.transmision}\n  - Freno delantero: ${moto.freno_delantero}\n  - Freno trasero: ${moto.freno_trasero}\n  - Precio: ${moto.precio}`
        ).join("\n\n");

        // Realizar la solicitud a la API de Google Generative Language con contexto restringido
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: `${context}Responde únicamente sobre las siguientes motos y sus características:\n\n${motosInfo}\n\nPregunta: ${modifiedQuestion}`,
                            },
                        ],
                    },
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        // Extraer la respuesta generada por el modelo
        let answer = "No se pudo generar una respuesta.";
        if (
            response.data.candidates &&
            response.data.candidates[0] &&
            response.data.candidates[0].content &&
            response.data.candidates[0].content.parts
        ) {
            answer = response.data.candidates[0].content.parts.map((part) => part.text).join(" ");
        }

        // Manejar respuestas vacías
        if (!answer || answer.trim() === "") {
            answer = "Lo siento, no tengo información sobre eso.";
        }

        // Guardar la interacción en la base de datos
        await ChatHistory.create({
            userId,
            question,
            answer,
        });

        res.json({ answer });
    } catch (error) {
        console.error("Error en el ChatBot:", error.response?.data || error.message, error.stack);
        res.status(500).json({
            error: "Error al procesar la solicitud del ChatBot",
            details: error.response?.data || error.message,
        });
    }
});

module.exports = router;