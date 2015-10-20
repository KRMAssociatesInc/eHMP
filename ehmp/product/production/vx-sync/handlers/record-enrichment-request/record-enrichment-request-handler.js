'use strict';

//--------------------------------------------------------------------------------
// This handles any Record Enrichment jobs.   It will enhance the record and send
// the enhanced record on to the Store Record Handler.
//
// @Author:  Les Westberg
//--------------------------------------------------------------------------------
var _ = require('underscore');
var util = require('util');
var errorUtil = require(global.VX_UTILS + 'error');
var jobUtil = require(global.VX_UTILS + 'job-utils');

//-----------------------------------------------------------------------------------
// This method is called when a record enrichment job is received.  It processes the
// job.
//
// log: The logger to send log messages to.
// config: The configuration information
// environment: The environment handles and context.
// job: The record enrichment job to be processed.
// handlerCallback: This is the handler to call when the message has been processed.
//                  function(error)  where:
//                       Error is the error that occurred.
//-----------------------------------------------------------------------------------
function handle(log, config, environment, job, handlerCallback) {
    log.debug('record-enrichment-request-handler.handle: received request to Record Enrichment %j', job);

    // Make sure that this job is valid.
    //----------------------------------
    if (!jobUtil.isValid(jobUtil.recordEnrichmentType(), job)) {
        log.warn('record-enrichment-request-handler.handle: Invalid job received %j', job);
        return setTimeout(handlerCallback, 0, errorUtil.createFatal('Invalid format for job', job));
    }

    transformRecord(log, config, environment, job.dataDomain, job.record, function(error, record){
        if(error) {
            return setTimeout(handlerCallback, 0, errorUtil.createFatal(util.format('Failed to run record enrichment transform.  Error: %s job: %j', error, job)));
        } else {
            createAndPublishStoreRecordJob(log, environment, job, record, handlerCallback);
        }
    });

}

function transformRecord(log, config, environment, domain, record, callback) {
    // Is this job one for a domain that we need to enrich?
    //-----------------------------------------------------
    if ((config) && (config.recordEnrichment) && (config.recordEnrichment.domains) && (_.contains(config.recordEnrichment.domains, domain))) {
        var xformer;
        try {
            xformer = getXformer(domain, environment);
        } catch (exception) {
            //Cannot find module for dataDomain
            //---------------------------------
            log.error('record-enrichment-request-handler.transformRecord: Xformer for Domain type: %s does not exist.  FileName: record-enrichment-%s-xformer.js', domain, domain);
            return setTimeout(callback, 0, errorUtil.createFatal(util.format('Xformer for Domain type: %s does not exist.  FileName: record-enrichment-%s-xformer.js', domain, domain)));
        }

        xformer(log, config, environment, record, function(error, record) {
            log.debug('record-enrichment-request-handler.transformRecord: Returned from calling xformer.  error: %s, record: %j', error, record);

            if (error) {
                log.error('record-enrichment-request-handler.transformRecord: Failed to run record enrichment transform.  Error: %s record: %j', error, record);
                return setTimeout(callback, 0, errorUtil.createFatal(util.format('Failed to run record enrichment transform.  Error: %s record: %j', error, record)));
            }

            if (!record) {
                log.error('record-enrichment-request-handler.transformRecord: Failed to run record enrichment transform.  No record was received from transformer.');
                return setTimeout(callback, 0, errorUtil.createFatal(util.format('Failed to run record enrichment transform.  No record was received from transformer.')));
            }

            return callback(null, record);
        });
    } else {
        return callback(null, record);
    }
}

//------------------------------------------------------------------------------------------------
// This method creates the StoreRecord job and publishes it.
//
// log: The logger to send log messages.
// environment: The environment handles and context.
// job: The job that was received by the handler.
// record: The record (or enhanced record) that will be published to the StoreRecord tube.
// handlerCallback: This is the handler to call when the message has been processed.
//                  function(error)  where:
//                       Error is the error that occurred.
//------------------------------------------------------------------------------------------------
function createAndPublishStoreRecordJob(log, environment, job, record, handlerCallback) {
    var meta = {
        jpid: job.jpid,
        rootJobId: job.rootJobId,
        param: job.param
    };
    var jobToPublish = jobUtil.createStoreRecord(job.patientIdentifier, job.dataDomain, record, meta);

    log.debug('record-enrichment-request-handler.handle: Publishing jobs %j', jobToPublish);
    return environment.publisherRouter.publish(jobToPublish, handlerCallback);
}

//--------------------------------------------------------------------------------------------------
// This method returns the transformer.  It was done this way so that unit tests could insert
// different behaviors for this xformer to test things.
//
// dataDomain: The domain of the data.
// environment:  If the unit test wants to override the transformer behavior it will send a new
//               function in the environment.XformerOverride field.
//--------------------------------------------------------------------------------------------------
function getXformer(dataDomain, environment) {
    if ((!environment) || (!environment.XformerOverride)) {
        return require(util.format('./record-enrichment-%s-xformer', dataDomain));
    } else {
        return environment.XformerOverride;
    }
}

module.exports = handle;
module.exports.transform = transformRecord;
