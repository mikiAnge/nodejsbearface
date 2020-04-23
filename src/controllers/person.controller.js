const personCtrl = {}
const Person = require('../models/Person')
const { unlink } = require('fs-extra')
const path = require('path')

personCtrl.renderPersonForm = (req, res) => {
    res.render('persons/register-person')
}

personCtrl.uploadPerson = async (req, res) => {
    const { name, lastname, age, description } = req.body
    const { filename, originalname, mimetype, size } = req.file
    const path = '/media/labeled_images/' + req.file.filename
    const newPerson = new Person({ name, lastname, age, description, filename, path, originalname, mimetype, size })

    await newPerson.save()
    req.flash('success_msg', 'Datos Añadidos Satisfactoriamente')
    res.redirect('/persons')
}

personCtrl.renderRegisterPersons = async (req, res) => {
    await Person.find().sort({ updatedAt: 'desc' })
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
            res.render('persons/all-persons', { persons })
        })
}

personCtrl.searchPerson = async (req, res) => {
    const { name, lastname } = req.body
    if (name && lastname) {
        await Person.find({ name, lastname })
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
    else if (name) {
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
        await Person.find({ lastname })
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
    }
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