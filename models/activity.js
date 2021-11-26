const { model, Schema } = require('mongoose');


const newActivitySchema = new Schema({
    date: {
        type: String,
        required: true
    },
    disease: {
        type: String,
        required: true
    },
    cause: {
        type: String,
        required: true
    },
    advice: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
});

module.exports = model('Activity', newActivitySchema);