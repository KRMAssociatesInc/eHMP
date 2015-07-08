'use strict';

module.exports = function(pid, writebackContext, callback) {
    // TODO: validate newNotes

    var error = null;  // set if there is an error validating
    return setImmediate(callback, error, writebackContext);
};
