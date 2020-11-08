const videoUpload = document.getElementById('videoUpload')
const video = document.getElementById('video')
//const name = document.getElementById('name').value
//const lastname = document.getElementById('lastname').value
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
    let curVideo = 0
    let videoUp
    let canvas

    document.getElementById('resobt').innerHTML = ""
    document.getElementById('resobt').append('Cargado seleccione un video!!!')

    videoUpload.addEventListener('change', async () => {

        //almacenando las rutas de todos los videos que se seleccionen
        const nextVideo = videoUpload.files
        if (videoUp) videoUp.remove()
        if (canvas) canvas.remove()
        video.src = URL.createObjectURL(videoUpload.files[curVideo])

        document.getElementById('datos').append('Nombre de archivo: '+videoUpload.files[curVideo].name+'\n')

        //console.log(nextVideo.length)
        video.onended = function() {
            ++curVideo
            if(curVideo < nextVideo.length){
                video.src = URL.createObjectURL(videoUpload.files[curVideo])
                document.getElementById('datos').append('Nombre de archivo: '+videoUpload.files[curVideo].name+'\n')
            }
        }
        //console.log(video.src)
    })


    video.addEventListener('play', async () => {


        const canvas = faceapi.createCanvasFromMedia(video)
        document.getElementById('contenedor').append(canvas)
        //document.body.append(canvas)
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

            //Ver tiempo de reproduccion
            //video.ontimeupdate = tiempoReproduccion()
            //console.log(video.currentTime)

            //ver como reposisonar el name
            const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
            results.forEach((result, i) => {
                //verificando, si coincide mostrar canvas
                if (result.label != 'unknown') {
                    //document.getElementById('resobt').innerHTML=""
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
                    //document.getElementById('datos').append('Datos analizados '+cont+'\n')
                    video.ontimeupdate = tiempoReproduccion()
                    
                }
            })
            //console.log(results)
            //faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
            //faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

        }, 100)
    })

}

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

function tiempoReproduccion() {
    
    let seconds = video.currentTime
    var hour = Math.floor(seconds / 3600)
    hour = (hour < 10)? '0' + hour : hour
    var minute = Math.floor((seconds / 60) % 60)
    minute = (minute < 10)? '0' + minute : minute
    var second = Math.floor(seconds % 60)
    second = (second < 10)? '0' + second : second
    document.getElementById('datos').append('Coincidencia encontrada en el tiempo: '+hour+':'+minute+':'+second+'\n')
}

function openRegister() {
    document.getElementById('myForm').style.display = "block"
}

function closeRegister() {
    document.getElementById('myForm').style.display = "none"
}