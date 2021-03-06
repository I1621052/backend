var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var reservaSchema = new Schema({
    dni: { type: String, required: [true, 'El dni es necesario'] },
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    apellidos: { type: String, required: [true, 'El apellido es necesario'] },
    numero: { type: Number, required: [true, 'El numero es necesario'] },
    fechainicio: { type: Date, required: [true, 'La fecha inicio es necesario'] },
    fechafin: { type: Date, required: [true, 'La fecha fin es necesario'] },
    total: { type: Number, required: [true, 'El total es obligatorio'] },
    habitacion: { type: Schema.Types.ObjectId, ref: 'Habitacion', required: [true, 'El idHabitacion es	un campo obligatorio'] },
    servicio: { type: Schema.Types.ObjectId, ref: 'Servicio' },
});
module.exports = mongoose.model('Reserva', reservaSchema);