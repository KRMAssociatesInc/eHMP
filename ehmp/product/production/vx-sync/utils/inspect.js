'use strict';

var inspect = require('util').inspect;
var _ = require('underscore');

module.exports = function() {
    return inspect.apply(null, _.toArray(arguments));
};