'use strict';

var _ = require('underscore');
var jobUtil = require(global.VX_UTILS + 'job-utils');
var idUtil = require(global.VX_UTILS + 'patient-identifier-utils');
var request = require('request');
var format = require('util').format;
var inspect = require(global.VX_UTILS + 'inspect');
var errorUtil = require(global.VX_UTILS + 'error');
var async = require('async');
var lzma = require('lzma');

function handle(log, config, environment, job, handlerCallback) {
    log.debug('vler-to-vpr-xform-handler.handle : received request to VLER xform %s', job);
    if (!job.patientIdentifier || !job.patientIdentifier.type || job.patientIdentifier.type !== 'pid' || !idUtil.isVler(job.patientIdentifier.value) ||
        !job.record || !job.record.document.documentUniqueId || !job.record.document.homeCommunityId || !job.record.document.repositoryUniqueId) {
        log.error('vler-to-vpr-xform-handler.handle: Missing param(s).');
        return handlerCallback(errorUtil.createFatal('vler-to-vpr-xform-handler.handle: Missing parameter(s).'));
    }

    var documentConfig = getVlerDocumentConfiguration(log, config, job);
    if (documentConfig === null) {
        log.warn('vler-to-vpr-xform-handler.handle: No configuration for job: %j', job);
        return handlerCallback(errorUtil.createFatal('vler-to-vpr-xform-handler.handle: No configuration'));
    }

    log.debug('vler-to-vpr-xform-handler.handle: sending request to VLER for pid: %s; config: %s.', job.patientIdentifier.value, documentConfig);

    request(documentConfig, function(error, response, body) {
        log.debug('vler-to-vpr-xform-handler.handle: Received VLER document response.  error: %s; ', error);
        if ((!error) && (response) && (response.statusCode === 200)) {
            log.debug('vler-to-vpr-xform-handler.handle: response body (string form): %s', body);
            var jsonBody;
            if (typeof body !== 'object') {
                log.debug('vler-to-vpr-xform-handler.handle: was a string.  Parsing to object now...');
                try {
                    jsonBody = JSON.parse(body);
                } catch (e) {
                    log.error('vler-to-vpr-xform-handler.handle: Failed to parse JSON.  body: %s', body);
                    return handlerCallback(errorUtil.createFatal('Failed to parse VLER response.'));
                }

                getFullHtml(log, jsonBody.compressRequired, jsonBody.vlerDocHtml, function(err, result) {
                    if (!result) {
                        log.error(err);
                        return handlerCallback(errorUtil.createFatal('Failed to get full HTML'));
                    }

                    var vprItem = xformItem(log, job.record.document, result, jsonBody.vlerDocType, jsonBody.compressRequired, job.requestStampTime);

                    log.debug('vler-to-vpr-xform-handler.handle: We are now preparing jobs for publishing.  record: %j', vprItem);
                    var meta = {
                        jpid: job.jpid,
                        rootJobId: job.rootJobId,
                        param: job.param
                    };
                    var jobsToPublish = jobUtil.createRecordEnrichment(job.patientIdentifier, 'vlerdocument', vprItem, meta);

                    log.debug('vler-to-vpr-xform-handler.handle: Jobs prepared.  jobsToPublish: %j', jobsToPublish);

                    environment.publisherRouter.publish(jobsToPublish, function(error, response) {
                        log.debug('vler-to-vpr-xform-handler.handle: Jobs published.  error: %s, response: %j', error, response);
                        if (error) {
                            log.error('vler-to-vpr-xform-handler.handle:  Failed to publish jobs.  error: %s; response: %s; jobs: %j', error, response, jobsToPublish);

                            // TODO:   Push this to an error message location.  We do not want to error out the entire set of messages for one problem.
                            //--------------------------------------------------------------------------------------------------------------------------
                            return handlerCallback(null, 'FailedToPublishJobs');
                        }

                        return handlerCallback(null, 'success');
                    });
                });

            } else {
                log.error('vler-to-vpr-xform-handler.handle: invalid response body: $s', body);
                return handlerCallback(errorUtil.createFatal('invalid response body'));
            }
        } else {
            var statusCode;
            if ((response) && (response.statusCode)) {
                statusCode = response.statusCode;
            }
            log.error(format('vler-to-vpr-xform-handler.handle: Unable to retrieve VLER document for %s because %s', inspect(job.patientIdentifier), statusCode));
            return handlerCallback(errorUtil.createFatal('unable to sync'));
        }

    });

}

