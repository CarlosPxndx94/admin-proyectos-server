//Rutas para crear usuarios
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { check } = require('express-validator');

//Crear usuario
//api/users
router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email valido').isEmail(),
        check('password', 'El password debe ser minimo de 6 caracteres').isLength({ min: 6 })
    ],
    userController.crearUser
);

module.exports = router;