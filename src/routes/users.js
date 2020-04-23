const express = require('express')
const router = express.Router()

const { renderSingUpForm, renderSingInForm, singup, singin, logout } = require('../controllers/users.controller')

router.get('/users/singup', renderSingUpForm)

router.post('/users/singup', singup)

router.get('/users/singin', renderSingInForm)

router.post('/users/singin', singin)

router.get('/users/logout', logout)

module.exports = router