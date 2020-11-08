const videoUpload = document.getElementById('videoUpload')
const video = document.getElementById('video')

let curVideo = 0
let videoUp
let canvas

videoUpload.addEventListener('change', async () => {

    if (videoUp) videoUp.remove()
    if (canvas) canvas.remove()
    const nextvideo = videoUpload.files

    video.src = URL.createObjectURL(videoUpload.files[curVideo])
    document.getElementById('datos').append('Nombre de archivo: '+videoUpload.files[curVideo].name+'\n')
    video.ontimeupdate = tiempoReproduccion()

    video.onended = function() {
    ++curVideo
    if(curVideo < nextvideo.length){
    video.src = URL.createObjectURL(videoUpload.files[curVideo])
    document.getElementById('datos').append('Nombre de archivo: '+videoUpload.files[curVideo].name+'\n')
    video.ontimeupdate = tiempoReproduccion()

    console.log(URL.createObjectURL(videoUpload.files[curVideo]))
        }
    //console.log(video.src)
}
})

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