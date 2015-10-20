/**
 * Created by alexluong on 5/12/15.
 */

'use strict';

var _ = require('underscore');
var rdk = require('../core/rdk');
var nullchecker = rdk.utils.nullchecker;
var mask = require('json-mask');

module.exports = whitelistJson;
function whitelistJson(req, res, body, callback) {
    var fields = req.query.fields;
    if (req.method !== 'GET' || nullchecker.isNullish(fields) || fields.indexOf('*') !== -1) {
        return callback(null, req, res, body);
    }

    var bodyIsObject = _.isObject(body);
    var responseObject;
    if (bodyIsObject) {
        return callback(null, req, res, body);
    } else {
        try {
            responseObject = JSON.parse(body);
        } catch(err) {
            return callback(null, req, res, body);
        }
    }

    if (_.has(responseObject, 'data')) {
        fields = '*,data(*,items('+fields+'))';
    }
    responseObject = mask(responseObject, fields);
    if (_.isEmpty(responseObject)) {
        return callback(null, req, res, body);
    }

    if (bodyIsObject) {
        body = responseObject;
    } else {
        body = JSON.stringify(responseObject);
    }
    return callback(null, req, res, body);
}
