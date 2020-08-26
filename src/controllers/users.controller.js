const usersCtrl = {}

const passport = require('passport')

const User = require('../models/User')

usersCtrl.renderSingUpForm = (req, res) => {
    res.render('users/singup')
}

usersCtrl.singup = async (req, res) => {
    const errors = []
    const {name, lastname, ci, extension, numcontact, email, nameuser, password, confirm_password} = req.body
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
            const newUser = new User({name, lastname, ci, extension, numcontact, email, nameuser, password})
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