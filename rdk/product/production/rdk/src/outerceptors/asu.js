'use strict';

var _ = require('lodash');
var S = require('string');
var nullchecker = require('../utils/nullchecker');
var asuProcess = require('../subsystems/asu/asu-process');

module.exports = asu;

function asu(req, res, body, callback) {
    var bodyIsObject = _.isObject(body);
    var responseObject;
    var uid = req.query.uid;

    // If its not a document carry on
    if (nullchecker.isNotNullish(uid) && !S(uid).contains(":document:") && nullchecker.isNullish(req.query.documentDefUid)) {
        return callback(null, req, res, body);
    }

    if (bodyIsObject) {
        responseObject = body;
    } else {
        try {
            responseObject = JSON.parse(body);
        } catch (err) {
            return callback(403, req, res, null);
        }
    }

    asuProcess.getAsuPermission(req, responseObject, function (err, data){
        if(data) {
            if (bodyIsObject) {
                body = responseObject;
            } else {
                body = JSON.stringify(responseObject);
            }
            return callback(null, req, res, body);
        }
        return callback(403, req, res, null);
    });
}
