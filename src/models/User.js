const {Schema, model} = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new Schema({
    name: {
        type: String,
        required: false
    },
    lastname: {
        type: String,
        required: false,
        unique: true
    },
    ci: {
        type: String,
        required: false,
        unique: true
    },
    extension: {
        type: String,
        required: false
    },
    numcontact: {
        type: Number,
        required: false
    },
    nameinstitucion: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    nameuser: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps:true
})

UserSchema.methods.encryptPassword = async password => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

UserSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

module.exports = model('User', UserSchema)