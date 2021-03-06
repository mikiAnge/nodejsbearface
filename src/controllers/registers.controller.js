const registersCtrl = {}

const Register = require('../models/Register')

registersCtrl.renderRegisterForm = (req, res) => {
    res.render('registers/new-register')
}

registersCtrl.createNewRegister = async (req, res) => {
    const { name, datos } = req.body
    const newRegister = new Register({ name, datos })
    newRegister.institution = req.user.nameinstitucion
    console.log(newRegister)
    await newRegister.save()
    //Enviando mensaje de la accion realizada
    req.flash('success_msg', 'Guardado exitosamente')
    res.redirect('/registers')
}

registersCtrl.renderRegisters = async (req, res) => {
    await Register.find({institution: req.user.nameinstitucion}).sort({ updatedAt: 'desc' })
        .then(registersItem => {
            const myObject = {
                registers: registersItem.map(item => {
                    return {
                        id: item._id,
                        name: item.name,
                        datos: item.datos
                    }
                })
            }
            const registers = myObject.registers
            res.render('registers/all-registers', { registers })
        })
}

registersCtrl.renderEditForm = async (req, res) => {
    const register = await Register.findById(req.params.id)
        .then(item => {
                    return {
                        id: item._id,
                        title: item.title,
                        description: item.description
                    }
                })
            res.render('registers/edit-register', { register })
}

registersCtrl.updateRegister = async (req, res) => {
    const { title, description } = req.body;
    await Register.findByIdAndUpdate(req.params.id, {title, description})
    //Otro mensaje mas a enviar
    req.flash('success_msg', 'Registre Updated Successfully')
    res.redirect('/registers')
}

registersCtrl.deleteRegister = async (req, res) => {
    await Register.findByIdAndDelete(req.params.id)
    //Mensaje al eliminar un registro
    req.flash('success_msg', 'Registre Deleted Successfully')
    res.redirect('/registers')
}
module.exports = registersCtrl