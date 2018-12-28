var express = require('express');
var app = express();
var Habitacion = require('../models/habitacion');
var Categoria = require('../models/categoria');
var Usuario = require('../models/usuario');
var Reserva = require('../models/reserva');
var Servicio = require('../models/servicio');

//Rutas
app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarHabitaciones(busqueda, regex),
            buscarCategorias(busqueda, regex),
            buscaruUsuarios(busqueda, regex),
            buscarReservas(busqueda, regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                habitaciones: respuestas[0],
                categorias: respuestas[1],
                usuarios: respuestas[2],
                reservas: respuestas[3]
            });
        });

});

//===================================================BUSCAR CATEGORIA
function buscarCategorias(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Categoria.find({ nombre: regex }, (err, categorias) => {
            if (err) {
                reject('Error al cargar categorias', err);
            } else {
                resolve(categorias)
            }
        });
    });
}

//===================================================BUSCAR HABITACIONES
function buscarHabitaciones(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Habitacion.find({ numero: regex })
            .populate('categoria', 'nombre detalles')
            .exec((err, habitaciones) => {
                if (err) {
                    reject('Error al cargar habitaciones', err);
                } else {
                    resolve(habitaciones)
                }
            });
    });
}

//===================================================BUSCAR USUARIOS

function buscaruUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email rol')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios')
                } else {
                    resolve(usuarios)
                }
            });
    });
}

//===================================================BUSCAR RESERVA

function buscarReservas(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Reserva.find({ dni: regex })
            .populate('usuario', 'nombre email')
            .populate('habitacion', 'numero piso')
            .populate('servicio', 'nombre detalles')
            .exec((err, reservas) => {
                if (err) {
                    reject('Error al cargar reservas', err);
                } else {
                    resolve(reservas)
                }
            });
    });
}

//===================================================BUSCAR SERVICIOS

function buscarServicios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Servicio.find({ nombre: regex }, (err, servicios) => {
            if (err) {
                reject('Error al cargar servicios', err);
            } else {
                resolve(servicios)
            }
        });
    });
}

module.exports = app;