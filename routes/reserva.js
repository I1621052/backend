var express = require('express');
var jwt = require('jsonwebtoken');
//var SEED = require('../config/config').SEED;
var mdAutenticacion = require('../middlewares/autenticacion')

var app = express();
var Reserva = require('../models/reserva');

//--------------------------------------------------------
//Obtener todos los reservas
//--------------------------------------------------------
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Reserva.find({}, )
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre apellidos email')
        .populate('habitacion', 'numero piso')
        .populate('servicio', 'nombre detalles precios')
        .exec(
            (err, reservas) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mesanje: 'Error GET de reservas!',
                        errors: err
                    });
                }
                Reserva.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        reservas,
                        total: conteo
                    });
                });
            });
});

// ========================================== 
//  Obtener reserva por ID 
// ========================================== 

app.get('/:id', (req, res) => {

    var id = req.params.id;

    Reserva.findById(id)
        .exec((err, reserva) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar reserva',
                    errors: err
                });
            }

            if (!reserva) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La reserva con el id ' + id + ' no existe',
                    errors: { message: 'No existe una reserva con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                reserva: reserva
            });

        })

});

//--------------------------------------------------------
//Actualizar reserva
//--------------------------------------------------------

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Reserva.findById(id, (err, reserva) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mesanje: 'Error al buscar reserva',
                errors: err
            });
        }

        if (!reserva) {
            return res.status(400).json({
                ok: false,
                mesanje: 'El reserva con el id' + id + ' no existe',
                errors: { message: 'No existe un reserva con ese ID' }
            });
        }

        reserva.dni = body.dni;
        reserva.nombre = body.nombre;
        reserva.apellidos = body.apellidos;
        reserva.numero = body.numero;
        reserva.fechainicio = body.fechainicio;
        reserva.fechafin = body.fechafin;
        reserva.precio = body.precio;
        reserva.total = body.total;
        reserva.usuario = body.usuario;
        reserva.habitacion = body.habitacion;
        reserva.servicio = body.servicio;

        reserva.save((err, reservaGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mesanje: 'Error al actualizar reserva',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                reserva: reservaGuardado
            });
        });
    });
});

//--------------------------------------------------------
//Crear un nuevo reserva
//--------------------------------------------------------
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var reserva = new Reserva({
        dni: body.dni,
        nombre: body.nombre,
        apellidos: body.apellidos,
        numero: body.numero,
        fechainicio: body.fechainicio,
        fechafin: body.fechafin,
        precio: body.precio,
        total: body.total,
        habitacion: body.habitacion,
        servicio: body.servicio
    });

    reserva.save((err, reservaGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mesanje: 'Error al crear reserva',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            reserva: reservaGuardado,
            token: req.usuario
        });
    });
});

//--------------------------------------------------------
//Borrar un reserva por el id
//--------------------------------------------------------
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Reserva.findByIdAndRemove(id, (err, reservaBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mesanje: 'Error al borrar reserva',
                errors: err
            });
        }
        if (!reservaBorrado) {
            return res.status(400).json({
                ok: false,
                mesanje: 'No existe un reserva con ese id',
                errors: { message: 'No existe un reserva con ese id' }
            });
        }
        res.status(200).json({
            ok: true,
            reserva: reservaBorrado
        });
    });
});

module.exports = app;