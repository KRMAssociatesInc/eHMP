/*jslint node: true */
'use strict';
var _ = require('underscore');
var sync = require('../resources/patientsearch/patientSync');

var req = {
    logger: {
        trace: function() {},
        debug: function() {},
        info: function() {},
        warn: function() {},
        error: function() {}
        }
    };

describe('MVI Patient Sync', function() {
    xdescribe('Patient Sync Status', function() {
        var syncStatus = {
            status: 200,
            data: {
                "syncStatus": {
                    "completedStamp": {
                        "icn": "10108V420871",
                        "sourceMetaStamp": {
                            "9E7A": {
                                "domainMetaStamp": {
                                    "document": {
                                        "domain": "document",
                                        "stampTime": 20150305113256,
                                        "syncCompleted": true
                                    },
                                    "factor": {
                                        "domain": "factor",
                                        "stampTime": 20150305113256,
                                        "syncCompleted": true
                                    },
                                    "lab": {
                                        "domain": "lab",
                                        "stampTime": 20150305113256,
                                        "syncCompleted": true
                                    },
                                    "med": {
                                        "domain": "med",
                                        "stampTime": 20150305113256,
                                        "syncCompleted": true
                                    },
                                    "vital": {
                                        "domain": "vital",
                                        "stampTime": 20150305113256,
                                        "syncCompleted": true
                                    }
                                },
                                "localId": 3,
                                "pid": "9E7A;3",
                                "stampTime": 20150305113256,
                                "syncCompleted": true
                            },
                            "C877": {
                                "domainMetaStamp": {
                                    "factor": {
                                        "domain": "factor",
                                        "stampTime": 20150305113259,
                                        "syncCompleted": true
                                    },
                                    "lab": {
                                        "domain": "lab",
                                        "stampTime": 20150305113259,
                                        "syncCompleted": true
                                    },
                                    "med": {
                                        "domain": "med",
                                        "stampTime": 20150305113259,
                                        "syncCompleted": true
                                    },
                                    "vital": {
                                        "domain": "vital",
                                        "stampTime": 20150305113259,
                                        "syncCompleted": true
                                    }
                                },
                                "localId": 3,
                                "pid": "C877;3",
                                "stampTime": 20150305113259,
                                "syncCompleted": true
                            },
                            "DOD": {
                                "domainMetaStamp": {
                                    "problem": {
                                        "domain": "problem",
                                        "stampTime": 20150305113237,
                                        "syncCompleted": true
                                    },
                                    "visit": {
                                        "domain": "visit",
                                        "stampTime": 20150305113237,
                                        "syncCompleted": true
                                    },
                                    "vital": {
                                        "domain": "vital",
                                        "stampTime": 20150305113237,
                                        "syncCompleted": true
                                    }
                                },
                                "localId": "0000000003",
                                "pid": "DOD;0000000003",
                                "stampTime": 20150305113237,
                                "syncCompleted": true
                            }
                        },
                        "stampTime": 20150305113237
                    },
                    "stampTime": 20150306202400
                },
                "jobStatus": []
            }
        };
        it('Patient Fully Synced', function() {
            var status = _.clone(syncStatus);
            var response = sync._determineIfPatientIsSynced(status, req);
            expect(response).toBeDefined();
            expect(response).toEqual({'status':'ok','patientSynced':true,'syncInProgress':false});
        });
        it('Empty Sync Status', function(){
            var response = sync._determineIfPatientIsSynced({}, req);
            expect(response).toBeDefined();
            expect(response).toEqual({'status':'Unknown response from JDS','patientSynced':false,'syncInProgress':false});
        });
        it('Undefined Sync Status', function(){
            var response = sync._determineIfPatientIsSynced(undefined, req);
            expect(response).toBeDefined();
            expect(response).toEqual({'status':'Unknown response from JDS','patientSynced':false,'syncInProgress':false});
        });
        xit('404 Sync Status', function(){  //disabled as this has become an integration test situation
            var status = { status: 404,
                      data: { error: { code: 404, message: 'pid is unsynced' } } };
            var response = sync._determineIfPatientIsSynced(status, req);
            expect(response).toEqual({'status':'PID is unknown to JDS','patientSynced':false,'syncInProgress':false});
        });
        it('Partially Synced Status', function(){
            var status = _.clone(syncStatus);
            status.data.syncStatus.inProgress = {"DAS": {}};
            var response = sync._determineIfPatientIsSynced(status, req);
            expect(response).toBeDefined();
            expect(response).toEqual({'status':'ok','patientSynced':false,'syncInProgress':true});
        });
        it('Error code status', function(){
            var status = _.clone(syncStatus);
            status.status=500;
            var response = sync._determineIfPatientIsSynced(status, req);
            expect(response).toBeDefined();
            expect(response).toEqual({'status':'Unknown response from JDS','patientSynced':false,'syncInProgress':false});
        });
    });
});
