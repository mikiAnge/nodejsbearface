const indexCtrl = {}
const Person = require('../models/Person')
const { unlink } = require('fs-extra')
const path = require('path')

indexCtrl.renderIndex = (req, res) => {
    res.render('index')
}

indexCtrl.renderHelp = (req, res) => {
    res.render('help')
}

indexCtrl.renderImage = async (req, res) => {
    const { ci } = req.body
    await Person.find({ ci })
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
indexCtrl.renderCamera = async (req, res) => {
    const { ci } = req.body
    await Person.find({ ci })
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
            res.render('cameradetect', { persons })
            //console.log(persons)
            //console.log(name, lastname)
            //res.send(persons)
            //res.send('!Probando el modelo¡ ' + name + ' -- ' + lastname)
        })
}
indexCtrl.renderVideo = async (req, res) => {
    const { ci } = req.body
    await Person.find({ ci })
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