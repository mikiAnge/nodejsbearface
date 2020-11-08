'use strict';

const video = document.getElementById('video')

const errorMsgElement = document.querySelector('span#errorMsg');
let predictedAges = []

document.getElementById('resobt').append('Espere un momento...')

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
    //faceapi.nets.ageGenderNet.loadFromUri('/models')
]).then(startVideo)

const constraints = window.constraints = {
    audio: false,
    video: true
}


async function startVideo() {
    const labeledFaceDescriptors = await loadLabeledImages()
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)

    document.getElementById('resobt').innerHTML = ""
    document.getElementById('resobt').append('Cargado seleccione un video!!!')
    
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
            var videoTracks = stream.getVideoTracks()
            console.log('Got stream with constraints:', constraints)
            console.log('Using video device: ' + videoTracks[0].label)
            stream.onended = function() {
                console.log('Stream ended')
            }
            window.stream = stream
            video.srcObject = stream
        })
        .catch(function(error) {})

    video.addEventListener('play', async () => {
        const canvas = faceapi.createCanvasFromMedia(video)
        document.getElementById('contenedor').append(canvas)
        const displaySize = { width: video.width, height: video.height }
        faceapi.matchDimensions(canvas, displaySize)

        document.getElementById('resobt').innerHTML = ""
        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceDescriptors()//
                    .withFaceExpressions()
                //.withAgeAndGender()
            const resizedDetections = faceapi.resizeResults(detections, displaySize)
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            //faceapi.draw.drawDetections(canvas, resizedDetections)
            //faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
            //faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
            const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
                results.forEach((result, i) => {
                    const box = resizedDetections[i].detection.box
                    const drawBox = new faceapi.draw.DrawBox(
                        //modificador del canvas que se visualizara
                        box,
                        {
                            boxColor: "rgba(0,255,0,1)",
                            drawLabelOptions:
                            {
                                fontColor: "rgba(0,0,102,1)"
                            },
                            label: result.toString()
                        })
                    drawBox.draw(canvas)
                })
    /*
            const age = resizedDetections[0].age
            const interpolatedAge = interpolatedAgePredictions(age)
            const bottomRight = { x: resizedDetections[0].detection.box.bottomRight.x - 50, y: resizedDetections[0].detection.box.bottomRight.y }

            new faceapi.draw.DrawTextField(
                [`${faceapi.utils.round(interpolatedAge, 0)} years`], bottomRight
            ).draw(canvas)*/
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        }, 100)
    })
}

/*
function interpolatedAgePredictions(age) {
    predictedAges = [age].concat(predictedAges).slice(0, 30)
    const avgPredictedAge = predictedAges.reduce((total, a) => total + a) / predictedAges.length
    return avgPredictedAge
}*/
function loadLabeledImages() {
    const nombres = nameLastname()
    const path = pathImages()
    //Obteniendo la cantidad de datos que corresponden a uno o mas nombres
    const newNombres = nombres.reduce((newTempNom, nom) => (newTempNom.includes(nom) ? newTempNom : [...newTempNom, nom]), [])
    
    let totDatNom = nombres.reduce((contNombre, nomb) => {contNombre[nomb] = (contNombre[nomb] || 0)+1
    return contNombre}, {})
    totDatNom = Object.keys(totDatNom).map(function (nomb) {
        const canti = []
        canti.push(totDatNom[nomb])
        return parseInt(canti)
    })
    //----------------------------//
    let p = 0
    let j = 0
    let max = totDatNom[p]
    const labels = newNombres
    return Promise.all(
        //Manejando bd en labels almacenar el nombre a buscar y mandar con esto los ids de las imagenes relacionadas a ese nombre
        labels.map(async label => {
            const descriptions = []
            for (j; j < max; j++) {
                console.log(j, max, label)
                const img = await faceapi.fetchImage(`${path[j]}`)
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                descriptions.push(detections.descriptor)
            }
            j = totDatNom[p]
            p ++
            max += totDatNom[p]
            //console.log(j,p,v,max)
            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
}

function pathImages() {
    const temp = document.getElementById("path")
    const rutas = []
    for (let i = 0; i < temp.rows.length; i++) {
        rutas.push((temp.rows[i].innerText).trim())
    }
    return rutas
}

function nameLastname() {
    const temp = document.getElementById("namelastname")
    const names = []
    for (let i = 0; i < temp.rows.length; i++) {
        names.push((temp.rows[i].innerText).trim())
    }
    return names
}

function handleSuccess(stream) {
    window.stream = stream;
    video.srcObject = stream;
  }