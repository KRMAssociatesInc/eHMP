'use strict';

require('../../env-setup');

var format = require('util').format;
var _ = require('underscore');
var async = require('async');

var request = require('request');

var siteList = process.env.VXSYNC_SITELIST || ('9E7A,C877');
var timeoutSecs = Number(process.env.VXSYNC_OPD_TIMEOUT_SECS) || 900;
var host = process.env.JDS_IP || '10.2.2.110';
var port = Number(process.env.JDS_PORT) || 9080;
var protocol = process.env.JDS_PROTOCOL || 'http';

describe('Wait for Operational Data Synchronization', function() {
	it('Verify "patient" environment variable is set to pid or icn', function() {
		expect(siteList).toBeDefined();
	});

	it('Verify "timeoutSecs" is a valid positive number less than 3600', function() {
		expect(timeoutSecs).toEqual(jasmine.any(Number));
		expect(timeoutSecs).toBeGreaterThan(0);
		expect(timeoutSecs).toBeLessThan(3600);
	});

	it('Verify "port" is a valid positive number less than 65536', function() {
		expect(port).toEqual(jasmine.any(Number));
		expect(port).toBeGreaterThan(0);
		expect(port).toBeLessThan(65536);
	});

	it('Verify "protocol" is "http" or "https"', function() {
		expect(protocol).toMatch(/^http[s]?$/);
	});

	it('Verify operational data successfully synchronized on ' + host + ':' + port + ' within ' + timeoutSecs + ' seconds for Sites: ' + siteList, function() {
		var expectedError;
		var expectedResult;
		var syncCheckCalled;

		isOperationalDataSynchronized(siteList, function(error, result) {
			expectedError = error;
			expectedResult = result;
			syncCheckCalled = true;
		});

		waitsFor(function() {
			return syncCheckCalled;
		}, format('synchronization to complete for Sites "%s" at %s:%s', siteList, host, port), timeoutSecs * 1000);

		runs(function() {
			expect(expectedError).toBeNull();
		});
	});

	function isOperationalDataSynchronized(siteList, callback) {
		if (!siteList) {
			return setTimeout(callback, 0, 'No value for siteList');
		}

		var sites = _.map(_.filter(siteList.split(','), function(site) {
			return site.trim().length > 0;
		}), function(site) {
			return site.trim();
		});

		if (_.isEmpty(sites)) {
			return setTimeout(callback, 0, 'No sites');
		}

		// Note: IIFE
		(function fetchStatus() {
			async.map(sites, fetchSingleSiteStatus, function(error, results) {
				if (error) {
					return callback(error);
				}

				if (_.isEmpty(results)) {
					return callback('No results returned when fetching operational sync status');
				}

				var isComplete = _.every(results, function(siteStatus) {
					return isSiteStatusComplete(siteStatus);
				});

				if (isComplete) {
					return callback(null, 'Operational data sync complete');
				}

				return setTimeout(fetchStatus, 500);
			});
		})();

		function isSiteStatusComplete(status) {
			if (!status.completedStamp) {
				return false;
			}

			if (status.error) {
				return false;
			}

			if (_.isEmpty(status)) {
				return false;
			}

			if (status.inProgress) {
				return false;
			}

			return true;
		}

		function fetchSingleSiteStatus(site, callback) {
			var url = protocol + '://' + host + ':' + port + '/statusod/' + site;
			var options = {
				url: url,
				timeout: 60000
			};

			request(options, function(error, response, body) {
				if (error) {
					return callback(null, format('Warning: Error attempting to get site operational sync status at: %s -> %j', url, error));
				}

				if (!_.contains([200, 404], response.statusCode)) {
					return callback(null, format('Warning: Error attempting to get site operational sync status: %s code: %s -> %s', url, response.statusCode, body));
				}

				try {
					body = JSON.parse(body);
				} catch (error) {
					return callback(null, format('Warning: Error parsing operational sync status for site at: %s -> %s', url, body));
				}

				return callback(null, body);
			});
		}
	}
});