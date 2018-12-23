var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var habitacionSchema = new Schema({
    numero: { type: String, unique: true, required: [true, 'El numero de habitacion es necesario'] },
    piso: { type: Number, required: [true, 'El piso es necesario'] },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: [true, 'la categoria es necesaria'] }
}, { collection: 'habitaciones' });
module.exports = mongoose.model('Habitacion', habitacionSchema);