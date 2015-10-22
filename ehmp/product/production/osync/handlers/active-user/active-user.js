'use strict';

var _ = require('lodash');
var async = require('async');
var S = require('string');
var moment = require('moment');

var nullUtil = require(global.OSYNC_UTILS + 'null-utils');
var jobUtil = require(global.OSYNC_UTILS + 'job-utils');
var jdsUtil = require(global.OSYNC_UTILS + 'jds-utils');
var users_list_screen_id = 'osyncusers';
var active_user_threshold = 30.0;

function handle(log, config, environment, job, handlerCallback) {
    log.debug('active-user.handle : received request to save %s', JSON.stringify(job));

    if (nullUtil.isNullish(job.type) || job.type !== 'active-user') {
        log.debug("active-user-request.handle: No Job type or incorrect job type received ");
        return;
    }

    async.series({
        get: function (cb) {
            jdsUtil.getFromJDS(log, config, users_list_screen_id, cb);
        }
    }, function(getError, getResponse) {
        if (_.isUndefined(getResponse.get.users) || _.isUndefined(getResponse.get.users)) {
            log.debug("active-user-request.handle: No users in JDS to process");
            return;
        }
        var result = filterForActiveUsers(getResponse.get.users, moment());
        job.source = 'active-user';
        job.users = result;

        var jobToPublish = jobUtil.createPatientListRequest(log, config, environment, handlerCallback, job);
        log.debug("active-user-request.handle: "+ jobToPublish.toString());

        environment.publisherRouter.publish(jobToPublish, handlerCallback);
    });
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