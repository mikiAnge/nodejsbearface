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
    ci: {
        type: String,
        required: false
    },
    extension: {
        type: String,
        required: false
    },
    description: { type: String},
    filename: { type: String},
    path: { type: String},
    originalname: { type: String},
    mimetype: { type: String},
    size: { type: Number},

    institution: { type: String}
}, {
    timestamps: true
})


module.exports = model('Person', PersonSchema)