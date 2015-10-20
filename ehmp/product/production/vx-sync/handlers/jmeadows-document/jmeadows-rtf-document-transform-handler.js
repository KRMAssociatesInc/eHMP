'use strict';

var office = require(global.VX_SUBSYSTEMS + '/libreoffice/libreOffice');
var async = require('async');
var fsUtil = require(global.VX_UTILS + 'fs-utils');
var jobUtil = require(global.VX_UTILS + 'job-utils');
var uidUtil = require(global.VX_UTILS + 'uid-utils');
var docUtil = require(global.VX_UTILS + 'doc-utils');
var errorUtil = require(global.VX_UTILS + 'error');
var uuid = require('node-uuid');
var _ = require('underscore');

function handle(log, config, environment, job, handlerCallback) {
    log.debug('jmeadows-rtf-document-transform-handler.handle : received request to JMeadows RTF conversion handler %j', job);

    if (!job || !job.patientIdentifier || !job.patientIdentifier.value) {
        return setTimeout(handlerCallback, 0, errorUtil.createFatal('Job has no patient identifier'));
    }
    if (!job.record || !job.record.fileId || !job.record.fileJobId) {
        return setTimeout(handlerCallback, 0, errorUtil.createFatal('Job is missing required information about the file'))
    }
    if (!config || !config.documentStorage || !config.documentStorage.staging || !config.documentStorage.staging.path) {
        return setTimeout(handlerCallback, 0, errorUtil.createFatal('Configuration missing document staging information'));
    }
    if (!config.documentStorage.publish || !config.documentStorage.publish.path) {
        return setTimeout(handlerCallback, 0, errorUtil.createFatal('Configuration missing document publish information'));
    }
    if (!config.documentStorage.officeLocation) {
        return setTimeout(handlerCallback, 0, errorUtil.createFatal('Configuration missing reference to LibreOffice'));
    }
    if (!config.documentStorage.uriRoot) {
        return setTimeout(handlerCallback, 0, errorUtil.createFatal('Configuration missing document retrieval endpoint'));
    }

    var rtfFile = docUtil.getRtfDocPathByJob(job, config);
    var dir = docUtil.getPatientDirByJob(job);
    var outPath = docUtil.getDocOutPath(dir, config);

    var htmlFilename = job.record.fileId.replace(/\.rtf/, '.html');
    var txtFilename = htmlFilename.replace(/\.html/, '.txt');

    var jobs = [function(callback) {
        var metricsObj = {
            'subsystem':'LibreOffice',
            'action':'convertToTXT',
            'process':uuid.v4(),
            'timer':'start',
            'jobId':job.jobId,
            'rootJobId':job.rootJobId,
            'jpid':job.jpid,
            'uid':job.record.uid
        };
        environment.metrics.debug('LibreOffice Converting to TXT', metricsObj);
        log.debug('jmeadows-rtf-document-transform-handler.handle : Converting rtf to TXT...');
        office.convert(rtfFile, 'txt:Text', outPath, config, function(err) {
            metricsObj.timer='stop';
            log.debug('jmeadows-rtf-document-transform-handler.handle : Verifying conversion to TXT.');
            if (fsUtil.fileExistsSync(outPath + '/' + txtFilename)) {
                environment.metrics.debug('LibreOffice Converting to TXT', metricsObj);
                log.debug('jmeadows-rtf-document-transform-handler.handle : Successfully converted rtf to TXT.');
                callback();
            } else {
                environment.metrics.debug('LibreOffice Converting to TXT in Error', metricsObj);
                log.warn('jmeadows-rtf-document-transform-handler.handle(): Could not create TXT file. Error: %s', err);
                callback('TXT file not produced');
            }
        }, log);
    }];

    log.debug('jmeadows-rtf-document-transform-handler.handle : Checking if HTML document already exists; will skip conversion if so.');
    if (!fsUtil.fileExistsSync(outPath + '/' + htmlFilename)) { //if this file is already stored, don't convert it again
        jobs.push(function(callback) {
            var metricsObj = {
                'subsystem':'LibreOffice',
                'action':'convertToHTML',
                'process':uuid.v4(),
                'timer':'start',
                'jobId':job.jobId,
                'rootJobId':job.rootJobId,
                'jpid':job.jpid,
                'uid':job.record.uid
            };
            environment.metrics.debug('LibreOffice Converting to HTML', metricsObj);
            log.debug('jmeadows-rtf-document-transform-handler.handle : Converting rtf to HTML.');
            office.convert(rtfFile, 'html', outPath, config, function(err) {
                metricsObj.timer='stop';
                log.debug('jmeadows-rtf-document-transform-handler.handle : Verifying conversion to HTML.');
                if (fsUtil.fileExistsSync(outPath + '/' + htmlFilename)) {
                    log.debug('jmeadows-rtf-document-transform-handler.handle : Successfully converted rtf to HTML.');
                    environment.metrics.debug('LibreOffice Converting to HTML', metricsObj);
                    callback();
                } else {
                    environment.metrics.debug('LibreOffice Converting to HTML in Error', metricsObj);
                    log.warn('jmeadows-rtf-document-transform-handler.handle(): Could not create HTML file. Error: %s', err);
                    callback('HTML file not produced');
                }
            }, log);
        });
    } else {
        log.info('jmeadows-rtf-document-transform-handler.handle() HTML document already found, skipping conversion');
    }

    async.parallel(jobs, function(err) {
        if (!err) {
            //delete source document (clean up staging directory)
            fsUtil.deleteFile(rtfFile);
            //change document uri
            job.record.dodComplexNoteUri = docUtil.getDodComplexNoteUri(config.documentStorage.uriRoot, dir, htmlFilename);
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
                job.record.dodComplexNoteUri = docUtil.getDodComplexNoteUri(config.documentStorage.uriRoot, dir, htmlFilename);
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