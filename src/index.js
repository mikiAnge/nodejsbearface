//configurando servidor
const express = require('express');
const app = express();
const path = require('path');
// settings
app.set('port', 3000)
app.set('views', path.join(__dirname, 'views'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'ejs')


// routes
app.use(require('./routes/index'))

// static files
app.use(express.static(path.join(__dirname, 'public')))

//mostrando que el servidor esta funcionando
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
})