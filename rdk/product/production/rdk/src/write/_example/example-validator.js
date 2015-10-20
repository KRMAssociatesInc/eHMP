'use strict';

module.exports.create = function(writebackContext, callback) {
    var model = writebackContext.model;
    if(model.badCreate) {
        return setImmediate(callback, 'model is bad');
    }
    var error = null;  // set if there is an error validating
    setImmediate(callback, error);
};

module.exports.update = function(writebackContext, callback) {
    var model = writebackContext.model;
    if(model.badUpdate) {
        return setImmediate(callback, 'model is bad');
    }
    var error = null;  // set if there is an error validating
    setImmediate(callback, error);
};
