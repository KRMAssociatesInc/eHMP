'use strict';

//---------------------------------------------------------------------------
// This contains a set of unit tests for the VprUpdateOpData.js class.
//
// Author: Les Westberg
//---------------------------------------------------------------------------

require('../../../env-setup');
var dummyLogger = require(global.VX_UTILS + '/dummy-logger');
var JdsClientDummy = require(global.VX_SUBSYSTEMS + 'jds/jds-client-dummy');
var VprUpdateOpData = require(global.VX_UTILS + 'VprUpdateOpData.js');

var config = {
	jds: {
		protocol: 'http',
		host: '10.2.2.110',
		port: 9080
	}
};

var lastUpdateTimeValue = '3150106-1624';
var vistaIdValue = 'C877';
var uidValue = 'urn:va:vprupdate:' + vistaIdValue;

var jdsClientDummy = new JdsClientDummy(dummyLogger, config);


describe('VprUpdateOpData.js', function() {
	beforeEach(function() {
		// Underlying JDS calls to monitor and make sure that they are made.
		//---------------------------------------------------------------------------
		spyOn(jdsClientDummy, 'storeOperationalDataMutable').andCallThrough();
		spyOn(jdsClientDummy, 'getOperationalDataMutable').andCallThrough();
	});
	describe('storeLastUpdateTime()', function() {
		it('Happy Path', function() {

			var expectedJdsResponse = {
				statusCode: 200
			};
			jdsClientDummy._setResponseData(null, expectedJdsResponse, undefined);
			var vprUpdateOpData = new VprUpdateOpData(dummyLogger, vistaIdValue, jdsClientDummy);
			var actualError;
			var actualResponse;
			var called = false;
			vprUpdateOpData.storeLastUpdateTime(lastUpdateTimeValue, function(error, response) {
				actualError = error;
				actualResponse = response;
				called = true;
			});

			waitsFor(function() {
				return called;
			}, 'Call to storeLastUpdateTime failed to return in time.', 500);

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
		it('JDS returns error.', function() {

			var expectedJdsError = 'Failed call to JDS.';
			jdsClientDummy._setResponseData(expectedJdsError, null, undefined);
			var vprUpdateOpData = new VprUpdateOpData(dummyLogger, vistaIdValue, jdsClientDummy);
			var actualError;
			var actualResponse;
			var called = false;
			vprUpdateOpData.storeLastUpdateTime(lastUpdateTimeValue, function(error, response) {
				actualError = error;
				actualResponse = response;
				called = true;
			});

			waitsFor(function() {
				return called;
			}, 'Call to storeLastUpdateTime failed to return in time.', 500);

			runs(function() {
				expect(actualError.indexOf(expectedJdsError)).toBeGreaterThan(-1);
				expect(actualResponse).toBeNull();
				expect(jdsClientDummy.storeOperationalDataMutable.calls.length).toEqual(1);
				expect(jdsClientDummy.storeOperationalDataMutable).toHaveBeenCalledWith(jasmine.objectContaining({
					_id: vistaIdValue,
					lastUpdate: lastUpdateTimeValue,
					uid: uidValue
				}), jasmine.any(Function));
			});
		});
		it('JDS returns no error and no response.', function() {
			jdsClientDummy._setResponseData(null, null, undefined);
			var vprUpdateOpData = new VprUpdateOpData(dummyLogger, vistaIdValue, jdsClientDummy);
			var actualError;
			var actualResponse;
			var called = false;
			vprUpdateOpData.storeLastUpdateTime(lastUpdateTimeValue, function(error, response) {
				actualError = error;
				actualResponse = response;
				called = true;
			});

			waitsFor(function() {
				return called;
			}, 'Call to storeLastUpdateTime failed to return in time.', 500);

			runs(function() {
				expect(actualError).toBeTruthy();
				expect(actualResponse).toBeNull();
				expect(jdsClientDummy.storeOperationalDataMutable.calls.length).toEqual(1);
				expect(jdsClientDummy.storeOperationalDataMutable).toHaveBeenCalledWith(jasmine.objectContaining({
					_id: vistaIdValue,
					lastUpdate: lastUpdateTimeValue,
					uid: uidValue
				}), jasmine.any(Function));
			});
		});
		it('JDS returns no error but incorrect response.statusCode', function() {
			var expectedJdsResponse = {
				statusCode: 100
			};
			jdsClientDummy._setResponseData(null, expectedJdsResponse, undefined);
			var vprUpdateOpData = new VprUpdateOpData(dummyLogger, vistaIdValue, jdsClientDummy);
			var actualError;
			var actualResponse;
			var called = false;
			vprUpdateOpData.storeLastUpdateTime(lastUpdateTimeValue, function(error, response) {
				actualError = error;
				actualResponse = response;
				called = true;
			});

			waitsFor(function() {
				return called;
			}, 'Call to storeLastUpdateTime failed to return in time.', 500);

			runs(function() {
				expect(actualError).toBeTruthy();
				expect(actualResponse).toBeNull();
				expect(jdsClientDummy.storeOperationalDataMutable.calls.length).toEqual(1);
				expect(jdsClientDummy.storeOperationalDataMutable).toHaveBeenCalledWith(jasmine.objectContaining({
					_id: vistaIdValue,
					lastUpdate: lastUpdateTimeValue,
					uid: uidValue
				}), jasmine.any(Function));
			});
		});
		it('Missing last-update-time', function() {
			var expectedJdsResponse = {
				statusCode: 201
			};
			jdsClientDummy._setResponseData(null, expectedJdsResponse, undefined);
			var vprUpdateOpData = new VprUpdateOpData(dummyLogger, vistaIdValue, jdsClientDummy);
			var actualError;
			var actualResponse;
			var called = false;
			vprUpdateOpData.storeLastUpdateTime(null, function(error, response) {
				actualError = error;
				actualResponse = response;
				called = true;
			});

			waitsFor(function() {
				return called;
			}, 'Call to storeLastUpdateTime failed to return in time.', 500);

			runs(function() {
				expect(actualError).toBeTruthy();
				expect(actualResponse).toBeNull();
				expect(jdsClientDummy.storeOperationalDataMutable.calls.length).toEqual(0);
			});
		});
		it('Missing vistaId', function() {
			var expectedJdsResponse = {
				statusCode: 200
			};
			jdsClientDummy._setResponseData(null, expectedJdsResponse, undefined);
			var vprUpdateOpData = new VprUpdateOpData(dummyLogger, null, jdsClientDummy);
			var actualError;
			var actualResponse;
			var called = false;
			vprUpdateOpData.storeLastUpdateTime(lastUpdateTimeValue, function(error, response) {
				actualError = error;
				actualResponse = response;
				called = true;
			});

			waitsFor(function() {
				return called;
			}, 'Call to storeLastUpdateTime failed to return in time.', 500);

			runs(function() {
				expect(actualError).toBeTruthy();
				expect(actualResponse).toBeNull();
				expect(jdsClientDummy.storeOperationalDataMutable.calls.length).toEqual(0);
			});
		});
	});
	describe('retrieveLastUpdateTime()', function() {
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
			var vprUpdateOpData = new VprUpdateOpData(dummyLogger, vistaIdValue, jdsClientDummy);
			var actualError;
			var actualResponse;
			var called = false;
			vprUpdateOpData.retrieveLastUpdateTime(function(error, response) {
				actualError = error;
				actualResponse = response;
				called = true;
			});

			waitsFor(function() {
				return called;
			}, 'Call to retrieveLastUpdateTime failed to return in time.', 500);

			runs(function() {
				expect(actualError).toBeNull();
				expect(actualResponse).toEqual(lastUpdateTimeValue);
				expect(jdsClientDummy.getOperationalDataMutable.calls.length).toEqual(1);
				expect(jdsClientDummy.getOperationalDataMutable).toHaveBeenCalledWith(vistaIdValue, jasmine.any(Function));
			});
		});
		it('Missing vistaId', function() {
			var expectedJdsResponse = {
				statusCode: 200
			};
			jdsClientDummy._setResponseData(null, expectedJdsResponse, null);
			var vprUpdateOpData = new VprUpdateOpData(dummyLogger, null, jdsClientDummy);
			var actualError;
			var actualResponse;
			var called = false;
			vprUpdateOpData.retrieveLastUpdateTime(function(error, response) {
				actualError = error;
				actualResponse = response;
				called = true;
			});

			waitsFor(function() {
				return called;
			}, 'Call to retrieveLastUpdateTime failed to return in time.', 500);

			runs(function() {
				expect(actualError).toBeTruthy();
				expect(actualResponse).toBeNull();
				expect(jdsClientDummy.getOperationalDataMutable.calls.length).toEqual(0);
			});
		});
		it('JDS returns error.', function() {

			var expectedJdsError = 'Failed call to JDS.';
			jdsClientDummy._setResponseData(expectedJdsError, null, undefined);
			var vprUpdateOpData = new VprUpdateOpData(dummyLogger, vistaIdValue, jdsClientDummy);
			var actualError;
			var actualResponse;
			var called = false;
			vprUpdateOpData.retrieveLastUpdateTime(function(error, response) {
				actualError = error;
				actualResponse = response;
				called = true;
			});

			waitsFor(function() {
				return called;
			}, 'Call to retrieveLastUpdateTime failed to return in time.', 500);

			runs(function() {
				expect(actualError.indexOf(expectedJdsError)).toBeGreaterThan(-1);
				expect(actualResponse).toBeNull();
				expect(jdsClientDummy.getOperationalDataMutable.calls.length).toEqual(1);
				expect(jdsClientDummy.getOperationalDataMutable).toHaveBeenCalledWith(vistaIdValue, jasmine.any(Function));
			});
		});
		it('JDS returns no error and no response.', function() {
			jdsClientDummy._setResponseData(null, null, undefined);
			var vprUpdateOpData = new VprUpdateOpData(dummyLogger, vistaIdValue, jdsClientDummy);
			var actualError;
			var actualResponse;
			var called = false;
			vprUpdateOpData.retrieveLastUpdateTime(function(error, response) {
				actualError = error;
				actualResponse = response;
				called = true;
			});

			waitsFor(function() {
				return called;
			}, 'Call to retrieveLastUpdateTime failed to return in time.', 500);

			runs(function() {
				expect(actualError).toBeTruthy();
				expect(actualResponse).toBeNull();
				expect(jdsClientDummy.getOperationalDataMutable.calls.length).toEqual(1);
				expect(jdsClientDummy.getOperationalDataMutable).toHaveBeenCalledWith(vistaIdValue, jasmine.any(Function));
			});
		});
		it('JDS returns no error but response is an empty object (meaning record does not exist)', function() {

			var expectedJdsResponse = {
				statusCode: 200
			};
			jdsClientDummy._setResponseData(null, expectedJdsResponse, {});
			var vprUpdateOpData = new VprUpdateOpData(dummyLogger, vistaIdValue, jdsClientDummy);
			var actualError;
			var actualResponse;
			var called = false;
			vprUpdateOpData.retrieveLastUpdateTime(function(error, response) {
				actualError = error;
				actualResponse = response;
				called = true;
			});

			waitsFor(function() {
				return called;
			}, 'Call to retrieveLastUpdateTime failed to return in time.', 500);

			runs(function() {
				expect(actualError).toBeNull();
				expect(actualResponse).toEqual('0');
				expect(jdsClientDummy.getOperationalDataMutable.calls.length).toEqual(1);
				expect(jdsClientDummy.getOperationalDataMutable).toHaveBeenCalledWith(vistaIdValue, jasmine.any(Function));
			});
		});
		it('JDS returns no error but incorrect response.statusCode', function() {
			var expectedJdsResponse = {
				statusCode: 100
			};
			jdsClientDummy._setResponseData(null, expectedJdsResponse, undefined);
			var vprUpdateOpData = new VprUpdateOpData(dummyLogger, vistaIdValue, jdsClientDummy);
			var actualError;
			var actualResponse;
			var called = false;
			vprUpdateOpData.retrieveLastUpdateTime(function(error, response) {
				actualError = error;
				actualResponse = response;
				called = true;
			});

			waitsFor(function() {
				return called;
			}, 'Call to retrieveLastUpdateTime failed to return in time.', 500);

			runs(function() {
				expect(actualError).toBeTruthy();
				expect(actualResponse).toBeNull();
				expect(jdsClientDummy.getOperationalDataMutable.calls.length).toEqual(1);
				expect(jdsClientDummy.getOperationalDataMutable).toHaveBeenCalledWith(vistaIdValue, jasmine.any(Function));
			});
		});
		it('JDS returns no error, response, or result', function() {
			jdsClientDummy._setResponseData(null, null, null);
			var vprUpdateOpData = new VprUpdateOpData(dummyLogger, vistaIdValue, jdsClientDummy);
			var actualError;
			var actualResponse;
			var called = false;
			vprUpdateOpData.retrieveLastUpdateTime(function(error, response) {
				actualError = error;
				actualResponse = response;
				called = true;
			});

			waitsFor(function() {
				return called;
			}, 'Call to retrieveLastUpdateTime failed to return in time.', 500);

			runs(function() {
				expect(actualError).toBeTruthy();
				expect(actualResponse).toBeNull();
				expect(jdsClientDummy.getOperationalDataMutable.calls.length).toEqual(1);
				expect(jdsClientDummy.getOperationalDataMutable).toHaveBeenCalledWith(vistaIdValue, jasmine.any(Function));
			});
		});
		it('JDS returns response - but response did not have the actual item.', function() {
			var expectedJdsResponse = {
				statusCode: 200
			};
			var expectedJdsResult = {
				apiVersion: '1.0',
				data: {
					updated: '20141231144448',
					totalItems: 0,
					currentItemCount: 0
				}
			};
			jdsClientDummy._setResponseData(null, expectedJdsResponse, expectedJdsResult);
			var vprUpdateOpData = new VprUpdateOpData(dummyLogger, vistaIdValue, jdsClientDummy);
			var actualError;
			var actualResponse;
			var called = false;
			vprUpdateOpData.retrieveLastUpdateTime(function(error, response) {
				actualError = error;
				actualResponse = response;
				called = true;
			});

			waitsFor(function() {
				return called;
			}, 'Call to retrieveLastUpdateTime failed to return in time.', 500);

			runs(function() {
				expect(actualError).toBeTruthy();
				expect(actualResponse).toBeNull();
				expect(jdsClientDummy.getOperationalDataMutable.calls.length).toEqual(1);
				expect(jdsClientDummy.getOperationalDataMutable).toHaveBeenCalledWith(vistaIdValue, jasmine.any(Function));
			});
		});
	});
});