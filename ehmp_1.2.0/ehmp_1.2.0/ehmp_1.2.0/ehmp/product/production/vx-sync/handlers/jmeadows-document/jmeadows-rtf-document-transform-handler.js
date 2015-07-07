'use strict';

var office = require(global.VX_SUBSYSTEMS + '/libreoffice/libreOffice');
var async = require('async');
var format = require('util').format;
var fsUtil = require(global.VX_UTILS + 'fs-utils');
var jobUtil = require(global.VX_UTILS + 'job-utils');
var uidUtil = require(global.VX_UTILS + 'uid-utils');
var path = require('path');
var _ = require('underscore');

function handle(log, config, environment, job, handlerCallback) {
    log.debug('jmeadows-rtf-document-transform-handler.handle : received request to JMeadows RTF conversion handler %s', job);

    if (!job || !job.patientIdentifier || !job.patientIdentifier.value) {
        return setTimeout(handlerCallback, 0, 'Job has no patient identifier');
    }
    if (!job.record || !job.record.fileId || !job.record.fileJobId) {
        return setTimeout(handlerCallback, 0, 'Job is missing required information about the file');
    }
    if (!config || !config.documentStorage || !config.documentStorage.staging || !config.documentStorage.staging.path) {
        return setTimeout(handlerCallback, 0, 'Configuration missing document staging information');
    }
    if (!config.documentStorage.publish || !config.documentStorage.publish.path) {
        return setTimeout(handlerCallback, 0, 'Configuration missing document publish information');
    }
    if (!config.documentStorage.officeLocation) {
        return setTimeout(handlerCallback, 0, 'Configuration missing reference to LibreOffice');
    }
    if (!config.documentStorage.uriRoot) {
        return setTimeout(handlerCallback, 0, 'Configuration missing document retrieval endpoint');
    }


    var rtfFile = config.documentStorage.staging.path + '/' + job.record.fileJobId + '/' + job.record.fileId;
    rtfFile = path.resolve(rtfFile);
    var dir = getPatientDir(job);
    var outPath = config.documentStorage.publish.path + '/' + dir;
    outPath = path.resolve(outPath);
    var htmlFilename = job.record.fileId.replace(/\.rtf/, '.html');
    var txtFilename = htmlFilename.replace(/\.html/, '.txt');
    var jobs = [function(callback) {
        office.convert(rtfFile, 'txt:Text', outPath, config, function(err) {
            if (fsUtil.fileExistsSync(outPath + '/' + txtFilename)) {
                callback();
            } else {
                log.warn('jmeadows-rtf-document-transform-handler.handle(): Could not create TXT file. Error: %s', err);
                callback('TXT file not produced');
            }
        });
    }];

    if (!fsUtil.fileExistsSync(outPath + '/' + htmlFilename)) { //if this file is already stored, don't convert it again
        jobs.push(function(callback) {
            office.convert(rtfFile, 'html', outPath, config, function(err) {
                if (fsUtil.fileExistsSync(outPath + '/' + htmlFilename)) {
                    callback();
                } else {
                    log.warn('jmeadows-rtf-document-transform-handler.handle(): Could not create HTML file. Error: %s', err);
                    callback('HTML file not produced');
                }
            });
        });
    } else {
        log.info('jmeadows-rtf-document-transform-handler.handle() HTML document already found, skipping conversion');
    }

    async.parallel(jobs, function(err) {
        if (!err) {
            //delete source document (clean up staging directory)
            fsUtil.deleteFile(rtfFile);
            //change document uri
            job.record.dodComplexNoteUri = format(config.documentStorage.uriRoot + '?dir=%s&file=%s', dir, htmlFilename);
            //job.record.content = fsUtil.readFileSync(outPath + '/' + txtFilename).toString();
            updateRecordText(job.record, fsUtil.readFileSync(outPath + '/' + txtFilename).toString());
            delete job.record.fileId;
            delete job.record.fileJobId;
            fsUtil.deleteFile(outPath + '/' + txtFilename);

            // Get correct VPR domain
            //-----------------------
            var vprDataDomain = uidUtil.extractDomainFromUID(job.record.uid);

            var jobToPublish = jobUtil.createRecordEnrichment(job.patientIdentifier, vprDataDomain, job.record, job);
            environment.publisherRouter.publish(jobToPublish, handlerCallback);
        } else {
            log.warn('jmeadows-rtf-document-transform-handler.handle(): Could not create HTML and/or TXT file because the document %s appears to be corrupted. error: %s', rtfFile, err);
            //corrupted document example: http://HOST:8080/MockDoDAdaptor/async/complex/note/2151767199

            //delete source document (clean up staging directory)
            fsUtil.deleteFile(rtfFile);

            //copy placeholder document
            fsUtil.copyFile('./handlers/jmeadows-document/corruptedDocPlaceholder.html', outPath + '/' + htmlFilename, function(err) {
                if(err){
                    log.error('jmeadows-rtf-document-transform-handler.handle(): Error copying corrupted document placeholder: ' + err);
                } else{
                    log.debug('jmeadows-rtf-document-transform-handler.handle(): Copied placeholder document as a stand-in for the corrupted document.');
                }

                //change document uri
                job.record.dodComplexNoteUri = format(config.documentStorage.uriRoot + '?dir=%s&file=%s', dir, htmlFilename);
                //job.record.content = '-This is a placeholder for a DOD patient document- Patient data on the jMeadows system indicates that the patient has a document here, but the document appears to be corrupted.'; //fsUtil.readFileSync(outPath+'/'+txtFilename).toString();
                updateRecordText(job.record, '-Placeholder for a DOD Patient Document- Unfortunately this document is corrupted and cannot be displayed.  Please report it so the problem can be rectified.');
                delete job.record.fileId;
                delete job.record.fileJobId;

                // Get correct VPR domain
                //-----------------------
                var vprDataDomain = uidUtil.extractDomainFromUID(job.record.uid);

                var jobToPublish = jobUtil.createRecordEnrichment(job.patientIdentifier, vprDataDomain, job.record, job);
                environment.publisherRouter.publish(jobToPublish, handlerCallback);
            });

        }
    });
}

function getPatientDir(job) {
    var eventid = uidUtil.extractLocalIdFromUID(job.record.uid);

    var pidHex = new Buffer(job.patientIdentifier.value, 'utf8');
    return pidHex.toString('hex') + '/' + eventid;
}

function updateRecordText(record, textContent){
    if(!record.text || !_.isArray(record.text)){
        record.text = [];
    }

    record.text.push({
        content: textContent,
        dateTime: record.referenceDateTime,
        status: 'completed',
        uid: record.uid
        });
}

module.exports = handle;