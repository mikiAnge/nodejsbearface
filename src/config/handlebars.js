const { format } = require('timeago.js')

const helpers = {}

//modificar este sector para el formateo de la fecha creada por la base de datos y sea mejor visible

helpers.time_ago = (timestamp) => {
    return format(timestamp, 'en_US')
}

module.exports = helpers