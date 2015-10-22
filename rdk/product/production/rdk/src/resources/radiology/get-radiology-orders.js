'use strict';

var rdk = require('../../core/rdk');

var parameters = {
    'get': {
        'pid': {
            'required': true,
            'description': 'patient id'
        }
    }
};

function readRadiologyOrder(req, res) {
    res.status(rdk.httpstatus.ok).rdkSend('Reading radiology order');
    return;
}

module.exports = readRadiologyOrder;
module.exports.parameters = parameters;
