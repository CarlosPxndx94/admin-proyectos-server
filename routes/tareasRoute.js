const express = require('express');
const router = express.Router();
const tareaController = require('../controller/tareaController');
const authMiddleware = require('../middleware/authMiddleware');
const { check } = require('express-validator');
const { model } = require('mongoose');

//Crear Tarea
//api/tareas
router.post('/',
    authMiddleware, [
        check('nombre', 'El nombre de la tarea es obligatorio').not().isEmpty(),
        check('proyecto', 'El proyecto es obligatorio').not().isEmpty()
    ],
    tareaController.postTarea
);

router.get('/',
    authMiddleware,
    tareaController.getTareas
);

router.put('/',
    authMiddleware, [
        check('nombre', 'El nombre de la tarea es obligatorio').not().isEmpty(),
        check('proyecto', 'El proyecto es obligatorio').not().isEmpty()
    ],
    tareaController.putTarea
);


router.delete('/',
    authMiddleware,
    tareaController.deleteTarea
);

module.exports = router;