'use strict';

var rdk = require('../../core/rdk');

var parameters = {
    'post': {
        'pid': {
            'required': true,
            'description': 'patient id'
        }
    }
};

function updateRadiologyOrder(req, res) {
    res.status(rdk.httpstatus.ok).rdkSend('Updating radiology order');
    return;
}

module.exports = updateRadiologyOrder;
module.exports.parameters = parameters;
