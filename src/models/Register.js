const {Schema, model} = require('mongoose')

const RegisterSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    datos: { 
        type: String
    },
    institution: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = model('Register', RegisterSchema)