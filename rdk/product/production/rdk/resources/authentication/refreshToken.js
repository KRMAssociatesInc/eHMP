/*jslint node: true */
'use strict';

var _ = require('underscore');
var rdk = require('../../rdk/rdk');
var userUtil = require('../user/userUtil');

var apiDocs = {
    spec: {
        summary: 'Refreshes the current user session',
        notes: 'Expects a session to already occur or it returns a blank object.',
        parameters: [],
        responseMessages: [
            {
                code: 200,
                message: 'Session successfully refreshed'
            },
            {
                code: 401,
                message: 'No session to refresh'
            }
        ]
    }
};

function refreshToken(req, res) {

    if (_.isObject(req.session.user) === true) {
        req.logger.info('Token refreshed');
        res.status(rdk.httpstatus.ok).json(userUtil.sanitizeUser(req.session.user));
        return;
    }

    req.logger.warn('No session present for refresh');
    res.status(rdk.httpstatus.unauthorized).json();

}

module.exports = refreshToken;
module.exports.apiDocs = apiDocs;
