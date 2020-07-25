const express = require('express');
const router = express.Router();
const proyectoController = require('../controller/proyectoController');
const authMiddleware = require('../middleware/authMiddleware');
const { check } = require('express-validator');

//Crear Proyecto
//api/proyectos
router.post('/',
    authMiddleware, [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.postProyecto
);

router.get('/',
    authMiddleware,
    proyectoController.getProyectos
);

router.put('/',
    authMiddleware, [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.putProyecto
);

router.delete('/:id',
    authMiddleware,
    proyectoController.deleteProyecto
);

module.exports = router;