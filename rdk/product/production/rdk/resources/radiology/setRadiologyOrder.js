/*jslint node: true */
'use strict';

var rdk = require('../../rdk/rdk');
var async = require('async');

var parameters = {
    'put': {
        'pid': {
            'required': true,
            'description': 'patient id'
        }
    }
};

function createRadiologyOrder(req, res) {

    // perform calls to Vista in parallel
    async.parallel({
        'RPC': function(callback) {
            var data = {
                'RPC': req.body
            };

            sendRadiologyOrderToVista(data, callback);
        },
        'JDS': function(callback) {
            sendRadiologyOrderToJDS(callback);
        }
    }, function sendResponseToClient(err, data) {
        if (err) {
            return res.status(rdk.httpstatus.internal_server_error).json(err);
        }

        res.status(rdk.httpstatus.ok).json(data);
        return;
    });
}

function sendRadiologyOrderToVista(data, callback) {
    callback(null, data);
}

function sendRadiologyOrderToJDS(callback) {
    callback(null, {
        'JDS': 'faked'
    });
}

module.exports = createRadiologyOrder;
module.exports.parameters = parameters;
