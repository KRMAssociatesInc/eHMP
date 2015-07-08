'use strict';

var _ = require('underscore');
// var errorUtil = require(global.VX_UTILS + 'error');
var jobUtil = require(global.VX_UTILS + 'job-utils');
// var format = require('util').format;

function handle(log, config, environment, job, handlerCallback) {
    log.debug('publish-vx-data-change-request-handler.handle - received request to vx change (%s) %s', job.dataDomain, job);

    var meta = {
        jpid: job.jpid,
        rootJobId: job.rootJobId,
        param: job.param
    };
    var jobsToPublish = _.map(config.publishTubes, function(tubeName){
        log.info('publish-vx-data-change-request-handler publishing job to tube ' + tubeName);
        return jobUtil.create(tubeName, job.patientIdentifier, job.dataDomain, job.record, null, null, meta);
    });
    if(jobsToPublish.length > 0) {
        environment.publisherRouter.publish(jobsToPublish, handlerCallback);
    } else {
        handlerCallback();
    }
}

module.exports = handle;
