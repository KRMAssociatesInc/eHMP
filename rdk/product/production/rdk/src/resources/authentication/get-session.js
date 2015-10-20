'use strict';

var _ = require('underscore');
var rdk = require('../../core/rdk');
var userUtil = require('../user/user-whitelist');

/**
 * Resource configuration parameters option
 * @type {Object}
 */
var parameters = {
    post: {
        accessCode: {
            required: true,
            description: 'accessCode'
        },
        verifyCode: {
            required: true,
            description: 'verifyCode'
        },
        site: {
            required: true,
            description: 'site'
        }
    }
};

var apiDocs = {
    spec: {
        summary: 'Login to create a user session',
        notes: 'Requires the authentication interceptor to run in order to add the user to the session for returning that data.',
        parameters: [
            rdk.docs.swagger.paramTypes.body('User', 'User to authenticate', 'authentication.User', undefined, true)
        ],
        responseMessages: []
    },
    models: {
        'authentication.User': {
            required: ['accessCode', 'verifyCode', 'site'],
            properties: {
                accessCode: {
                    type: 'string'
                },
                verifyCode: {
                    type: 'string'
                },
                site: {
                    type: 'string'
                }
            }
        }
    }
};

function getSession(req, res) {

    if (_.isObject(req.session.user) === true) {
        req.logger.info('Session Found');
        res.status(rdk.httpstatus.ok).rdkSend(userUtil.sanitizeUser(req.session.user));
        return;
    }

    req.logger.warn('No session present for get');
    res.status(rdk.httpstatus.unauthorized).rdkSend();

}

module.exports = getSession;
module.exports.parameters = parameters;
module.exports.apiDocs = apiDocs;
