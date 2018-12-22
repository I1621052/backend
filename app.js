//Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Inicializar variables
var app = express();

//body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
    //app.use(express.json());

//Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var categoriaRoutes = require('./routes/categoria');
var servicioRoutes = require('./routes/servicio');
var habitacionRoutes = require('./routes/habitacion');

//Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/DBModIII', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'onLine');
});
//Rutas
app.use('/usuario', usuarioRoutes);
app.use('/categoria', categoriaRoutes);
app.use('/servicio', servicioRoutes);
app.use('/habitacion', habitacionRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

//Escuchar peticiones
app.listen(3000, () => {
    console.log('express  server puerto 3000: \x1b[32m%s\x1b[0m', 'onLine');
});