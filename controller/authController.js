const User = require('../models/UserModel');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async(req, res) => {
    //validamos los errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    const { email, password } = req.body;

    try {

        let user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({ msg: 'El usuario no existe' });
        }

        const passCorrecto = await bcryptjs.compare(password, user.password);

        if (!passCorrecto) {
            res.status(400).json({ msg: 'Password incorrecta' });
        }

        //Crear y firmar token
        const payload = {
            user: {
                id: user.id
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
    }
};