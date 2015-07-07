'use strict';

require('../../env-setup');

var format = require('util').format;
var _ = require('underscore');

var pidUtils = require(global.VX_UTILS + 'patient-identifier-utils');
var request = require('request');

var patient = process.env.VXSYNC_PATIENT;
var timeoutSecs = Number(process.env.VXSYNC_SYNC_TIMEOUT_SECS) || 450;
var host = process.env.VXSYNC_IP || '127.0.0.1';
var port = Number(process.env.VXSYNC_PORT) || 8080;
var protocol = process.env.VXSYNC_PROTOCOL || 'http';

describe('Synchronize Patient and Wait', function() {
	it('Verify "VXSYNC_PATIENT" environment variable is set to pid or icn', function() {
		expect(patient).toBeDefined();
		expect(pidUtils.isIcn(patient) || pidUtils.isPid(patient)).toBe(true);
	});

	it('Verify "VXSYNC_TIMEOUT_SECS" is a valid positive number less than 3600', function() {
		expect(timeoutSecs).toEqual(jasmine.any(Number));
		expect(timeoutSecs).toBeGreaterThan(0);
		expect(timeoutSecs).toBeLessThan(3600);
	});

	it('Verify "VXSYNC_HOST" is set', function() {
		expect(host).toBeDefined();
	});

	it('Verify "VXSYNC_PORT" is a valid positive number less than 65536', function() {
		expect(port).toEqual(jasmine.any(Number));
		expect(port).toBeGreaterThan(0);
		expect(port).toBeLessThan(65536);
	});

	it('Verify "VXSYNC_PROTOCOL" is "http" or "https"', function() {
		expect(protocol).toMatch(/^http[s]?$/);
	});

	it('Verify synchronize called on patient "' + patient + '"', function() {
		var expectedError;
		var expectedResult;
		var syncCalled = false;

		callSynchronize(patient, function(error, result) {
			expectedError = error;
			expectedResult = result;
			syncCalled = true;
		});

		waitsFor(function() {
			return syncCalled;
		}, format('call to sync patient "%s" at %s:%s', patient, host, port), 10000);

		runs(function() {
			expect(expectedError).toBeNull();
		});
	});

	it('Verify patient "' + patient + '" successfully synchronized on ' + host + ':' + port + ' within ' + timeoutSecs + ' seconds', function() {
		var expectedError;
		var expectedResult;
		var syncCheckCalled;

		isPatientSynchronized(patient, function(error, result) {
			expectedError = error;
			expectedResult = result;
			syncCheckCalled = true;
		});

		waitsFor(function() {
			return syncCheckCalled;
		}, format('synchronization to complete for patient "%s" at %s:%s', patient, host, port), timeoutSecs * 1000);

		runs(function() {
			expect(expectedError).toBeNull();
		});
	});

	function callSynchronize(patient, callback) {
		if (!patient) {
			return setTimeout(callback, 0, 'No value for patient');
		}

		var query;

		if (pidUtils.isPid(patient)) {
			query = 'pid=' + patient;
		} else if (pidUtils.isIcn(patient)) {
			query = 'icn=' + patient;
		} else {
			return setTimeout(callback, 0, format('Invalid identifer value for patient (%s)', patient));
		}

		var url = protocol + '://' + host + ':' + port + '/sync/doLoad?' + query;
		var options = {
			url: url,
			timeout: 60000
		};

		request(options, function(error, response, body) {
			if (error) {
				return callback(format('Error attempting to sync patient at: %s -> %j', url, error));
			}

			if (response.statusCode !== 202) {
				return callback(format('Error attempting to sync patient at: %s code: %s -> %s', url, response.statusCode, body));
			}

			try {
				body = JSON.parse(body);
			} catch (error) {
				return callback(format('Error parsing response to sync for patient at: %s -> %s', url, body));
			}

			if (!body.type || !body.patientIdentifier || !body.jobId || body.status !== 'created') {
				return callback(format('Error in response from sync request at: %s -> %j', url, body));
			}

			return callback(null, format('Synchronization called for patient "%s" complete', patient));
		});
	}

	function isPatientSynchronized(patient, callback) {
		if (!patient) {
			return setTimeout(callback, 0, 'No value for patient');
		}

		var query;

		if (pidUtils.isPid(patient)) {
			query = 'pid=' + patient;
		} else if (pidUtils.isIcn(patient)) {
			query = 'icn=' + patient;
		} else {
			return setTimeout(callback, 0, format('Invalid identifer value for patient (%s)', patient));
		}

		var url = protocol + '://' + host + ':' + port + '/sync/status?' + query;
		var options = {
			url: url,
			timeout: 60000
		};

		// Note: IIFE
		(function fetchStatus() {
			request(options, function(error, response, body) {
				if (error) {
					return callback(format('Error attempting to get patient sync status at: %s -> %j', url, error));
				}

				if (response.statusCode === 404) {
					return setTimeout(fetchStatus, 500);
				}

				if (response.statusCode === 202) {
					return callback(format('Error attempting to get patient sync status: %s code: %s -> %s', url, response.statusCode, body));
				}

				try {
					body = JSON.parse(body);
				} catch (error) {
					return callback(format('Error parsing sync status for patient at: %s -> %s', url, body));
				}

				if (!body.syncStatus || !body.jobStatus) {
					return callback(format('Error in response from sync status at: %s -> %j', url, body));
				}

				if (!_.isEmpty(body.jobStatus)) {
					return setTimeout(fetchStatus, 500);
				}

				if (body.syncStatus && body.syncStatus.inProgress) {
					return setTimeout(fetchStatus, 500);
				}

				return callback(null, format('Synchronization completed for patient "%s"', patient));
			});
		})();
	}
});