'use strict';
require('../../../../env-setup');
//var _ = require('underscore');
var handle = require(global.VX_HANDLERS + 'jmeadows-document/jmeadows-cda-document-conversion-handler');

var log = require(global.VX_UTILS + '/dummy-logger');

// log = require('bunyan').createLogger({
//     name: 'test',
//     level: 'debug'
// });

describe('jmeadows-cda-document-conversion-handler', function() {

    it('error: no patientIdentifier', function() {
        var done = false;

        var job = {
            type: 'jmeadows-cda-document-conversion',
            requestStampTime: '20150103120000',
            dataDomain: 'dischargeSummary',
            // patientIdentifier: {
            //     type: 'pid',
            //     value: 'DOD;00000003'
            // },
            record: {
                text: [{
                    content: ''
                }]
            }
        };

        var config = {
            documentStorage: {
                staging: {
                    path: '',
                    permissions: ''
                },
                publish: {
                    path: '',
                    permissions: ''
                },
                officeLocation: '',
                uriRoot: ''
            },
        };

        var environment = {};

        runs(function() {
            handle(log, config, environment, job, function(err, result) {
                done = true;
                expect(err).toBeTruthy();
                expect(err.message).toEqual('Job has no patient identifier');
            });
        });

        waitsFor(function() {
            return done;
        });
    });

    it('error: wrong job type', function() {
        var done = false;

        var job = {
            type: 'fake-job-type',
            requestStampTime: '20150103120000',
            dataDomain: 'dischargeSummary',
            patientIdentifier: {
                type: 'pid',
                value: 'DOD;00000003'
            },
            record: {
                text: [{
                    content: ''
                }]
            }
        };

        var config = {
            documentStorage: {
                staging: {
                    path: '',
                    permissions: ''
                },
                publish: {
                    path: '',
                    permissions: ''
                },
                officeLocation: '',
                uriRoot: ''
            },
        };

        var environment = {};

        runs(function() {
            handle(log, config, environment, job, function(err, result) {
                done = true;
                expect(err).toBeTruthy();
                expect(err.message).toEqual('Incorrect job type');
            });
        });

        waitsFor(function() {
            return done;
        });
    });

    it('error: no record', function() {
        var done = false;

        var job = {
            type: 'jmeadows-cda-document-conversion',
            requestStampTime: '20150103120000',
            dataDomain: 'dischargeSummary',
            patientIdentifier: {
                type: 'pid',
                value: 'DOD;00000003'
            },
            //record: {text : [{content: ''}]}
        };

        var config = {
            documentStorage: {
                staging: {
                    path: '',
                    permissions: ''
                },
                publish: {
                    path: '',
                    permissions: ''
                },
                officeLocation: '',
                uriRoot: ''
            },
        };

        var environment = {};

        runs(function() {
            handle(log, config, environment, job, function(err, result) {
                done = true;
                expect(err).toBeTruthy();
                expect(err.message).toEqual('Job is missing record');
            });
        });

        waitsFor(function() {
            return done;
        });
    });

    it('error: no publish info in config', function() {
        var done = false;

        var job = {
            type: 'jmeadows-cda-document-conversion',
            requestStampTime: '20150103120000',
            dataDomain: 'dischargeSummary',
            patientIdentifier: {
                type: 'pid',
                value: 'DOD;00000003'
            },
            record: {
                text: [{
                    content: ' '
                }]
            }
        };

        var config = {
            documentStorage: {
                staging: {
                    path: '',
                    permissions: ''
                },
                // publish: {
                //     path: '',
                //     permissions: ''
                // },
                officeLocation: '',
                uriRoot: ''
            },
        };

        var environment = {};

        runs(function() {
            handle(log, config, environment, job, function(err, result) {
                done = true;
                expect(err).toBeTruthy();
                expect(err.message).toEqual('Configuration missing document publish information');
            });
        });

        waitsFor(function() {
            return done;
        });
    });

    it('error: no LibreOffice info in config', function() {
        var done = false;

        var job = {
            type: 'jmeadows-cda-document-conversion',
            requestStampTime: '20150103120000',
            dataDomain: 'dischargeSummary',
            patientIdentifier: {
                type: 'pid',
                value: 'DOD;00000003'
            },
            record: {
                text: [{
                    content: ' '
                }]
            }
        };

        var config = {
            documentStorage: {
                staging: {
                    path: ' ',
                    permissions: ' '
                },
                publish: {
                    path: ' ',
                    permissions: ' '
                },
                //officeLocation: ' ',
                uriRoot: ' '
            },
        };

        var environment = {};

        runs(function() {
            handle(log, config, environment, job, function(err, result) {
                done = true;
                expect(err).toBeTruthy();
                expect(err.message).toEqual('Configuration missing reference to LibreOffice');
            });
        });

        waitsFor(function() {
            return done;
        });
    });

    it('error: no uriRoot info in config', function() {
        var done = false;

        var job = {
            type: 'jmeadows-cda-document-conversion',
            requestStampTime: '20150103120000',
            dataDomain: 'dischargeSummary',
            patientIdentifier: {
                type: 'pid',
                value: 'DOD;00000003'
            },
            record: {
                text: [{
                    content: ' '
                }]
            }
        };

        var config = {
            documentStorage: {
                staging: {
                    path: ' ',
                    permissions: ' '
                },
                publish: {
                    path: ' ',
                    permissions: ' '
                },
                officeLocation: ' ',
                //uriRoot: ' '
            },
        };

        var environment = {};

        runs(function() {
            handle(log, config, environment, job, function(err, result) {
                done = true;
                expect(err).toBeTruthy();
                expect(err.message).toEqual('Configuration missing document retrieval endpoint');
            });
        });

        waitsFor(function() {
            return done;
        });
    });
});