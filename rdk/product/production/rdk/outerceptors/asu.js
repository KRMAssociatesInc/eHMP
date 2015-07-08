/*jslint node: true */
'use strict';

var _ = require('lodash');
var S = require("string");
var asuProcess = require('../subsystems/asu/asuProcess');

module.exports = asu;

function asu(req, body, callback) {
    var bodyIsObject = _.isObject(body);
    var responseObject;
    var uid = req.query.uid;

    // If its not a document carry on
    if (!S(uid).contains(":document:")) {
        return callback(null, req, body);
    }

    if (bodyIsObject) {
        responseObject = body;
    } else {
        try {
            responseObject = JSON.parse(body);
        } catch (err) {
            return callback(403, req, null);
        }
    }

    asuProcess.getAsuPermission(req, responseObject, function (err, data){
        if (!_.isUndefined(err) && !_.isNull(err)) {
            return callback(err, req, data);
        }
        if(!_.isNull(data) && data === true) {
            if (bodyIsObject) {
                body = responseObject;
            } else {
                body = JSON.stringify(responseObject);
            }
            return callback(null, req, body);
        }
        return callback(403, req, null);
    });
}
