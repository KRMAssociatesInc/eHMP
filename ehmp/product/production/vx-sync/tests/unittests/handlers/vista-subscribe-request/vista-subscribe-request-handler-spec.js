'use strict';

require('../../../../env-setup');
var VistaSubscribeRequestHandler = require(global.VX_HANDLERS + 'vista-subscribe-request/vista-subscribe-request-handler');
var VistaClientDummy = require(global.VX_SUBSYSTEMS + 'vista/vista-client-dummy');
var dummyLogger = require(global.VX_UTILS + '/dummy-logger');
var jobStatusUpdaterDummy = require(global.VX_JOBFRAMEWORK + '/JobStatusUpdaterDummy');
var idUtil = require(global.VX_UTILS + 'patient-identifier-utils');
var jobUtil = require(global.VX_UTILS + 'job-utils');

var config = {
    'vistaSites': {
        '9E7A': {
            'name': 'panorama',
            'host': '10.2.2.101',
            'port': 9210,
            'accessCode': 'pu1234',
            'verifyCode': 'pu1234!!',
            'localIP': '127.0.0.1',
            'localAddress': 'localhost',
            'connectTimeout': 3000,
            'sendTimeout': 10000
        },
        'C877': {
            'name': 'kodak',
            'host': '10.2.2.102',
            'port': 9210,
            'accessCode': 'pu1234',
            'verifyCode': 'pu1234!!',
            'localIP': '127.0.0.1',
            'localAddress': 'localhost',
            'connectTimeout': 3000,
            'sendTimeout': 10000
        }
    }
};

var environment = {
    vistaClient: new VistaClientDummy(dummyLogger, config, null),
    jobStatusUpdater: jobStatusUpdaterDummy
};

var vistaId = '9E7A';
var pidSite = '9E7A';
var pid = pidSite + ';3';
var patientIdentifier = idUtil.create('pid', pid);
var jobId = '2';
var rootJobId = '1';
var pollerJobId = '3';
var meta = {
    jobId : jobId,
    rootJobId: rootJobId,
    jpid: '21EC2020-3AEA-4069-A2DD-FFFFFFFFFFFF'
};
var job = jobUtil.createVistaSubscribeRequest(vistaId, patientIdentifier, meta);

//--------------------------------------------------------------------------------------------------
// Overall plan on this class is to test each individual step and make sure that the appropriate
// JDS functions are called as well as the RPC functions are called with the appropriate values.
// One final test verifies that the entire set of steps all make the appropriate calls.
//-------------------------------------------------------------------------------------------------

describe('vista-subscribe-request-handler.js', function() {
    beforeEach(function() {
        // Underlying JDS and RPC calls to monitor and make sure that they are made.
        //---------------------------------------------------------------------------
        spyOn(jobStatusUpdaterDummy, 'startJobStatus').andCallThrough();
        spyOn(jobStatusUpdaterDummy, 'createJobStatus').andCallThrough();
        spyOn(jobStatusUpdaterDummy, 'completeJobStatus').andCallThrough();
        spyOn(environment.vistaClient, 'subscribe').andCallThrough();
    });
    describe('_validateParameters()', function() {
        it('Happy Path', function() {
            var actualError;
            var actualResponse;
            var called = false;
            VistaSubscribeRequestHandler._validateParameters(vistaId, pidSite, pid, dummyLogger, function(error, response) {
                actualError = error;
                actualResponse = response;
                called = true;
            });

            waitsFor(function() {
                return called;
            }, 'Call to _setJobStatusToStarted failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeNull();
                expect(actualResponse).toBeTruthy();
            });
        });

        it('Error Path', function() {
            var actualError;
            var actualResponse;
            var called = false;
            VistaSubscribeRequestHandler._validateParameters('C877', pidSite, pid, dummyLogger, function(error, response) {
                actualError = error;
                actualResponse = response;
                called = true;
            });

            waitsFor(function() {
                return called;
            }, 'Call to _setJobStatusToStarted failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeTruthy();
                expect(actualResponse).toBeNull();
            });
        });
    });

    describe('_createNewJobStatus()', function() {
        it('Happy Path', function() {
            var actualError;
            var actualResponse;
            var called = false;
            VistaSubscribeRequestHandler._createNewJobStatus(vistaId, pidSite, pid, job, pollerJobId, environment.jobStatusUpdater, dummyLogger, function(error, response) {
                actualError = error;
                actualResponse = response;
                called = true;
            });

            waitsFor(function() {
                return called;
            }, 'Call to _setJobStatusToStarted failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeNull();
                expect(jobStatusUpdaterDummy.createJobStatus.calls.length).toEqual(1);
                expect(jobStatusUpdaterDummy.createJobStatus).toHaveBeenCalledWith(jasmine.objectContaining({
                    type : 'vista-9E7A-data-poller',
                    patientIdentifier : { type : 'pid', value : pid },
                    jpid : meta.jpid,
                    rootJobId : rootJobId,
                    jobId : jasmine.any(String)
                }), jasmine.any(Function));
            });
        });
    });

    describe('_subscribePatientToVistA()', function() {
        it('Happy Path', function() {
            var actualError;
            var actualResponse;
            var called = false;
            VistaSubscribeRequestHandler._subscribePatientToVistA(vistaId, pidSite, pid, job, pollerJobId, environment.vistaClient, dummyLogger, function(error, response) {
                actualError = error;
                actualResponse = response;
                called = true;
            });

            waitsFor(function() {
                return called;
            }, 'Call to _setJobStatusToStarted failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeNull();
                expect(environment.vistaClient.subscribe.calls.length).toEqual(1);
                expect(environment.vistaClient.subscribe).toHaveBeenCalledWith(vistaId, { type : 'pid', value : pid }, rootJobId, pollerJobId, jasmine.any(Function));
            });
        });
    });

    describe('handle()', function() {
        it('Happy Path', function() {
            var actualError;
            var actualResponse;
            var called = false;
            VistaSubscribeRequestHandler.handle(vistaId, dummyLogger, config, environment, job, function(error, response) {
                actualError = error;
                actualResponse = response;
                called = true;
            });

            waitsFor(function() {
                return called;
            }, 'Call to handle failed to return in time.', 500);

            runs(function() {
                expect(actualError).toBeFalsy();
                expect(actualResponse).toBeTruthy();


                // _createNewJobStatus was called
                //--------------------------------
                expect(jobStatusUpdaterDummy.createJobStatus.calls.length).toEqual(1);
                expect(jobStatusUpdaterDummy.createJobStatus).toHaveBeenCalledWith(jasmine.objectContaining({
                    type : 'vista-9E7A-data-poller',
                    patientIdentifier : { type : 'pid', value : pid },
                    jpid : meta.jpid,
                    rootJobId : rootJobId,
                    jobId : jasmine.any(String)
                }), jasmine.any(Function));

                // _subscribePatientToVistA was called
                //-------------------------------------
                expect(environment.vistaClient.subscribe.calls.length).toEqual(1);
                expect(environment.vistaClient.subscribe).toHaveBeenCalledWith(vistaId, { type : 'pid', value : pid }, rootJobId, jasmine.any(String), jasmine.any(Function));

            });
        });
    });


});