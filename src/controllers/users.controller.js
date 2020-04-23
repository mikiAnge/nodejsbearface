const usersCtrl = {}

const passport = require('passport')

const User = require('../models/User')

usersCtrl.renderSingUpForm = (req, res) => {
    res.render('users/singup')
}

usersCtrl.singup = async (req, res) => {
    const errors = []
    const {name, email, password, confirm_password} = req.body
    if (password != confirm_password) {
        errors.push({text: 'Passwords do not match'})
    }
    if (password.length < 4) {
        errors.push({text: 'Passwords must be at least 4 characters.'})
    }
    if (errors.length > 0) {
        res.render('users/singup', {
            errors,
            name,
            email
        })
    } else{
        const emailUser = await User.findOne({email: email})
        if (emailUser) {
            req.flash('error_msg', 'The email is already in use')
            res.redirect('/users/singup')
        } else {
            const newUser = new User({name, email, password})
            newUser.password = await newUser.encryptPassword(password)
            await newUser.save()
            req.flash('success_msg', 'You are Registered')
            res.redirect('/users/singin')
        }
    }
}

usersCtrl.renderSingInForm = (req, res) => {
    res.render('users/singin')
}

usersCtrl.singin = passport.authenticate('local', {
    failureRedirect: '/users/singin',
    successRedirect: '/registers',
    failureFlash: true
})

usersCtrl.logout = (req, res) => {
    req.logout()
    req.flash('success_msg', 'You are logged out now.')
    res.redirect('/users/singin')
}

module.exports = usersCtrl