'use strict';

var _ = require('underscore');
var errorUtil = require(global.VX_UTILS + 'error');
var jobUtil = require(global.VX_UTILS + 'job-utils');

function handle(log, config, environment, job, handlerCallback) {
    log.debug('pgd-to-vpr-xform-handler.handle : received request to PGD xform %s', job);

    // if(!jobUtil.isValid(jobUtil.pgdXformVprType(), job)) {
    //     log.warn('Invalid job received');
    //     log.warn(job);
    //     return handlerCallback(errorUtil.createFatal('Invalid format for job', job));
    // }

    // transform called here
    var record = {
        data: {
            type: job.type,
            jpid: job.jpid
        }
    };
    var jobToPublish = jobUtil.createRecordEnrichment(job.patientIdentifier, job.dataDomain, job.record, job);
    environment.publisherRouter.publish(jobToPublish, handlerCallback);
}

module.exports = handle;
