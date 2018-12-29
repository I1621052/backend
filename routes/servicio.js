var express = require('express');
var jwt = require('jsonwebtoken');
//var SEED = require('../config/config').SEED;
var mdAutenticacion = require('../middlewares/autenticacion')

var app = express();
var Servicio = require('../models/servicio');

//--------------------------------------------------------
//Obtener todos los servicios
//--------------------------------------------------------
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Servicio.find({}, )
        .skip(desde)
        .limit(10)
        .exec(
            (err, servicios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mesanje: 'Error GET de servicios!',
                        errors: err
                    });
                }
                Servicio.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        servicios,
                        total: conteo
                    });
                });
            });
});

// ========================================== 
//  Obtener Servicio por ID 
// ========================================== 

app.get('/:id', (req, res) => {

    var id = req.params.id;

    Servicio.findById(id)
        .exec((err, servicio) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar servicio',
                    errors: err
                });
            }

            if (!servicio) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El servicio con el id ' + id + ' no existe',
                    errors: { message: 'No existe un servicio con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                servicio: servicio
            });

        })

});
//--------------------------------------------------------
//Actualizar servicio
//--------------------------------------------------------

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Servicio.findById(id, (err, servicio) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mesanje: 'Error al buscar servicio',
                errors: err
            });
        }

        if (!servicio) {
            return res.status(400).json({
                ok: false,
                mesanje: 'El servicio con el id' + id + ' no existe',
                errors: { message: 'No existe un servicio con ese ID' }
            });
        }

        servicio.nombre = body.nombre;
        servicio.detalles = body.detalles;
        servicio.precios = body.precios;

        servicio.save((err, servicioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mesanje: 'Error al actualizar servicio',
                    errors: err
                });
            }
            servicioGuardado.password = ':)';
            res.status(200).json({
                ok: true,
                servicio: servicioGuardado
            });
        });
    });
});

//--------------------------------------------------------
//Crear un nuevo servicio
//--------------------------------------------------------

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var servicio = new Servicio({
        nombre: body.nombre,
        detalles: body.detalles,
        precios: body.precios
    });

    servicio.save((err, servicioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mesanje: 'Error al crear servicio',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            servicio: servicioGuardado
        });
    });
});

//--------------------------------------------------------
//Borrar un servicio por el id
//--------------------------------------------------------
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Servicio.findByIdAndRemove(id, (err, servicioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mesanje: 'Error al borrar servicio',
                errors: err
            });
        }
        if (!servicioBorrado) {
            return res.status(400).json({
                ok: false,
                mesanje: 'No existe un servicio con ese id',
                errors: { message: 'No existe un servicio con ese id' }
            });
        }
        servicioBorrado.password = ':)';
        res.status(200).json({
            ok: true,
            servicio: servicioBorrado
        });
    });
});

module.exports = app;