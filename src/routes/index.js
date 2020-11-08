const { Router } = require('express')
const router = Router()

const { renderIndex, renderHelp,renderImage, renderCamera, renderVideo } = require('../controllers/index.controller')

router.get('/', renderIndex)

//router.get('/imagedetect', renderImage)
router.get('/help', renderHelp)

router.get('/imagedetect/dat', renderImage)

router.post('/imagedetect/dat', renderImage)

router.get('/cameradetect/dat', renderCamera)

router.post('/cameradetect/dat', renderCamera)

//router.get('/videodetect', renderVideo)
router.get('/videodetect/dat', renderVideo)

router.post('/videodetect/dat', renderVideo)

module.exports = router