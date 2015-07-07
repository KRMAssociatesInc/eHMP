/*jslint node: true */
'use strict';

var rdk = require('../../rdk/rdk');

var parameters = {
    'delete': {
        'pid': {
            'required': true,
            'description': 'patient id'
        }
    }
};

function deleteRadiologyOrder(req, res) {
    res.status(rdk.httpstatus.ok).send('Deleting radiology order');
    return;
}

module.exports = deleteRadiologyOrder;
module.exports.parameters = parameters;
