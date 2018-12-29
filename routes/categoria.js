var express = require('express');
var jwt = require('jsonwebtoken');
//var SEED = require('../config/config').SEED;
var mdAutenticacion = require('../middlewares/autenticacion')

var app = express();
var Categoria = require('../models/categoria');

//--------------------------------------------------------
//Obtener todos los categorias
//--------------------------------------------------------
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Categoria.find({}, )
        .skip(desde)
        .limit(10)
        .exec(
            (err, categorias) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mesanje: 'Error GET de categorias!',
                        errors: err
                    });
                }
                Categoria.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        categorias,
                        total: conteo
                    });
                });

            });
});

// ========================================== 
//  Obtener Categoria por ID 
// ========================================== 

app.get('/:id', (req, res) => {

    var id = req.params.id;

    Categoria.findById(id)
        .exec((err, categoria) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar categoria',
                    errors: err
                });
            }

            if (!categoria) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La categoria con el id ' + id + ' no existe',
                    errors: { message: 'No existe una categoria con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                categoria: categoria
            });

        })

});


//--------------------------------------------------------
//Actualizar categoria
//--------------------------------------------------------

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Categoria.findById(id, (err, categoria) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mesanje: 'Error al buscar categoria',
                errors: err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                mesanje: 'El categoria con el id' + id + ' no existe',
                errors: { message: 'No existe un categoria con ese ID' }
            });
        }

        categoria.nombre = body.nombre;
        categoria.detalles = body.detalles;

        categoria.save((err, categoriaGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mesanje: 'Error al actualizar categoria',
                    errors: err
                });
            }
            categoriaGuardado.password = ':)';
            res.status(200).json({
                ok: true,
                categoria: categoriaGuardado
            });
        });
    });
});

//--------------------------------------------------------
//Crear un nuevo categoria
//--------------------------------------------------------
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var categoria = new Categoria({
        nombre: body.nombre,
        detalles: body.detalles
    });

    categoria.save((err, categoriaGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mesanje: 'Error al crear categoria',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            categoria: categoriaGuardado,
            categoriaToken: req.categoria
        });
    });
});

//--------------------------------------------------------
//Borrar un categoria por el id
//--------------------------------------------------------
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mesanje: 'Error al borrar categoria',
                errors: err
            });
        }
        if (!categoriaBorrado) {
            return res.status(400).json({
                ok: false,
                mesanje: 'No existe un categoria con ese id',
                errors: { message: 'No existe un categoria con ese id' }
            });
        }
        categoriaBorrado.password = ':)';
        res.status(200).json({
            ok: true,
            categoria: categoriaBorrado
        });
    });
});

module.exports = app;