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
//const {isAuthenticated} = require('../helpers/validateauth')
//Nuevos Registros descomentar luego cuando este funcionando todo
/*router.get('/persons/add',isAuthenticated, renderRegisterForm)*/
router.get('/persons/add', renderPersonForm)

router.post('/persons/upload', uploadPerson) 

//Obtener todos los registros
router.get('/persons', renderRegisterPersons)

//Obtener registros especificos
router.post('/persons/see', searchPerson)

router.get('/persons/update', renderSeePerson)

//Eliminar registros
router.delete('/persons/delete/:id', deleteDate)

module.exports = router