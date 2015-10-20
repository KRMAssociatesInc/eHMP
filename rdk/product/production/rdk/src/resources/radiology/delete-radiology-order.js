'use strict';

var rdk = require('../../core/rdk');

var parameters = {
    'delete': {
        'pid': {
            'required': true,
            'description': 'patient id'
        }
    }
};

function deleteRadiologyOrder(req, res) {
    res.status(rdk.httpstatus.ok).rdkSend('Deleting radiology order');
    return;
}

module.exports = deleteRadiologyOrder;
module.exports.parameters = parameters;
