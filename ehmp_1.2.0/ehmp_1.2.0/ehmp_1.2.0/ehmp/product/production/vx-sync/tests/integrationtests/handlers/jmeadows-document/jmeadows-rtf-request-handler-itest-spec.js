'use strict';

require('../../../../env-setup');
var log = require(global.VX_UTILS + 'dummy-logger');
var fs = require('fs');
var path = require('path');
var handler = require(global.VX_HANDLERS + 'jmeadows-document/jmeadows-rtf-request-handler');
var realConfig = require(global.VX_ROOT + 'worker-config');

var val = require(global.VX_UTILS + 'object-utils').getProperty;
var vx_sync_ip = require(global.VX_INTTESTS + 'test-config');

describe('jmeadows-rtf-request-handler', function() {
    var environment = {
        publisherRouter: {
            publish: function(job, callback) {
                callback(null, job);
            }
        }
    };

    var config = {
        jmeadows: {
            domains: ['allergy', 'appointment', 'consult', 'demographics', 'encounter', 'immunization', 'lab', 'progressNote', 'dischargeSummary'],
            defaults: {
                host: 'localhost',
                port: 54000,
                method: 'GET'
            },
            allergy: {
                path: '/dod/allergy'
            },
            appointment: {
                path: '/dod/appointment'
            },
            consult: {
                path: '/dod/consult'
            },
            demographics: {
                path: '/dod/demographics'
            },
            document: {
                path: '/dod/document'
            },
            encounter: {
                path: '/dod/encounter'
            },
            immunization: {
                path: '/dod/immunization'
            },
            lab: {
                path: '/dod/lab'
            },
            progressNote: {
                path: '/dod/progressNote'
            },
            dischargeSummary: {
                path: '/dod/dischargeSummary'
            }
        },
        documentStorage: {
            staging: {
                path: path.resolve(realConfig.documentStorage.staging.path),
                permissions: '700'
            },
            publish: {
                path: path.resolve(realConfig.documentStorage.publish.path),
                permissions: '400'
            },
            uriRoot: 'http://localhost:8443/documents'
        }
    };

    describe('create staging file', function() {

        var sampleVPRAllergy = {
            'facilityCode': 'DOD',
            'facilityName': 'DOD',
            'status': 'COMPLETED',
            'statusDisplayName': 'Completed',
            'localTitle': 'Consultation Note (Provider) Document',
            'referenceDateTime': '201103021444432',
            'documentTypeName': 'Consultation Note (Provider) Document',
            'sensitive': true,
            'dodComplexNoteUri': 'http://' + vx_sync_ip + ':8080/MockDoDAdaptor/async/complex/note/2157584289',
            'uid': null,
            'pid': 'DOD;00000099',
            'text': null
        };

        var callback = function(err) {
            expect(err).toBeFalsy();
        };

        var job = {
            requestStampTime: '20150103120000',
            dataDomain: 'consult',
            patientIdentifier: {
                type: 'edipi',
                value: '00000099'
            },
            record: sampleVPRAllergy,
            jobId: 12
        };

        // since this checks the local file system, it cannot work on the VM
        // TODO: reenable
        xit('document retrieved', function() {
            var finished = false;
            runs(function() {
                handler(log, config, environment, job, function(err, result) {
                    expect(result).toBeTruthy();
                    expect(val(result, 'record', 'fileId')).toBeTruthy();
                    expect(val(result, 'record', 'fileJobId')).toBeTruthy();
                    var filepath = config.documentStorage.staging.path + '/' + job.jobId + '/' + val(result, 'record', 'fileId');
                    expect(fs.existsSync(filepath)).toBeTruthy();
                    finished = true;
                    callback(err, result);
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Timeout waiting for JMeadows document download', 8000);
        });

    });
    afterEach(function() {
        rmDir(config.documentStorage.staging.path, false);
    });
});

var rmDir = function(dirPath, removeSelf) {
    var files;
    if (removeSelf === undefined) {
        removeSelf = true;
    }
    try {
        files = fs.readdirSync(dirPath);
    } catch (e) {
        return;
    }
    if (files.length > 0) {
        for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile()) {
                fs.unlinkSync(filePath);
            } else {
                rmDir(filePath);
            }
        }
    }
    if (removeSelf) {
        fs.rmdirSync(dirPath);
    }
};