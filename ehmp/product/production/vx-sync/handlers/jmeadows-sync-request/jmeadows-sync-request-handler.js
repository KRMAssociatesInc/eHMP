'use strict';

var _ = require('underscore');
var errorUtil = require(global.VX_UTILS + 'error');
var jobUtil = require(global.VX_UTILS + 'job-utils');
var timeUtil = require(global.VX_UTILS + 'time-utils');

function handle(log, config, environment, job, handlerCallback) {
    log.debug('jmeadows-sync-request-handler.handle: received request to JMeadows %j', job);

    if(!job) {
        log.debug('jmeadows-sync-request-handler.handle : Job was null or undefined');
        return setTimeout(handlerCallback, 0, errorUtil.createFatal('No job given to handle'));
    }

    if(!job.type || job.type !== jobUtil.jmeadowsSyncRequestType()) {
        log.debug('jmeadows-sync-request-handler..handle : job type was invalid: %s', job.type);
        return setTimeout(handlerCallback, 0, errorUtil.createFatal('Incorrect job type', job.type), job);
    }

    if(!jobUtil.isValid(jobUtil.jmeadowsSyncRequestType(), job)) {
        log.debug('jmeadows-sync-request-handler.handle : job was invalid jpid=%s', job.jpid);
        return setTimeout(handlerCallback, 0, errorUtil.createFatal('Invalid job', job.type), job);
    }

    // TODO: determine whether not having any domains defined is an error
    if(!config.jmeadows || _.isEmpty(config.jmeadows.domains)) {
        log.warn('jmeadows-sync-request-handler.handle : No domains configured for jmeadows');
        return setTimeout(handlerCallback);
    }

    var requestStampTime = timeUtil.createStampTime();

    log.debug('jmeadows-sync-request-handler.handle: Preparing domain jobs to be published.  requestStampTime: %s', requestStampTime);
    var jobsToPublish = _.map(config.jmeadows.domains, function(domain) {
        var meta = {
            jpid: job.jpid,
            rootJobId: job.rootJobId,
            param: job.param
        };
        return jobUtil.createJmeadowsDomainSyncRequest(job.patientIdentifier, domain, requestStampTime, meta);
    });

    log.debug('jmeadows-sync-request-handler.handle: Publishing jobs.  jobsToPublish: %j', jobsToPublish);
    environment.publisherRouter.publish(jobsToPublish, handlerCallback);
}

module.exports = handle;