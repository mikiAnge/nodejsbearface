const mongoose = require('mongoose')

const{FACIAL_APP_MONGODB_HOST, FACIAL_APP_MONGODB_DATABASE} = process.env

const MONGODB_URI = `mongodb://${FACIAL_APP_MONGODB_HOST}/${FACIAL_APP_MONGODB_DATABASE}`

mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
.then(db => console.log('DB is connected'))
.catch(err => console.error(err))