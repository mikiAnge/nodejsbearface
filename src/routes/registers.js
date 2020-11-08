const { Router } = require('express')
const router = Router()

const { 
    renderRegisterForm, 
    createNewRegister, 
    renderRegisters, 
    renderEditForm, 
    updateRegister, 
    deleteRegister 
} = require('../controllers/registers.controller')
//importando funcion que protege rutas que no es accesible para todos
const {isAuthenticated} = require('../helpers/validateauth')
//Nuevos Registros
router.get('/registers/add',isAuthenticated, renderRegisterForm)

router.post('/registers/upload',isAuthenticated, createNewRegister)

//Obtener todos los registros
router.get('/registers',isAuthenticated, renderRegisters)

//Editar registros
router.get('/registers/edit/:id',isAuthenticated, renderEditForm)

router.put('/registers/edit/:id',isAuthenticated, updateRegister)

//Eliminar registros
router.delete('/registers/delete/:id', deleteRegister)
module.exports = router