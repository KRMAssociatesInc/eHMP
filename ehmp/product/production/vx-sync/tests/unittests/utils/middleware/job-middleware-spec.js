'use strict';

require('../../../../env-setup');

var _ = require('underscore');

var log = require(global.VX_UTILS + 'dummy-logger');

var DummyRequest = require('../../../frames/dummy-request');
var DummyResponse = require('../../../frames/dummy-response');

var mockJobData = require(global.VX_ROOT + 'mocks/jds/jds-mock-job-data');
var mockSyncData = require(global.VX_ROOT + 'mocks/jds/jds-mock-sync-data');

var JobAPI = require(global.VX_UTILS + 'middleware/job-middleware');

var options = { 'log': log, 'config': {}, 'jdsClient': {}, 'jobStatusUpdater': {} };

var buildJob = JobAPI._test._buildJob;
var getJobHistory = JobAPI._test._getJobHistory;
var getSyncStatus = JobAPI._test._getSyncStatus;
var jobVerification = JobAPI._test._jobVerification;
var interceptUnforcedJobs = JobAPI._test._interceptUnforcedJobs;
var publishJob = JobAPI._test._publishJob;

var jobUtil = require(global.VX_UTILS + 'job-utils');

describe('middleware/job.js', function() {
    describe('buildJob()', function() {
        it('Builds an enterprise-sync-request job from a valid request', function() {
            var request = new DummyRequest({
                'pid': 'ABCD;0'
            });
            request.jpid = '21EC2020-3AEA-4069-A2DD-08002B30309D';
            request.patientIdentifier = {
                'type': 'pid',
                'value': 'ABCD;0'
            };
            var response = new DummyResponse();
            var jobFactory = function(r) {
                return jobUtil.createEnterpriseSyncRequest(r.patientIdentifier, r.jpid, r.force);
            };
            buildJob.call(options, jobFactory, request, response, function() {});
            expect(response.job).toBeDefined();
            expect(response.job.type).toEqual('enterprise-sync-request');
            expect(response.job.jpid).toEqual('21EC2020-3AEA-4069-A2DD-08002B30309D');
            expect(response.job.patientIdentifier.type).toEqual('pid');
            expect(response.job.patientIdentifier.value).toEqual('ABCD;0');
        });
    });

    describe('getJobHistory()', function() {
        var opts = _.clone(options);
        beforeEach(function() {
            opts.jdsClient.getJobStatus = jasmine.createSpy().andCallFake(function(job, callback) {
                callback(null, {}, { 'items': mockJobData(1)[job.jpid] });
            });
        });

        it('Retrieves the job history for a known JPID', function() {
            var request = new DummyRequest({
                'pid': 'ABCD;3'
            });
            request.jpid = '21EC2020-3AEA-4069-A2DD-CCCCCCCCCCCC';
            request.patientIdentifier = {
                'type': 'pid',
                'value': 'ABCD;3'
            };
            var response = new DummyResponse();
            response.job = {
                'type': 'enterprise-sync-request',
                'patientIdentifier': request.patientIdentifier,
                'jpid': request.jpid
            };
            var next = jasmine.createSpy().andCallFake(function() {
                expect(response.jobStates).toBeDefined();
                expect(response.jobStates[0]).toBeDefined();
                expect(response.jobStates[0].jpid).toEqual(request.jpid);
                expect(opts.jdsClient.getJobStatus).toHaveBeenCalled();
            });

            runs(function() {
                getJobHistory.call(opts, request, response, next);
            });

            waitsFor(function() {
                return next.callCount > 0;
            });
        });

        it('Retrieves the filtered job history for a known JPID', function() {
            var request = new DummyRequest({
                'pid': 'ABCD;3'
            });
            request.jpid = '21EC2020-3AEA-4069-A2DD-CCCCCCCCCCCC';
            request.filter = {
                'filter': '?filter=eq(status,\"created\")'
            };
            request.patientIdentifier = {
                'type': 'pid',
                'value': 'ABCD;3'
            };
            var response = new DummyResponse();
            response.job = {
                'type': 'enterprise-sync-request',
                'patientIdentifier': request.patientIdentifier,
                'jpid': request.jpid
            };
            var next = jasmine.createSpy().andCallFake(function() {
                expect(response.jobStates).toBeDefined();
                expect(response.jobStates[0]).toBeDefined();
                expect(response.jobStates[0].jpid).toEqual(request.jpid);
                expect(opts.jdsClient.getJobStatus).toHaveBeenCalled();
            });

            runs(function() {
                getJobHistory.call(opts, request, response, next);
            });

            waitsFor(function() {
                return next.callCount > 0;
            });
        });
    });

    describe('getSyncStatus()', function() {
        var opts = _.clone(options);
        beforeEach(function() {
            opts.jdsClient.getSyncStatus = jasmine.createSpy().andCallFake(function(job, callback) {
                callback(null, {}, mockSyncData('21EC2020-3AEA-4069-A2DD-08002B30309D', 4));
            });
        });

        it('Retrieves the sync status for a known JPID', function() {
            var request = new DummyRequest({
                'pid': 'ABCD;0'
            });
            request.jpid = '21EC2020-3AEA-4069-A2DD-08002B30309D';
            request.patientIdentifier = {
                'type': 'pid',
                'value': 'ABCD;0'
            };
            var response = new DummyResponse();
            response.job = {
                'jpid': request.jpid
            };
            var next = jasmine.createSpy().andCallFake(function() {
                expect(response.syncStatus).toBeDefined();
                expect(response.syncStatus.data.items[0]).toBeDefined();
                var syncStatus = response.syncStatus.data.items[0];
                expect(syncStatus.jpid).toEqual('21EC2020-3AEA-4069-A2DD-08002B30309D');
                expect(syncStatus.completedStamp).toBeDefined();
                expect(syncStatus.completedStamp.syncCompleted).toBe(true);
                expect(syncStatus.inProgress).toBeDefined();
                expect(syncStatus.inProgress.syncCompleted).toBe(false);
                expect(opts.jdsClient.getSyncStatus).toHaveBeenCalled();
            });

            runs(function() {
                getSyncStatus.call(opts, request, response, next);
            });

            waitsFor(function() {
                return next.callCount > 0;
            });
        });
    });

    describe('publishJob()', function() {
        var dummyRouter;
        var opts = _.clone(options);
        beforeEach(function() {
            dummyRouter = {
                'publish': jasmine.createSpy().andCallFake(function(job, callback) {
                    callback(null, [ '1' ]);
                })
            };

            opts.jobStatusUpdater.writeStatus = jasmine.createSpy().andCallFake(function(job, callback) {
                callback(null, {}, job);
            });
            opts.jobStatusUpdater.createJobStatus = function(job, callback) {
                job.status = 'created';
                opts.jobStatusUpdater.writeStatus(job, callback);
            };
        });

        it('Publishes a job and posts a status update for an unforced job', function() {
            var request = new DummyRequest({
                'pid': 'ABCD;0'
            });
            request.jpid = '21EC2020-3AEA-4069-A2DD-08002B30309D';
            request.patientIdentifier = {
                'type': 'pid',
                'value': 'ABCD;0'
            };
            var response = new DummyResponse();
            response.job = {
                'type': 'enterprise-sync-request',
                'patientIdentifier': request.patientIdentifier,
                'jpid': request.jpid
            };
            var next = jasmine.createSpy();

            runs(function() {
                publishJob.call(opts, dummyRouter, request, response, next);
            });

            waitsFor(function() {
                return next.callCount > 0;
            });

            runs(function() {
                expect(dummyRouter.publish).toHaveBeenCalled();
            });
        });

        it('Publishes a job and posts two status updates for a forced job', function() {
            var request = new DummyRequest({
                'pid': 'ABCD;0'
            });
            request.jpid = '21EC2020-3AEA-4069-A2DD-08002B30309D';
            request.patientIdentifier = {
                'type': 'pid',
                'value': 'ABCD;0'
            };
            var response = new DummyResponse();
            response.job = {
                'type': 'enterprise-sync-request',
                'patientIdentifier': request.patientIdentifier,
                'jpid': request.jpid,
                'force': true
            };
            response.currentJob = {
                'jobType': 'enterprise-sync-request',
                'patientIdentifier': request.patientIdentifier,
                'jpid': request.jpid,
                'rootJobId': '0',
                'jobId': '0',
                'status': 'started'
            };
            var next = jasmine.createSpy();

            runs(function() {
                publishJob.call(opts, dummyRouter, request, response, next);
            });

            waitsFor(function() {
                return next.callCount > 0;
            });

            runs(function() {
                expect(dummyRouter.publish).toHaveBeenCalled();
            });
        });
    });
});