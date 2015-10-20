'use strict';

var _ = require('underscore');

module.exports = transformJdsApiVersion;
function transformJdsApiVersion(req, res, body, callback) {
    var bodyIsObject = _.isObject(body);
    var responseObject;
    if(bodyIsObject) {
        responseObject = body;
    } else {
        try {
            responseObject = JSON.parse(body);
        } catch(err) {
            return callback(null, req, res, body);
        }
    }
    if(body.apiVersion) {
        body.jdsApiVersion = body.apiVersion;
        delete body.apiVersion;
    }
    if(bodyIsObject) {
        body = responseObject;
    } else {
        body = JSON.stringify(responseObject);
    }
    return callback(null, req, res, body);
}
