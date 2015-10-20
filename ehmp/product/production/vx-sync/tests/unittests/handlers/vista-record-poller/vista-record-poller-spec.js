'use strict';

//------------------------------------------------------------------------------------
// This file contains unit tests for vista-record-poller.js.
//
// Author: Mike Risher, Les Westberg
//------------------------------------------------------------------------------------

require('../../../../env-setup');

var fs = require('fs');
var path = require('path');
var async = require('async');
var Poller = require(global.VX_HANDLERS + 'vista-record-poller/vista-record-poller');
var PublisherRouterDummy = require(global.VX_JOBFRAMEWORK + 'publisherRouterDummy');
var publisherRouterDummy = new PublisherRouterDummy(dummyLogger, config, PublisherDummy);
var PublisherDummy = require(global.VX_JOBFRAMEWORK + 'publisherDummy');
var dummyLogger = require(global.VX_UTILS + '/dummy-logger');
// dummyLogger = require('bunyan').createLogger({
//     name: 'vista-record-poller-spec',
//     level: 'debug'
// });
var JobStatusUpdater = require(global.VX_JOBFRAMEWORK + 'JobStatusUpdater');
var JdsClientDummy = require(global.VX_SUBSYSTEMS + 'jds/jds-client-dummy');


var config = {
    jds: {
        protocol: 'http',
        host: '10.2.2.110',
        port: 9080
    }
};

var jdsClientDummy = new JdsClientDummy(dummyLogger, config);
var lastUpdateTimeValue = '3150106-1624';
var vistaIdValue = 'C877';
var patientIdentifierValue1 = {
    type: 'pid',
    value: vistaIdValue + ';1'
};
var patientIdentifierValue2 = {
    type: 'pid',
    value: vistaIdValue + ';1'
};
var uidValue = 'urn:va:vprupdate:' + vistaIdValue;

var environment = {
    jobStatusUpdater: {},
    metrics: dummyLogger,
    publisherRouter: publisherRouterDummy,
    jds: jdsClientDummy
};
environment.jobStatusUpdater = new JobStatusUpdater(dummyLogger, config, environment.jds);

var poller = new Poller(dummyLogger, vistaIdValue, config, environment);

var syncStartJobsValue = [{
    collection: 'syncStart',
    pid: vistaIdValue + ';1',
    metaStamp: {
        stampTime: '20150114115126',
        sourceMetaStamp: {
            '9E7A': {
                pid: vistaIdValue + ';1',
                localId: '1',
                stampTime: '20150114115126',
                domainMetaStamp: {
                    'allergy': {
                        domain: 'allergy',
                        stampTime: '20150114115126',
                        eventMetaStamp: {
                            'urn:va:allergy:C877:1:751': {
                                stampTime: '20150114115126'
                            },
                            'urn:va:allergy:C877:1:752': {
                                stampTime: '20150114115126'
                            }
                        }
                    }
                }
            }
        }
    }
}, {
    collection: 'syncStart',
    pid: vistaIdValue + ';2',
    metaStamp: {
        stampTime: '20150114115126',
        sourceMetaStamp: {
            '9E7A': {
                pid: vistaIdValue + ';2',
                localId: '1',
                stampTime: '20150114115126',
                domainMetaStamp: {
                    'allergy': {
                        domain: 'allergy',
                        stampTime: '20150114115126',
                        eventMetaStamp: {
                            'urn:va:allergy:C877:2:300': {
                                stampTime: '20150114115126'
                            },
                            'urn:va:allergy:C877:2:301': {
                                stampTime: '20150114115126'
                            }
                        }
                    }
                }
            }
        }
    }
}];

var OPDsyncStartJobsValue = [{
    'collection': 'OPDsyncStart',
    'systemId': '9E7A',
    'rootJobId': '1',
    'jobId': '3',
    'metaStamp': {
        'stampTime': 20141031094920,
        'sourceMetaStamp': {
            '9E7A': {
                'stampTime': 20141031094920,
                'domainMetaStamp': {
                    'doc-def': {
                        'domain': 'doc-def',
                        'stampTime': 20141031094920,
                        'itemMetaStamp': {
                            'urn:va:doc-def:9E7A:1001': {
                                'stampTime': 20141031094920,
                            },
                            'urn:va:doc-def:9E7A:1002': {
                                'stampTime': 20141031094920,
                            }
                        }
                    },
                    'pt-select': {
                        'domain': 'pt-select',
                        'stampTime': 20141031094920,
                        'itemMetaStamp': {
                            'urn:va:pt-select:9E7A:1001': {
                                'stampTime': 20141031094920,
                            },
                            'urn:va:pt-select:9E7a:1002': {
                                'stampTime': 20141031094920,
                            }
                        }
                    }
                }
            }
        }
    }
}];

