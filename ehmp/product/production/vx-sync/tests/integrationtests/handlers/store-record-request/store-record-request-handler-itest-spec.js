'use strict';

require('../../../../env-setup');

var _ = require('underscore');
var handle = require(global.VX_HANDLERS + 'store-record-request/store-record-request-handler');
var JdsClient = require(global.VX_SUBSYSTEMS + 'jds/jds-client');
var wConfig = require(global.VX_ROOT + 'worker-config');
var val = require(global.VX_UTILS + 'object-utils').getProperty;

var log = require(global.VX_UTILS + 'dummy-logger');
// log = require('bunyan').createLogger({
//     name: 'store-record-request-handler',
//     level: 'debug'
// });

describe('store-record-request-handler.js', function() {

    var setUpconfig = {
        jds: _.defaults(wConfig.jds, {
            protocol: 'http',
            host: '10.2.2.110',
            port: 9080
        })
    };

    var setUpEnvironment = {
        jds: new JdsClient(log, log, setUpconfig),
    };

    var setupForTest = function(testPatientIdentifier, metastampToStore) {
        var deleteFinished, storePatientFinished, syncStatusFinished = false;

        var testPid = testPatientIdentifier.value;

        var identifierToStore = {
            'patientIdentifiers': [testPid]
        };

        runs(function() {
            setUpEnvironment.jds.deletePatientByPid(testPid, function() {
                deleteFinished = true;
            });
        });
        waitsFor(function() {
            return deleteFinished;
        });
        runs(function() {
            setUpEnvironment.jds.storePatientIdentifier(identifierToStore, function(error, response) {
                expect(error).toBeFalsy();
                expect(response).toBeTruthy();
                expect(val(response, 'statusCode')).toEqual(201);
                storePatientFinished = true;
            });
        });
        waitsFor(function() {
            return storePatientFinished;
        });
        runs(function() {
            setUpEnvironment.jds.saveSyncStatus(metastampToStore, testPatientIdentifier, function(error, response) {
                expect(error).toBeFalsy();
                expect(val(response, 'statusCode')).toBe(200);
                syncStatusFinished = true;
            });
        });
        waitsFor(function() {
            return syncStatusFinished;
        });
    };

    var tearDownAfterTest = function(testPatientIdentifier) {
        var cleanUpFinished = false;
        runs(function() {
            setUpEnvironment.jds.deletePatientByPid(testPatientIdentifier.value, function() {
                cleanUpFinished = true;
            });
        });
        waitsFor(function() {
            return cleanUpFinished;
        });
    };

    describe('handle()', function() {

        var config = {
            jds: _.defaults(wConfig.jds, {
                protocol: 'http',
                host: '10.2.2.110',
                port: 9080
            })
        };

        it('handles a store-record-request job', function() {

            var recordUid = 'urn:va:allergy:9E7A:123456:0654321';
            var allergyMetaStamp = {
                'icn': '9E7A;123456',
                'stampTime': '20150119135618',
                'sourceMetaStamp': {
                    '9E7A': {
                        'pid': '9E7A;123456',
                        'localId': '123456',
                        'stampTime': '20150119135618',
                        'domainMetaStamp': {
                            'allergy': {
                                'domain': 'allergy',
                                'stampTime': '20150119135618',
                                'eventMetaStamp': {
                                    'urn:va:allergy:9E7A:123456:0654321': {
                                        'stampTime': '20150119135618'
                                    }
                                }
                            }
                        }
                    }
                }
            };
            var allergyRecord = {
                entered: '200712171513',
                facilityCode: '500',
                facilityName: 'CAMP MASTER',
                historical: true,
                kind: 'Allergy/Adverse Reaction',
                lastUpdateTime: 20150119135618,
                localId: '874',
                mechanism: 'ALLERGY',
                originatorName: 'PROVIDER,ONE',
                products: ['CHOCOLATE'],
                reactions: ['DIARRHEA'],
                reference: '3;GMRD(120.82,',
                stampTime: 20150119135618,
                summary: 'CHOCOLATE',
                typeName: 'DRUG, FOOD',
                uid: recordUid,
                verified: '20071217151354',
                verifierName: '<auto-verified>',
                pid: '9E7A;123456',
                codesCode: ['C0008299'],
                codesSystem: ['urn:oid:2.16.840.1.113883.6.86'],
                codesDisplay: ['Chocolate'],
                drugClasses: [],
                comments: []
            };

            var patientIdentifier = {
                'type': 'pid',
                'value': '9E7A;123456'
            };

            var storageJob = {
                'patientIdentifier': patientIdentifier,
                'record': allergyRecord,
                'jpid': '21EC2020-3AEA-4069-A2DD-08002B30309D',
                'type': 'store-record-request'
            };

            setupForTest(patientIdentifier, allergyMetaStamp);

            var jdsClient = new JdsClient(log, log, config);
            var environment = {
                jds: jdsClient,
                publisherRouter: {
                    publish: function(job, callback) {
                        callback();
                    }
                },
                metrics: log,
                solr: {
                    add: function(record, callback) {
                        callback();
                    }
                }
            };

            var finished = false;
            runs(function() {
                handle(log, config, environment, storageJob, function(error, result) {
                    expect(error).toBeNull();
                    expect(result).toEqual('success');
                    finished = true;
                }, function() {});
            });

            waitsFor(function() {
                return finished;
            });

            var finished2 = false;
            //Verify record was actually stored
            runs(function() {
                jdsClient.getPatientDataByUid(recordUid, function(error, response) {
                    expect(val(response, 'statusCode')).toEqual(200);
                    finished2 = true;
                });
            });
            waitsFor(function() {
                return finished2;
            });

            var finished4 = false;
            //Verify record was marked as stored in metastamp
            runs(function() {
                jdsClient.getSyncStatus(patientIdentifier, function(error, response, result) {
                    expect(val(response, 'statusCode')).toEqual(200);
                    expect(val(result, 'completedStamp')).toBeTruthy();
                    expect(val(result, 'inProgress')).toBeFalsy();
                    finished4 = true;
                });
            });
            waitsFor(function() {
                return finished4;
            });

            var finished3 = false;
            //Clean up the record
            runs(function() {
                jdsClient.deletePatientDataByUid(recordUid, function(error, response) {
                    expect(val(response, 'statusCode')).toEqual(200);
                    finished3 = true;
                });
            });
            waitsFor(function() {
                return finished3;
            });

            tearDownAfterTest(patientIdentifier);
        });

        it('handles an unsolicited update marking a record as deleted', function() {

            var recordUid = 'urn:va:allergy:WXYZ:123456:0654321';
            var allergyMetaStamp = {
                'icn': 'WXYZ;123456',
                'stampTime': '20150119135618',
                'sourceMetaStamp': {
                    'WXYZ': {
                        'pid': 'WXYZ;123456',
                        'localId': '123456',
                        'stampTime': '20150119135618',
                        'domainMetaStamp': {
                            'allergy': {
                                'domain': 'allergy',
                                'stampTime': '20150119135618',
                                'eventMetaStamp': {
                                    'urn:va:allergy:WXYZ:123456:0654321': {
                                        'stampTime': '20150119135618'
                                    }
                                }
                            }
                        }
                    }
                }
            };
            var allergyRecord = {
                entered: '200712171513',
                facilityCode: '500',
                facilityName: 'CAMP MASTER',
                historical: true,
                kind: 'Allergy/Adverse Reaction',
                lastUpdateTime: 20150119135618,
                localId: '874',
                mechanism: 'ALLERGY',
                originatorName: 'PROVIDER,ONE',
                products: ['CHOCOLATE'],
                reactions: ['DIARRHEA'],
                reference: '3;GMRD(120.82,',
                stampTime: 20150119135618,
                summary: 'CHOCOLATE',
                typeName: 'DRUG, FOOD',
                uid: recordUid,
                verified: '20071217151354',
                verifierName: '<auto-verified>',
                pid: 'WXYZ;123456',
                codesCode: ['C0008299'],
                codesSystem: ['urn:oid:2.16.840.1.113883.6.86'],
                codesDisplay: ['Chocolate'],
                drugClasses: [],
                comments: []
            };

            var patientIdentifier = {
                'type': 'pid',
                'value': 'WXYZ;123456'
            };

            var storageJob = {
                'patientIdentifier': patientIdentifier,
                'record': allergyRecord,
                'jpid': '21EC2020-3AEA-4069-A2DD-08002B30309D',
                'type': 'store-record-request'
            };

            setupForTest(patientIdentifier, allergyMetaStamp);
            var jdsClient = new JdsClient(log, log, config);
            var environment = {
                jds: jdsClient,
                publisherRouter: {
                    publish: function(job, callback) {
                        callback();
                    }
                },
                metrics: log,
                solr: {
                    add: function(record, callback) {
                        callback();
                    }
                }
            };

            //store new allergy record
            var finished = false;
            runs(function() {
                handle(log, config, environment, storageJob, function(error, result) {
                    expect(error).toBeNull();
                    expect(result).toEqual('success');
                    finished = true;
                }, function() {});
            });

            waitsFor(function() {
                return finished;
            });

            var finished4 = false;
            //Verify record was marked as stored in metastamp
            //Check the stampTime
            runs(function() {
                jdsClient.getSyncStatus(patientIdentifier, function(error, response, result) {
                    expect(val(response, 'statusCode')).toEqual(200);
                    expect(val(result, 'completedStamp')).toBeTruthy();
                    expect(val(result, 'inProgress')).toBeFalsy();
                    expect(val(result, ['completedStamp', 'sourceMetaStamp', 'WXYZ', 'stampTime'])).toEqual(allergyRecord.stampTime);
                    finished4 = true;
                });
            });
            waitsFor(function() {
                return finished4;
            });

            var deletedAllergyMetaStamp = {
                'icn': 'WXYZ;123456',
                'stampTime': '20150421126625',
                'sourceMetaStamp': {
                    'WXYZ': {
                        'pid': 'WXYZ;123456',
                        'localId': '123456',
                        'stampTime': '20150421126625',
                        'domainMetaStamp': {
                            'allergy': {
                                'domain': 'allergy',
                                'stampTime': '20150421126625',
                                'eventMetaStamp': {
                                    'urn:va:allergy:WXYZ:123456:0654321': {
                                        'stampTime': '20150421126625'
                                    }
                                }
                            }
                        }
                    }
                }
            };
            var deletedAllergyRecord = {
                'uid': recordUid,
                'stampTime': 20150421126625,
                'pid': patientIdentifier.value,
                'removed': true
            };
            var storageJob2 = {
                'patientIdentifier': patientIdentifier,
                'record': deletedAllergyRecord,
                'jpid': '21EC2020-BEEF-BEEF-BEEF-08002B30309D',
                'type': 'store-record-request'
            };
            //Update metastamp with new metastamp for the deleted record
            var updateMetastampFinished = false;
            runs(function() {
                environment.jds.saveSyncStatus(deletedAllergyMetaStamp, patientIdentifier, function(error, response) {
                    expect(error).toBeFalsy();
                    expect(val(response, 'statusCode')).toBe(200);
                    updateMetastampFinished = true;
                });
            });
            waitsFor(function() {
                return updateMetastampFinished;
            });

            //Update the record with the deleted record
            var finished5 = false;
            runs(function() {
                handle(log, config, environment, storageJob2, function(error, result) {
                    expect(error).toBeNull();
                    expect(result).toEqual('success');
                    finished5 = true;
                }, function() {});
            });

            waitsFor(function() {
                return finished5;
            });

            var finished6 = false;
            //Verify metaStamp was updated with the deleted record
            //Check the stampTime
            runs(function() {
                jdsClient.getSyncStatus(patientIdentifier, function(error, response, result) {
                    expect(val(response, 'statusCode')).toEqual(200);
                    expect(val(result, 'completedStamp')).toBeTruthy();
                    expect(val(result, 'inProgress')).toBeFalsy();
                    expect(val(result, ['completedStamp', 'sourceMetaStamp', 'WXYZ', 'stampTime'])).toEqual(deletedAllergyRecord.stampTime);
                    finished6 = true;
                });
            });
            waitsFor(function() {
                return finished6;
            });

            var finished7 = false;
            //Verify old record was updated with deleted record
            runs(function() {
                jdsClient.getPatientDataByUid(recordUid, function(error, response, result) {
                    expect(val(response, 'statusCode')).toEqual(200);
                    expect(val(result, ['data', 'items', 0, 'removed'])).toBe(true);
                    finished7 = true;
                });
            });
            waitsFor(function() {
                return finished7;
            });

            tearDownAfterTest(patientIdentifier);
        });
        it('throws an error for jobs with missing records or records missing data', function() {
            var jdsClient = new JdsClient(log, log, config);
            var environment = {
                jds: jdsClient,
                publisherRouter: {
                    publish: function() {}
                },
                metrics: log,
                solr: {
                    add: function() {}
                }
            };

            var finished = false;
            var brokenJob = {
                'patientIdentifier': {
                    type: 'pid',
                    value: 'BLAH;123456'
                },
                'record': {},
                'jpid': '21EC2020-3AEA-4069-A2DD-08002B30309D',
                'type': 'store-record-request'
            };
            runs(function() {
                handle(log, config, environment, brokenJob, function(error, result) {
                    expect(error).not.toBeNull();
                    expect(val(error, 'message')).toEqual('Missing UID');
                    expect(result).toBeUndefined();
                    finished = true;
                }, function() {});
            });

            waitsFor(function() {
                return finished;
            });
        });
    });
});