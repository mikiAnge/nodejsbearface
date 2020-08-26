const videoUpload = document.getElementById('videoUpload')
const video = document.getElementById('video')
const name = document.getElementById('name').value
const lastname = document.getElementById('lastname').value
let cont

//
document.getElementById('resobt').append('Espere un momento...')

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(startVideo)


async function startVideo() {

    const labeledFaceDescriptors = await loadLabeledImages()
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
    //console.log(faceMatcher)
    //
    //En el caso de usar una bd colocar una variable para asignar la ruta
    let videoUp
    let canvas

    document.getElementById('resobt').innerHTML = ""
    document.getElementById('resobt').append('Cargado!!!')

    videoUpload.addEventListener('change', async () => {
        if (videoUp) videoUp.remove()
        if (canvas) canvas.remove()
        video.src = URL.createObjectURL(videoUpload.files[0])
        //console.log(video.src)
    })

    video.addEventListener('play', async () => {
    
        canvas = faceapi.createCanvasFromMedia(video)
        //document.getElementById('vidcont').append(canvas)
        document.body.append(canvas)
        const displaySize = { width: video.width, height: video.height }
        faceapi.matchDimensions(canvas, displaySize)

        document.getElementById('resobt').innerHTML = ""

        //añadido para pruebas
        cont = 0

        setInterval(async () => {
    
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptors()//
                .withFaceExpressions()
            const resizedDetections = faceapi.resizeResults(detections, displaySize)
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            //faceapi.draw.drawDetections(canvas, resizedDetections)

            //ver como reposisonar el name
            const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
            results.forEach((result, i) => {
                //verificando, si coincide mostrar canvas
                if (result.label != 'unknown') {
                    document.getElementById('resobt').innerHTML=""
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
                    //dato añadido para prueba de cantidad de rostros reconocidos
                    cont ++
                    document.getElementById('resobt').append('Datos analizados '+cont)
                    
                }
            })
            //console.log(results)
            //faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
            //faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

        }, 100)
    })

}
function loadLabeledImages() {
    const nombre = name + lastname
    const labels = [nombre]
    const path = pathImages()
    //console.log(path)
    //console.log('direccion',path[2])
    //console.log('Mostar aqui', labels)
    return Promise.all(
        labels.map(async label => {
            const descriptions = []
            for (let i = 0; i < path.length; i++) {
                const img = await faceapi.fetchImage(`${path[i]}`)
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                descriptions.push(detections.descriptor)
            }

            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
}

function pathImages() {
    const temp = document.getElementById("path")
    const rutas = []
    for (let i = 0; i < temp.rows.length; i++) {
        rutas.push(temp.rows[i].innerText)
    }
    return rutas
}