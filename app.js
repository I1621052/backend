//Requires
var express = require('express');
var mongoose = require('mongoose');

//Inicializar variables
var app = express();

//Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/appadas', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'onLine');
})

//Rutas
app.get('/', (req, res, next) => {
    //200-realizado correctamente
    //404- recurso no encontrado
    res.status(200).json({
        ok: true,
        mesanje: 'Peticion realizada correctamente'
    })
});

//Escuchar peticiones
app.listen(3000, () => {
    console.log('express  server puerto 3000: \x1b[32m%s\x1b[0m', 'onLine');
});