'use strict';

var rdk = require('../../core/rdk');
var nullChecker = rdk.utils.nullchecker;
var mongoStore = require('../../utils/mongo-store');
var _ = require('underscore');
var USERS_COLLECTION = 'ehmpUsers';

module.exports = editRole;
module.exports.parameters = {
    post: {
        user: {
            required: true
        },
        roles: {
            required: true
        }
    }
};

module.exports.apiDocs = {
    spec: {
        summary: 'Replaces a role in the list of roles for an ehmp user with a new role',
        notes: '',
        parameters: [
            rdk.docs.swagger.paramTypes.body('Roles', 'User and roles for the user', 'edit.Roles', undefined, true)
        ],
        responseMessages: [{
            code: 200,
            message: 'Role successfully replaced'
        }, {
            code: 400,
            message: 'Bad request'
        }]
    },
    models: {
        'edit.Roles': {
            required: ['user', 'roles'],
            properties: {
                user: {
                    required: ['uid'],
                    properties: {
                        uid: {
                            type: 'string'
                        }
                    }
                },
                roles: {
                    type: 'array',
                    uniqueItems: true,
                    items: {
                        type: 'string'
                    }
                }
            }
        }
    }
};

function editRole(req, res) {
    mongoStore.getCollection(USERS_COLLECTION, req, res, function(ehmpUsers) {
        if (nullChecker.isNullish(ehmpUsers)) {
            return; // mongo-store db connector will report error
        }
        var user = req.param('user');
        var newRoles = req.param('roles') || [];
        if (nullChecker.isNullish(user)) {
            res.status(rdk.httpstatus.bad_request).rdkSend('User missing from request');
            return;
        }
        if (nullChecker.isNullish(newRoles)) {
            res.status(rdk.httpstatus.bad_request).rdkSend('Roles missing from request');
            return;
        }
        if (!_.isUndefined(user.roles) && _.isEqual(user.roles, newRoles)) {
            res.status(rdk.httpstatus.ok).rdkSend('No new roles to be updated or removed');
            return;
        }

        /**
         * Build the query findAndModify for mongodb
         * It finds and updates the existing data or creates new if doesn't exist
         * collection.findAndModify({
         *      query: <document>,
         *      sort: <document>,
         *      remove: <boolean>,
         *      update: <document>,
         *      new: <boolean>,
         *      fields: <document>,
         *      upsert: <boolean>,
         *      callback: function
         * });
         */

        ehmpUsers.findAndModify({
            uid: user.uid
        }, [], {
            $set: {
                roles: newRoles
            }
        }, {
            upsert: true,
            'new': true
        }, function(err, result) {
            if (err) {
                res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
                return;
            }
            res.status(rdk.httpstatus.ok).rdkSend(result.roles);
            return;
        });
    });
}
