/*jslint node: true */
'use strict';

var rdk = require('../../rdk/rdk');
var nullchecker = rdk.utils.nullchecker;

var parameters = {
    'post': {
        'pid': {
            'required': true,
            'description': 'patient id'
        }
    }
};

function updateLabOrder(req, res, next) {
    var pid = req.param('pid');

    if (nullchecker.isNullish(pid)) {
        next(); // require pid
        return;
    }

    res.status(rdk.httpstatus.ok).send('Updating lab order');
    return;
}

module.exports = updateLabOrder;
module.exports.parameters = parameters;
