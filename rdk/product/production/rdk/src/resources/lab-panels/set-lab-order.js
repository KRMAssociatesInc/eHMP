'use strict';

var rdk = require('../../core/rdk');
var nullchecker = rdk.utils.nullchecker;

var parameters = {
    'put': {
        'pid': {
            'required': true,
            'description': 'patient id'
        }
    }
};

function createLabOrder(req, res, next) {
    var pid = req.param('pid');

    if (nullchecker.isNullish(pid)) {
        next(); // require pid
        return;
    }

    res.status(rdk.httpstatus.ok).rdkSend('Creating lab order');
    return;
}

module.exports = createLabOrder;
module.exports.parameters = parameters;
