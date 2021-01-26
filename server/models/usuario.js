const mongoose = require('mongoose');
const uniquevalidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let rolevalidator = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es valido'
}

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es requerido"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "el email es necesario"]
    },
    password: {
        type: String,
        required: [true, "El password es obligatorio"]
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolevalidator
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})

usuarioSchema.plugin(uniquevalidator, { message: '{PATH} debe ser único' });

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject
}
module.exports = mongoose.model('Usuario', usuarioSchema)