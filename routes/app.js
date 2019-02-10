var express = require('express');
var app = express();
//Rutas
app.get('/', (req, res, next) => {
    //200-realizado correctamente
    //404- recurso no encontrado
    res.status(200).json({
        ok: true,
        mesanje: 'HOTEL ADAS PALACE'
    });
});
module.exports = app;