const { exec } = require('child_process');
const path = require('path');
const { guardarRecomendaciones, obtenerRecomendacionesPorUsuario } = require('../services/recommendation.services');

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

exports.guardarRecomendaciones = async (req, res) => {
    const { userId, motoIds } = req.body;
    console.log("Solicitud para guardar recomendaciones:", { userId, motoIds });

    try {
        await guardarRecomendaciones(userId, motoIds);
        res.status(200).json({ message: 'Recomendaciones guardadas correctamente' });
    } catch (error) {
        console.error("Error al guardar las recomendaciones:", error);
        res.status(500).json({ error: 'Error al guardar las recomendaciones' });
    }
};

exports.obtenerRecomendacionesPorUsuario = async (req, res) => {
    const { userId } = req.params;
    console.log("Solicitud para obtener recomendaciones del usuario:", { userId });

    try {
        const recomendaciones = await obtenerRecomendacionesPorUsuario(userId);
        const agrupadasPorBusqueda = recomendaciones.reduce((acc, rec) => {
            const searchId = rec.searchId;
            const createdAt = rec.createdAt.toISOString().split('T')[0]; // Obtener solo la fecha
            if (!acc[searchId]) {
                acc[searchId] = { createdAt, recomendaciones: [] };
            }
            acc[searchId].recomendaciones.push(rec);
            return acc;
        }, {});
        res.status(200).json(agrupadasPorBusqueda);
    } catch (error) {
        console.error("Error al obtener las recomendaciones del usuario:", error);
        res.status(500).json({ error: 'Error al obtener las recomendaciones del usuario' });
    }
};