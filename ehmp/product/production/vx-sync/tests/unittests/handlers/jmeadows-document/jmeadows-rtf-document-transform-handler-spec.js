'use strict';

require('../../../../env-setup');
var _ = require('underscore');
var realConfig = require(global.VX_ROOT + 'worker-config');
var handle = require(global.VX_HANDLERS + 'jmeadows-document/jmeadows-rtf-document-transform-handler');

var dummyLogger = require(global.VX_UTILS + '/dummy-logger');
var VistaClientDummy = require(global.VX_SUBSYSTEMS + 'vista/vista-client-dummy');
var jobStatusUpdaterDummy = require(global.VX_JOBFRAMEWORK + '/JobStatusUpdaterDummy');
var config = {};

config = _.clone(realConfig);
config = _.pick(config, 'documentStorage');

// dummyLogger = require('bunyan').createLogger({
//     name: 'test',
//     level: 'debug'
// });

describe('jmeadows-rtf-document-transform-handler.js', function() {
    var environment = {
        vistaClient: new VistaClientDummy(dummyLogger, config, null),
        jobStatusUpdater: jobStatusUpdaterDummy,
        publisherRouter:{
            publish: function(job, callback){
                expect(job.record).toBeDefined();
                callback(null, job);
            }
        }
    };


    it('missing document id information',function(){
        var job = {
            patientIdentifier:{
                type:'EDIPI',
                value:'00000003'
            },
            record:{
                data:{
                    items:{
                        dodComplexNoteUri:'test'
                    }
                }
            }
        };

        handle(dummyLogger, config, environment, job, function(err){
            expect(err).not.toBeFalsy();
        });
    });
    it('missing document job id information',function(){
        var job = {
            patientIdentifier:{
                type:'EDIPI',
                value:'00000003'
            },
            record:{
                data:{
                    items:{
                        fileId:'dummy',
                        dodComplexNoteUri:'test'
                    }
                }
            }
        };

        handle(dummyLogger, config, environment, job, function(err){
            expect(err).not.toBeFalsy();
        });
    });
    it('missing patient id information',function(){
        var job = {
                        fileId: 'dummy',
                        dodComplexNoteUri:'test'
        };

        handle(dummyLogger, config, environment, job, function(err){
            expect(err).not.toBeFalsy();
        });
    });
    it('missing staging information',function(){
        var job = {
            patientIdentifier:{
                type:'EDIPI',
                value:'00000003'
            },
            record:{
                data:{
                    items:{
                        fileId: 'dummy',
                        fileJobId: 'dummy',
                        dodComplexNoteUri:'test'
                    }
                }
            }
        };
        var badConfig = {
            documentStorage: {
                publish: {
                    path: '',
                    permissions: ''
                }
            },
            uriRoot: '',
            officeLocation: ''
        };

        handle(dummyLogger, badConfig, environment, job, function(err){
            expect(err).not.toBeFalsy();
        });
    });
    it('missing publish information',function(){
        var job = {
            patientIdentifier:{
                type:'EDIPI',
                value:'00000003'
            },
            record:{
                data:{
                    items:{
                        fileId: 'dummy',
                        fileJobId: 'dummy',
                        dodComplexNoteUri:'test'
                    }
                }
            }
        };
        var badConfig = {
            documentStorage: {
                staging: {
                    path: '',
                    permissions: ''
                }
            },
            uriRoot: '',
            officeLocation: ''
        };

        handle(dummyLogger, badConfig, environment, job, function(err){
            expect(err).not.toBeFalsy();
        });
    });
    it('missing document retrieval information',function(){
        var job = {
            patientIdentifier:{
                type:'EDIPI',
                value:'00000003'
            },
            record:{
                data:{
                    items:{
                        fileId: 'dummy',
                        fileJobId: 'dummy',
                        dodComplexNoteUri:'test'
                    }
                }
            }
        };
        var badConfig = {
            documentStorage: {
                publish: {
                    path: '',
                    permissions: ''
                },
                staging: {
                    path: '',
                    permissions: ''
                }
            },
            officeLocation: ''
        };

        handle(dummyLogger, badConfig, environment, job, function(err){
            expect(err).not.toBeFalsy();
        });
    });
    it('missing libreOffice information',function(){
        var job = {
            patientIdentifier:{
                type:'EDIPI',
                value:'00000003'
            },
            record:{
                data:{
                    items:{
                        fileId: 'dummy',
                        fileJobId: 'dummy',
                        dodComplexNoteUri:'test'
                    }
                }
            }
        };
        var badConfig = {
            documentStorage: {
                publish: {
                    path: '',
                    permissions: ''
                },
                staging: {
                    path: '',
                    permissions: ''
                }
            },
            uriRoot: ''
        };

        handle(dummyLogger, badConfig, environment, job, function(err){
            expect(err).not.toBeFalsy();
        });
    });
});