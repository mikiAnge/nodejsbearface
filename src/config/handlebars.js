const { format } = require('timeago.js')
const helpers = {}
const Handlebars = require("handlebars");

Handlebars.registerHelper('repite', function (value, options) {
    let i;
    let max;
    let comparador = '';
    let respuesta = '';
    max = value.length;
    if (value != '') {
        for (i=0; i < max; i++){
            if (options.fn(value[i]) != comparador){
                comparador = options.fn(value[i])
                respuesta += options.fn(value[i])
            }
            else {
                comparador = options.fn(value[i])
            }
        }
        //console.log(respuesta)
        return respuesta
    }
    else {
        return respuesta = options.inverse(value)
    }
})

Handlebars.registerHelper('compare', function (lvalue, operator, rvalue, options) {

    var operators, result;
    
    if (arguments.length < 3) {
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
    }
    
    if (options === undefined) {
        options = rvalue;
        rvalue = operator;
        operator = "===";
    }
    
    operators = {
        '==': function (l, r) { return l == r; },
        '===': function (l, r) { return l === r; },
        '!=': function (l, r) { return l != r; },
        '!==': function (l, r) { return l !== r; },
        '<': function (l, r) { return l < r; },
        '>': function (l, r) { return l > r; },
        '<=': function (l, r) { return l <= r; },
        '>=': function (l, r) { return l >= r; },
        'typeof': function (l, r) { return typeof l == r; }
    };
    
    if (!operators[operator]) {
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
    }
    
    result = operators[operator](lvalue, rvalue);
    
    if (result) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

})


//modificar este sector para el formateo de la fecha creada por la base de datos y sea mejor visible

helpers.time_ago = (timestamp) => {
    return format(timestamp, 'en_US')
}

module.exports = helpers