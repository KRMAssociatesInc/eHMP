'use strict';

module.exports = function(writebackContext, callback) {
    // TODO: validate newNotes

    var error = null;  // set if there is an error validating
    return setImmediate(callback, error);
};
