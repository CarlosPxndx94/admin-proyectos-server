const User = require('../models/UserModel');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUser = async(req, res) => {

    //validamos los errores
    const errores = validationResult(req);
    console.log(errores.array());
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    const { email, password } = req.body;

    try {
        let usuario = await User.findOne({ email });

        if (usuario) {
            return res.status(400).json({
                msg: 'El usuario ya existe'
            });
        }

        //Creamos user 
        usuario = new User(req.body);

        //hash pass
        const salt = await bcryptjs.genSalt(10);

        usuario.password = await bcryptjs.hash(password, salt);

        //save user
        await usuario.save();

        //Crear y firmar token
        const payload = {
            user: {
                id: usuario.id
            }
        };

        //firma
        jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 3600
        }, (error, token) => {
            if (error) throw error;

            res.json({
                token
            });
        });


    } catch (error) {
        console.log(error);
        res.status(400).send('Ha ocurrido un error');
    }
};