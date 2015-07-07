'use strict';

var _ = require('underscore');
var jobUtil = require(global.VX_UTILS + 'job-utils');
var timeUtil = require(global.VX_UTILS + 'time-utils');
var domains = require(global.VX_UTILS + 'domain').getDomainList();

function handle(log, config, environment, job, handlerCallback) {
    log.debug('pgd-sync-request-handler.handle : received request to PGD %s', job);

    // if(!jobUtil.isValid(jobUtil.pgdSyncRequestType, job)) {
    //     log.warn('Invalid job received');
    //     log.warn(job);
    //     return handlerCallback(errorUtil.createFatal('Invalid format for job', job));
    // }

    // the call(s) to PGD/DAS go here:
    var record = {
        pid: job.patientIdentifier.value,
        stampTime: timeUtil.createStampTime()
    };

    var jobsToPublish = _.map(domains, function(domain) {
        // TODO: remove this
        var newJob = jobUtil.createPgdXformVpr(job.patientIdentifier, domain, _.clone(record), job);
        newJob.record.uid = 'urn:va:' + newJob.dataDomain + ':PGD:' + job.patientIdentifier.value + ':' + job.jobId;
        if (newJob.dataDomain === 'obs') {
            newJob.record.typeName = 'something';
        }
        return newJob;
        // TODO: enable this version once stampTime is added and events have legit UIDs
        // return jobUtil.createPgdXformVpr(job.patientIdentifier, domain, record, requestStampTime, job);
    });

    environment.publisherRouter.publish(jobsToPublish, handlerCallback);
}

module.exports = handle;
