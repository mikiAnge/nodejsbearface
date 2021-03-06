const imageUpload = document.getElementById('imageUpload')
//const namelastname = document.getElementById('namelastname').value

//
document.getElementById('resobt').append('Espere un momento...')
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
    // FaceMatcher(Descriptor, Distancia) Distancia probable de que una persona sea la correcta mientras mas alto es mas probable que todos sean esa persona ha buscar, y de lo contrario mientras mas bajo se requiere de mas datos para su valoración, por eso se opta por un punto intermedio para una obtención de resultados fiable sin tener que cargar de mucha información
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
    let image
    let canvas

    document.getElementById('resobt').innerHTML = ""
    document.getElementById('resobt').append('Cargado seleccione una imagen!!!')
    
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
    const nombres = nameLastname()
    const path = pathImages()
    //Obteniendo la cantidad de datos que corresponden a uno o mas nombres
    const labels = nombres.reduce((newTempNom, nom) => (newTempNom.includes(nom) ? newTempNom : [...newTempNom, nom]), [])
    
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