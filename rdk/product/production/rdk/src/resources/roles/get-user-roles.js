'use strict';

var rdk = require('../../core/rdk');
var nullChecker = rdk.utils.nullchecker;
var mongoStore = require('../../utils/mongo-store');
var _ = require('underscore');
var USERS_COLLECTION = 'ehmpUsers';

module.exports = getUserRoles;
module.exports.parameters = {
    get: {
        uid: {
            required: true,
        }
    }
};

module.exports.apiDocs = {
    spec: {
        summary: '',
        notes: '',
        parameters: [
            rdk.docs.commonParams.uid
        ],
        responseMessages: [{
            code: 200,
            message: 'Roles retrieved'
        }, {
            code: 400,
            message: 'Bad request'
        }]
    }
};

function getUserRoles(req, res) {
    req.logger.debug('getRoles resource called');
    mongoStore.getCollection(USERS_COLLECTION, req, res, function(ehmpUsers) {
        if (nullChecker.isNullish(ehmpUsers)) {
            return; // mongo-store db connector will report error
        }
        var uid = req.param('uid');

        if (nullChecker.isNullish(uid)) {
            res.status(rdk.httpstatus.bad_request).rdkSend('User missing from request');
            return;
        }
        ehmpUsers.findOne({
            uid: uid
        }, function(err, result) {
            if (!_.isEmpty(err) && !_.isNull(err)) {
                res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
                return;
            }
            if (nullChecker.isNullish(result)) {
                res.status(rdk.httpstatus.bad_request).rdkSend('User does not exist');
                return;
            }
            res.status(rdk.httpstatus.ok).rdkSend({
                roles: result.roles
            });
            return;
        });
    });
}
