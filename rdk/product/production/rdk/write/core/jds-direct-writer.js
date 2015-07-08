'use strict';

module.exports = function(vprModel, callback) {
    var error = null;
    //return callback(error, vprModel);
    return setImmediate(callback, error, vprModel);
};
