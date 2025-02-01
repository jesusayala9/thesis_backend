const { exec } = require('child_process');

exports.getRecommendations = (req, res) => {
    const { userId, num_recomendaciones } = req.body;

    exec(`python3 recommendation_script.py ${userId} ${num_recomendaciones}`, (error, stdout, stderr) => {
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