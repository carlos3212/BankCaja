const mongoose = require('mongoose');


let Schema = mongoose.Schema;


let cajaInfo = new Schema({
    n_caja: {
        type: Number,
        required: [true, "El numero de caja es requerido"]
    },
    fecha: {
        type: String,
        required: [true, "La fecha es requerida"]
    },
    hora: {
        type: String,
        required: [true, "La hora es requerida"]
    }
})

module.exports = mongoose.model('Caja', cajaInfo)