'use strict';

var _ = require('underscore');
var rdk = require('../../core/rdk');

var apiDocs = {
    spec: {
        summary: 'Destroys the current user session',
        notes: 'Expects a session to exist else it returns nothing.',
        parameters: [],
        responseMessages: [
            {
                code: 200,
                message: 'Session successfully destroyed'
            },
            {
                code: 401,
                message: 'No session to destroy'
            }
        ]
    }
};

function destroySession(req, res) {

    if (_.isObject(req.session.user) === false) {
        req.logger.debug('Could not destroy empty session.');
        res.status(rdk.httpstatus.unauthorized).rdkSend();
        return;
    }

    req.session.destroy(function(err) {
        if (err) {
            req.logger.error('Error destroying session: ' + err.toString());
            res.status(rdk.httpstatus.internal_server_error).rdkSend();
            return;
        } else {
            req.logger.debug('Destroyed session.');
            //backbone requires a json object at a minimum to be sent back or it will assume an error
            res.status(rdk.httpstatus.ok).rdkSend();
            return;
        }
    });
}

module.exports = destroySession;
module.exports.apiDocs = apiDocs;
