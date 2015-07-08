'use strict';

var _ = require('lodash');
var async = require('async');
var S = require('string');
var moment = require('moment');

//var errorUtil = require(global.OSYNC_UTILS + 'error');
var jobUtil = require(global.OSYNC_UTILS + 'job-utils');
var jdsUtil = require(global.OSYNC_UTILS + 'jds-utils');
var users_list_screen_id = 'osyncusers';

var cprs_list_field_name = 'patientList';
var pid_field_name = 'pid';

var active_user_threshold = 30.0;

function handle(log, config, environment, job, handlerCallback) {

    async.series({
        get: function (cb) {
            jdsUtil.getFromJDS(log, config, users_list_screen_id, cb);
        }
    }, function(getError, getResponse) {
        var result = process(filterForActiveUsers(getResponse.get.users, moment()), handlerCallback);
        var jobToPublish = jobUtil.createValidationRequest(log, config, environment, handlerCallback, job);

        environment.publisherRouter.publish(jobToPublish, handlerCallback);
    });
}

function process(activeUsersList, handlerCallback) {
    var activeUsersCprsLists = _.pluck(activeUsersList, cprs_list_field_name);
    var activeUsersPatients = _.flatten(activeUsersCprsLists);
    var activeUsersPatientsPids = _.uniq(_.pluck(activeUsersPatients, pid_field_name));
    handlerCallback(activeUsersPatientsPids);
}

function filterForActiveUsers(usersList, now) {
    now = typeof now !== 'undefined' ? now : moment();
    return _.filter(usersList, function(user) {
        if (!user.lastlogin) return false;
        return now.diff(moment(fixDateString(user.lastlogin)), 'days') <= active_user_threshold;
    });
}

function fixDateString(date) {
    var year = S(date).left(4).s;
    var month = S(date).right(4).left(2).s;
    var day = S(date).left(-2).s;
    return year + '-' + month + '-' + day;
}

module.exports = handle;
module.exports.handle = handle;

module.exports.process = process;
module.exports.filterForActiveUsers = filterForActiveUsers;
module.exports.fixDateString = fixDateString;
