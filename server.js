const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');
const userRoutes = require('./routes/userRoutes');
const preferenceRoutes = require('./routes/preferenceRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', userRoutes);
app.use('/api', preferenceRoutes);
app.use('/api', recommendationRoutes);

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