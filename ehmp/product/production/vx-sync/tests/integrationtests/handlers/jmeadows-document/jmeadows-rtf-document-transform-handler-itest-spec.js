'use strict';

require('../../../../env-setup');
var _ = require('underscore');
var realConfig = require(global.VX_ROOT + 'worker-config');
var fsUtil = require(global.VX_UTILS + 'fs-utils');
var jobUtils = require(global.VX_UTILS + 'job-utils');
var testHandler = require(global.VX_INTTESTS + 'framework/handler-test-framework').testHandler;
var handle = require(global.VX_HANDLERS + 'jmeadows-document/jmeadows-rtf-document-transform-handler');
var path = require('path');
var val = require(global.VX_UTILS + 'object-utils').getProperty;

var vx_sync_ip = require(global.VX_INTTESTS + 'test-config');

var dummyLogger = require(global.VX_UTILS + '/dummy-logger');
var VistaClientDummy = require(global.VX_SUBSYSTEMS + 'vista/vista-client-dummy');
var jobStatusUpdaterDummy = require(global.VX_JOBFRAMEWORK + '/JobStatusUpdaterDummy');

var config = _.pick(realConfig, 'documentStorage');
config.documentStorage.staging.path = config.documentStorage.staging.path.replace(/vxsync/, 'vxsync-test');
config.documentStorage.publish.path = config.documentStorage.publish.path.replace(/vxsync/, 'vxsync-test');
config.documentStorage.staging.path = path.resolve(config.documentStorage.staging.path);
config.documentStorage.publish.path = path.resolve(config.documentStorage.publish.path);

