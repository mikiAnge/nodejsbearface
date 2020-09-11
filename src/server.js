const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const morgan = require('morgan')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
//subida de imagenes
const multer = require('multer')
const uuid = require('uuid/v4')
const { format } = require('timeago.js')

//Initializations
const app = express()
require('./config/passport')

//Settings
app.set('port', process.env.PORT || 4000)
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./config/handlebars')
}))
app.set('view engine', '.hbs')
//Middleware
//Morgan permite ver que se le esta solicitando al servidor
app.use(morgan('dev'))
//convierte los dato en codigo json
app.use(express.urlencoded({extended: false}))
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/media/labeled_images'),
    filename: (req, file, cb, filename) => { 
        cb(null, uuid() + path.extname(file.originalname))
    }
})
app.use(multer({ storage: storage }).single('image'))

app.use(methodOverride('_method'))
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
//Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    //fragmento agregado para acceder a datos del usuario
    let user = null
    if(req.user){
         user =JSON.parse(JSON.stringify(req.user))
    }
        
    res.locals.user = user   
    //res.locals.user = req.user || null
    next()
})

//Routes
app.use(require('./routes/index'))
app.use(require('./routes/registers'))
app.use(require('./routes/users'))
app.use(require('./routes/persons'))
//Statics Files
app.use(express.static(path.join(__dirname, 'public')))

module.exports = app