const { Schema, model } = require('mongoose')

const PersonSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    description: { type: String},
    filename: { type: String},
    path: { type: String},
    originalname: { type: String},
    mimetype: { type: String},
    size: { type: Number}
}, {
    timestamps: true
})


module.exports = model('Person', PersonSchema)