'use strict';

require('../../../../env-setup');

var uuid = require('node-uuid');

var handle = require(global.VX_HANDLERS + 'jmeadows-sync-request/jmeadows-sync-request-handler');

var errorUtil = require(global.VX_UTILS + 'error');
var log = require(global.VX_UTILS + 'dummy-logger');
var jobUtil = require(global.VX_UTILS + 'job-utils');
var patientIdUtil = require(global.VX_UTILS + 'patient-identifier-utils');


describe('jmeadows-sync-request-handler.js', function() {
	var job;
	var rootJob;
	var config;
	var environment;
	var callback;
	var patientIdentifier;
	var called;
	var calledError;
	var calledResult;

	beforeEach(function() {
		called = false;

		patientIdentifier = patientIdUtil.create('icn', '10110V004877');
		rootJob = jobUtil.createEnterpriseSyncRequest(patientIdentifier, uuid.v4(), false);

		config = {
			jmeadows: []
		};

		environment = {
			publisherRouter: {
				publish: function(jobsToPublish, handlerCallback) {
					handlerCallback(null, jobsToPublish);
				}
			}
		};

		callback = function(error, result) {
			called = true;
			calledError = error;
			calledResult = result;
		};

		spyOn(environment.publisherRouter, 'publish').andCallThrough();
	});

	describe('handle()', function() {
		it('verify invalid job type is rejected', function() {
			job = jobUtil.createEnterpriseSyncRequest(patientIdentifier, uuid.v4(), false);
			handle(log, config, environment, job, callback);

			waitsFor(function() {
				return called;
			}, 'should be called', 100);

			runs(function() {
				expect(errorUtil.isFatal(calledError)).toBe(true);
				expect(environment.publisherRouter.publish).not.toHaveBeenCalled();
			});
		});

		it('verify invalid job format is rejected', function() {
			job = {
				patientIdentifier: patientIdentifier,
				jpid: uuid.v4()
			};

			handle(log, config, environment, job, callback);

			waitsFor(function() {
				return called;
			}, 'should be called', 100);

			runs(function() {
				expect(errorUtil.isFatal(calledError)).toBe(true);
				expect(environment.publisherRouter.publish).not.toHaveBeenCalled();
			});
		});

		it('verify no jobs sent for empty domains config parameter', function() {
			job = jobUtil.createJmeadowsSyncRequest(patientIdentifier, rootJob);
			handle(log, config, environment, job, callback);

			waitsFor(function() {
				return called;
			}, 'should be called', 100);

			runs(function() {
				expect(calledError).toBeUndefined();
				expect(environment.publisherRouter.publish).not.toHaveBeenCalled();
			});
		});

		it('verify correct jobs sent based on domains in config parameter', function() {
			config.jmeadows.domains = ['allergy', 'appointment'];
			job = jobUtil.createJmeadowsSyncRequest(patientIdentifier, rootJob);
			handle(log, config, environment, job, callback);

			waitsFor(function() {
				return called;
			}, 'should be called', 100);

			runs(function() {
				expect(calledError).toBeNull();
				expect(environment.publisherRouter.publish).toHaveBeenCalled();
			});
		});

		it('verify failed publish returns error', function() {
			config.jmeadows.domains = ['allergy', 'appointment'];
			environment.publisherRouter.publish = function(jobsToPublish, handlerCallback) {
				handlerCallback(errorUtil.createTransient('test error'));
			};
			spyOn(environment.publisherRouter, 'publish').andCallThrough();
			job = jobUtil.createJmeadowsSyncRequest(patientIdentifier, rootJob);
			handle(log, config, environment, job, callback);

			waitsFor(function() {
				return called;
			}, 'should be called', 100);

			runs(function() {
				expect(calledError).not.toBeNull();
				expect(environment.publisherRouter.publish).toHaveBeenCalled();
			});
		});
	});
});