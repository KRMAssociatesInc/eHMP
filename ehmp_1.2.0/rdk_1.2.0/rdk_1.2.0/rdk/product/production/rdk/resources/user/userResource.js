/*jslint node: true */
'use strict';

var userUtil = require('./userUtil');
var rdk = require('../../rdk/rdk');

var apiDocs = {
    spec: {
        summary: 'Get the current user session',
        notes: '',
        responseMessages: []
    }
};

var getResourceConfig = function() {
    return [{
        name: 'userinfo',
        path: '/info',
        interceptors: {
            operationalDataCheck: false,
            pep: false
        },
        apiDocs: apiDocs,
        get: getUser,
        healthcheck: {

        }
    }];
};

function getUser(req, res) {
    if (req.session && req.session.user) {
        res.status(rdk.httpstatus.ok).send(userUtil.sanitizeUser(req.session.user));
    } else {
        res.status(rdk.httpstatus.unauthorized).send();
    }
}

module.exports.getResourceConfig = getResourceConfig;
