const Tarea = require('../models/TareaModel');
const Proyecto = require('../models/ProyectoModel');
const { validationResult } = require('express-validator');

exports.postTarea = async(req, res) => {
    //validamos los errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        const { proyecto } = req.body;
        //revisar el ID
        let proyectoExiste = await Proyecto.findById(proyecto);

        //si el proyecto existe
        if (!proyectoExiste) {
            return res.status(404).json({ msg: 'Proyecto no existe' });
        }

        //verificar el creador del proyecto
        if (proyectoExiste.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Usuario no autorizado para crear tareas en este Proyecto' });
        }

        //guardar el tarea
        let tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
}

//Obtener tareas por usuario proyecto
exports.getTareas = async(req, res) => {
    try {

        const { proyecto } = req.query;
        //revisar el ID
        let proyectoExiste = await Proyecto.findById(proyecto);

        //si el proyecto existe
        if (!proyectoExiste) {
            return res.status(404).json({ msg: 'Proyecto no existe' });
        }

        //verificar el creador del proyecto
        if (proyectoExiste.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Usuario no autorizado para ver las tareas en este Proyecto' });
        }

        const tareas = await Tarea.find({ proyecto }).sort({ fecha: -1 });
        res.json({ tareas });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
}

//Actualizar tarea
exports.putTarea = async(req, res) => {
    //validamos los errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        const { _id, nombre, proyecto, estado } = req.body;

        //revisar el ID de la tarea
        let tarea = await Tarea.findById(_id);

        //si la tarea existe
        if (!tarea) {
            return res.status(404).json({ msg: 'Tarea no existe' });
        }

        //Validamos el id del proyecto
        let proyectoExiste = await Proyecto.findById(proyecto);

        //si el proyecto existe
        if (!proyectoExiste) {
            return res.status(404).json({ msg: 'Proyecto no existe' });
        }

        //verificar el creador del proyecto
        if (proyectoExiste.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Usuario no autorizado para editar la tarea de este Proyecto' });
        }

        const nuevaTarea = {};

        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        //actualizar
        tarea = await Tarea.findByIdAndUpdate({ _id }, { $set: nuevaTarea }, { new: true });
        res.json({ tarea });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
}

//Eliminar tarea
exports.deleteTarea = async(req, res) => {
    try {
        const { id, proyecto } = req.query;
        //revisar el ID de la tarea
        let tarea = await Tarea.findById(id);

        //si la tarea existe
        if (!tarea) {
            return res.status(404).json({ msg: 'Tarea no existe' });
        }

        //Validamos el id del proyecto
        let proyectoExiste = await Proyecto.findById(proyecto);

        //si el proyecto existe
        if (!proyectoExiste) {
            return res.status(404).json({ msg: 'Proyecto no existe' });
        }

        //verificar el creador del proyecto
        if (proyectoExiste.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Usuario no autorizado para eliminar la tarea de este Proyecto' });
        }

        //Eliminar
        await Tarea.findOneAndRemove({ _id: id });
        return res.json({ msg: 'Tarea eliminada' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
}