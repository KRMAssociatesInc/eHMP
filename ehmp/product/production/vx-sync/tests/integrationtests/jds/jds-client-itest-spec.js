'use strict';

require('../../../env-setup');

var _ = require('underscore');

var logger = require(global.VX_UTILS + 'dummy-logger');

// logger = require('bunyan').createLogger({
//     name: 'jds-client',
//     level: 'debug'
// });

var config = require(global.VX_ROOT + 'worker-config');
var val = require(global.VX_UTILS + 'object-utils').getProperty;

var JdsClient = require(global.VX_SUBSYSTEMS + 'jds/jds-client');
var jdsClient = new JdsClient(logger, logger, config);

var identifiers = ['9E7A;33333'];
var identifiers2 = ['888V123887', 'ASDF;123'];
var extraIdentifiers = ['12108V420871', 'DOD;00001'];
var patientIdentifier = {
    'type': 'pid',
    'value': '9E7A;33333'
};
var async = require('async');
var jpid;

var unknownIdentifier = {
    'type': 'pid',
    'value': '9E7B;3'
};

function deletePatientIdentifiers(callback) {
    var deleteFinished = 0;
    runs(function() {
        jdsClient.deletePatientByPid(patientIdentifier.value, function(error) {
            expect(error).toBeNull();
            //expect(val(response, 'statusCode')).toBe(200); Can be 200 or 404
            deleteFinished++;
        });
        jdsClient.deletePatientByPid(identifiers2[1], function(error) {
            expect(error).toBeNull();
            //expect(val(response, 'statusCode')).toBe(200); Can be 200 or 404
            deleteFinished++;
        });
        jdsClient.deletePatientByPid(unknownIdentifier.value, function(error) {
            expect(error).toBeNull();
            //expect(val(response, 'statusCode')).toBe(200); Can be 200 or 404
            deleteFinished++;
        });
    });
    waitsFor(function() {
        return deleteFinished === 3;
    });
    runs(function() {
        callback();
    });
}

function resetPatientIdentifiers() {
    var deleteFinished = false;

    runs(function() {
        deletePatientIdentifiers(function() {
            deleteFinished = true;
        });
    });

    waitsFor(function() {
        return deleteFinished;
    });

    var finished = 0;
    runs(function() {
        jdsClient.storePatientIdentifier({
            'patientIdentifiers': identifiers
        }, function(error, response) {
            finished++;
            expect(error).toBeNull();
            expect(val(response, 'statusCode')).toBe(201);
            jdsClient.getPatientIdentifier({
                'patientIdentifier': patientIdentifier
            }, function(error, response, results) {
                jpid = results.jpid;
                finished++;
            });
        });
        jdsClient.storePatientIdentifier({
            'patientIdentifiers': identifiers2
        }, function(error, response) {
            finished++;
            expect(error).toBeNull();
            expect(val(response, 'statusCode')).toBe(201);
        });
    });

    waitsFor(function() {
        return finished === 3;
    });
}

var mockJobStatus = require(global.VX_ROOT + 'mocks/jds/jds-mock-job-data');

var mockSyncStatus = require(global.VX_ROOT + 'mocks/jds/jds-mock-sync-data');
var getMetaStamps = function() {
    var inProgressMetaStamp = mockSyncStatus('21EC2020-3AEA-4069-A2DD-08002B30309D', 33333);
    inProgressMetaStamp = inProgressMetaStamp.data.items[0].inProgress;

    var initial9E7AStatus = JSON.parse(JSON.stringify(inProgressMetaStamp));

    initial9E7AStatus.icn = extraIdentifiers[0];
    delete initial9E7AStatus.syncCompleted;

    var initialDODLabStatus = JSON.parse(JSON.stringify(initial9E7AStatus));

    delete initial9E7AStatus.sourceMetaStamp.DOD;
    delete initialDODLabStatus.sourceMetaStamp['9E7A'];

    delete initialDODLabStatus.sourceMetaStamp.DOD.syncCompleted;

    var initialDODVitalStatus = JSON.parse(JSON.stringify(initialDODLabStatus));

    delete initial9E7AStatus.sourceMetaStamp['9E7A'].syncCompleted;
    delete initial9E7AStatus.sourceMetaStamp['9E7A'].domainMetaStamp.allergy.syncCompleted;
    delete initial9E7AStatus.sourceMetaStamp['9E7A'].domainMetaStamp.vital.syncCompleted;
    delete initial9E7AStatus.sourceMetaStamp['9E7A'].domainMetaStamp.allergy.eventMetaStamp['urn:va:allergy:9E7A:3:1001'].stored;
    delete initial9E7AStatus.sourceMetaStamp['9E7A'].domainMetaStamp.allergy.eventMetaStamp['urn:va:allergy:9E7A:3:1002'].stored;
    delete initial9E7AStatus.sourceMetaStamp['9E7A'].domainMetaStamp.vital.eventMetaStamp['urn:va:vital:9E7A:3:1001'].stored;
    delete initial9E7AStatus.sourceMetaStamp['9E7A'].domainMetaStamp.vital.eventMetaStamp['urn:va:vital:9E7A:3:1002'].stored;

    delete initialDODLabStatus.sourceMetaStamp.DOD.domainMetaStamp.vital;
    delete initialDODLabStatus.sourceMetaStamp.DOD.domainMetaStamp.lab.syncCompleted;
    delete initialDODLabStatus.sourceMetaStamp.DOD.domainMetaStamp.lab.eventMetaStamp['urn:va:lab:DOD:00001:100100'].stored;
    delete initialDODLabStatus.sourceMetaStamp.DOD.domainMetaStamp.lab.eventMetaStamp['urn:va:lab:DOD:00001:100200'].stored;

    delete initialDODVitalStatus.sourceMetaStamp.DOD.domainMetaStamp.lab;
    delete initialDODVitalStatus.sourceMetaStamp.DOD.domainMetaStamp.vital.syncCompleted;
    delete initialDODVitalStatus.sourceMetaStamp.DOD.domainMetaStamp.vital.eventMetaStamp['urn:va:vital:DOD:00001:1003000'].stored;

    var reassembledMetastamp = JSON.parse(JSON.stringify(initial9E7AStatus));
    reassembledMetastamp.sourceMetaStamp.DOD = JSON.parse(JSON.stringify(initialDODLabStatus.sourceMetaStamp.DOD));
    reassembledMetastamp.sourceMetaStamp.DOD.domainMetaStamp.vital = JSON.parse(JSON.stringify(initialDODVitalStatus.sourceMetaStamp.DOD.domainMetaStamp.vital));

    var summary9E7AStatus = JSON.parse(JSON.stringify(initial9E7AStatus));
    delete summary9E7AStatus.sourceMetaStamp['9E7A'].domainMetaStamp.allergy.eventMetaStamp;
    delete summary9E7AStatus.sourceMetaStamp['9E7A'].domainMetaStamp.vital.eventMetaStamp;

    var summaryCompleteMetaStamp = JSON.parse(JSON.stringify(reassembledMetastamp));
    // Delete eventMetaStamp for 9E7A
    delete summaryCompleteMetaStamp.sourceMetaStamp['9E7A'].domainMetaStamp.allergy.eventMetaStamp;
    delete summaryCompleteMetaStamp.sourceMetaStamp['9E7A'].domainMetaStamp.vital.eventMetaStamp;
    // Delete eventMetaStamp for DOD
    delete summaryCompleteMetaStamp.sourceMetaStamp.DOD.domainMetaStamp.vital.eventMetaStamp;
    delete summaryCompleteMetaStamp.sourceMetaStamp.DOD.domainMetaStamp.lab.eventMetaStamp;

    return {
        'completeMetaStamp': reassembledMetastamp,
        'summaryCompleteMetaStamp': summaryCompleteMetaStamp,
        'initial9E7AStatus': initial9E7AStatus,
        'summary9E7AStatus': summary9E7AStatus,
        'initialDODLabStatus': initialDODLabStatus,
        'initialDODVitalStatus': initialDODVitalStatus
    };
};

