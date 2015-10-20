'use strict';

module.exports.edit = function(writebackContext, callback) {
    var error = null; // set if there is an error validating
    if (writebackContext) {
        if (!writebackContext.resourceId) {
            error = 'Missing Resource ID';
        }
    } else {
        error = 'Invalid edit request';
    }
    return setImmediate(callback, error);
};
