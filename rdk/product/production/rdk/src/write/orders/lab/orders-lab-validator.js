'use strict';

module.exports.create = function(writebackContext, callback) {
    var error = null; // set if there is an error validating
    if (writebackContext) {
        var model = writebackContext.model;
        if (model) {
            if (!model.dfn || !model.provider || !model.location || !model.orderDialog || !model.displayGroup ||
                !model.quickOrderDialog || !model.inputList || (model.inputList.length < 1) || !model.kind) {
                error = 'Missing input parameter';
            }
        } else {
            error = 'Invalid create request';
        }
    } else {
        error = 'Invalid create request';
    }
    return setImmediate(callback, error);
};

module.exports.update = function(writebackContext, callback) {
    var error = null; // set if there is an error validating
    if (writebackContext) {
        var model = writebackContext.model;
        if (model) {
            if (!model.dfn || !model.provider || !model.location || !model.orderDialog || !model.displayGroup ||
                !model.quickOrderDialog || !model.inputList || (model.inputList.length < 1) || !model.kind ||
                !model.orderId) {
                error = 'Missing input parameter';
            }
        } else {
            error = 'Invalid update request';
        }
    } else {
        error = 'Invalid update request';
    }
    return setImmediate(callback, error);
};

module.exports.discontinue = function(writebackContext, callback) {
    var error = null; // set if there is an error validating
    if (writebackContext) {
        var model = writebackContext.model;
        if (model) {
            if (!model.orderId || !model.provider || !model.location || !model.kind) {
                error = 'Missing input parameter';
            }
        } else {
            error = 'Invalid discontinue request';
        }
    } else {
        error = 'Invalid discontinue request';
    }
    return setImmediate(callback, error);
};
