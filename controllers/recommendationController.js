const { exec } = require('child_process');
const path = require('path');
const db = require('../models');

exports.getRecommendations = async (req, res) => {
    const { userId, num_recomendaciones } = req.body;

    // Construir la ruta completa al script de Python
    const scriptPath = path.join(__dirname, '../recommendation/svd_algoritm.py');

    // Ejecutar el script de Python con los parámetros necesarios
    const command = `python "${scriptPath}" ${userId} ${num_recomendaciones}`;
    console.log(`Ejecutando comando: ${command}`);
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error ejecutando el script: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
        if (stderr) {
            console.error(`Error en el script: ${stderr}`);
            return res.status(500).json({ error: stderr });
        }
        try {
            console.log(`Salida del script: ${stdout}`);
            const recommendations = JSON.parse(stdout);
            res.status(200).json(recommendations);
        } catch (parseError) {
            console.error(`Error parseando la salida del script: ${parseError.message}`);
            res.status(500).json({ error: parseError.message });
        }
    });
};