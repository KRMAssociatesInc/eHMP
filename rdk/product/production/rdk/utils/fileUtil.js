/*jslint node: true */
'use strict';

var nullchecker = require('../utils/nullchecker/nullchecker');

var combine = function(path1, path2) {
    var fullPath = path1;

    if (!nullchecker.isNullish(path2)) {
        fullPath = fullPath + path2;
    }

    return fullPath;
};

module.exports.combine = combine;
