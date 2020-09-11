const personCtrl = {}
const Person = require('../models/Person')
const { unlink } = require('fs-extra')
const path = require('path')

personCtrl.renderPersonForm = (req, res) => {
    res.render('persons/register-person')
}

personCtrl.uploadPerson = async (req, res) => {
    const errors = []
    const { name, lastname, age, ci, extension, description } = req.body
    const { filename, originalname, mimetype, size } = req.file
    const path = '/media/labeled_images/'+req.file.filename

    if (name == "") {
        errors.push({text: 'Rellene el campo de nombre'})
    }
    if (lastname == ""){
        errors.push({text: 'Rellene el campo de apellido'})
    }
    if (age == "") {
        errors.push({text: 'Rellene el campo de edad'})
    }
    if (ci == "") {
        errors.push({text: 'Rellene el campo de Cedula de identidad'})
    }
    if (extension == "") {
        errors.push({text: 'Seleccione una extensión'})
    }
    if (filename == ""){
        errors.push({text: 'Debe seleccionar una imagen'})
    }
    if (errors.length > 0) {
        res.render('persons/register-person', {
            errors, name, lastname, age, ci, description
        })
    } else{
        const newPerson = new Person({ name, lastname, age, ci, extension, description, filename, path, originalname, mimetype, size })
        //guardando id o el dato requerido del usuario que se loguea junto con el registro
        newPerson.institution = req.user.nameinstitucion

        await newPerson.save()
        req.flash('success_msg', 'Datos Añadidos Satisfactoriamente')
        res.redirect('/persons')
    }
}

personCtrl.renderRegisterPersons = async (req, res) => {
    await Person.find({institution: req.user.nameinstitucion}).sort({ updatedAt: 'desc' })
        .then(personsItem => {
            const myObject = {
                persons: personsItem.map(item => {
                    return {
                        id: item._id,
                        name: item.name,
                        lastname: item.lastname,
                        age: item.age,
                        ci: item.ci,
                        extension: item.extension,
                        description: item.description,
                        path: item.path,
                        updatedAt: item.updatedAt
                    }
                })
            }
            const persons = myObject.persons
            res.render('persons/all-persons', { persons })
        })
}

personCtrl.searchPerson = async (req, res) => {
    const { ci } = req.body
    //const { name, ci } = req.body
    //console.log(name, lastname)
    if (ci != '') {
        await Person.find({ ci, institution: req.user.nameinstitucion })
            .then(personsItem => {
                const myObject = {
                    persons: personsItem.map(item => {
                        return {
                            id: item._id,
                            name: item.name,
                            lastname: item.lastname,
                            age: item.age,
                            ci: item.ci,
                            description: item.description,
                            path: item.path,
                            updatedAt: item.updatedAt
                        }
                    })
                }
                const persons = myObject.persons
                res.render('persons/see-person', { persons })
                //console.log(persons)
                //console.log(lastname)
            })
    }
    /*
    if (name != '' && ci != '') {
        await Person.find({ name, ci })
            .then(personsItem => {
                const myObject = {
                    persons: personsItem.map(item => {
                        return {
                            id: item._id,
                            name: item.name,
                            lastname: item.lastname,
                            age: item.age,
                            description: item.description,
                            path: item.path,
                            updatedAt: item.updatedAt
                        }
                    })
                }
                const persons = myObject.persons
                res.render('persons/see-person', { persons })
                //console.log(persons)
                //console.log(name, lastname)
            })
    }
    else if (name != '') {

        //console.log(name.length, lastname.length)
        await Person.find({ name })
            .then(personsItem => {
                const myObject = {
                    persons: personsItem.map(item => {
                        return {
                            id: item._id,
                            name: item.name,
                            lastname: item.lastname,
                            age: item.age,
                            description: item.description,
                            path: item.path,
                            updatedAt: item.updatedAt
                        }
                    })
                }
                const persons = myObject.persons
                res.render('persons/see-person', { persons })
                //console.log(persons)
                //console.log(name)
            })
    }
    else {
        await Person.find({ ci })
            .then(personsItem => {
                const myObject = {
                    persons: personsItem.map(item => {
                        return {
                            id: item._id,
                            name: item.name,
                            lastname: item.lastname,
                            age: item.age,
                            description: item.description,
                            path: item.path,
                            updatedAt: item.updatedAt
                        }
                    })
                }
                const persons = myObject.persons
                res.render('persons/see-person', { persons })
                //console.log(persons)
                //console.log(lastname)
            })
    }*/
}

personCtrl.renderSeePerson = (req, res) => {
    res.send('Datos actualizados')
}

personCtrl.deleteDate = async (req, res) => {
    const image = await Person.findByIdAndDelete(req.params.id)
    await unlink(path.resolve('./src/public' + image.path))
    //Mensaje al eliminar un registro
    req.flash('success_msg', 'Registro eliminado exitosamente')
    res.redirect('/persons')
}

module.exports = personCtrl