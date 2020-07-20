const mongoose = require('mongoose');
require('dotenv').config({ path: 'properties.env' });

const connectBD = async() => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        console.log('Conexion a DB exitosa');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectBD;