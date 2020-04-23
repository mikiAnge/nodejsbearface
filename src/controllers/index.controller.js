const indexCtrl = {}
const Person = require('../models/Person')
const { unlink } = require('fs-extra')
const path = require('path')

indexCtrl.renderIndex = (req, res) => {
    res.render('index')
}
indexCtrl.renderImage = async (req, res) => {
    const { name, lastname } = req.params
    await Person.find({ name, lastname })
        .then(personsItem => {
            const myObject = {
                persons: personsItem.map(item => {
                    return {
                        id: item._id,
                        name: item.name,
                        lastname: item.lastname,
                        age: item.age,
                        path: item.path,
                    }
                })
            }
            const persons = myObject.persons
            res.render('imagedetect', { persons })
            //console.log(persons)
            //console.log(name, lastname)
            //res.send(persons)
            //res.send('!Probando el modelo¡ ' + name + ' -- ' + lastname)
        })
    //res.render('imagedetect')
}
indexCtrl.renderCamera = (req, res) => {
    res.render('cameradetect')
}
indexCtrl.renderVideo = async (req, res) => {
    const { name, lastname } = req.params
    await Person.find({ name, lastname })
        .then(personsItem => {
            const myObject = {
                persons: personsItem.map(item => {
                    return {
                        id: item._id,
                        name: item.name,
                        lastname: item.lastname,
                        age: item.age,
                        path: item.path,
                    }
                })
            }
            const persons = myObject.persons
            res.render('videodetect', { persons })
            //console.log(persons)
            //console.log(name, lastname)
            //res.send(persons)
            //res.send('!Probando el modelo¡ ' + name + ' -- ' + lastname)
        })
    //res.render('videodetect')
}

module.exports = indexCtrl