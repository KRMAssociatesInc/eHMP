'use strict';

var xslt = require('xslt4node');
var office = require(global.VX_SUBSYSTEMS + '/libreoffice/libreOffice');
var async = require('async');
var fsUtil = require(global.VX_UTILS + 'fs-utils');
var mkdirp = require('mkdirp');
var jobUtil = require(global.VX_UTILS + 'job-utils');
var uidUtil = require(global.VX_UTILS + 'uid-utils');
var docUtil = require(global.VX_UTILS + 'doc-utils');
var errorUtil = require(global.VX_UTILS + 'error');
var path = require('path');
//var errorUtil = requrie(global.VX_UTILS + 'error');

function handle(log, config, environment, job, handlerCallback) {
    log.debug('jmeadows-cda-document-conversion-handler.handle() for jobId %s: Entering method... Job: %j', job.jobId, job);

    if (!job || !job.patientIdentifier || !job.patientIdentifier.value) {
        log.error('jmeadows-cda-document-conversion-handler.handle for jobId %s : Job has no patient identifier', job.jobId);
        return setTimeout(handlerCallback, 0, errorUtil.createFatal('Job has no patient identifier'));
    }
    if (job.type !== 'jmeadows-cda-document-conversion') {
        log.error('jmeadows-cda-document-conversion-handler.handle for jobId %s  : Incorrect job type', job.jobId);
        return setTimeout(handlerCallback, 0, errorUtil.createFatal('Incorrect job type'));
    }
    if (!job.record) {
        log.error('jmeadows-cda-document-conversion-handler.handle for jobId %s  : Job is missing record', job.jobId);
        return setTimeout(handlerCallback, 0, errorUtil.createFatal('Job is missing record'));
    }
    if (!job.record.text || !job.record.text[0] || !job.record.text[0].content) {
        log.error('jmeadows-cda-document-conversion-handler.handle for jobId %s  : Job is missing XML string to convert', job.jobId);
        return setTimeout(handlerCallback, 0, errorUtil.createFatal('Job is missing XML string to convert'));
    }
    if (!config || !config.documentStorage.publish || !config.documentStorage.publish.path) {
        log.error('jmeadows-cda-document-conversion-handler.handle for jobId %s  : Configuration missing document publish information', job.jobId);
        return setTimeout(handlerCallback, 0, errorUtil.createFatal('Configuration missing document publish information'));
    }
    if (!config.documentStorage.officeLocation) {
        log.error('jmeadows-cda-document-conversion-handler.handle for jobId %s  : Configuration missing reference to LibreOffice', job.jobId);
        return setTimeout(handlerCallback, 0, errorUtil.createFatal('Configuration missing reference to LibreOffice'));
    }
    if (!config.documentStorage.uriRoot) {
        log.error('jmeadows-cda-document-conversion-handler.handle for jobId %s  : Configuration missing document retrieval endpoint', job.jobId);
        return setTimeout(handlerCallback, 0, errorUtil.createFatal('Configuration missing document retrieval endpoint'));
    }

    var xmlText = job.record.text[0].content;

    //Generate name of html file to publish
    var htmlFilename = docUtil.getSha1Filename(xmlText, '.html');
    var txtFilename = htmlFilename.replace(/\.html/, '.txt');
    //Get path to directory where file will be published
    var dir = docUtil.getPatientDirByJob(job);
    var outPath = docUtil.getDocOutPath(dir, config);
    var htmlFile;
    var htmlFileExists = false;

    var xsltConfig = {
        xsltPath: './handlers/jmeadows-document/CIS_IMPL_CDAR2.xsl',
        source: xmlText,
        result: outPath + '/' + htmlFilename
    };

    async.series([
        function(callback) {
            //Create the directory where the HTML file will be published.
            mkdirp(outPath, '700', function(error) {
                if (error) {
                    log.error('jmeadows-cda-document-conversion-handler.handle for jobId %s : Error encountered when creating publish directory %s', job.jobId, error);
                    callback(error);
                } else {
                    callback();
                }
            });
        },
        function(callback) {
            //Check whether the file has already been converted in a past sync
            fsUtil.fileExists(outPath + '/' + htmlFilename, function(exists) {
                if (exists) {
                    htmlFileExists = true;
                    callback();
                } else {
                    callback();
                }
            });
        },
        function(callback) {
            //Convert the XML document to HTML
            if (htmlFileExists) {
                log.debug('jmeadows-cda-document-conversion-handler.handle for jobId %s : HTML document already exists. Skipping XML to HTML conversion.', job.jobId);
                return setTimeout(callback, 0);
            }

            log.debug('jmeadows-cda-document-conversion-handler.handle for jobId %s : Beginning conversion of XML document to HTML...', job.jobId);
            xslt.transform(xsltConfig, function(error) {
                if (error) {
                    log.error('jmeadows-cda-document-conversion-handler.handle for jobId %s  : Error encountered when converting XML to HMTL %s', job.jobId, error);
                    callback(error);
                } else {
                    log.debug('jmeadows-cda-document-conversion-handler.handle for jobId %s : Successfully converted XML document to HTML.', job.jobId);
                    callback();
                }
            });
        },
        function(callback) {
            //Convert HTML to TXT
            htmlFile = path.resolve(outPath + '/' + htmlFilename);

            log.debug('jmeadows-cda-document-conversion-handler.handle for jobId %s : Beginning conversion of HTML document to TXT...', job.jobId);
            office.convert(htmlFile, 'txt:Text', outPath, config, function() {
                log.debug('jmeadows-cda-document-conversion-handler.handle for jobId %s : Verifying that TXT file was created...', job.jobId);
                if (fsUtil.fileExistsSync(outPath + '/' + txtFilename)) {
                    log.debug('jmeadows-cda-document-conversion-handler.handle for jobId %s : Successfully converted HMTL document to TXT.', job.jobId);
                    callback();
                } else {
                    log.error('jmeadows-cda-document-conversion-handler.handle for jobId %s : Could not convert HTML document to TXT.', job.jobId);
                    callback('TXT file not produced');
                }
            }, log);
        }
    ], function(err) { //At the end of the series...
        if (err) {
            //Error thrown in conversion process
            log.warn('jmeadows-cda-document-conversion-handler.handle for jobId %s: Copying placeholder document because an error was encountered in the conversion process: %s', job.jobId, err);
            fsUtil.copyFile('./handlers/jmeadows-document/corruptedDocPlaceholder.html', outPath + '/' + htmlFilename, function(err) {
                if (err) {
                    log.error('jmeadows-cda-document-conversion-handler.handle() for jobId %s: Error copying corrupted document placeholder: %s', job.jobId, err);
                } else {
                    log.debug('jmeadows-cda-document-conversion-handler.handle() for jobId %s: Copied placeholder document as a stand-in for the corrupted document.', job.jobId);
                }

                //***Update document metadata***
                //Add complex document uri
                job.record.dodComplexNoteUri = docUtil.getDodComplexNoteUri(config.documentStorage.uriRoot, dir, htmlFilename);
                //Insert placeholder text
                job.record.text[0].content = '-Placeholder for a DOD Patient Document- Unfortunately this document is corrupted and cannot be displayed.  Please report it so the problem can be rectified.';

                // Get correct VPR domain
                //-----------------------
                var vprDataDomain = uidUtil.extractDomainFromUID(job.record.uid);

                //Create next job
                var jobToPublish = jobUtil.createRecordEnrichment(job.patientIdentifier, vprDataDomain, job.record, job);
                environment.publisherRouter.publish(jobToPublish, handlerCallback);
                //Done!!!
                log.debug('jmeadows-cda-document-conversion-handler.handle for jobId %s: Conversion process completed with warning (see above).', job.jobId);
            });
            return;
        }
        log.debug('jmeadows-cda-document-conversion-handler.handle for jobId %s: Conversion to HTML and TXT successful. Updating document metadata and preparing jobs to publish.', job.jobId);
        //Normal pathway
        //***Update document metadata***
        //Add complex document uri
        job.record.dodComplexNoteUri = docUtil.getDodComplexNoteUri(config.documentStorage.uriRoot, dir, htmlFilename);
        //Insert document plaintext
        job.record.text[0].content = fsUtil.readFileSync(outPath + '/' + txtFilename).toString();
        //Delete txt file
        fsUtil.deleteFile(outPath + '/' + txtFilename);

        // Get correct VPR domain
        //-----------------------
        var vprDataDomain = uidUtil.extractDomainFromUID(job.record.uid);

        //Create next job
        var jobToPublish = jobUtil.createRecordEnrichment(job.patientIdentifier, vprDataDomain, job.record, job);
        environment.publisherRouter.publish(jobToPublish, handlerCallback);
        //Done!!!
        log.debug('jmeadows-cda-document-conversion-handler.handle for jobId %s: Conversion process completed.', job.jobId);
    });
}


module.exports = handle;