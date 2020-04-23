const imageUpload = document.getElementById('imageUpload')
const name = document.getElementById('name').value
const lastname = document.getElementById('lastname').value

Promise.all([
    //ver si se puede subir un nivel para la ruta
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start)

async function start() {
    /*const container = document.createElement('div')
    container.style.position = 'relative'
    document.body.append(container)*/
    const labeledFaceDescriptors = await loadLabeledImages()
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
    let image
    let canvas
    document.body.append('Loaded')
    imageUpload.addEventListener('change', async () => {
        if (image) image.remove()
        if (canvas) canvas.remove()
        image = await faceapi.bufferToImage(imageUpload.files[0])
        document.getElementById('contenedor').append(image)
        canvas = faceapi.createCanvasFromMedia(image)
        document.getElementById('contenedor').append(canvas)
        const displaySize = { width: image.width, height: image.height }
        faceapi.matchDimensions(canvas, displaySize)
        const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
        results.forEach((result, i) => {
            //verificando, si coincide mostrar canvas
            if (result.label != 'unknown') {
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
                console.log(drawBox)
            }
        })
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
        //Manejando bd en labels almacenar el nombre a buscar y mandar con esto los ids de las imagenes relacionadas a ese nombre
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