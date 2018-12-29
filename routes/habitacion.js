var express = require('express');
var jwt = require('jsonwebtoken');
//var SEED = require('../config/config').SEED;
var mdAutenticacion = require('../middlewares/autenticacion')

var app = express();
var Habitacion = require('../models/habitacion');

//--------------------------------------------------------
//Obtener todos los habitaciones
//--------------------------------------------------------
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Habitacion.find({}, )
        .skip(desde)
        .limit(10)
        .populate('categoria', 'nombre detalles')
        .exec(
            (err, habitaciones) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mesanje: 'Error GET de habitaciones!',
                        errors: err
                    });
                }
                Habitacion.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        habitaciones,
                        total: conteo
                    });
                });
            });
});

// ========================================== 
//  Obtener Habitaciones por ID 
// ========================================== 

app.get('/:id', (req, res) => {

    var id = req.params.id;

    Habitacion.findById(id)
        .populate('categoria', 'nombre detalles')
        .exec((err, habitacion) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar habitacion',
                    errors: err
                });
            }

            if (!habitacion) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La habitacion con el id ' + id + ' no existe',
                    errors: { message: 'No existe una habitacion con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                habitacion: habitacion
            });

        })

});

//--------------------------------------------------------
//Actualizar habitacion
//--------------------------------------------------------

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Habitacion.findById(id, (err, habitacion) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mesanje: 'Error al buscar habitacion',
                errors: err
            });
        }

        if (!habitacion) {
            return res.status(400).json({
                ok: false,
                mesanje: 'El habitacion con el id' + id + ' no existe',
                errors: { message: 'No existe un habitacion con ese ID' }
            });
        }

        habitacion.numero = body.numero;
        habitacion.piso = body.piso;
        habitacion.categoria = body.categoria

        habitacion.save((err, habitacionGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mesanje: 'Error al actualizar habitacion',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                habitacion: habitacionGuardado
            });
        });
    });
});

//--------------------------------------------------------
//Crear un nuevo habitacion
//--------------------------------------------------------
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var habitacion = new Habitacion({
        numero: body.numero,
        piso: body.piso,
        categoria: body.categoria
    });

    habitacion.save((err, habitacionGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mesanje: 'Error al crear habitacion',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            habitacion: habitacionGuardado
        });
    });
});

//--------------------------------------------------------
//Borrar un habitacion por el id
//--------------------------------------------------------
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Habitacion.findByIdAndRemove(id, (err, habitacionBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mesanje: 'Error al borrar habitacion',
                errors: err
            });
        }
        if (!habitacionBorrado) {
            return res.status(400).json({
                ok: false,
                mesanje: 'No existe un habitacion con ese id',
                errors: { message: 'No existe un habitacion con ese id' }
            });
        }
        res.status(200).json({
            ok: true,
            habitacion: habitacionBorrado
        });
    });
});

module.exports = app;