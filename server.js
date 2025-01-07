const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors()); // Asegúrate de que CORS esté habilitado
app.use(bodyParser.json());

app.use('/api', userRoutes);

db.sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos establecida correctamente.');
        return db.sequelize.sync();
    })
    .then(() => {
        app.listen(8000, () => {
            console.log('Servidor corriendo en http://localhost:8000');
        });
    })
    .catch(err => {
        console.error('No se pudo conectar a la base de datos:', err);
    });