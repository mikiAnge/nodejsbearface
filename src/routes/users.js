const express = require('express')
const router = express.Router()

const { renderSingUpForm, renderSingInForm, singup, singin, logout } = require('../controllers/users.controller')

//importando funcion que protege rutas que no es accesible para todos
const {isAuthenticated} = require('../helpers/validateauth')

router.get('/users/singup', isAuthenticated, renderSingUpForm)

router.post('/users/singup', isAuthenticated, singup)

router.get('/users/singin', renderSingInForm)

router.post('/users/singin', singin)

router.get('/users/logout', logout)

module.exports = router