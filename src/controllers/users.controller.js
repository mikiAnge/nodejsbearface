const usersCtrl = {}

const passport = require('passport')

const User = require('../models/User')

usersCtrl.renderSingUpForm = async (req, res) => {
    await User.find().sort({ nameinstitucion: 'desc' })
    .then(usersItem => {
        const myObject = {
            users: usersItem.map(item => {
                return {
                    nameinstitucion: item.nameinstitucion
                }
            })
        }
        const users = myObject.users
        res.render('users/singup', { users })
    })
}

usersCtrl.singup = async (req, res) => {
    const errors = []
    const {name, lastname, ci, extension, numcontact, nameinstitucion, email, nameuser, password, confirm_password} = req.body
    if (password != confirm_password) {
        errors.push({text: 'Las contraseñas no son iguales'})
    }
    if (password.length < 4) {
        errors.push({text: 'La contraseña debe contener mas de 4 caracteres'})
    }
    if (errors.length > 0) {
        res.render('users/singup', {
            errors,
            name,
            lastname,
            ci,
            extension,
            numcontact,
            nameinstitucion,
            email,
            nameuser
        })
    } else{
        const emailUser = await User.findOne({email: email})
        const nameUser = await User.findOne({nameuser: nameuser})
        if (emailUser) {
            req.flash('error_msg', 'El email esta en uso')
            res.redirect('/users/singup')
        } 
        if (nameUser) {
            req.flash('error_msg', 'El nombre de usuario esta en uso')
            res.redirect('/users/singup')
        }
        else {
            const newUser = new User({name, lastname, ci, extension, numcontact, nameinstitucion, email, nameuser, password})
            newUser.password = await newUser.encryptPassword(password)
            await newUser.save()
            req.flash('success_msg', 'Registrado correctamente')
            res.redirect('/users/singin')
        }
    }
}

usersCtrl.renderSingInForm = (req, res) => {
    res.render('users/singin')
}

usersCtrl.singin = passport.authenticate('local', {
    failureRedirect: '/users/singin',
    //successRedirect: '/registers',
    successRedirect: '/persons',
    failureFlash: true
})

usersCtrl.logout = (req, res) => {
    req.logout()
    req.flash('success_msg', 'Sesion cerrada corectamente')
    res.redirect('/users/singin')
}

module.exports = usersCtrl