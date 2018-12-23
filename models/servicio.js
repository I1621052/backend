var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var servicioSchema = new Schema({

    nombre: { type: String, unique: true, required: [true, 'El nombre es necesario'] },
    detalles: { type: String, required: [true, 'Los detalles es necesario'] },
    precios: { type: Number, required: [true, 'El precio es necesario'] }

});

module.exports = mongoose.model('Servicio', servicioSchema);