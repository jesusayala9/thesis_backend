const { exec } = require('child_process');
const db = require('../models');

exports.getRecommendations = async (req, res) => {
    const { userId, nombre_preferido, marca_preferida, cilindraje_preferido, num_recomendaciones } = req.body;

    // Ejecutar el script de Python con los parámetros necesarios
    exec(`python3 recommendation/svd_algorithm.py ${userId} ${nombre_preferido} ${marca_preferida} ${cilindraje_preferido} ${num_recomendaciones}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error ejecutando el script: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
        if (stderr) {
            console.error(`Error en el script: ${stderr}`);
            return res.status(500).json({ error: stderr });
        }
        res.status(200).json(JSON.parse(stdout));
    });
};