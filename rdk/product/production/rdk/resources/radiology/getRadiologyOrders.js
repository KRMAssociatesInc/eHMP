/*jslint node: true */
'use strict';

var rdk = require('../../rdk/rdk');

var parameters = {
    'get': {
        'pid': {
            'required': true,
            'description': 'patient id'
        }
    }
};

function readRadiologyOrder(req, res) {
    res.status(rdk.httpstatus.ok).send('Reading radiology order');
    return;
}

module.exports = readRadiologyOrder;
module.exports.parameters = parameters;
