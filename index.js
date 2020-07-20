const express = require('express');
const connectBD = require('./config/db');

//crear server
const app = express();

//conectar BD
connectBD();

//Habilitar express.json
app.use(express.json({ extended: true }));

const PORT = process.env.PORT || 4000;

//importar rutas
app.use('/api/users/', require('./routes/usersRoute'));

app.listen(PORT, () => {
    console.log(`El app esta corriendo por el puerto ${PORT}`);
});