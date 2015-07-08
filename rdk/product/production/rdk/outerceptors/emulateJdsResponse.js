'use strict';

var _ = require('underscore');
var moment = require('moment');
var paramUtil = require('../utils/paramUtil');

module.exports = emulateJdsResponse;

function emulateJdsResponse(req, body, callback) {
    var bodyIsObject = _.isObject(body);
    var responseObject;
    if (bodyIsObject) {
        responseObject = body;
    } else {
        try {
            responseObject = JSON.parse(body);
        } catch (err) {
            return callback(null, req, body);
        }
    }

    var wrappedResponse = responseObject;
    if (responseObject.items) {

        // create standard response
        wrappedResponse = {
            data: {
                updated: responseObject.updated || parseInt(moment().format('YYYYMMDDhhmmss')),
                totalItems: responseObject.totalItems,
                currentItemCount: responseObject.items.length,
            },
            apiVersion: '1.0'
        };

        var start = Math.max(0, paramUtil.parseIntParam(req, 'start', 0, 0));
        var limit = paramUtil.parseIntParam(req, 'limit', -1, -1);

        // add paging-related fields if paging occurred
        if (limit > 0) {
            wrappedResponse.data.itemsPerPage = limit;
            wrappedResponse.data.startIndex = start;
            wrappedResponse.data.pageIndex = Math.floor(start / limit);
            wrappedResponse.data.totalPages = Math.ceil(responseObject.totalItems / limit);
        }

        wrappedResponse.data.items = responseObject.items;
    }

    if (bodyIsObject) {
        body = wrappedResponse;
    } else {
        body = JSON.stringify(wrappedResponse);
    }
    return callback(null, req, body);
}