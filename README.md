# nodejsbearface
_Continuidad del proyecto de reconocimiento de rostros en video usando [Face-Api.js](https://justadudewhohacks.github.io/face-api.js/docs/index.html), ahora implementando  nodejs y mongodb para el manejo de una base de datos para el almacenamiento de la información de las personas, registros de las busquedas y usuarios._
## Instalación
_Para la instalación del proyecto se requiere de la versión de **nodejs v14.0.0**, una vez obtenida la versión de node correspondiente, instalar los modulos con:_
```
npm i ó npm install
```
_Antes de iniciar el proyecto, se debe de **instalar mongodb**, luego ejecutar sus servicios y verificar que este funcionando correctamente.
Para la conexión con la base de datos se debe de crear un **.env** en la raiz del proyecto y colocar ahí lo siguiente:_
```
FACIAL_APP_MONGODB_HOST=localhost
FACIAL_APP_MONGODB_DATABASE=facials-db-app
```
_Echo ya todo esto ahora si ejecuta el comando para iniciar el servicio del proyecto, he ingresar en nuestro navegador:_
```
localhost:4000 || puerto por defecto 4000: modificable
```
### Nota
_En el archivo **.env** que creaste cambia el nombre de la base de datos con el de tu preferencia. Para el registro del primer usuario modificar la ruta de user, ó bien insertarlo desde la consola de mongodb._
# Proyecto anterior
_Este es el git de mi proyecto anterior con HTML y Javascript puro [bearFace](https://github.com/mikiAnge/bearFace)._
