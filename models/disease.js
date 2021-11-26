// Definimos el schema

const { model, Schema } = require('mongoose');

// modelo = operaciones
// schema = datos

const newDiseaseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    questions: {
        type: [],
        required: true
    },
    causes: {
        type: [],
        required: true
    },
    advices: {
        type: [],
        required: true
    }
});

module.exports = model('Disease', newDiseaseSchema);