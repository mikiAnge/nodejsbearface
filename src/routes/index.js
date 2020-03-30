const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index.html', { title: 'Detección de Rostros' })
})

router.get('/imagedetect', (req, res) => {
    res.render('imagedetect.html', { title: 'Image Detection' })
})

router.get('/cameradetect', (req, res) => {
    res.render('cameradetect.html', { title: 'Camera Detection' })
})

router.get('/videodetect', (req, res) => {
    res.render('videodetect.html', { title: 'Video Detection' })
})

router.get('/contact', (req, res) => {
    res.render('contact.html', { title: 'Contact Detection' })
})

module.exports = router