describe('jds-client.js', function() {
    it('Is properly defined', function() {
        expect(jdsClient).not.toBeUndefined();

        //expect(jdsClient.clearJdsData).not.toBeUndefined();
        expect(jdsClient.saveSyncStatus).not.toBeUndefined();
        expect(jdsClient.getSyncStatus).not.toBeUndefined();
        expect(jdsClient.saveJobState).not.toBeUndefined();
        expect(jdsClient.getJobStatus).not.toBeUndefined();
        expect(jdsClient.clearJobStatesByPatientIdentifier).not.toBeUndefined();
        expect(jdsClient.getPatientIdentifier).not.toBeUndefined();
        expect(jdsClient.storePatientIdentifier).not.toBeUndefined();
        expect(jdsClient.clearPatientIdentifiers).not.toBeUndefined();
        expect(jdsClient.storeOperationalData).not.toBeUndefined();
        expect(jdsClient.getOperationalDataByUid).not.toBeUndefined();
        expect(jdsClient.deleteOperationalDataByUid).not.toBeUndefined();
        expect(jdsClient.getPatientDomainData).not.toBeUndefined();
        expect(jdsClient.storePatientDataFromJob).not.toBeUndefined();
    });

    describe('Patient Identifiers', function() {
        var unknownIdentifier = {
            'type': 'pid',
            'value': '9E7B;3'
        };

        it('Can reset the patient identifiers to a base testing state', resetPatientIdentifiers);

        describe('storePatientIdentifier()', function() {
            beforeEach(resetPatientIdentifiers);

            it('Successfully validates a known patient identifier array', function() {
                var finished;
                runs(function() {
                    jdsClient.storePatientIdentifier({
                        'patientIdentifiers': identifiers
                    }, function(error, response) {
                        finished = true;
                        expect(error).toBeNull();
                        expect(val(response, 'statusCode')).toBe(200);
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 10000);
            });

            it('Successfully saves a properly formatted unknown identifier array', function() {
                var finished;
                runs(function() {
                    jdsClient.storePatientIdentifier({
                        'patientIdentifiers': [unknownIdentifier.value]
                    }, function(error, response) {
                        expect(error).toBeNull();
                        expect(val(response, 'statusCode')).toBe(201);
                        finished = true;
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 10000);
            });
        });

        describe('getPatientIdentifier()', function() {
            beforeEach(resetPatientIdentifiers);

            it('Successfully retrieves the JPID for a known identifier', function() {
                var finished;
                runs(function() {
                    jdsClient.getPatientIdentifier({
                        'patientIdentifier': patientIdentifier
                    }, function(error, response, result) {
                        finished = true;
                        expect(error).toBeNull();
                        expect(val(response, 'statusCode')).toBe(200);
                        expect(val(result, 'patientIdentifiers')).toEqual(identifiers);
                        expect(val(result, 'jpid')).not.toBeUndefined();
                        expect(val(result, 'jpid', 'length')).not.toBeUndefined();
                        expect(val(result, 'jpid', 'length')).toBe(36);
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 10000);
            });

            it('Returns a 404 error for unknown identifiers', function() {
                var finished;
                runs(function() {
                    jdsClient.getPatientIdentifier({
                        'patientIdentifier': unknownIdentifier
                    }, function(error, response, result) {
                        finished = true;
                        expect(error).toBeNull();
                        expect(val(response, 'statusCode')).toBe(404);
                        expect(val(result, 'error', 'errors', 0, 'message')).toEqual('JPID Not Found');
                        expect(val(result, 'error', 'errors', 0, 'reason')).toBe(224);
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 10000);
            });

            describe('getPatientIdentifierByPid()', function() {
                beforeEach(resetPatientIdentifiers);

                it('Successfully retrieves the JPID for a known pid', function() {
                    var finished;
                    runs(function() {
                        jdsClient.getPatientIdentifierByPid(patientIdentifier.value, function(error, response, result) {
                            finished = true;
                            expect(error).toBeNull();
                            expect(val(response, 'statusCode')).toBe(200);
                            expect(val(result, 'patientIdentifiers')).toEqual(identifiers);
                            expect(val(result, 'jpid')).not.toBeUndefined();
                            expect(val(result, 'jpid', 'length')).toBe(36);
                        });
                    });

                    waitsFor(function() {
                        return finished;
                    }, 10000);
                });

                it('Returns a 404 error for unknown identifiers', function() {
                    var finished;
                    runs(function() {
                        jdsClient.getPatientIdentifierByPid(unknownIdentifier.value, function(error, response, result) {
                            finished = true;
                            expect(error).toBeNull();
                            expect(val(response, 'statusCode')).toBe(404);
                            expect(val(result, 'error', 'errors', 0, 'message')).toEqual('JPID Not Found');
                            expect(val(result, 'error', 'errors', 0, 'reason')).toBe(224);
                        });
                    });

                    waitsFor(function() {
                        return finished;
                    }, 10000);
                });
            });
        });
    });

    describe('Job Status', function() {
        var startedEnterpriseSyncRequestState;
        var createEnterpriseSyncRequestState;

        var resetJobState = function() {
            var clearFinished = false;
            var saveFinished = false;
            startedEnterpriseSyncRequestState = mockJobStatus('1').jpid(jpid)[0];
            startedEnterpriseSyncRequestState.patientIdentifier = patientIdentifier;
            createEnterpriseSyncRequestState = _.clone(startedEnterpriseSyncRequestState);
            createEnterpriseSyncRequestState.status = 'created';
            createEnterpriseSyncRequestState.timestamp = (parseInt(createEnterpriseSyncRequestState.timestamp) - 2).toString();

            runs(function() {
                jdsClient.clearJobStatesByPatientIdentifier(patientIdentifier, function(error, response) {
                    expect(error).toBeNull();
                    expect(val(response, 'statusCode')).toBe(200);
                    clearFinished = true;
                });
            });
            waitsFor(function(){
                return clearFinished;
            });

            runs(function() {
                jdsClient.saveJobState(createEnterpriseSyncRequestState, function(error, response) {
                    expect(error).toBeNull();
                    expect(val(response, 'statusCode')).toBe(200);
                    saveFinished = true;
                });
            });

            waitsFor(function() {
                return saveFinished;
            }, 20000);
        };

        beforeEach(resetPatientIdentifiers);

        it('Can reset the job state data to an initial testing state', resetJobState);

        describe('clearJobStatesByPatientIdentifier()', function() {
            it('Successfully clears all job states', function() {
                var finished;
                runs(function() {
                    jdsClient.clearJobStatesByPatientIdentifier(patientIdentifier, function(error, response) {
                        expect(error).toBeNull();
                        expect(val(response, 'statusCode')).toBe(200);
                        finished = true;
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 20000);
            });
        });

        describe('saveJobState()', function() {
            beforeEach(resetJobState);

            it('Can save new job states', function() {
                var finished;
                runs(function() {
                    jdsClient.saveJobState(startedEnterpriseSyncRequestState, function(error, response) {
                        expect(error).toBeNull();
                        expect(val(response, 'statusCode')).toBe(200);
                        finished = true;
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 20000);
            });
        });

        describe('getJobStatus()', function() {
            beforeEach(resetJobState);

            it('Can retrieve a JPID\'s job status', function() {
                var finished;
                runs(function() {
                    jdsClient.getJobStatus({
                        'jpid': jpid
                    }, function(error, response, results) {
                        expect(error).toBeNull();
                        expect(val(response, 'statusCode')).toBe(200);
                        expect(results).not.toBeUndefined();
                        expect(val(results, 'items')).not.toBeUndefined();

                        expect(val(results, 'items', 'length')).toBe(1);
                        expect(val(results, 'items', 0)).toEqual(createEnterpriseSyncRequestState);
                        finished = true;
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 20000);
            });


            it('Can retrieve a filtered results', function() {
                var finished, filter = {
                    'filter': '?filter=eq(status,\"created\")'
                };
                runs(function() {
                    jdsClient.getJobStatus({
                            'jpid': jpid
                        },
                        filter,
                        function(error, response, results) {
                            expect(error).toBeNull();
                            expect(val(response, 'statusCode')).toBe(200);
                            expect(results).not.toBeUndefined();
                            expect(val(results, 'items')).not.toBeUndefined();

                            expect(val(results, 'items', 'length')).toBe(1);
                            expect(val(results, 'items', 0)).toEqual(createEnterpriseSyncRequestState);
                            finished = true;
                        });
                });

                waitsFor(function() {
                    return finished;
                }, 20000);
            });

        });

        describe('Correctly displays the job status under a multi-job scenario', function() {
            var vista9E7AsubscribeRequestCreateState,
                vista9E7AsubscribeRequestStartState,
                vista9E7AsubscribeRequestCompleteState;

            beforeEach(resetJobState);
            beforeEach(function() {
                var finished = 0;
                runs(function() {
                    var validateSaveResponse = function(error, response) {
                        expect(error).toBeNull();
                        expect(val(response, 'statusCode')).toBe(200);
                        finished++;
                    };

                    var jobs = mockJobStatus(1).jpid(jpid);
                    _.forEach(jobs, function(job) {
                        job.patientIdentifier = patientIdentifier;
                    });
                    var completeTime = parseInt(jobs[1].timestamp);

                    vista9E7AsubscribeRequestCompleteState = jobs[1];

                    vista9E7AsubscribeRequestCreateState = _.clone(vista9E7AsubscribeRequestCompleteState);
                    vista9E7AsubscribeRequestCreateState.status = 'created';
                    vista9E7AsubscribeRequestCreateState.timestamp = (completeTime - 2).toString();

                    vista9E7AsubscribeRequestStartState = _.clone(vista9E7AsubscribeRequestCompleteState);
                    vista9E7AsubscribeRequestStartState.status = 'started';
                    vista9E7AsubscribeRequestStartState.timestamp = (completeTime - 1).toString();

                    jdsClient.saveJobState(startedEnterpriseSyncRequestState, validateSaveResponse);
                    jdsClient.saveJobState(vista9E7AsubscribeRequestCreateState, validateSaveResponse);
                    jdsClient.saveJobState(vista9E7AsubscribeRequestStartState, validateSaveResponse);
                    jdsClient.saveJobState(vista9E7AsubscribeRequestCompleteState, validateSaveResponse);
                });

                waitsFor(function() {
                    return finished === 4;
                }, 20000);
            });

            it('Returns a correct job status', function() {
                var finished;
                runs(function() {
                    jdsClient.getJobStatus({
                        'jpid': jpid
                    }, function(error, response, results) {
                        finished = true;
                        expect(error).toBeNull();
                        expect(val(response, 'statusCode')).toBe(200);
                        expect(val(results, 'items')).not.toBeUndefined();
                        expect(val(results, 'items', 'length')).not.toBeUndefined();
                        expect(val(results, 'items', 'length')).toBe(2);
                        expect(val(results, 'items')).toContain(startedEnterpriseSyncRequestState);
                        expect(val(results, 'items')).toContain(vista9E7AsubscribeRequestCompleteState);
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 10000);
            });
        });
    });

    describe('Sync Status', function() {
        var jpid, metastamps;
        var resetSyncStatus = function() {
            var finished;
            // runs(function() {
            //     // jdsClient.clearSyncStatus(function(error, response) {
            //     //     expect(error).toBeNull();
            //     //     expect(val(response, 'statusCode')).toBe(200);
            //     //     finished = true;
            //     // });
            //     jdsClient.deletePatientByPid(patientIdentifier.value, function(error, response) {
            //         expect(error).toBeNull();
            //         //expect(val(response, 'statusCode')).toBe(200); Can be 200 or 404
            //         finished = true;
            //     });
            // });

            // waitsFor(function() {
            //     return finished;
            // });

            runs(function() {
                finished = false;
                jdsClient.saveSyncStatus(metastamps.initial9E7AStatus, patientIdentifier, function(error, response) {
                    expect(error).toBeFalsy();
                    expect(val(response, 'statusCode')).toBe(200);
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 10000);
        };
        var augmentPatientIdentifiers = function() {
            jpid = undefined;
            runs(function() {
                jdsClient.getPatientIdentifier({
                    'patientIdentifier': patientIdentifier
                }, function(error, response, result) {
                    expect(error).toBeNull();
                    expect(val(response, 'statusCode')).toBe(200);
                    expect(val(result, 'jpid')).not.toBeUndefined();
                    expect(val(result, 'jpid', 'length')).toBe(36);
                    jpid = result.jpid;
                });
            });

            waitsFor(function() {
                return jpid;
            }, 10000);

            var finished;
            runs(function() {
                metastamps = getMetaStamps(jpid);

                var addIdentifier = {
                    'jpid': jpid,
                    'patientIdentifiers': extraIdentifiers
                };
                jdsClient.storePatientIdentifier(addIdentifier, function(error, response) {
                    expect(error).toBeNull();
                    expect(val(response, 'statusCode')).toBe(201);
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 10000);
        };

        beforeEach(resetPatientIdentifiers);
        beforeEach(augmentPatientIdentifiers);
        beforeEach(resetSyncStatus);

        it('Can reset the sync status to an initial testing state', resetSyncStatus);

        // describe('clearSyncStatus()', function() {
        //     it('Successfully deletes all synchronization data', function() {
        //         var finished;
        //         runs(function() {
        //             jdsClient.clearSyncStatus(function(error, response) {
        //                 expect(error).toBeNull();
        //                 expect(val(response, 'statusCode')).toBe(200);
        //                 finished = true;
        //             });
        //         });

        //         waitsFor(function() {
        //             return finished;
        //         });
        //     });
        // });

        describe('saveSyncStatus()', function() {
            it('Successfully saves a metastamp', function() {
                var finished;
                runs(function() {
                    jdsClient.saveSyncStatus(metastamps.initialDODLabStatus, patientIdentifier, function(error, response) {
                        expect(error).toBeFalsy();
                        expect(val(response, 'statusCode')).toBe(200);
                        finished = true;
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 10000);
            });
        });

        describe('getSyncStatus()', function() {
            it('Successfully retrieves the sync status for a known patientIdentifier', function() {
                var finished;
                runs(function() {
                    jdsClient.getSyncStatus(patientIdentifier, function(error, response, results) {
                        expect(error).toBeNull();
                        expect(val(response, 'statusCode')).toBe(200);

                        expect(results).not.toBeUndefined();
                        expect(val(results, 'inProgress')).toEqual(metastamps.summary9E7AStatus);

                        finished = true;
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 10000);
            });
        });

        describe('End to end test saving metastamps for 9E7A and two DOD domains', function() {
            beforeEach(function() {
                var finished = 0;
                var handleSyncSaveResponse = function(error, response) {
                    expect(error).toBeFalsy();
                    expect(val(response, 'statusCode')).toBe(200);
                    finished++;
                };

                runs(function() {
                    jdsClient.saveSyncStatus(metastamps.initialDODLabStatus, patientIdentifier, handleSyncSaveResponse);
                    jdsClient.saveSyncStatus(metastamps.initialDODVitalStatus, patientIdentifier, handleSyncSaveResponse);
                });

                waitsFor(function() {
                    return finished === 2;
                });
            });

            it('Retrieves and accurate sync status given the metastamps stored', function() {
                var finished;
                runs(function() {
                    jdsClient.getSyncStatus(patientIdentifier, function(error, response, results) {
                        expect(error).toBeNull();
                        expect(val(response, 'statusCode')).toBe(200);

                        expect(results).not.toBeUndefined();
                        expect(val(results, 'inProgress')).toEqual(metastamps.summaryCompleteMetaStamp);

                        finished = true;
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 10000);
            });
        });
    });

    describe('Patient Data', function() {
        describe('Get patient data', function() {
            it('Can query the JDS endpoint to retrieve all data for the \'patient\' domain', function() {
                var finished = false;
                var callbackError, callbackResponse, callbackBody;
                runs(function() {
                    jdsClient.getPatientDomainData(patientIdentifier.value, 'patient', function(error, response, body) {
                        callbackError = error;
                        callbackResponse = response;
                        callbackBody = body;
                        expect(val(response, 'statusCode')).toBe(200);
                        expect(val(body, 'data')).not.toBeUndefined();
                        finished = true;
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 10000);
            });
        });

        describe('Store patient data', function() {
            var demographicsRecord = {
                'addresses': [{
                    'city': 'Any Town',
                    'postalCode': '99998-0071',
                    'stateProvince': 'WEST VIRGINIAN'
                }],
                'aliases': [{
                    'fullName': 'P8'
                }],
                'briefId': 'U7777',
                'dateOfBirth': 19350408,
                'facilities': [{
                    'code': 500,
                    'latestDate': 20110613,
                    'name': 'CAMP MASTER',
                    'systemId': '93EF'
                }],
                'familyName': 'UTESTPATIENT',
                'gender': 'M',
                'givenNames': 'EIGHT',
                'icn': '888V123887',
                'ssn': '88888887',
                'pid': 'ASDF;123',
                'uid': 'urn:va:patient:ASDF:123:123',
                'stampTime': '20141031094920'
            };
            var storageJob = {
                'patientIdentifier': patientIdentifier,
                'record': demographicsRecord
            };
            var allergyRecord = {
                'facilityCode': '500',
                'facilityName': 'CAMP MASTER',
                'entered': '200503172015',
                'verified': '20050317201533',
                'kind': 'Allergy/Adverse Reaction',
                'originatorName': 'VEHU,TEN',
                'verifierName': '<auto-verified>',
                'mechanism': 'PHARMACOLOGIC',
                'uid': 'urn:va:allergy:ASDF:123:753',
                'summary': 'PENICILLIN',
                'pid': 'ASDF;123',
                'localId': '123',
                'historical': true,
                'reference': '125;GMRD(120.82,',
                'products': [{
                    'name': 'PENICILLIN',
                    'vuid': 'urn:va:vuid:',
                    'summary': 'AllergyProduct'
                }],
                'reactions': [{
                    'name': 'ITCHING,WATERING EYES',
                    'vuid': 'urn:va:vuid:',
                    'summary': 'AllergyReaction}'
                }],
                'drugClasses': [{
                    'code': 'AM114',
                    'name': 'PENICILLINS AND BETA-LACTAM ANTIMICROBIALS',
                    'summary': 'AllergyDrugClass'
                }],
                'typeName': 'DRUG',
                'stampTime': '20141031094920'
            };

            beforeEach(resetPatientIdentifiers);
            it('Can store a valid demographics record', function() {
                var finished = false;
                runs(function() {
                    jdsClient.storePatientDataFromJob(storageJob, function(error, response) {
                        expect(error).toBeNull();
                        expect(val(response, 'statusCode')).toBe(201);
                        finished = true;
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 20000);
            });

            it('Can store a valid demographics record and validate that it has been stored', function() {
                var finished = false;
                runs(function() {
                    jdsClient.storePatientDataFromJob(storageJob, function(error, response) {
                        expect(error).toBeNull();
                        expect(val(response, 'statusCode')).toBe(201);
                        jdsClient.getPatientDomainData(demographicsRecord.pid, 'patient', function(error, response, body) {
                            expect(body).not.toBeUndefined();
                            expect(val(body, 'data')).not.toBeUndefined();
                            expect(val(body, 'data', 'items')).not.toBeUndefined();
                            expect(val(body, 'data', 'items', 'length')).not.toBeUndefined();
                            expect(val(body, 'data', 'items', 'length') > 0).toBeTruthy();
                            expect(val(body, 'data', 'items')).toContain(jasmine.objectContaining(demographicsRecord));
                            finished = true;
                        });
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 10000);
            });

            it('Can store/retrieve/delete an allergy record.', function() {
                var finished = false;
                runs(function() {
                    jdsClient.storePatientData(allergyRecord, function(error, response) {
                        expect(error).toBeNull();
                        expect(val(response, 'statusCode')).toBe(201);
                        jdsClient.getPatientDomainData(allergyRecord.pid, 'allergy', function(error, response, body) {
                            expect(body).not.toBeUndefined();
                            expect(val(body, 'data')).not.toBeUndefined();
                            expect(val(body, 'data', 'items')).not.toBeUndefined();
                            expect(val(body, 'data', 'items', 'length')).not.toBeUndefined();
                            expect(val(body, 'data', 'items', 'length') > 0).toBeTruthy();
                            expect(val(body, 'data', 'items')).toContain(jasmine.objectContaining(allergyRecord));

                            jdsClient.deletePatientDataByUid(allergyRecord.uid, function(error, response) {
                                expect(error).toBeNull();
                                expect(response).toBeTruthy();
                                expect(val(response, 'statusCode')).toEqual(200);
                                finished = true;
                            });
                        });
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 10000);
            });

        });
    });

    describe('Operational Data', function() {
        var testUid = 'urn:va:vprupdate-test:C877';
        var operationalData = {
            systemId: 'C877',
            timestamp: '3141231-14011',
            stampTime: '1234',
            uid: testUid
        };
        var resetOperationalData = function() {
            var finished;
            runs(function() {
                jdsClient.deleteOperationalDataByUid(testUid, function(error, response) {
                    expect(error).toBeNull();
                    expect(val(response, 'statusCode')).toBe(200);
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 10000);
        };

        beforeEach(resetOperationalData);

        describe('deleteOperationalDataByUid(), storeOperationalData(), and getOperationalDataByUid()', function() {
            var storeOperationalData = function() {
                var finished;
                runs(function() {
                    jdsClient.storeOperationalData(operationalData, function(error, response) {
                        expect(error).toBeNull();
                        expect(val(response, 'statusCode')).toBe(201);
                        finished = true;
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 10000);
            };
            var retrieveOperationalData = function() {
                var finished = false;
                runs(function() {
                    jdsClient.getOperationalDataByUid(testUid, function(error, response, result) {
                        expect(error).toBeNull();
                        expect(val(response, 'statusCode')).toBe(200);
                        expect(response).toBeTruthy();
                        if (val(result, 'data', 'items', 'length')) {
                            expect(val(result, 'data', 'items')).toContain(jasmine.objectContaining({
                                systemId: 'C877',
                                timestamp: '3141231-14011',
                                uid: testUid
                            }));
                        }
                        finished = true;
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 10000);
            };
            it('Successfully store operational data.', function() {
                storeOperationalData();
                retrieveOperationalData();
            });
            afterEach(resetOperationalData);
        });
    });

    describe('PtSelect Data', function() {
        var testPatient1 = {
            'pid': '9E7A;3000000000',
            'birthDate': '19350407',
            'last4': '0008',
            'last5': 'E0008',
            'icn': '3000000000V420871',
            'familyName': 'TEST',
            'givenNames': 'PATIENT',
            'fullName': 'TEST,PATIENT',
            'displayName': 'Test,Patient',
            'genderCode': 'urn:va:pat-gender:M',
            'genderName': 'Male',
            'sensitive': false,
            'uid': 'urn:va:pt-select:9E7A:3000000000:3000000000',
            'summary': 'Test,Patient',
            'ssn': '666000008',
            'stampTime': '1234',
            'localId': 3000000000
        };
        var testPatient2 = {
            'pid': 'C877;3000000000',
            'birthDate': '19350407',
            'last4': '0008',
            'last5': 'E0008',
            'icn': '3000000000V420871',
            'familyName': 'TEST',
            'givenNames': 'PATIENT',
            'fullName': 'TEST,PATIENT',
            'displayName': 'Test,Patient',
            'genderCode': 'urn:va:pat-gender:M',
            'genderName': 'Male',
            'sensitive': false,
            'uid': 'urn:va:pt-select:C877:3000000000:3000000000',
            'summary': 'Test,Patient',
            'ssn': '666000008',
            'stampTime': '1234',
            'localId': 3000000000
        };
        var testUid1 = testPatient1.uid;
        var testUid2 = testPatient2.uid;
        var resetPatientSelectData = function() {
            var finished;
            runs(function() {

                var tasks = [
                    // jdsClient.deleteOperationalDataByUid.bind(jdsClient, testUid1),
                    // jdsClient.deleteOperationalDataByUid.bind(jdsClient, testUid2),
                    jdsClient.storeOperationalData.bind(jdsClient, testPatient1),
                    jdsClient.storeOperationalData.bind(jdsClient, testPatient2)
                ];

                // Process all the jobs that we have received
                //--------------------------------------------
                async.series(tasks, function(error) {
                    expect(error).toBeFalsy();
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            });
        };

        var deletePatientSelectData = function() {
            var finished;
            runs(function() {

                var tasks = [
                    jdsClient.deleteOperationalDataByUid.bind(jdsClient, testUid1),
                    jdsClient.deleteOperationalDataByUid.bind(jdsClient, testUid2)
                ];

                // Process all the jobs that we have received
                //--------------------------------------------
                async.series(tasks, function(error) {
                    expect(error).toBeFalsy();
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 10000);
        };

        beforeEach(resetPatientSelectData);
        afterEach(deletePatientSelectData);

        describe('getOperationalDataPtSelectByPid(), getOperationalDataPtSelectByIcn()', function() {
            it('Successfully retrieve by Pid.', function() {
                var finished = false;
                runs(function() {
                    jdsClient.getOperationalDataPtSelectByPid(testPatient1.pid, function(error, response, result) {
                        expect(error).toBeNull();
                        expect(val(response, 'statusCode')).toBe(200);
                        expect(response).toBeTruthy();
                        expect(val(result, 'data', 'totalItems')).toEqual(1);
                        expect(val(result, 'data', 'items')).toContain(jasmine.objectContaining({
                            pid: testPatient1.pid,
                            uid: testPatient1.uid
                        }));
                        finished = true;
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 10000);
            });
            it('Successfully retrieve by icn.', function() {
                var finished = false;
                runs(function() {
                    jdsClient.getOperationalDataPtSelectByIcn(testPatient1.icn, function(error, response, result) {
                        expect(error).toBeNull();
                        expect(val(response, 'statusCode')).toBe(200);
                        expect(response).toBeTruthy();
                        expect(val(result, 'data', 'totalItems')).toEqual(2);
                        expect(val(result, 'data', 'items')).toContain(jasmine.objectContaining({
                            pid: testPatient1.pid,
                            uid: testPatient1.uid
                        }));
                        expect(val(result, 'data', 'items')).toContain(jasmine.objectContaining({
                            pid: testPatient2.pid,
                            uid: testPatient2.uid
                        }));
                        finished = true;
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 10000);
            });
        });
    });

    describe('PtDemographics Data', function() {
        var testPatient1 = {
            'pid': '9E7A;3000000000',
            'birthDate': '19350407',
            'last4': '0008',
            'last5': 'E0008',
            'icn': '3000000000V420871',
            'familyName': 'TEST',
            'givenNames': 'PATIENT',
            'fullName': 'TEST,PATIENT',
            'displayName': 'Test,Patient',
            'genderCode': 'urn:va:pat-gender:M',
            'genderName': 'Male',
            'sensitive': false,
            'uid': 'urn:va:patient:9E7A:3000000000:3000000000',
            'summary': 'Test,Patient',
            'ssn': '666000008',
            'localId': 3000000000,
            'stampTime': '20150212010000'
        };
        var testPatient2 = {
            'pid': 'C877;3000000000',
            'birthDate': '19350407',
            'last4': '0008',
            'last5': 'E0008',
            'icn': '3000000000V420871',
            'familyName': 'TEST',
            'givenNames': 'PATIENT',
            'fullName': 'TEST,PATIENT',
            'displayName': 'Test,Patient',
            'genderCode': 'urn:va:pat-gender:M',
            'genderName': 'Male',
            'sensitive': false,
            'uid': 'urn:va:patient:C877:3000000000:3000000000',
            'summary': 'Test,Patient',
            'ssn': '666000008',
            'localId': 3000000000,
            'stampTime': '20150212010000'
        };
        var jdsPatientIdentificationRequest = {
            patientIdentifiers: [testPatient1.icn, testPatient1.pid, testPatient2.pid]
        };
        var resetPtDemographicsData = function() {
            var finished;
            runs(function() {

                var tasks = [
                    jdsClient.deletePatientByPid.bind(jdsClient, testPatient1.pid),
                    jdsClient.storePatientIdentifier.bind(jdsClient, jdsPatientIdentificationRequest),
                    jdsClient.storePatientData.bind(jdsClient, testPatient1),
                    jdsClient.storePatientData.bind(jdsClient, testPatient2)
                ];

                // Process all the jobs that we have received
                //--------------------------------------------
                async.series(tasks, function(error) {
                    expect(error).toBeFalsy();
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 10000);
        };

        var deletePtDemographicsData = function() {
            var finished;
            runs(function() {
                jdsClient.deletePatientByPid(testPatient1.pid, function(error) {
                    expect(error).toBeFalsy();
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 10000);
        };

        beforeEach(resetPtDemographicsData);
        afterEach(deletePtDemographicsData);

        describe('getPtDemographicsByPid(), getPtDemographicsByIcn()', function() {
            it('Successfully retrieve by Pid.', function() {
                var finished = false;
                runs(function() {
                    jdsClient.getPtDemographicsByPid(testPatient1.pid, function(error, response, result) {
                        logger.debug('Returned from jdsClient.getPtDemographicsByPid: error: %s; response: %j, result: %j', error, response, result);
                        expect(error).toBeNull();
                        expect(val(response, 'statusCode')).toBe(200);
                        expect(response).toBeTruthy();
                        expect(val(result, 'data', 'totalItems')).toEqual(1);
                        expect(val(result, 'data', 'items')).toContain(jasmine.objectContaining({
                            pid: testPatient1.pid,
                            uid: testPatient1.uid
                        }));
                        finished = true;
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 10000);
            });
            it('Successfully retrieve by icn.', function() {
                var finished = false;
                runs(function() {
                    jdsClient.getPtDemographicsByIcn(testPatient1.icn, function(error, response, result) {
                        expect(error).toBeNull();
                        expect(val(response, 'statusCode')).toBe(200);
                        expect(response).toBeTruthy();
                        expect(val(result, 'data', 'totalItems')).toEqual(2);
                        expect(val(result, 'data', 'items')).toContain(jasmine.objectContaining({
                            pid: testPatient1.pid,
                            uid: testPatient1.uid
                        }));
                        expect(val(result, 'data', 'items')).toContain(jasmine.objectContaining({
                            pid: testPatient2.pid,
                            uid: testPatient2.uid
                        }));
                        finished = true;
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 10000);
            });
        });
    });

    describe('Site specific operational data storage', function() {
        var testSiteId = 'HHHH';
        var testUid1 = 'urn:va:vprupdate-test:HHHH';
        // var testUid2 = 'urn:va:vprupdate-test:9E7A';
        var operationalData1 = {
            _id: testSiteId,
            lastUpdate: '3141231-14011',
            uid: testUid1
        };
        // var operationalData2 = {
        //     _id: '9E7A',
        //     lastUpdate: '3141231-14011',
        //     uid: testUid2
        // };


        describe('storeOperationalDataMutable(), getOperationalDataMutable(), getOperationalDataMutableByFilter(), deleteOperationalDataMutable()', function() {
            var clearOperationalData = function() {
                var finished;
                runs(function() {
                    jdsClient.deleteOperationalDataByUid(testUid1, function(error, response) {
                        expect(error).toBeNull();
                        expect(val(response, 'statusCode')).toBe(200);
                        finished = true;
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 10000);
            };

            var storeOperationalData = function() {
                var finished = false;

                runs(function() {
                    jdsClient.storeOperationalDataMutable(operationalData1, function(error, response) {
                        expect(error).toBeNull();
                        expect(val(response, 'statusCode')).toBe(200);
                        finished = true;
                    });
                });
                waitsFor(function() {
                    return finished;
                }, 10000);
            };

            var retrieveOperationalData = function() {
                var finished = false;

                runs(function() {
                    jdsClient.getOperationalDataMutable(testSiteId, function(error, response, result) {
                        expect(error).toBeNull();
                        expect(val(response, 'statusCode')).toBe(200);
                        expect(result).toEqual({
                            _id: 'HHHH',
                            lastUpdate: '3141231-14011',
                            uid: testUid1
                        });
                        finished = true;
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 10000);
            };

            var retrieveOperationalDataMutableByFliter = function(){
                var finished = false;

                runs(function() {
                    jdsClient.getOperationalDataMutableByFilter('?filter=eq(\"uid\",' + testUid1 + ')', function(error, response, result) {
                        expect(error).toBeNull();
                        expect(val(response, 'statusCode')).toBe(200);
                        expect(result).toEqual({items :[{
                            _id: 'HHHH',
                            lastUpdate: '3141231-14011',
                            uid: testUid1
                        }]});
                        finished = true;
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 10000);
            };

            var deleteOperationalData = function() {
                var finished = false;

                runs(function() {
                    jdsClient.deleteOperationalDataMutable(testSiteId, function(error, response) {
                        expect(error).toBeNull();
                        expect(val(response, 'statusCode')).toBe(200);
                        finished = true;
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 10000);

                finished = false;

                runs(function() {
                    jdsClient.getOperationalDataMutable(testSiteId, function(error, response, result) {
                        expect(error).toBeNull();
                        expect(val(response, 'statusCode')).toBe(200);
                        expect(result).toEqual({});
                        finished = true;
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 10000);
            };

            it('Verify clear, store, retreive, delete functionality.', function() {
                clearOperationalData();
                storeOperationalData();
                retrieveOperationalData();
                retrieveOperationalDataMutableByFliter();
                deleteOperationalData();
                clearOperationalData();
            });
        });

        // This test is being removed from the list.   It is a bad test for integration because it destroys all 
        // mutable data in JDS.  Basically breaks JDS.  Should not be done...   When it is wanted for some
        // spot checking - it needs to be refactored to not assume that these separate IT wait for the earlier ones.
        // xdescribe('clearOperationalDataMutableStorage() and getOperationalDataMutableCount()', function() {
        //     it('store some site specific operational data', function() {

        //         runs(function() {
        //             //Delete all site specifc operational data before running test
        //             var finished = false;

        //             runs(function() {
        //                 jdsClient.clearOperationalDataMutableStorage(function() {
        //                     finished = true;
        //                 });
        //             });

        //             waitsFor(function() {
        //                 return finished;
        //             }, 10000);
        //         });

        //         //Store some operational data samples
        //         var finished = false;

        //         runs(function() {
        //             jdsClient.storeOperationalDataMutable(operationalData1, function(error, response) {
        //                 expect(error).toBeNull();
        //                 expect(val(response, 'statusCode')).toBe(200);
        //                 finished = true;
        //             });
        //         });
        //         waitsFor(function() {
        //             return finished;
        //         }, 10000);

        //         finished = false;

        //         runs(function() {
        //             jdsClient.storeOperationalDataMutable(operationalData2, function(error, response) {
        //                 expect(error).toBeNull();
        //                 expect(val(response, 'statusCode')).toBe(200);
        //                 finished = true;
        //             });
        //         });
        //         waitsFor(function() {
        //             return finished;
        //         }, 10000);
        //     });
        //     it('make sure there are 2 entries in site specific operational data storage', function() {
        //         var finished = false;
        //         runs(function() {
        //             jdsClient.getOperationalDataMutableCount(function(error, response, result) {
        //                 expect(error).toBeNull();
        //                 expect(val(response, 'statusCode')).toBe(200);
        //                 expect(result).toEqual({
        //                     length: '2'
        //                 });
        //                 finished = true;
        //             });
        //         });
        //         waitsFor(function() {
        //             return finished;
        //         }, 10000);
        //     });
        //     it('delete all site specific operational data', function() {
        //         //Delete all site specifc operational data
        //         var finished = false;

        //         runs(function() {
        //             jdsClient.clearOperationalDataMutableStorage(function(error, response) {
        //                 expect(error).toBeNull();
        //                 expect(val(response, 'statusCode')).toBe(200);
        //                 finished = true;
        //             });
        //         });

        //         waitsFor(function() {
        //             return finished;
        //         }, 10000);
        //     });
        //     it('ensure storage is clear', function() {
        //         var finished = false;
        //         runs(function() {
        //             jdsClient.getOperationalDataMutableCount(function(error, response, result) {
        //                 expect(error).toBeNull();
        //                 expect(val(response, 'statusCode')).toBe(200);
        //                 expect(result).toEqual({
        //                     length: '0'
        //                 });
        //                 finished = true;
        //             });
        //         });
        //         waitsFor(function() {
        //             return finished;
        //         }, 10000);
        //     });
        // });
    });

    describe('Operational Data Sync Status', function() {
        describe('Store sample operational data metastamp', function() {
            var sampleOpDataStamp = {
                'sourceMetaStamp': {
                    'DDDD': {
                        'stampTime': 20141031094920,
                        'domainMetaStamp': {
                            'doc-def': {
                                'domain': 'doc-def',
                                'stampTime': 20141031094920,
                                'itemMetaStamp': {
                                    'urn:va:doc-def:DDDD:1001': {
                                        'stampTime': 20141031094920,
                                    },
                                    'urn:va:doc-def:DDDD:1002': {
                                        'stampTime': 20141031094920,
                                    }
                                }
                            },
                            'pt-select': {
                                'domain': 'pt-select',
                                'stampTime': 20141031094920,
                                'itemMetaStamp': {
                                    'urn:va:pt-select:DDDD:1001': {
                                        'stampTime': 20141031094920,
                                    },
                                    'urn:va:pt-select:DDDD:1002': {
                                        'stampTime': 20141031094920,
                                    }
                                }
                            }
                        }
                    }
                }
            };
            var summaryOpDataStamp = {
                'sourceMetaStamp': {
                    'DDDD': {
                        'stampTime': 20141031094920,
                        'domainMetaStamp': {
                            'doc-def': {
                                'domain': 'doc-def',
                                'stampTime': 20141031094920
                            },
                            'pt-select': {
                                'domain': 'pt-select',
                                'stampTime': 20141031094920
                            }
                        }
                    }
                }
            };
            // var sampleOpDataStamp2 = {
            //     'sourceMetaStamp': {
            //         'EEEE': {
            //             'stampTime': 20141031094920,
            //             'domainMetaStamp': {
            //                 'pt-select': {
            //                     'domain': 'pt-select',
            //                     'stampTime': 20141031094920,
            //                     'itemMetaStamp': {
            //                         'urn:va:pt-select:EEEE:1001': {
            //                             'stampTime': 20141031094920,
            //                         }
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // };

            var storeOperationalSyncStatus = function() {
                var done = false;
                runs(function() {
                    jdsClient.saveOperationalSyncStatus(sampleOpDataStamp, 'DDDD', function(error, response) {
                        expect(error).toBeFalsy();
                        expect(response).toBeTruthy();
                        expect(val(response, 'statusCode')).toBe(200);
                        done = true;
                    });
                });

                waitsFor(function() {
                    return done;
                }, 10000);
            };

            var retrieveOperationalSyncStatus = function() {
                var done = false;
                runs(function() {
                    jdsClient.getOperationalSyncStatus('DDDD', function(error, response, result) {
                        expect(error).toBeFalsy();
                        expect(response).toBeTruthy();
                        expect(val(response, 'statusCode')).toBe(200);
                        expect(result).toBeTruthy();
                        expect(val(result, 'inProgress')).toEqual(summaryOpDataStamp);
                        done = true;
                    });
                });

                waitsFor(function() {
                    return done;
                }, 10000);
            };

            var deleteOperationalSyncStatus = function() {
                var done = false;
                runs(function() {
                    jdsClient.deleteOperationalSyncStatus('DDDD', function(error, response) {
                        expect(error).toBeFalsy();
                        expect(response).toBeTruthy();
                        expect(val(response, 'statusCode')).toBe(200);
                        done = true;
                    });
                });

                waitsFor(function() {
                    return done;
                }, 10000);
            };

            var ensureDeleteOfSyncStatusWasSuccessful = function() {
                var done = false;
                runs(function() {
                    jdsClient.getOperationalSyncStatus('DDDD', function(error, response, result) {
                        expect(error).toBeFalsy();
                        expect(response).toBeTruthy();
                        //expect(val(response, 'statusCode')).toBe(200); //can be 200 or 404 depending on whether other op. data metastamps are already stored
                        expect(val(result, 'inProgress')).toBeFalsy();
                        done = true;
                    });
                });

                waitsFor(function() {
                    return done;
                }, 10000);
            };

            it('store, retrieve, delete operational data metastamp.', function() {
                storeOperationalSyncStatus();
                retrieveOperationalSyncStatus();
                deleteOperationalSyncStatus();
                ensureDeleteOfSyncStatusWasSuccessful();

            });

            // it('store operational data metastamp using saveOperationalSyncstatus()', function() {
            //     var done = false;
            //     runs(function() {
            //         jdsClient.saveOperationalSyncStatus(sampleOpDataStamp, 'DDDD', function(error, response) {
            //             expect(error).toBeFalsy();
            //             expect(response).toBeTruthy();
            //             expect(val(response, 'statusCode')).toBe(200);
            //             done = true;
            //         });
            //     });

            //     waitsFor(function() {
            //         return done;
            //     }, 10000);
            // });

            // it('ensure the data was stored using getOperationalSyncStatus()', function() {
            //     var done = false;
            //     runs(function() {
            //         jdsClient.getOperationalSyncStatus('DDDD', function(error, response, result) {
            //             expect(error).toBeFalsy();
            //             expect(response).toBeTruthy();
            //             expect(val(response, 'statusCode')).toBe(200);
            //             expect(result).toBeTruthy();
            //             expect(val(result, 'inProgress')).toEqual(summaryOpDataStamp);
            //             done = true;
            //         });
            //     });

            //     waitsFor(function() {
            //         return done;
            //     }, 10000);
            // });

            // it('try deleting the data using deleteOperationalSyncStatus()', function() {
            //     var done = false;
            //     runs(function() {
            //         jdsClient.deleteOperationalSyncStatus('DDDD', function(error, response) {
            //             expect(error).toBeFalsy();
            //             expect(response).toBeTruthy();
            //             expect(val(response, 'statusCode')).toBe(200);
            //             done = true;
            //         });
            //     });

            //     waitsFor(function() {
            //         return done;
            //     }, 10000);
            // });

            // it('ensure the data was deleted by using getOperationalSyncStatus again', function() {
            //     var done = false;
            //     runs(function() {
            //         jdsClient.getOperationalSyncStatus('DDDD', function(error, response, result) {
            //             expect(error).toBeFalsy();
            //             expect(response).toBeTruthy();
            //             //expect(val(response, 'statusCode')).toBe(200); //can be 200 or 404 depending on whether other op. data metastamps are already stored
            //             expect(val(result, 'inProgress')).toBeFalsy();
            //             done = true;
            //         });
            //     });

            //     waitsFor(function() {
            //         return done;
            //     }, 10000);
            // });

            // it('store a second operational data metastamp using saveOperationalSyncstatus()', function() {
            //     var done = false;
            //     runs(function() {
            //         jdsClient.saveOperationalSyncStatus(sampleOpDataStamp2, 'EEEE', function(error, response) {
            //             expect(error).toBeFalsy();
            //             expect(response).toBeTruthy();
            //             expect(val(response, 'statusCode')).toBe(200);
            //             done = true;
            //         });
            //     });

            //     waitsFor(function() {
            //         return done;
            //     }, 10000);
            // });

            // it('try deleting all operational data metastamps using clearAllOperationalSyncStatus()', function(){
            //     var done = false;
            //     runs(function(){
            //         jdsClient.clearAllOperationalSyncStatus(function(error, response){
            //             expect(error).toBeFalsy();
            //             expect(response).toBeTruthy();
            //             expect(val(response, 'statusCode')).toBe(200);
            //             done = true;
            //         });
            //     });

            //     waitsFor(function() {
            //         return done;
            //     }, 10000);
            // });

            // it('ensure the data was deleted by using getOperationalSyncStatus yet again', function(){
            //     var done = false;
            //     runs(function(){
            //         jdsClient.getOperationalSyncStatus('EEEE', function(error, response, result){
            //             expect(error).toBeFalsy();
            //             expect(response).toBeTruthy();
            //             //expect(val(response, 'statusCode')).toBe(200); //can be 200 or 404 depending on whether other op. data metastamps are already stored
            //                                                      //in this case, it should always be a 404 since we just cleared all operational data metastamps
            //             expect(val(result, 'inProgress')).toBeFalsy();
            //             done = true;
            //         });
            //     });

            //     waitsFor(function() {
            //         return done;
            //     }, 10000);
            // });
        });
    });


    runs(function() {
        var done = 0;
        deletePatientIdentifiers(function() {
            done++;
        });
    });
});