/*jslint node: true */
'use strict';

var rdk = require('../../rdk/rdk');

var parameters = {
    'post': {
        'pid': {
            'required': true,
            'description': 'patient id'
        }
    }
};

function updateRadiologyOrder(req, res) {
    res.status(rdk.httpstatus.ok).send('Updating radiology order');
    return;
}

module.exports = updateRadiologyOrder;
module.exports.parameters = parameters;
