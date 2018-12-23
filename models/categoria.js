var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var categoriaSchema = new Schema({

    nombre: { type: String, unique: true, required: [true, 'El nombre es necesario'] },
    detalles: { type: String, required: [true, 'Los apellidos es necesario'] }

}, { collection: 'categorias' });

module.exports = mongoose.model('Categoria', categoriaSchema);