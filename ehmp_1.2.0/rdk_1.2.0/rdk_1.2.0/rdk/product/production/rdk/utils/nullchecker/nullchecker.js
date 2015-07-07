/*jslint node: true */
'use strict';

var isNullish = function(value) {
    return value === undefined || value === null || value === '';
};

var isNotNullish = function(value) {
    return !(isNullish(value));
};

module.exports.isNullish = isNullish;
module.exports.isNotNullish = isNotNullish;
