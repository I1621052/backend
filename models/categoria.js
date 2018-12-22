var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var categoriaSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    detalles: { type: String, required: [true, 'Los apellidos es necesario'] }

}, { collection: 'categorias' });

module.exports = mongoose.model('Categoria', categoriaSchema);