var vistaDataJobAllergyObjectWithoutPid = {
    uid: 'urn:va:allergy:9E7A:1:27837'
};

var vistaDataJobAllergyObjectWithPid = {
    pid: vistaIdValue + ';1',
    uid: 'urn:va:allergy:9E7A:1:27837'
};

var vistaDataJobsValue = [{
    collection: 'allergy',
    pid: vistaIdValue + ';1',
    object: vistaDataJobAllergyObjectWithoutPid
}, {
    collection: 'pt-select',
    pid: vistaIdValue + ';2',
    object: {
        pid: vistaIdValue + ';2'
    }
}, {
    collection: 'doc-ref',
    object: {
        data: 'some operational data'
    }
}];

var dataValue = {
    lastUpdate: lastUpdateTimeValue,
    items: []
};
dataValue.items = syncStartJobsValue.concat(vistaDataJobsValue);

var rootJobIdValue = '1';
var jobIdValue = '2';
var jpidValue = '9a6c3294-fe16-4a91-b10b-19f78656fb8c';

describe('vista-record-poller', function() {
    beforeEach(function() {
        // Underlying JDS calls to monitor and make sure that they are made.
        //---------------------------------------------------------------------------
        // spyOn(jdsClientDummy, 'storeOperationalData').andCallThrough();
        // spyOn(jdsClientDummy, 'getOperationalDataByUid').andCallThrough();

        spyOn(jdsClientDummy, 'storeOperationalDataMutable').andCallThrough();
        spyOn(jdsClientDummy, 'getOperationalDataMutable').andCallThrough();

        spyOn(jdsClientDummy, 'saveSyncStatus').andCallThrough();
        spyOn(jdsClientDummy, 'saveOperationalSyncStatus').andCallThrough();
        spyOn(jdsClientDummy, 'getPatientIdentifierByPid').andCallThrough();
        spyOn(jdsClientDummy, 'saveJobState').andCallThrough();
        spyOn(poller, '_processSyncStartJob').andCallThrough();
        spyOn(poller, '_processOPDSyncStartJob').andCallThrough();
        spyOn(poller, '_buildVistaDataJob').andCallThrough();
        spyOn(poller, '_processSyncStartJobs').andCallThrough();
        spyOn(poller, '_processOPDSyncStartJobs').andCallThrough();
        spyOn(poller, '_processVistaDataJobs').andCallThrough();
        spyOn(poller, '_storeLastUpdateTime').andCallThrough();
        spyOn(publisherRouterDummy, 'publish').andCallThrough();
    });

    describe('operational data', function() {
        it('Null Record', function() {
            var record = null;
            expect(Poller._isOperationalData(record)).toBeFalsy();
        });
        it('Empty Items', function() {
            var record = {};
            expect(Poller._isOperationalData(record)).toBeTruthy();
        });
        it('PID Record', function() {
            var record = {
                pid: '1'
            };
            expect(Poller._isOperationalData(record)).toBeFalsy();
        });
        it('Good Operational Record', function() {
            var record = {
                collection: 'patient'
            };
            expect(Poller._isOperationalData(record)).toBeTruthy();
        });
        it('Development Operational Samples', function() {
            //iterates over all sample operational data and confirms that isOperational is true
            var directory = 'tests/data/operational';
            directory = path.resolve(directory);
            fs.readdir(directory, function(err, list) {
                expect(err).toBeFalsy();
                if (err) {
                    return;
                }

                async.eachSeries(list, function(file, callback) {
                    var path = directory + '/' + file;
                    var contents = fs.readFileSync(path);
                    try {
                        contents = JSON.parse(contents);
                        expect(contents).not.toBeUndefined();
                        expect(contents.data).not.toBeUndefined();
                        expect(contents.data.items).not.toBeUndefined();

                        var items = contents.data.items;
                        async.eachSeries(items, function(operationalPayload, callback) {
                            expect(Poller._isOperationalData(operationalPayload)).toBeTruthy();
                            callback();
                        });
                        callback();
                    } catch (e) {
                        expect(e).toBeUndefined();
                        console.log(e);
                        // console.log('could not parse ' +file);x
                        callback(e);
                    }
                });
            });
        });
    });
    describe('_getLastUpdateTimeFromJds', function() {
        it('Happy Path', function() {
            var expectedJdsResponse = {
                statusCode: 200
            };
            var expectedJdsResult = {
                        _id: vistaIdValue,
                        lastUpdate: lastUpdateTimeValue,
                        uid: uidValue
            };
            jdsClientDummy._setResponseData(null, expectedJdsResponse, expectedJdsResult);

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._getLastUpdateTimeFromJds(function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _getLastUpdateTimeFromJds failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeNull();
                expect(actualResponse).toEqual(lastUpdateTimeValue);
                expect(jdsClientDummy.getOperationalDataMutable.calls.length).toEqual(1);
                expect(jdsClientDummy.getOperationalDataMutable).toHaveBeenCalledWith(vistaIdValue, jasmine.any(Function));
            });
        });
    });
    describe('_storeLastUpdateTimeToJds', function() {
        it('Happy Path', function() {
            var expectedJdsResponse = {
                statusCode: 200
            };
            jdsClientDummy._setResponseData(null, expectedJdsResponse, undefined);

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._storeLastUpdateTimeToJds(lastUpdateTimeValue, function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _storeLastUpdateTimeToJds failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeNull();
                expect(actualResponse).toEqual('success');
                expect(jdsClientDummy.storeOperationalDataMutable.calls.length).toEqual(1);
                expect(jdsClientDummy.storeOperationalDataMutable).toHaveBeenCalledWith(jasmine.objectContaining({
                    _id: vistaIdValue,
                    lastUpdate: lastUpdateTimeValue,
                    uid: uidValue
                }), jasmine.any(Function));
            });
        });
    });
    describe('_storeLastUpdateTime', function() {
        it('Happy Path', function() {
            var expectedJdsResponse = {
                statusCode: 200
            };
            jdsClientDummy._setResponseData(null, expectedJdsResponse, undefined);

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._storeLastUpdateTime(dataValue, function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _storeLastUpdateTime failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeNull();
                expect(actualResponse).toEqual('success');
                expect(jdsClientDummy.storeOperationalDataMutable.calls.length).toEqual(1);
                expect(jdsClientDummy.storeOperationalDataMutable).toHaveBeenCalledWith(jasmine.objectContaining({
                    _id: vistaIdValue,
                    lastUpdate: lastUpdateTimeValue,
                    uid: uidValue
                }), jasmine.any(Function));
            });
        });
        it('Missing lastUpdateField', function() {
            var expectedJdsResponse = {
                statusCode: 200
            };
            jdsClientDummy._setResponseData(null, expectedJdsResponse, undefined);

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._storeLastUpdateTime({}, function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _storeLastUpdateTime failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeNull();
                expect(actualResponse).toEqual('success');
                expect(jdsClientDummy.storeOperationalDataMutable.calls.length).toEqual(0);
            });
        });
    });
    describe('_processSyncStartJobs', function() {
        it('Happy Path', function() {
            var expectedJdsResponse = {
                statusCode: 201
            };
            jdsClientDummy._setResponseData(null, expectedJdsResponse, undefined);

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._processSyncStartJobs(syncStartJobsValue, function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _processSyncStartJobs failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeFalsy();
                expect(actualResponse).toBeTruthy();
                expect(poller._processSyncStartJob.calls.length).toEqual(syncStartJobsValue.length);
                expect(poller._processSyncStartJob).toHaveBeenCalledWith(jasmine.objectContaining(syncStartJobsValue[0]), jasmine.any(Function));
                expect(poller._processSyncStartJob).toHaveBeenCalledWith(jasmine.objectContaining(syncStartJobsValue[1]), jasmine.any(Function));
            });
        });
        it('No syncStartJobs', function() {
            var expectedJdsResponse = {
                statusCode: 201
            };
            jdsClientDummy._setResponseData(null, expectedJdsResponse, undefined);

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._processSyncStartJobs(null, function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _processSyncStartJobs failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeFalsy();
                expect(actualResponse).toEqual('');
                expect(poller._processSyncStartJob.calls.length).toEqual(0);
            });
        });
    });

    //processOPDSyncStartJobs
    describe('_processOPDSyncStartJobs', function(){
            it('Happy Path', function() {
            var expectedJdsResponse = {
                statusCode: 201
            };
            jdsClientDummy._setResponseData(null, expectedJdsResponse, undefined);

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._processOPDSyncStartJobs(OPDsyncStartJobsValue, function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _OPDprocessSyncStartJobs failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeFalsy();
                expect(actualResponse).toBeTruthy();
                expect(poller._processOPDSyncStartJob.calls.length).toEqual(OPDsyncStartJobsValue.length);
                expect(poller._processOPDSyncStartJob).toHaveBeenCalledWith(jasmine.objectContaining(OPDsyncStartJobsValue[0]), jasmine.any(Function));
                expect(poller._processOPDSyncStartJob).toHaveBeenCalledWith(jasmine.objectContaining(OPDsyncStartJobsValue[1]), jasmine.any(Function));
            });
        });
        it('No OPDsyncStartJobs', function() {
            var expectedJdsResponse = {
                statusCode: 201
            };
            jdsClientDummy._setResponseData(null, expectedJdsResponse, undefined);

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._processSyncStartJobs(null, function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _processOPDSyncStartJobs failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeFalsy();
                expect(actualResponse).toEqual('');
                expect(poller._processSyncStartJob.calls.length).toEqual(0);
            });
        });
    });

    describe('_processSyncStartJob', function() {
        it('Happy Path', function() {
            var expectedJdsResponse = {
                statusCode: 200
            };
            jdsClientDummy._setResponseData(null, expectedJdsResponse, undefined);

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._processSyncStartJob(syncStartJobsValue[0], function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _processSyncStartJobs failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeFalsy();
                expect(actualResponse).toBeTruthy();
                expect(jdsClientDummy.saveSyncStatus.calls.length).toEqual(1);
                expect(jdsClientDummy.saveSyncStatus).toHaveBeenCalledWith(syncStartJobsValue[0].metaStamp, patientIdentifierValue1, jasmine.any(Function));
            });
        });
        it('No pid', function() {
            var syncStartJobNoPid = {
                collection: 'syncStart',
                metaStamp: {
                    stampTime: '20150114115126',
                    sourceMetaStamp: {
                        '9E7A': {
                            pid: vistaIdValue + ';1',
                            localId: '1',
                            stampTime: '20150114115126',
                            domainMetaStamp: {
                                'allergy': {
                                    domain: 'allergy',
                                    stampTime: '20150114115126',
                                    eventMetaStamp: {
                                        'urn:va:allergy:C877:1:751': {
                                            stampTime: '20150114115126'
                                        },
                                        'urn:va:allergy:C877:1:752': {
                                            stampTime: '20150114115126'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };
            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._processSyncStartJob(syncStartJobNoPid, function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _processSyncStartJobs failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeNull();
                expect(actualResponse).toBe('FailedNoPid');
                expect(jdsClientDummy.saveSyncStatus.calls.length).toEqual(0);
            });
        });
        it('No metaStamp', function() {
            var syncStartJobNoPid = {
                collection: 'syncStart',
                pid: vistaIdValue + ';1'
            };
            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._processSyncStartJob(syncStartJobNoPid, function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _processSyncStartJob failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeNull();
                expect(actualResponse).toBe(null);
                expect(jdsClientDummy.saveSyncStatus.calls.length).toEqual(0);
            });
        });
    });

    describe('_processOPDSyncStartJob', function(){
        it('Happy Path', function() {
            var expectedJdsResponse = {
                statusCode: 200
            };
            //var jdsClientDummy = new JdsClientDummy(dummyLogger, config);
            jdsClientDummy._setResponseData(null, expectedJdsResponse, undefined);
            //spyOn(jdsClientDummy, 'saveOperationalSyncStatus').andCallThrough();

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._processOPDSyncStartJob(OPDsyncStartJobsValue[0], function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _processSyncStartJobs failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeFalsy();
                expect(actualResponse).toBeTruthy();
                expect(jdsClientDummy.saveOperationalSyncStatus.calls.length).toEqual(1);
                expect(jdsClientDummy.saveOperationalSyncStatus).toHaveBeenCalledWith(OPDsyncStartJobsValue[0].metaStamp, '9E7A', jasmine.any(Function));
            });
        });

        it('No metaStamp', function() {
            var OPDsyncStartJobNoStamp = {
                collection: 'OPDsyncStart',
                systemId: '9E7A'
            };
            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._processOPDSyncStartJob(OPDsyncStartJobNoStamp, function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _processOPDSyncStartJob failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeNull();
                expect(actualResponse).toBe('FailedNoMetaStamp');
                expect(jdsClientDummy.saveOperationalSyncStatus.calls.length).toEqual(0);
            });
        });
    });

    describe('_storeMetaStamp', function() {
        it('Happy Path', function() {
            var expectedJdsResponse = {
                statusCode: 200
            };
            jdsClientDummy._setResponseData(null, expectedJdsResponse, undefined);

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._storeMetaStamp(syncStartJobsValue[0].metaStamp, patientIdentifierValue1, function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _storeMetaStamp failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeFalsy();
                expect(actualResponse).toBeTruthy();
                expect(jdsClientDummy.saveSyncStatus.calls.length).toEqual(1);
                expect(jdsClientDummy.saveSyncStatus).toHaveBeenCalledWith(syncStartJobsValue[0].metaStamp, patientIdentifierValue1, jasmine.any(Function));
            });
        });
        it('Error From JDS', function() {
            jdsClientDummy._setResponseData('Error occurred.', null, undefined);

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._storeMetaStamp(syncStartJobsValue[0].metaStamp, patientIdentifierValue1, function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _storeMetaStamp failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeNull();
                expect(actualResponse).toBe('FailedJdsError');
                expect(jdsClientDummy.saveSyncStatus.calls.length).toEqual(1);
                expect(jdsClientDummy.saveSyncStatus).toHaveBeenCalledWith(syncStartJobsValue[0].metaStamp, patientIdentifierValue1, jasmine.any(Function));
            });
        });
        it('No response From JDS', function() {
            jdsClientDummy._setResponseData(null, null, undefined);

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._storeMetaStamp(syncStartJobsValue[0].metaStamp, patientIdentifierValue1, function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _storeMetaStamp failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeNull();
                expect(actualResponse).toBe('FailedJdsNoResponse');
                expect(jdsClientDummy.saveSyncStatus.calls.length).toEqual(1);
                expect(jdsClientDummy.saveSyncStatus).toHaveBeenCalledWith(syncStartJobsValue[0].metaStamp, patientIdentifierValue1, jasmine.any(Function));
            });
        });
        it('Incorrect status code response From JDS', function() {
            var expectedJdsResponse = {
                statusCode: 404
            };
            jdsClientDummy._setResponseData(null, expectedJdsResponse, undefined);

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._storeMetaStamp(syncStartJobsValue[0].metaStamp, patientIdentifierValue1, function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _storeMetaStamp failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeNull();
                expect(actualResponse).toBe('FailedJdsWrongStatusCode');
                expect(jdsClientDummy.saveSyncStatus.calls.length).toEqual(1);
                expect(jdsClientDummy.saveSyncStatus).toHaveBeenCalledWith(syncStartJobsValue[0].metaStamp, patientIdentifierValue1, jasmine.any(Function));
            });
        });
    });

    //_storeOperationalMetastamp

    describe('_storeOperationalMetastamp', function() {
         it('Happy Path', function() {
            var expectedJdsResponse = {
                statusCode: 200
            };
            jdsClientDummy._setResponseData(null, expectedJdsResponse, undefined);

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._storeOperationalMetaStamp(OPDsyncStartJobsValue[0].metaStamp, '9E7A', function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _storeOperationalMetaStamp failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeFalsy();
                expect(actualResponse).toBeTruthy();
                expect(jdsClientDummy.saveOperationalSyncStatus.calls.length).toEqual(1);
                expect(jdsClientDummy.saveOperationalSyncStatus).toHaveBeenCalledWith(OPDsyncStartJobsValue[0].metaStamp, '9E7A', jasmine.any(Function));
            });
        });
        it('Error From JDS', function() {
            jdsClientDummy._setResponseData('Error occurred.', null, undefined);

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._storeOperationalMetaStamp(OPDsyncStartJobsValue[0].metaStamp, '9E7A', function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _storeOperationalMetaStamp failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeNull();
                expect(actualResponse).toBe('FailedJdsError');
                expect(jdsClientDummy.saveOperationalSyncStatus.calls.length).toEqual(1);
                expect(jdsClientDummy.saveOperationalSyncStatus).toHaveBeenCalledWith(OPDsyncStartJobsValue[0].metaStamp, '9E7A', jasmine.any(Function));
            });
        });
        it('No response From JDS', function() {
            jdsClientDummy._setResponseData(null, null, undefined);

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._storeOperationalMetaStamp(OPDsyncStartJobsValue[0].metaStamp, '9E7A', function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _storeMetaStamp failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeNull();
                expect(actualResponse).toBe('FailedJdsNoResponse');
                expect(jdsClientDummy.saveOperationalSyncStatus.calls.length).toEqual(1);
                expect(jdsClientDummy.saveOperationalSyncStatus).toHaveBeenCalledWith(OPDsyncStartJobsValue[0].metaStamp, '9E7A', jasmine.any(Function));
            });
        });
        it('Incorrect status code response From JDS', function() {
            var expectedJdsResponse = {
                statusCode: 404
            };
            jdsClientDummy._setResponseData(null, expectedJdsResponse, undefined);

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._storeOperationalMetaStamp(OPDsyncStartJobsValue[0].metaStamp, '9E7A', function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _storeMetaStamp failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeNull();
                expect(actualResponse).toBe('FailedJdsWrongStatusCode');
                expect(jdsClientDummy.saveOperationalSyncStatus.calls.length).toEqual(1);
                expect(jdsClientDummy.saveOperationalSyncStatus).toHaveBeenCalledWith(OPDsyncStartJobsValue[0].metaStamp, '9E7A', jasmine.any(Function));
            });
        });
    });

    describe('_storeCompletedJob', function() {
        it('Happy Path', function() {
            dummyLogger.debug('**************** starting _storeCompletedJob:Happy Path ***************************');
            var expectedJdsResponses = [{
                statusCode: 200
            }, {
                statusCode: 200
            }];

            var expectedJdsResults = [{
                jpid: jpidValue
            }, undefined];
            jdsClientDummy._setResponseData([null, null], expectedJdsResponses, expectedJdsResults);

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._storeCompletedJob(rootJobIdValue, jobIdValue, patientIdentifierValue1, function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _storeCompletedJob failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeFalsy();
                expect(actualResponse).toBeTruthy();
                expect(jdsClientDummy.getPatientIdentifierByPid.calls.length).toEqual(1);
                expect(jdsClientDummy.getPatientIdentifierByPid).toHaveBeenCalledWith(patientIdentifierValue1.value, jasmine.any(Function));
                expect(jdsClientDummy.saveJobState.calls.length).toEqual(1);
                expect(jdsClientDummy.saveJobState).toHaveBeenCalledWith({
                        type: 'vista-C877-data-poller',
                        patientIdentifier: patientIdentifierValue1,
                        jpid: jpidValue,
                        rootJobId: rootJobIdValue,
                        jobId: jobIdValue,
                        status: 'completed',
                        timestamp: jasmine.any(String)
                    },
                    jasmine.any(Function));
                dummyLogger.debug('**************** ending _storeCompletedJob:Happy Path ***************************');
            });
        });
        it('Error From JDS on first call.', function() {
            jdsClientDummy._setResponseData(['Error occurred.'], [null], [undefined]);

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._storeCompletedJob(rootJobIdValue, jobIdValue, patientIdentifierValue1, function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _storeCompletedJob failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeNull();
                expect(actualResponse).toBe('FailedJdsError');
                expect(jdsClientDummy.getPatientIdentifierByPid.calls.length).toEqual(1);
                expect(jdsClientDummy.getPatientIdentifierByPid).toHaveBeenCalledWith(patientIdentifierValue1.value, jasmine.any(Function));
                expect(jdsClientDummy.saveJobState.calls.length).toEqual(0);
            });
        });
        it('No response From JDS on first call', function() {
            jdsClientDummy._setResponseData([null], [null], [undefined]);

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._storeCompletedJob(rootJobIdValue, jobIdValue, patientIdentifierValue1, function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _storeCompletedJob failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeNull();
                expect(actualResponse).toBe('FailedJdsNoResponse');
                expect(jdsClientDummy.getPatientIdentifierByPid.calls.length).toEqual(1);
                expect(jdsClientDummy.getPatientIdentifierByPid).toHaveBeenCalledWith(patientIdentifierValue1.value, jasmine.any(Function));
                expect(jdsClientDummy.saveJobState.calls.length).toEqual(0);
            });
        });
        it('Incorrect status code response From JDS on first call', function() {
            var expectedJdsResponse = {
                statusCode: 404
            };
            jdsClientDummy._setResponseData([null], [expectedJdsResponse], [undefined]);

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._storeCompletedJob(rootJobIdValue, jobIdValue, patientIdentifierValue1, function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _storeCompletedJob failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeNull();
                expect(actualResponse).toBe('FailedJdsWrongStatusCode');
                expect(jdsClientDummy.getPatientIdentifierByPid.calls.length).toEqual(1);
                expect(jdsClientDummy.getPatientIdentifierByPid).toHaveBeenCalledWith(patientIdentifierValue1.value, jasmine.any(Function));
                expect(jdsClientDummy.saveJobState.calls.length).toEqual(0);
            });
        });
        it('Error from JDS on second call (when storing job)', function() {
            var expectedJdsResponses = [{
                statusCode: 200
            }, {
                statusCode: 200
            }];

            var expectedJdsResults = [{
                jpid: jpidValue
            }, undefined];
            jdsClientDummy._setResponseData([null, 'JDSErrorOccurred'], expectedJdsResponses, expectedJdsResults);
            dummyLogger.debug('SetResponseData...');

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                dummyLogger.debug('calling _storeCompletedJob...');
                poller._storeCompletedJob(rootJobIdValue, jobIdValue, patientIdentifierValue1, function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _storeCompletedJob failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeFalsy();
                expect(actualResponse).toBe('FailedJdsError');
                expect(jdsClientDummy.getPatientIdentifierByPid.calls.length).toEqual(1);
                expect(jdsClientDummy.getPatientIdentifierByPid).toHaveBeenCalledWith(patientIdentifierValue1.value, jasmine.any(Function));
                expect(jdsClientDummy.saveJobState.calls.length).toEqual(1);
                expect(jdsClientDummy.saveJobState).toHaveBeenCalledWith({
                        type: 'vista-C877-data-poller',
                        patientIdentifier: patientIdentifierValue1,
                        jpid: jpidValue,
                        rootJobId: rootJobIdValue,
                        jobId: jobIdValue,
                        status: 'completed',
                        timestamp: jasmine.any(String)
                    },
                    jasmine.any(Function));
            });
        });
        it('JDS error no response on second call (when storing job)', function() {
            var expectedJdsResponses = [{
                statusCode: 200
            }, undefined];

            var expectedJdsResults = [{
                jpid: jpidValue
            }, undefined];
            jdsClientDummy._setResponseData([null, null], expectedJdsResponses, expectedJdsResults);
            dummyLogger.debug('SetResponseData...');

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                dummyLogger.debug('calling _storeCompletedJob...');
                poller._storeCompletedJob(rootJobIdValue, jobIdValue, patientIdentifierValue1, function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _storeCompletedJob failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeFalsy();
                expect(actualResponse).toBe('FailedJdsNoResponse');
                expect(jdsClientDummy.getPatientIdentifierByPid.calls.length).toEqual(1);
                expect(jdsClientDummy.getPatientIdentifierByPid).toHaveBeenCalledWith(patientIdentifierValue1.value, jasmine.any(Function));
                expect(jdsClientDummy.saveJobState.calls.length).toEqual(1);
                expect(jdsClientDummy.saveJobState).toHaveBeenCalledWith({
                        type: 'vista-C877-data-poller',
                        patientIdentifier: patientIdentifierValue1,
                        jpid: jpidValue,
                        rootJobId: rootJobIdValue,
                        jobId: jobIdValue,
                        status: 'completed',
                        timestamp: jasmine.any(String)
                    },
                    jasmine.any(Function));
            });
        });
        it('JDS error incorrect status code on second call (when storing job)', function() {
            var expectedJdsResponses = [{
                statusCode: 200
            }, {
                statusCode: 404
            }];

            var expectedJdsResults = [{
                jpid: jpidValue
            }, undefined];
            jdsClientDummy._setResponseData([null, null], expectedJdsResponses, expectedJdsResults);
            dummyLogger.debug('SetResponseData...');

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                dummyLogger.debug('calling _storeCompletedJob...');
                poller._storeCompletedJob(rootJobIdValue, jobIdValue, patientIdentifierValue1, function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _storeCompletedJob failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeFalsy();
                expect(actualResponse).toBe('FailedJdsWrongStatusCode');
                expect(jdsClientDummy.getPatientIdentifierByPid.calls.length).toEqual(1);
                expect(jdsClientDummy.getPatientIdentifierByPid).toHaveBeenCalledWith(patientIdentifierValue1.value, jasmine.any(Function));
                expect(jdsClientDummy.saveJobState.calls.length).toEqual(1);
                expect(jdsClientDummy.saveJobState).toHaveBeenCalledWith({
                        type: 'vista-C877-data-poller',
                        patientIdentifier: patientIdentifierValue1,
                        jpid: jpidValue,
                        rootJobId: rootJobIdValue,
                        jobId: jobIdValue,
                        status: 'completed',
                        timestamp: jasmine.any(String)
                    },
                    jasmine.any(Function));
            });
        });

    });

    describe('_processVistaDataJobs', function() {
        it('Happy Path', function() {
            var expectedJdsResponse = {
                statusCode: 201
            };
            jdsClientDummy._setResponseData(null, expectedJdsResponse, undefined);

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._processVistaDataJobs(vistaDataJobsValue, function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _processSyncStartJobs failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeFalsy();
                expect(actualResponse).toBeTruthy();
                expect(poller._buildVistaDataJob.calls.length).toEqual(vistaDataJobsValue.length);
                expect(poller._buildVistaDataJob).toHaveBeenCalledWith(jasmine.objectContaining(vistaDataJobsValue[0]));
                expect(poller._buildVistaDataJob).toHaveBeenCalledWith(jasmine.objectContaining(vistaDataJobsValue[1]));
                expect(poller._buildVistaDataJob).toHaveBeenCalledWith(jasmine.objectContaining(vistaDataJobsValue[3]));
                expect(publisherRouterDummy.publish.calls.length).toEqual(1);
                // I do not really like that this test requires the order to be this way.  I could not find a way to
                // allow for any order.  But with the way the code is working - order should be preserved - so this will
                // work.
                //--------------------------------------------------------------------------------------------------------
                expect(publisherRouterDummy.publish).toHaveBeenCalledWith([
                        jasmine.objectContaining({
                            type: 'vista-prioritization-request',
                            patientIdentifier: {
                                type: 'pid',
                                value: 'C877;1'
                            },
                            jpid: jasmine.any(String),
                            dataDomain: 'allergy',
                            record: {
                                pid: 'C877;1',
                                uid: 'urn:va:allergy:9E7A:1:27837'
                            }
                        }),
                        jasmine.objectContaining({
                            type: 'operational-store-record',
                            jpid: jasmine.any(String),
                            record: {
                                pid: 'C877;2'
                            }
                        }),
                        jasmine.objectContaining({
                            type: 'operational-store-record',
                            jpid: jasmine.any(String),
                            record: {
                                data: 'some operational data'
                            }
                        })
                    ],
                    jasmine.any(Function));
            });
        });
        it('No vistaDataJobs', function() {
            var expectedJdsResponse = {
                statusCode: 201
            };
            jdsClientDummy._setResponseData(null, expectedJdsResponse, undefined);

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._processVistaDataJobs(null, function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _processVistaDataJobs failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeFalsy();
                expect(actualResponse).toEqual('');
                expect(poller._buildVistaDataJob.calls.length).toEqual(0);
                expect(publisherRouterDummy.publish.calls.length).toEqual(0);
            });
        });
    });
    describe('_buildVistaDataJob', function() {
        it('Patient Data Job', function() {
            var job = poller._buildVistaDataJob(vistaDataJobsValue[0]);

            expect(job).toBeTruthy();
            expect(job).toEqual(jasmine.objectContaining({
                type: 'vista-prioritization-request',
                patientIdentifier: {
                    type: 'pid',
                    value: 'C877;1'
                },
                jpid: jasmine.any(String),
                dataDomain: 'allergy',
                record: {
                    pid: 'C877;1',
                    uid: 'urn:va:allergy:9E7A:1:27837'
                }
            }));
        });
        it('Operational Data pt-select', function() {
            var job = poller._buildVistaDataJob(vistaDataJobsValue[1]);

            expect(job).toBeTruthy();
            expect(job).toEqual(jasmine.objectContaining({
                type: 'operational-store-record',
                jpid: jasmine.any(String),
                record: {
                    pid: 'C877;2'
                }
            }));
        });
        it('Operational Data other', function() {
            var job = poller._buildVistaDataJob(vistaDataJobsValue[2]);

            expect(job).toBeTruthy();
            expect(job).toEqual(jasmine.objectContaining({
                type: 'operational-store-record',
                jpid: jasmine.any(String),
                record: {
                    data: 'some operational data'
                }
            }));
        });
    });
    describe('_processBatch', function() {
        it('Happy Path', function() {
            var expectedJdsResponse = {
                statusCode: 200
            };
            jdsClientDummy._setResponseData(null, expectedJdsResponse, undefined);

            var finished = false;
            var actualError;
            var actualResponse;
            runs(function() {
                poller._processBatch(dataValue, function(error, response) {
                    actualError = error;
                    actualResponse = response;
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call to _processSyncStartJobs failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeFalsy();
                expect(actualResponse).toBeTruthy();
                expect(poller._processSyncStartJobs.calls.length).toEqual(1);
                expect(poller._processVistaDataJobs.calls.length).toEqual(1);
                expect(poller._storeLastUpdateTime.calls.length).toEqual(1);
                expect(poller._processSyncStartJobs).toHaveBeenCalledWith(syncStartJobsValue, jasmine.any(Function));
                expect(poller._processVistaDataJobs).toHaveBeenCalledWith(vistaDataJobsValue, jasmine.any(Function));
                expect(poller._storeLastUpdateTime).toHaveBeenCalledWith(dataValue, jasmine.any(Function));
            });
        });
    });
});