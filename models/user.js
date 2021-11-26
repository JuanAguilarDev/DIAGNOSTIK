// Definimos el schema

const { model, Schema } = require('mongoose');

// modelo = operaciones
// schema = datos

const newUserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    code: {
        type: String,
    }
});

module.exports = model('User', newUserSchema);