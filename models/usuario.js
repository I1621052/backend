var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};
var usuarioSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    apellidos: { type: String, required: [true, 'Los apellidos es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesario'] },
    img: { type: String, required: false },
    rol: { type: String, required: true, uppercase: true, default: 'USER_ROLE', enum: rolesValidos }

});

usuarioSchema.plugin(uniqueValidator, { message: 'el correo debe ser unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);