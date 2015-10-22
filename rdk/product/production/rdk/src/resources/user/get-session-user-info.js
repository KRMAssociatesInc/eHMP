'use strict';

var userUtil = require('./user-whitelist');
var rdk = require('../../core/rdk');

var getSessionUser = {};

getSessionUser.apiDocs = {
    spec: {
        summary: 'Get the current user session',
        notes: '',
        responseMessages: []
    }
};

getSessionUser.getUser = function(req, res) {
    if (req.session && req.session.user) {
        res.status(rdk.httpstatus.ok).rdkSend(userUtil.sanitizeUser(req.session.user));
    } else {
        res.status(rdk.httpstatus.unauthorized).rdkSend();
    }
};

module.exports = getSessionUser;
