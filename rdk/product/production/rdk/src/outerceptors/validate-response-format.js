'use strict';

var _ = require('lodash');

module.exports = validateResponseFormat;
function validateResponseFormat(req, res, body, callback) {
    if (req.permitResponseFormat ||
        (req._resourceConfigItem && req._resourceConfigItem.permitResponseFormat) ||
        (req.url && req.url.indexOf('/api-docs/') !== -1)) {
        return callback(null, req, res, body);
    }

    var bodyObject = body;
    if(!_.isObject(body)) {
        try {
            bodyObject = JSON.parse(body);
        } catch(err) {
        }
    }

    var error = null;
    if (!_.isObject(bodyObject)) {
        error = 'response payload must be an object';
    } else if (_.isArray(bodyObject)) {
        error = 'response payload must not be an array';
    } else if (!_.has(bodyObject, 'status')) {
        error = 'response payload must contain a "status" field that echoes the response statusCode';
    } else if (!_.isNumber(bodyObject.status)) {
        error = 'response payload\'s "status" field must be a number';
    } else if (bodyObject.status !== res.statusCode && (res.statusCode || bodyObject.status !== 200)) {
        error = 'response payload\'s "status" field must match the response\'s statusCode';
    } else if (_.has(bodyObject, 'data')) {
        var data = bodyObject.data;
        if (!_.isObject(data)) {
            error = 'response payload\'s "data" field must be an object';
        }
    } else if (_.has(bodyObject, 'message')) {
        if (!_.isString(bodyObject.message)) {
            error = 'response payload\'s "message" field must be a string';
        }
    }

    if (error) {
        req.logger.error('Invalid response format: ' + error + '. Try calling res.rdkSend instead of res.send for ' + req.url);
        req.logger.debug({invalidResponseBody: bodyObject});
    }

    return callback(error, req, res, body);
}
