'use strict';

var _ = require('underscore');
var errorUtil = require(global.VX_UTILS + 'error');
var jobUtil = require(global.VX_UTILS + 'job-utils');
var timeUtil = require(global.VX_UTILS + 'time-utils');
var OperationaldataSyncUtil = require(global.VX_UTILS + 'site-operational-data-status-util');

function handle(log, config, environment, job, handlerCallback) {
    log.debug('hdr-sync-request-handler.handle: received request to HDR %j', job);

    if(!job) {
        log.debug('hdr-sync-request-handler.handle : Job was null or undefined');
        return setTimeout(handlerCallback, 0, errorUtil.createFatal('No job given to handle'));
    }

    if(!job.type || job.type !== jobUtil.hdrSyncRequestType()) {
        log.debug('hdr-sync-request-handler..handle : job type was invalid: %s', job.type);
        return setTimeout(handlerCallback, 0, errorUtil.createFatal('Incorrect job type', job.type), job);
    }

    if(!jobUtil.isValid(jobUtil.hdrSyncRequestType(), job)) {
        log.debug('hdr-sync-request-handler.handle : job was invalid jpid=%s', job.jpid);
        return setTimeout(handlerCallback, 0, errorUtil.createFatal('Invalid job', job.type), job);
    }

    // TODO: determine whether not having any domains defined is an error
    if(!config.hdr || _.isEmpty(config.hdr.domains)) {
        log.warn('hdr-sync-request-handler.handle : No domains configured for hdr');
        return setTimeout(handlerCallback);
    }

    var requestStampTime = timeUtil.createStampTime();

    // lets get setup for the Operational Data Sync status for primary sites
    // this information will be used by hdr-xform-domain-vpr-handler
    // to decide whether a redundant domain sync job is redundant or not

    log.debug('hdr-sync-request-handler.handle: received request to HDR %j', job);
    var operationaldataSyncUtil = OperationaldataSyncUtil.getInstance();
    operationaldataSyncUtil.initialize(log, config, environment);

    log.debug('hdr-sync-request-handler.handle: Preparing domain jobs to be published.  requestStampTime: %s', requestStampTime);
    var filterDomains = _.filter(config.hdr.domains, function(domain) { return domain !== 'patient'; });
    var jobsToPublish = _.map(filterDomains, function(domain) {
        var meta = {
            jpid: job.jpid,
            rootJobId: job.rootJobId,
            param: job.param
        };
        return jobUtil.createHdrDomainSyncRequest(job.patientIdentifier, domain, requestStampTime, meta);
    });

    log.debug('hdr-sync-request-handler.handle: Publishing jobs.  jobsToPublish: %j', jobsToPublish);
    environment.publisherRouter.publish(jobsToPublish, handlerCallback);
}

module.exports = handle;