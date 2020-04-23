const { Router } = require('express')
const router = Router()

const { renderIndex,renderImage, renderCamera, renderVideo } = require('../controllers/index.controller')

router.get('/', renderIndex)

//router.get('/imagedetect', renderImage)

router.get('/imagedetect/:name/:lastname', renderImage)

router.get('/cameradetect', renderCamera)

//router.get('/videodetect', renderVideo)
router.get('/videodetect/:name/:lastname', renderVideo)


module.exports = router