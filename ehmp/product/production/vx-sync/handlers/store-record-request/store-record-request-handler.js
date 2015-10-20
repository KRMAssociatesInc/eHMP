/*jslint node: true */
'use strict';

var _ = require('underscore');
var errorUtil = require(global.VX_UTILS + 'error');
var jobUtil = require(global.VX_UTILS + 'job-utils');
var async = require('async');
var solrXform = require(global.VX_UTILS + 'solr-xform');
var uuid = require('node-uuid');

function handle(log, config, environment, job, handlerCallback, touchBack) {
    log.debug('store-record-request-handler.handle: Received request to store record (%s) %j', job.dataDomain, job);

    if (!jobUtil.isValid(jobUtil.storeRecordType(), job)) {
        log.warn('store-record-request-handler.handle: Invalid job received.  Job: %j', job);
        return handlerCallback(errorUtil.createFatal('Invalid format for job', job));
    } else {
        log.debug('store-record-request-handler.handle: Valid job received');
    }

    storeRecord(log, environment, job.dataDomain, job.patientIdentifier, job.record, handlerCallback, touchBack);
}

function storeRecord(log, environment, domain, patientIdentifier, record, callback, touchBack) {
    if (_.isUndefined(record)) {
        log.error('store-record-request-handler.handle: Missing record.  Record: %j', record);
        return callback(errorUtil.createFatal('Missing record', record));
    }
    if (_.isUndefined(record.uid)) {
        log.error('store-record-request-handler.handle: Missing uid.  Record: %j', record);
        return callback(errorUtil.createFatal('Missing UID', record));
    }
    if (_.isUndefined(record.stampTime)) {
        log.error('store-record-request-handler.handle: Missing stampTime.  Record: %j', record);
        return callback(errorUtil.createFatal('Missing stampTime', record));
    }
    if (_.isUndefined(record.pid) && _.isUndefined(record.icn)) {
        log.error('store-record-request-handler.handle: Missing patient identifier.  Record: %j', record);
        return callback(errorUtil.createFatal('Missing patient identifier', record));
    }

    log.debug('store-record-request-handler.handle: Storing to JDS: %j', record);
    async.series({
        storeJds: function(callback) {
            var metricsObj = {'uid':record.uid, 'pid':record.pid,'process':uuid.v4(),'timer':'start'};
            environment.metrics.warn('Store record in JDS', metricsObj);
            metricsObj.timer = 'stop';
            environment.jds.storePatientData(record, function(error, response, body) {
                log.debug('store-record-request-handler.handle: JDS response code: %s', (response ? response.statusCode : undefined));
                if (error) {
                    environment.metrics.warn('Store record in JDS in Error', metricsObj);
                    log.error('store-record-request-handler.handle: Error encountered when storing to JDS. error: %s; response: %j; body: %j', error, response, body);
                    return callback(error);
                } else if (response.statusCode !== 201) {
                    environment.metrics.warn('Store record in JDS in Error', metricsObj);
                    log.error('store-record-request-handler.handle: Unexpected statusCode received when storing to JDS. error: (no error received); response: %j; body: %j', response, body);
                } else {
                    environment.metrics.warn('Store record in JDS', metricsObj);
                    log.debug('store-record-request-handler.handle: JDS STORED RECORD!  error: (no error received); response: %j; body: %j', response, body);
                }

                return callback();
            });
        },
        touchBack: function(callback) {
            if(_.isFunction(touchBack)) {
                touchBack();
            }
            callback();
        },
        storeSolr: function(callback) {
            var solrClient = environment.solr;
            var metricsObj = {'subsystem':'SOLR','action':'transform','uid':record.uid, 'pid':record.pid,'process':uuid.v4(),'timer':'start'};
            environment.metrics.debug('SOLR record transformation', metricsObj);

            var solrRecord = solrXform(record, log);
            metricsObj.timer = 'stop';
            environment.metrics.debug('SOLR record transformation', metricsObj);
            if (_.isObject(solrRecord)) {
                log.debug('store-record-request-handler.handle: Storing SOLR record.  uid: %s; solrRecord: %j', record.uid, solrRecord);
                metricsObj.timer = 'start';
                metricsObj.action = 'storeRecord';
                environment.metrics.debug('SOLR record storage', metricsObj);
                solrClient.add(solrRecord, function(error) {
                    metricsObj.timer = 'stop';
                    if (error) {
                        environment.metrics.debug('SOLR record storage in Error', metricsObj);
                        // error storing to solr.  log it, but don't kill stuff
                        log.error('store-record-request-handler.handle: Error storing to SOLR.  error: %s; uid: %s, solrRecord: %j', error, record.uid, solrRecord);
                        return callback();
                    } else {
                        environment.metrics.debug('SOLR record storage', metricsObj);
                        log.debug('store-record-request-handler.handle: Record stored to SOLR successfully.  uid: %s', record.uid);
                        return callback();
                    }
                });
            } else {
                log.debug('store-record-request-handler.handle: SOLR xform returned null There is no SOLR record to store.  uid: %s', record.uid);
                return callback();
            }
        },
        touchAgain: function(callback) {
            if(_.isFunction(touchBack)) {
                touchBack();
            }
            callback();
        },
        publish: function(callback) {
            // var meta = {
            //     jpid: job.jpid,
            //     rootJobId: job.rootJobId,
            //     param: job.param
            // };
            var jobToPublish = jobUtil.createPublishVxDataChange(patientIdentifier, domain, record);
            environment.publisherRouter.publish(jobToPublish, callback);
        }
    }, function(error) {
        log.debug('store-record-request-handler.handle: Completed call to async.series.  error: %s', error);
        if (error) {
            if (error.message) {
                var errorMessage = error.message;
                if(errorMessage.error){
                    errorMessage = errorMessage.error.errors;
                }

                log.error('store-record-request-handler.handle: Unable to store record.  error: %j', errorMessage);
                return callback(errorUtil.createFatal('Unable to store record', errorMessage));
            }
            log.error('store-record-request-handler.handle: Unable to handle publish vx data change.  error: %j', error);
            return callback(errorUtil.createFatal('Unable to handle publish vx data change', error));
        }

        log.debug('store-record-request-handler.handle: Exiting final callback.');
        callback(null, 'success');
    });
}

module.exports = handle;
module.exports.store = storeRecord;