// dummyLogger = require('bunyan').createLogger({
//     name: 'test',
//     level: 'debug'
// });
// since this checks the local file system, it cannot work on the VM
// TODO: reenable
xdescribe('jmeadows-rtf-document-transform-handler.js', function() {
    var environment = {
        vistaClient: new VistaClientDummy(dummyLogger, config, null),
        jobStatusUpdater: jobStatusUpdaterDummy,
        publisherRouter: {
            publish: function(job, callback) {
                expect(val(job, 'record')).toBeDefined();
                callback(null, job);
            }
        }
    };
    var fileName = 'dummyDocument.rtf';

    beforeEach(function() {
        fsUtil.deleteAllFiles(config.documentStorage.publish.path);
    });
    it('convert RTF document', function() {
        var job = {
            patientIdentifier: {
                type: 'EDIPI',
                value: '00000003'
            },
            record: {
                fileJobId: 0xbeefbeef,
                fileId: fileName,
                dodComplexNoteUri: 'test',
                uid: 'urn:va:consult:DOD:0000000008:1000001122'
            }
        };

        var filepath = config.documentStorage.staging.path + '/' + job.record.fileJobId + '/' + fileName;
        var handlerFinished = false;
        runs(function() {
            fsUtil.copyFile('./tests/data/secondary/jmeadows/dummyDocument.rtf', filepath, function() {});
        });

        waitsFor(function() {
            var file = filepath; //config.documentStorage.staging.path+'/dummyDocument.rtf';
            var exists = fsUtil.fileExistsSync(file);
            return exists;
        }, 'File copy', 2000);

        runs(function() {
            handle(dummyLogger, config, environment, job, function(err, result) {
                expect(err).toBeFalsy();
                expect(result).toBeDefined();
                expect(val(result, 'record')).toBeDefined();
                expect(val(result, 'record', 'fileId')).toBeUndefined();

                var rtfPath = config.documentStorage.staging.path + '/' + fileName;
                var dirRegex = /dir=([a-zA-Z0-9\/]+)/;
                // console.log(result.record);
                var matches = dirRegex.exec(result.record.dodComplexNoteUri);
                expect(_.isArray(matches)).toBeTruthy();
                expect(val(matches, 'length')).toEqual(2);
                var patientDir = matches[1];
                var htmlFilename = fileName.replace(/\.rtf/, '.html');
                var htmlPath = config.documentStorage.publish.path + '/' + patientDir + '/' + htmlFilename;
                var txtFilename = fileName.replace(/\.rtf/, '.txt');
                var txtPath = config.documentStorage.publish.path + '/' + patientDir + '/' + txtFilename;

                expect(fsUtil.fileExistsSync(rtfPath)).not.toBeTruthy();
                expect(fsUtil.fileExistsSync(htmlPath)).toBeTruthy();
                expect(fsUtil.fileExistsSync(txtPath)).toBeFalsy();
                handlerFinished = true;
            });
        });
        waitsFor(function() {
            return handlerFinished;
        }, 'file conversion', 10000);
    });

    it('corrupted document pathway: handle corrupted RTF documents', function() {
        var job = {
            patientIdentifier: {
                type: 'EDIPI',
                value: '00000003'
            },
            record: {
                fileJobId: 0xbeefbeef,
                fileId: fileName,
                dodComplexNoteUri: 'test',
                uid: 'urn:va:consult:DOD:0000000008:1000001122'
            }
        };

        var filepath = config.documentStorage.staging.path + '/' + job.record.fileJobId + '/' + fileName;
        var handlerFinished = false;
        runs(function() {
            fsUtil.copyFile('./tests/data/secondary/jmeadows/dummyCorruptedDocument.rtf', filepath, function() {});
        });

        spyOn(environment.publisherRouter, 'publish').andCallThrough();

        waitsFor(function() {
            var file = filepath; //config.documentStorage.staging.path+'/dummyDocument.rtf';
            var exists = fsUtil.fileExistsSync(file);
            return exists;
        }, 'File copy', 2000);

        runs(function() {
            handle(dummyLogger, config, environment, job, function(err, result) {
                expect(err).toBeFalsy();
                if (!err && result && result.record) {
                    expect(result).toBeDefined();
                    expect(val(result, 'record')).toBeDefined();
                    expect(val(result, 'record', 'fileId')).toBeUndefined();

                    var rtfPath = config.documentStorage.staging.path + '/' + fileName;
                    var dirRegex = /dir=([a-zA-Z0-9\/]+)/;
                    // console.log(result.record);
                    var matches = dirRegex.exec(result.record.dodComplexNoteUri);
                    expect(_.isArray(matches)).toBeTruthy();
                    expect(val(matches, 'length')).toEqual(2);
                    var patientDir = matches[1];
                    var htmlFilename = fileName.replace(/\.rtf/, '.html');
                    var htmlPath = config.documentStorage.publish.path + '/' + patientDir + '/' + htmlFilename;
                    var txtFilename = fileName.replace(/\.rtf/, '.txt');
                    var txtPath = config.documentStorage.publish.path + '/' + patientDir + '/' + txtFilename;

                    expect(fsUtil.fileExistsSync(rtfPath)).not.toBeTruthy();
                    expect(fsUtil.fileExistsSync(htmlPath)).toBeTruthy();
                    expect(fsUtil.fileExistsSync(txtPath)).toBeFalsy();

                    var corruptedText = '-Placeholder for a DOD Patient Document- Unfortunately this document is corrupted and cannot be displayed.  Please report it so the problem can be rectified.';

                    //Check whether the corrupted document path was followed by looking at the record.content
                    expect(val(environment, 'publisherRouter', 'publish', 'calls')).toBeTruthy();
                    //console.log(JSON.stringify(environment.publisherRouter.publish.calls));
                    var publishCalls = val(environment, 'publisherRouter', 'publish', 'calls');
                    expect(val(publishCalls, 0, 'args')).toBeTruthy();
                    expect(val(publishCalls, 0, 'args', 0, 'record')).toBeTruthy();
                    expect(val(publishCalls, 0, 'args', 0, 'record', 'text')).toBeTruthy();
                    expect(val(publishCalls, 0, 'args', 0, 'record', 'text', 0)).toBeTruthy();
                    expect(val(publishCalls, 0, 'args', 0, 'record', 'text', 0, 'content')).toEqual(corruptedText);
                }
                handlerFinished = true;
            });
        });
        waitsFor(function() {
            return handlerFinished;
        }, 'file conversion', 10000);
    });

    describe('job output', function() {
        var environment = {
            vistaClient: new VistaClientDummy(dummyLogger, config, null),
            jobStatusUpdater: jobStatusUpdaterDummy,
        };
        var job = {
            patientIdentifier: {
                type: 'EDIPI',
                value: '00000003'
            },
            record: {
                fileJobId: 0xdeadbeef,
                fileId: fileName,
                dodComplexNoteUri: 'test',
                uid: 'urn:va:consult:DOD:0000000008:1000001122'
            }
        };
        var filepath = config.documentStorage.staging.path + '/' + job.record.fileJobId + '/dummyDocument.rtf';
        runs(function() {
            fsUtil.copyFile('./tests/data/secondary/jmeadows/dummyDocument.rtf', filepath, function() {});
        });

        waitsFor(function() {
            var file = filepath;
            var exists = fsUtil.fileExistsSync(file);
            return exists;
        }, 'File copy', 2000);

        var host = vx_sync_ip;
        var port = 5000;
        var tubename = 'vx-sync-test';

        var jobTypes = [jobUtils.recordEnrichmentType()];

        testHandler(handle, dummyLogger, config, environment, host, port, tubename, job, jobTypes);
    });

    afterEach(function() {
        //Make sure that the publish directory is clear after each test
        fsUtil.deleteAllFiles(config.documentStorage.publish.path);
    });
});