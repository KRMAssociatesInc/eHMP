'use strict';

var _ = require('underscore');

/*
Variadic Function
call(thisArg, func, *params, callback)
'thisArg' is the context to use to run this function
'params' is zero or more parameters

This function runs the 'func' function asynchronously by
wrapping it in a setTimeout: setTimeout(func, 0, params)

params can be zero or more parameters, all of which will
be passed to 'func'. Any error thrown when 'func' is executed
will be caught and passed as the value of the first callback
parameter. Any result will be passed as the second parameter
of the callback.
*/
function call(thisArg, func, params, callback) {
    params = _.toArray(arguments);
    callback = _.last(params);

    params = _.initial(_.rest(_.rest(params)));

    apply(thisArg, func, params, callback);
}

/*
Variadic Function
apply(thisArg, func, params, callback)
apply(thisArg, func, callback)

As call() except that 'params' must be an of the
parameters that should be sent to 'func'.
*/
function apply(thisArg, func, params, callback) {
    if(arguments.length < 4) {
        callback = arguments[2];
        params = [];
    }

    if(!_.isArray(params)) {
        params = [params];
    }

    setTimeout(function() {
        var result;

        try {
            result = func.apply(thisArg, params);
        } catch (error) {
            return callback(error);
        }

        callback(null, result);
    }, 0);
}

module.exports.call = call;
module.exports.apply = apply;