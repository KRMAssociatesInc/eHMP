'use strict';

var rdk = require('../../core/rdk');
var nullChecker = rdk.utils.nullchecker;
var mongoStore = require('../../utils/mongo-store');
var _ = require('underscore');
var USERS_COLLECTION = 'ehmpUsers';
var roles = require('../../subsystems/pdp/roles');

module.exports = getList;

module.exports.apiDocs = {
    spec: {
        summary: '',
        notes: '',
        parameters: [],
        responseMessages: []
    }
};

function getList(req, res) {
    var rdkRoles = _.toArray(_.clone(roles));
    var result = {
        data: rdkRoles
    }
    return res.status(rdk.httpstatus.ok).rdkSend(result);
}
