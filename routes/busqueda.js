var express = require('express');
var app = express();
var Habitacion = require('../models/habitacion');
var Categoria = require('../models/categoria');
var Usuario = require('../models/usuario');
var Reserva = require('../models/reserva');
var Servicio = require('../models/servicio');

//======================================BUSQUEDA POR COLECCION

app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');
    var promesa;
    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'categorias':
            promesa = buscarCategorias(busqueda, regex);
            break;

        case 'servicios':
            promesa = buscarServicios(busqueda, regex);
            break;

        case 'habitaciones':
            promesa = buscarHabitaciones(busqueda, regex);
            break;

        case 'reservas':
            promesa = buscarReservas(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda desconocida',
                error: { message: 'coleccion no vlaida' }
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
});

//======================================BUSQUEDA GENERAL
app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarHabitaciones(busqueda, regex),
            buscarCategorias(busqueda, regex),
            buscarUsuarios(busqueda, regex),
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

function buscarUsuarios(busqueda, regex) {
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