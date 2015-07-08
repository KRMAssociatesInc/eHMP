'use strict';

var _ = require('underscore');
var errorUtil = require(global.VX_UTILS + 'error');
var jobUtil = require(global.VX_UTILS + 'job-utils');

function handle(log, config, environment, job, handlerCallback) {
    log.debug('vista-prioritization-request-handler.handle : received request to HDR %s', job);

    // if(!jobUtil.isValid(jobUtil.recordEnrichmentType, job)) {
    //     log.warn('Invalid job received');
    //     log.warn(job);
    //     return handlerCallback(errorUtil.createFatal('Invalid format for job', job));
    // }

    // After validation, determine priority based on some criteria

    // the call(s) to enrichment goes here:
    var record = job.record;
    var meta = {
        jpid: job.jpid,
        rootJobId: job.rootJobId,
        param: job.param
    };
    var jobToPublish = jobUtil.createRecordEnrichment(job.patientIdentifier, job.dataDomain, record, meta);

    environment.publisherRouter.publish(jobToPublish, handlerCallback);
}

module.exports = handle;