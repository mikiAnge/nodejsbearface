/*
function cargar() {
    var provincias = ["Cantabria", "Asturias", "Galicia", "Andalucia", "Extremadura"]; //Tu array de provincias
    var select = document.getElementById("instituciones"); //Seleccionamos el select
    
    for(var i=0; i < provincias.length; i++){ 
        var option = document.createElement("option"); //Creamos la opcion
        option.innerHTML = provincias[i]; //Metemos el texto en la opción
        select.appendChild(option); //Metemos la opción en el select
    }
}
cargar();*/



function cambioOpciones() {
    var combo = document.getElementById('instituciones')
    var institucion = combo.options[combo.selectedIndex].text
    document.getElementById('nameinstitucion').value = institucion
}