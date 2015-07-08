'use strict';

require('../../env-setup');
var format = require('util').format;
var _ = require('lodash');
var errorUtil = require(global.OSYNC_UTILS + 'error');
var jobUtil = require(global.OSYNC_UTILS + 'job-utils');
var logUtil = require(global.OSYNC_UTILS + 'log');
var async = require('async');
var config= require(global.OSYNC_ROOT + 'worker-config');

function handle(log, configA, environment, handlerCallback) {
    var log = logUtil.getAsChild('opportunistic-sync-request');

    var jobs = [];

    if (!_.isUndefined(config.beanstalk.jobs.activeUser)) {
        log.info("starting osync-active user job");
        jobs = jobs.concat( jobUtil.createActiveUserRequest(log, config, environment, handlerCallback));
    }

    if (!_.isUndefined(config.beanstalk.jobs.appointmentRequest)) {
        log.info("starting appointment request job");
        jobs = jobs.concat( jobUtil.createAppointmentRequest(log, config, environment, handlerCallback));
    }

    if (!_.isUndefined(config.beanstalk.jobs.admissionRequest)) {
        log.info("opportunistic-sync-request. starting admission request job");
        jobs = jobs.concat(jobUtil.createAdmissionRequest(log, config, environment, handlerCallback));
    }

    // make sure that there is something to publish.
    //----------------------------------------------
    if ((jobs) && (jobs.length > 0)) {
        async.every(jobs, function(job, callback) {
            log.debug('opportunistic-sync-request.publishJobs: Entered method. %s jobsToPublish: %j', jobs.length, jobs);
            environment.publisherRouter.publish(job, function(error) {
                if (error) {
                    log.error('opportunistic-sync-request.publishJobs: publisher error: %s', error);
                    return callback(error);
                }

                log.debug('opportunistic-sync-request.publishJobs : jobs published, complete status. jobId: %s, jobs: %j', job);
                return callback(null, job);
            });
        }, function(result) {
            if (result) {
                log.debug("sync complete");
            } else {
                return log.debug("sync failed");
            }
        });
    }

}

module.exports = handle;
module.exports.handle = handle;