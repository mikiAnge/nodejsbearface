const { Router } = require('express')
const router = Router()

const { 
    renderPersonForm, 
    uploadPerson, 
    renderRegisterPersons, 
    searchPerson, 
    renderSeePerson, 
    deleteDate 
} = require('../controllers/person.controller')
//importando funcion que protege rutas que no es accesible para todos
const {isAuthenticated} = require('../helpers/validateauth')
//Nuevos Registros descomentar luego cuando este funcionando todo
router.get('/persons/add',isAuthenticated, renderPersonForm)

router.post('/persons/upload',isAuthenticated, uploadPerson) 

//Obtener todos los registros
router.get('/persons',isAuthenticated, renderRegisterPersons)

//Obtener registros especificos
router.post('/persons/see',isAuthenticated, searchPerson)

router.get('/persons/update',isAuthenticated, renderSeePerson)

//Eliminar registros
router.delete('/persons/delete/:id', deleteDate)

module.exports = router 