const express = require('express');
const connectBD = require('./config/db');
const cors = require('cors');

//crear server
const app = express();

//conectar BD
connectBD();

// habilitar cors
app.use(cors());

//Habilitar express.json
app.use(express.json({ extended: true }));

const PORT = process.env.PORT || 4000;

//importar rutas
app.use('/api/users', require('./routes/usersRoute'));
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/proyectos', require('./routes/proyectosRoute'));
app.use('/api/tareas', require('./routes/tareasRoute'));

app.listen(PORT, () => {
    console.log(`El app esta corriendo por el puerto ${PORT}`);
});