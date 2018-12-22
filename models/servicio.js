var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var servicioSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    detalles: { type: String, required: [true, 'Los detalles es necesario'] },
    precios: { type: Number, required: [true, 'El precio es necesario'] }

});

module.exports = mongoose.model('Servicio', servicioSchema);