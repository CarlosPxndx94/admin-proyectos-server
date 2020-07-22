const Proyecto = require('../models/ProyectoModel');
const { validationResult } = require('express-validator');

exports.postProyecto = async(req, res) => {

    //validamos los errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        let proyecto = new Proyecto(req.body);

        //Guardar usuario via jwt
        proyecto.user = req.user.id;

        //guardar el proyecto
        await proyecto.save();
        res.json({ proyecto });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
}

//Obtener proyectos por usuario logueado
exports.getProyectos = async(req, res) => {
    try {
        const proyectos = await Proyecto.find({ user: req.user.id }).sort({ fecha: -1 });
        res.json({ proyectos });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
}

//Actualizar proyecto
exports.putProyecto = async(req, res) => {
    //validamos los errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    const { id, nombre } = req.body;
    const nuevoProyecto = {};

    if (nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {
        //revisar el ID
        let proyecto = await Proyecto.findById(id);

        //si el proyecto existe
        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no existe' });
        }

        //verificar el creador del proyecto
        if (proyecto.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Usuario no autorizado para editar este Proyecto' });
        }

        //actualizar
        proyecto = await Proyecto.findByIdAndUpdate({ _id: id }, { $set: nuevoProyecto }, { new: true });
        res.json({ proyecto });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
}

//Eliminar proyecto
exports.deleteProyecto = async(req, res) => {
    try {
        //revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        //si el proyecto existe
        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no existe' });
        }

        //verificar el creador del proyecto
        if (proyecto.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Usario no autorizado para eliminar este Proyecto' });
        }

        //Eliminar
        await Proyecto.findOneAndRemove({ _id: req.params.id });
        return res.json({ msg: 'Proyecto eliminado' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
}