function getVlerDocumentConfiguration(log, config, job) {
    var query = {};
    query.icn = idUtil.extractIcnFromPid(job.patientIdentifier.value);
    query.documentUniqueId = job.record.document.documentUniqueId;
    query.homeCommunityId = job.record.document.homeCommunityId;
    query.repositoryUniqueId = job.record.document.repositoryUniqueId;
    log.debug('vler-sync-request-handler.getVlerDocumentConfiguration: query: %j', query);

    if (!config.vler) {
        log.error('vler-sync-request-handler.getVlerDocumentConfiguration: Missing VLER Document configuration');
        return null;
    }

    var vlerConfig = {
        'qs': query
    };
    vlerConfig = _.defaults(vlerConfig, config.vler);
    var url = format('%s://%s:%s%s', 'http', vlerConfig.defaults.host, vlerConfig.defaults.port, vlerConfig.vlerdocument.documentPath);
    vlerConfig.url = url;

    return vlerConfig;
}

function xformItem(log, document, fullHtml, vlerDocType, compressed, stampTime) {
    if (!document) {
        return;
    }

    var vprItem = vlerDocumentToVPR(document, fullHtml, vlerDocType, compressed);
    vprItem.stampTime = stampTime;
    log.debug('vler-to-vpr-xform-handler.xformItem: vprItemTimeStamp: %j', vprItem.stampTime);
    return vprItem;
}

function vlerDocumentToVPR(document, fullHtml, vlerDocType, compressed) {
    var vprVlerDocument = {};
    vprVlerDocument.kind = vlerDocType;
    vprVlerDocument.creationTime = document.creationTime;
    vprVlerDocument.name = document.name;
    vprVlerDocument.uid = document.uid;
    if (document.summary) {
        vprVlerDocument.summary = document.summary;
    } else {
        vprVlerDocument.summary = document.name;
    }
    vprVlerDocument.pid = document.pid;
    vprVlerDocument.authorList = document.authorList;
    vprVlerDocument.documentUniqueId = document.documentUniqueId;
    vprVlerDocument.homeCommunityId = document.homeCommunityId;
    vprVlerDocument.mimeType = document.mimeType;
    vprVlerDocument.repositoryUniqueId = document.repositoryUniqueId;
    vprVlerDocument.sourcePatientId = document.sourcePatientId;
    vprVlerDocument.fullHtml = fullHtml;
    if (compressed) {
        vprVlerDocument.compressed = compressed;
    }
    return vprVlerDocument;
}

function getFullHtml(log, compressRequired, vlerDocHtml, callback) {
    if (compressRequired) {
        var startTime = new Date();
        lzma.compress(vlerDocHtml, 1, function(result) {
            if (result === false) {
                callback('vler-to-vpr-xform-handler: Failed to compress VLER HTML', null);
            }
            var resultStr = new Buffer(result).toString('base64');
            log.debug('before compress: ' + vlerDocHtml.length + ' -> after compress: ' + resultStr.length + ', elapsed time: ' + (((new Date()) - startTime)/1000));
            callback(null, resultStr);
        });
    } else {
        callback(null, vlerDocHtml);
    }
}

module.exports = handle;
module.exports._getVlerDocumentConfiguration = getVlerDocumentConfiguration;
module.exports._getFullHtml = getFullHtml;
module.exports._vlerDocumentToVPR = vlerDocumentToVPR;