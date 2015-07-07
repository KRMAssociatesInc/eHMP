'use strict';

//---------------------------------------------------------------------------
// This contains a set of integration tests for the VprUpdateOpData.js class.
//
// Author: Les Westberg
//---------------------------------------------------------------------------

require('../../../env-setup');
var dummyLogger = require(global.VX_UTILS + '/dummy-logger');
var config = require(global.VX_ROOT + 'worker-config');
var val = require(global.VX_UTILS + 'object-utils').getProperty;

var JdsClient = require(global.VX_SUBSYSTEMS + 'jds/jds-client');
var VprUpdateOpData = require(global.VX_UTILS + 'VprUpdateOpData.js');

var lastUpdateTimeValue1 = '3150106-1624';
var lastUpdateTimeValue2 = '3150106-1624';
var lastUpdateTimeValue3 = '3150106-1624';
var vistaIdValue = 'GGGG';

var jdsClient = new JdsClient(dummyLogger, config);

// dummyLogger = require('bunyan').createLogger({
//     name: 'test',
//     level: 'debug'
// });

describe('VprUpdateOpData.js', function() {
	describe('storeLastUpdateTime() and retrieveLastUpdateTime()', function() {
		it('Store/Retrieve', function() {
			var vprUpdateOpData = new VprUpdateOpData(dummyLogger, vistaIdValue, jdsClient);
			var actualError;
			var actualResponse;
			var finished = false;
			runs(function() {
				vprUpdateOpData.storeLastUpdateTime(lastUpdateTimeValue1, function(error, response) {
					actualError = error;
					actualResponse = response;
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			}, 'Call to storeLastUpdateTime failed to return in time.', 500);

			runs(function() {
				finished = false;
				runs(function() {
					vprUpdateOpData.retrieveLastUpdateTime(function(error, response) {
						actualError = error;
						actualResponse = response;
						finished = true;
					});
				});

				waitsFor(function() {
					return finished;
				}, 'Call to storeLastUpdateTime failed to return in time.', 500);

				runs(function() {
					expect(actualError).toBeNull();
					expect(actualResponse).toEqual(lastUpdateTimeValue1);
				});
			});
		});
		it('Store/Retrieve/Store/Retrieve - Format 2', function() {
			var vprUpdateOpData = new VprUpdateOpData(dummyLogger, vistaIdValue, jdsClient);
			var actualError;
			var actualResponse;
			var finished1 = false;
			runs(function() {
				vprUpdateOpData.storeLastUpdateTime(lastUpdateTimeValue2, function(error, response) {
					actualError = error;
					actualResponse = response;
					finished1 = true;
				});
			});

			waitsFor(function() {
				return finished1;
			}, 'Call to storeLastUpdateTime failed to return in time.', 500);

			var finished2 = false;
			runs(function() {
				vprUpdateOpData.retrieveLastUpdateTime(function(error, response) {
					actualError = error;
					actualResponse = response;
					finished2 = true;
				});
			});

			waitsFor(function() {
				return finished2;
			}, 'Call to storeLastUpdateTime failed to return in time.', 500);

			var finished3 = false;
			runs(function() {
				expect(actualError).toBeNull();
				expect(actualResponse).toEqual(lastUpdateTimeValue2);
				vprUpdateOpData.storeLastUpdateTime(lastUpdateTimeValue3, function(error, response) {
					actualError = error;
					actualResponse = response;
					finished3 = true;
				});
			});

			waitsFor(function() {
				return finished3;
			}, 'Call to storeLastUpdateTime failed to return in time.', 500);

			var finished4 = false;
			runs(function() {
				vprUpdateOpData.retrieveLastUpdateTime(function(error, response) {
					actualError = error;
					actualResponse = response;
					finished4 = true;
				});
			});

			waitsFor(function() {
				return finished4;
			}, 'Call to storeLastUpdateTime failed to return in time.', 500);

			runs(function() {
				expect(actualError).toBeNull();
				expect(actualResponse).toEqual(lastUpdateTimeValue3);
			});
		});
		it('Retrieve one that we know does not exist.', function() {
			var vprUpdateOpData = new VprUpdateOpData(dummyLogger, vistaIdValue, jdsClient);
			var actualError;
			var actualResponse;
			var finished1 = false;
			var originalLastUpdateTime;
			// Retrieve the one that exists now - so we can get its value before we delete it.
			//----------------------------------------------------------------------------------
			runs(function() {
				vprUpdateOpData.retrieveLastUpdateTime(function(error, response) {
					actualError = error;
					actualResponse = response;
					finished1 = true;
				});
			});

			waitsFor(function() {
				return finished1;
			}, 'Call to storeLastUpdateTime failed to return in time.', 500);

			// Delete the entry
			//-----------------
			var finished2 = false;
			runs(function() {
				// console.log('originalLastUpdateTime: ' + originalLastUpdateTime);
				originalLastUpdateTime = actualResponse;
				jdsClient.deleteOperationalDataMutable(vistaIdValue, function(error, response) {
					actualError = error;
					actualResponse = response;
					finished2 = true;
					expect(error).toBeNull();
					expect(response).toBeTruthy();
					expect(val(response, 'statusCode')).toEqual(200);
				});
			});

			waitsFor(function() {
				return finished2;
			}, 'Call to storeLastUpdateTime failed to return in time.', 500);

			// Retrieve the entry now that it has been deleted
			//-------------------------------------------------
			var finished3 = false;
			runs(function() {
				// console.log('calling retrieveLastUpdateTime after deleting the item.');
				vprUpdateOpData.retrieveLastUpdateTime(function(error, response) {
					// console.log('error: ' + error + '; response: ' + response);
					actualError = error;
					actualResponse = response;
					finished3 = true;
				});
			});

			waitsFor(function() {
				return finished3;
			}, 'Call to storeLastUpdateTime failed to return in time.', 500);

			runs(function() {
				expect(actualError).toBeNull();
				expect(actualResponse).toEqual('0');
			});

		});
	});
});