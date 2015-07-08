'use strict';

var jobUtil = require(global.VX_UTILS + 'job-utils');
var request = require('request');
var _ = require('underscore');
var format = require('util').format;
var fsUtil = require(global.VX_UTILS + 'fs-utils');
var mkdirp = require('mkdirp');
var path = require('path');
var crypto = require('crypto');
var Buffer = require('buffer').Buffer;
var inspect = require('util').inspect;

function handle(log, config, environment, job, handlerCallback) {
    log.debug(format('jmeadows-rtf-request-handler.handle : received request to JMeadows RTF handler %s', job));

    var domainConfig = getHttpConfig(log, config, job);
    if (domainConfig === null) {
        return setTimeout(handlerCallback, 0, 'Could not get configuration for JMeadows document: ' + job.dataDomain);
    }

    log.debug('jmeadows-rtf-request-handler.handle : Requesting document at ' + domainConfig.url);
    log.debug('jmeadows-rtf-request-handler.handle : sending document request');
    request(domainConfig, function(error, response, body) {
        log.debug('jmeadows-rtf-request-handler.handle : received document response');
        if (!error && response.statusCode === 200) {
            var staging = config.documentStorage.staging;
            var tmpFilePath = staging.path + '/' + job.jobId;
            createTmpFile(log, path.resolve(tmpFilePath /*staging.path*/ ), staging.permissions, body, function(err, filename) {
                if (!err) {
                    //update record
                    job.record.fileId = filename;
                    job.record.fileJobId = job.jobId;
                    var jobToPublish = jobUtil.createJmeadowsRtfDocumentTransformRequest(job.patientIdentifier, job.dataDomain, job.record, job);

                    environment.publisherRouter.publish(jobToPublish, handlerCallback);
                } else {
                    log.error(format('jmeadows-rtf-request-handler.handle : unable to write JMeadows file for %s domain %s because %s', job.patientIdentifier, job.dataDomain, err));
                    return handlerCallback(format('unable to write JMeadows file Error: %s', err));
                }
            });
        } else {
            log.error(format('jmeadows-rtf-request-handler.handle : unable to retrieve JMeadows file for %s domain %s because %s', job.patientIdentifier, job.dataDomain, error));
            return handlerCallback(('unable to retrieve JMeadows file Error: %s', error));
        }
    });
}

function createTmpFile(log, path, permissions, file, callback) {
    log.debug('jmeadows-rtf-request-handler.createTmpFile : path ', path);
    log.debug('jmeadows-rtf-request-handler.createTmpFile : permissions ', permissions);
    if (_.isString(permissions)) {
        if (!/^7\d\d$/.test(permissions)) {
            return callback('jmeadows-rtf-request-handler.createTmpFile() Insufficient privledges set for staging area');
        }
    }
    mkdirp(path, permissions, function(error) {
        if (error) {
            log.error('jmeadows-rtf-request-handler.createTmpFile() : Could not create document staging area:' + error);
            return callback(format('jmeadows-rtf-request-handler.createTmpFile() : Could not create document staging area Error: %s', error));
        } else {
            //file contents will allow us to support document versioning
            //while UID would remain the same even if the file were updated.
            var filename = getFilename(file);
            if (!Buffer.isBuffer(file)) {
                file = new Buffer(file, 'binary');
            }
            writeTmpFile(log, path, filename, permissions, file, function(err) {
                //var error = 'jmeadows-rtf-request-handler.createTmpFile() - Unable to write file to disk' + err;
                log.error('jmeadows-rtf-request-handler.createTmpFile() - Unable to write file to disk: ' + inspect(err));
                callback(error);
            }, callback);
        }
    });
}

function getFilename(hashInput) {
    // return uuid.v1() + '.rtf';
    var sha = crypto.createHash('sha1');
    sha.update(hashInput, 'binary');
    return sha.digest('hex') + '.rtf';
}

function writeTmpFile(log, path, filename, permissions, file, tryAgainCallback, callback) {
    fsUtil.writeFile(log, path, filename, permissions, file, tryAgainCallback, callback);
}

function getHttpConfig(log, config, job) {
    var query = {};
    if (job && job.record) {
        if (job.record.dodComplexNoteUri) {
            query.uri = job.record.dodComplexNoteUri;
        } else if (job.record.complexDataUrl) {
            query.uri = job.record.complexDataUrl;
        } else {
            log.error('jmeadows-rtf-request-handler.getHttpConfig : unable to find URL for document retrieval');
            return null;
        }
    } else {
        log.error(format('jmeadows-rtf-request-handler.getHttpConfig : Received error while retrieving JMeadows Document Error: %s', 'Could not parse VPR record'));
        return null;
    }

    if (!config || !config.jmeadows || !config.jmeadows.document || !config.jmeadows.defaults) {
        log.error('jmeadows-rtf-request-handler.getHttpConfig : VX Sync configuration missing jmeadows document service');
        return null;
    }

    var domainConfig = _.extend({
        'qs': query
    }, config.jmeadows.document);
    domainConfig = _.defaults(domainConfig, config.jmeadows.defaults);
    var url = format('%s://%s:%s%s', domainConfig.protocol || 'http', domainConfig.host, domainConfig.port, domainConfig.path);
    domainConfig.url = url;

    return domainConfig;
}

module.exports = handle;
module.exports._getHttpConfig = getHttpConfig;
module.exports._writeTmpFile = writeTmpFile;
module.exports._createTmpFile = createTmpFile;