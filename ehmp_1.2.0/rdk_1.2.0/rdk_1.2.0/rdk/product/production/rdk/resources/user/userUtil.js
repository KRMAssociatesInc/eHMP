'use strict';


var _ = require('underscore');

// do not uncomment - see DE651
var whitelist = [
    //'corsTabs',
    //'dgRecordAccess',
    //'dgSecurityOfficer',
    //'dgSensitiveAccess',
    'disabled',
    'divisionSelect',
    'duz',
    'facility',
    //'username',
    'firstname',
    'lastname',
    'permissions',
    'requiresReset',
    //'rptTabs',
    'section',
    'site',
    'title',
    //'vistaKeys',
    'ccowObject',
    'provider'
];

var UserUtil = {};

UserUtil.sanitizeUser = function(user) {
    return _.pick(user, whitelist);
};

module.exports = UserUtil;
