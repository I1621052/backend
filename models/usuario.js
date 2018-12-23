var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE', 'EMPLOYEE_USER'],
    message: '{VALUE} no es un rol valido'
};
var usuarioSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    apellidos: { type: String },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesario'] },
    img: { type: String, required: false },
    ol: { type: String, required: true, uppercase: true, default: 'USER_ROLE', enum: rolesValidos },
    google: { type: Boolean, default: false }

});

usuarioSchema.plugin(uniqueValidator, { message: 'el correo debe ser unico' });
module.exports = mongoose.model('Usuario', usuarioSchema);