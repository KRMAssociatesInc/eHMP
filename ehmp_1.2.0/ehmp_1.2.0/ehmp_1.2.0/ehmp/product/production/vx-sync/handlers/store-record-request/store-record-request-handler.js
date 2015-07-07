/*jslint node: true */
'use strict';

var _ = require('underscore');
var errorUtil = require(global.VX_UTILS + 'error');
var jobUtil = require(global.VX_UTILS + 'job-utils');
var async = require('async');
var solrXform = require(global.VX_UTILS + 'solr-xform');

function handle(log, config, environment, job, handlerCallback) {
    log.debug('store-record-request-handler.handle: Received request to store record (%s) %j', job.dataDomain, job);

    if (!jobUtil.isValid(jobUtil.storeRecordType(), job)) {
        log.warn('store-record-request-handler.handle: Invalid job received.  Job: %j', job);
        return handlerCallback(errorUtil.createFatal('Invalid format for job', job));
    } else {
        log.debug('store-record-request-handler.handle: Valid job received');
    }

    // validate record
    if (_.isUndefined(job.record)) {
        log.error('store-record-request-handler.handle: Missing record.  Job: %j', job);
        return handlerCallback(errorUtil.createFatal('Missing record', job));
    }
    if (_.isUndefined(job.record.uid)) {
        log.error('store-record-request-handler.handle: Missing uid.  Job: %j', job);
        return handlerCallback(errorUtil.createFatal('Missing UID', job));
    }
    if (_.isUndefined(job.record.stampTime)) {
        log.error('store-record-request-handler.handle: Missing stampTime.  Job: %j', job);
        return handlerCallback(errorUtil.createFatal('Missing stampTime', job));
    }
    if (_.isUndefined(job.record.pid) && _.isUndefined(job.record.icn)) {
        log.error('store-record-request-handler.handle: Missing patient identifier.  Job: %j', job);
        return handlerCallback(errorUtil.createFatal('Missing patient identifier', job));
    }

    log.debug('store-record-request-handler.handle: Storing to JDS: %j', job);
    async.series({
        storeJds: function(callback) {
            environment.jds.storePatientDataFromJob(job, function(error, response, body) {
                log.debug('store-record-request-handler.handle: JDS response code: %s', (response ? response.statusCode : undefined));
                if (error) {
                    log.debug('store-record-request-handler.handle: error: %s; response: %j; body: %j', error, response, body);
                    return callback(error);
                }
                if (response.statusCode !== 201) {
                    log.debug('store-record-request-handler.handle: error: %s; response: %j; body: %j', error, response, body);
                }

                log.debug('store-record-request-handler.handle: JDS STORED RECORD!  error: %s; response: %j; body: %j', error, response, body);
                return callback();
            });
        },
        storeSolr: function(callback) {
            var solrClient = environment.solr;

            var solrRecord = solrXform(job.record, log);
            if (_.isObject(solrRecord)) {
                log.debug('store-record-request-handler.handle: Storing SOLR record.  uid: %s; solrRecord: %j', job.record.uid, solrRecord);
                solrClient.add(solrRecord, function(error) {
                    if (error) {
                        // error storing to solr.  log it, but don't kill stuff
                        log.error('store-record-request-handler.handle: Error storing to SOLR.  error: %s; uid: %s, solrRecord: %j', error, job.record.uid, solrRecord);
                        return callback();
                    } else {
                        log.debug('store-record-request-handler.handle: Record stored to SOLR successfully.  uid: %s', job.record.uid);
                        return callback();
                    }
                });
            } else {
                log.debug('store-record-request-handler.handle: SOLR xform returned null There is no SOLR record to store.  uid: %s', job.record.uid);
                return callback();
            }
        },
        publish: function(callback) {
            var meta = {
                jpid: job.jpid,
                rootJobId: job.rootJobId,
                param: job.param
            };
            var jobToPublish = jobUtil.createPublishVxDataChange(job.patientIdentifier, job.dataDomain, job.record, meta);
            environment.publisherRouter.publish(jobToPublish, callback);
        }
    }, function(error) {
        log.debug('store-record-request-handler.handle: Completed call to async.series.  error: %s', error);
        if (error) {
            if (error.message) {
                log.error('store-record-request-handler.handle: Unable to store record.  error: %j', error.message.error.errors);
                return handlerCallback(errorUtil.createFatal('Unable to store record', error.message.error.errors));
            }
            log.error('store-record-request-handler.handle: Unable to handle publish vx data change.  error: %j', error);
            return handlerCallback(errorUtil.createFatal('Unable to handle publish vx data change', error));
        }

        log.debug('store-record-request-handler.handle: Exiting final callback.');
        handlerCallback(null, 'success');
    });

}

module.exports = handle;