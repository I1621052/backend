var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var reservaSchema = new Schema({
    fechainicio: { type: Date, required: [true, 'La fecha inicio es necesario'] },
    fechafin: { type: Date, required: [true, 'La fecha fin es necesario'] },
    precio: { type: Number, required: [true, 'El precios es obligatorio'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    habitacion: { type: Schema.Types.ObjectId, ref: 'Habitacion', required: [true, 'El idHabitacion es	un campo obligatorio'] },
    servicio: { type: Schema.Types.ObjectId, ref: 'Servicio', required: [true, 'El idServicio es un campo obligatorio'] },
});
module.exports = mongoose.model('Reserva', reservaSchema);