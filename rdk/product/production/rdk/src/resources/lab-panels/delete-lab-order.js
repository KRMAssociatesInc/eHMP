'use strict';

var rdk = require('../../core/rdk');
var nullchecker = rdk.utils.nullchecker;

var parameters = {
    'delete': {
        'pid': {
            'required': true,
            'description': 'patient id'
        }
    }
};

function deleteLabOrder(req, res, next) {
    var pid = req.param('pid');

    if (nullchecker.isNullish(pid)) {
        next(); // require pid
        return;
    }

    res.status(rdk.httpstatus.ok).rdkSend('Deleting lab order');
    return;
}

module.exports = deleteLabOrder;
module.exports.parameters = parameters;
