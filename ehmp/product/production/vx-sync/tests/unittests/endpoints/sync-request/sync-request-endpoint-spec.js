'use strict';

require('../../../../env-setup');

var request = require('request');
var log = require(global.VX_UTILS + 'dummy-logger');
var config = require(global.VX_ROOT + 'worker-config');

var DummyRequest = require(global.VX_ROOT + 'tests/frames/dummy-request');
var DummyResponse = require(global.VX_ROOT + 'tests/frames/dummy-response');

var storedPid;
var DummyJDS = {
    'getPatientIdentifier': jasmine.createSpy().andCallFake(function(job, callback) {
        if (storedPid) {
            callback(null, { 'statusCode': 200 }, { 'jpid': '21EC2020-3AEA-4069-A2DD-FFFFFFFFFFFF' });
        } else {
            callback(404, { 'statusCode': 404 }, 'Patient not found');
        }
    }),
    'storePatientIdentifier': jasmine.createSpy().andCallFake(function(job, callback) {
        var retObj = { 'jpid': '21EC2020-3AEA-4069-A2DD-FFFFFFFFFFFF' };
        storedPid = true;
        callback(null, { 'statusCode': 200 }, retObj);
    })
};
var DummyJSU = {
    'writeStatus': function(job, callback) {
        callback(null, {}, job);
    },
    'createJobStatus': function(job, callback) {
        job.status ='created';
        DummyJSU.writeStatus(job, callback);
    }
};
var env = {
    'jds': DummyJDS,
    'jobStatusUpdater': DummyJSU
};

var PatientIdentifierAPI = require(global.VX_UTILS + 'middleware/patient-identifier-middleware'),
    patientMiddleware = new PatientIdentifierAPI(log, {}, DummyJDS);
var JobAPI = require(global.VX_UTILS + 'middleware/job-middleware'),
    jobMiddleware = new JobAPI(log, {}, env);

var mockIdentifierData = require(global.VX_ROOT + 'mocks/jds/jds-mock-identifier-data');
var mockJobData = require(global.VX_ROOT + 'mocks/jds/jds-mock-job-data');
var mockSyncData = require(global.VX_ROOT + 'mocks/jds/jds-mock-sync-data');

var jobUtil = require(global.VX_UTILS + 'job-utils');

describe('sync-request-endpoint.js', function() {
    describe('doLoadMethods', function() {
        var dummyRouter;
        beforeEach(function() {
            dummyRouter = {
                'publish': jasmine.createSpy().andCallFake(function(job, callback) {
                    callback(null, [ '1' ]);
                })
            };
        });

        xit('Successfully invokes the endpoint for an unknown PID', function() {
            var responseObj = {};

            runs(function() {
                request('http://localhost:8080/sync/doLoad?pid=ABCD;4', function(error, response) {
                    responseObj.status = response.statusCode;
                    responseObj.response = JSON.parse(response.body);
                });
            });

            waitsFor(function() {
                return typeof responseObj.status !== 'undefined';
            });

            runs(function() {
                expect(responseObj.status).toBe(202);
                expect(responseObj.response).toBeDefined();
                expect(responseObj.response.type).toEqual('enterprise-sync-request');
            });
        });

        it('Operates all middleware on a dummy request', function() {
            var request = new DummyRequest({
                'pid': 'ABCD;4'
            });
            var response = new DummyResponse();
            var next = jasmine.createSpy();
            next.andCallFake(function() {
                expect(dummyRouter.publish).toHaveBeenCalled();
            });

            runs(function() {
                patientMiddleware.validatePatientIdentifier(request, response, function() {
                    expect(request.patientIdentifier).toBeDefined();
                    expect(request.patientIdentifier.type).toEqual('pid');
                    expect(request.patientIdentifier.value).toEqual('ABCD;4');
                    expect(response.statusCode).toBeUndefined();
                    patientMiddleware.getJPID(request, response, function() {
                        expect(request.jpid).toBe(false);
                        expect(response.statusCode).toBeUndefined();
                        patientMiddleware.createJPID(request, response, function() {
                            expect(response.statusCode).toBeUndefined();
                            expect(request.jpid).toEqual('21EC2020-3AEA-4069-A2DD-FFFFFFFFFFFF');
                            var jobFactory = function(r) {
                                return jobUtil.createEnterpriseSyncRequest(r.patientIdentifier, r.jpid, r.force);
                            };
                            jobMiddleware.buildJob(jobFactory, request, response, function() {
                                expect(response.job).toBeDefined();
                                expect(response.job.type).toEqual('enterprise-sync-request');
                                expect(response.job.jpid).toEqual('21EC2020-3AEA-4069-A2DD-FFFFFFFFFFFF');
                                expect(response.job.patientIdentifier).toBeDefined();
                                expect(response.job.patientIdentifier.type).toEqual('pid');
                                expect(response.job.patientIdentifier.value).toEqual('ABCD;4');
                                jobMiddleware.jobVerification([ 'completed' ], request, response, function() {
                                    expect(response.currentJob).toBeUndefined();
                                    expect(response.statusCode).toBeUndefined();
                                    jobMiddleware.publishJob(dummyRouter, request, response, next);
                                });
                            });
                        });
                    });
                });
            });

            waitsFor(function() {
                return next.callCount > 0;
            });
        });
    });

    describe('getStatusMethods', function() {
        xit('Successfully invokes the endpoint for a known PID', function() {
            var responseObj = {};

            runs(function() {
                request('http://localhost:8080/sync/status?pid=ABCD;0', function(error, response) {
                    responseObj.status = response.statusCode;
                    responseObj.response = JSON.parse(response.body);
                });
            });

            waitsFor(function() {
                return typeof responseObj.status !== 'undefined';
            });

            runs(function() {
                expect(responseObj.status).toBe(200);
                expect(responseObj.response.syncStatus.data.items[0]).toBeDefined();
                expect(responseObj.response.syncStatus.data.items[0].completedStamp).toBeDefined();
                expect(responseObj.response.jobStatus[0]).toBeDefined();
            });
        });
    });
});