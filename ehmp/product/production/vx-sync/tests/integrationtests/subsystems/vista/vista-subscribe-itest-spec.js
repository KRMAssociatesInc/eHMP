'use strict';

//---------------------------------------------------------------------------------------------------
// This is an integration test for the vista-subscribe.
//
// Author: Les Westberg
//---------------------------------------------------------------------------------------------------

var _ = require('underscore');

require('../../../../env-setup');
var VistaClient = require(global.VX_SUBSYSTEMS + 'vista/vista-client');
var dummyLogger = require(global.VX_UTILS + 'dummy-logger');
// dummyLogger = require('bunyan').createLogger({name: 'vista-record-poller-itest-spec', level: 'debug'});

var JdsClient = require(global.VX_SUBSYSTEMS + 'jds/jds-client');
var val = require(global.VX_UTILS + 'object-utils').getProperty;
var wConfig = require(global.VX_ROOT + 'worker-config');

var vistaIdValue = '9E7A';
var dfnValue = '3';

function setUpEnvironment() {
	var config = {
		'vistaSites': {
			'9E7A': _.defaults(wConfig.vistaSites['9E7A'], {
				'name': 'panorama',
				'host': '10.2.2.101',
				'port': 9210,
				'accessCode': 'pu1234',
				'verifyCode': 'pu1234!!',
				'localIP': '127.0.0.1',
				'localAddress': 'localhost',
				'connectTimeout': 3000,
				'sendTimeout': 10000
			}),
			'C877': _.defaults(wConfig.vistaSites.C877, {
				'name': 'kodak',
				'host': '10.2.2.102',
				'port': 9210,
				'accessCode': 'pu1234',
				'verifyCode': 'pu1234!!',
				'localIP': '127.0.0.1',
				'localAddress': 'localhost',
				'connectTimeout': 3000,
				'sendTimeout': 10000
			})
		},
		'hmp.server.id': 'hmp-development-box',
		'hmp.version': '0.7-S65',
		'hmp.batch.size': '1000',
		'hmp.extract.schema': '3.001'
	};

	var environment = {
		vistaClient: new VistaClient(dummyLogger, dummyLogger, config),
		jds: new JdsClient(dummyLogger, dummyLogger, config)
	};

	return environment;
}

describe('vista-subscribe.js', function() {
	describe('getDemographics', function() {
		it('Happy Path', function() {
			var completed = false;
			var actualError;
			var actualResponse;
			runs(function() {
				var environment = setUpEnvironment();
				environment.vistaClient.getDemographics(vistaIdValue, dfnValue, function(error, response) {
					actualError = error;
					actualResponse = response;
					completed = true;
				});
			});

			waitsFor(function() {
				return completed;
			}, 'response from getDemographics(...) timed out.', 10000);

			runs(function() {
				expect(actualError).toBeNull();
				expect(actualResponse).toBeTruthy();
				expect(val(actualResponse, 'familyName')).toEqual('EIGHT');
				expect(val(actualResponse, 'fullName')).toEqual('EIGHT,PATIENT');
				expect(val(actualResponse, 'icn')).toEqual('10108V420871');
				expect(val(actualResponse, 'localId')).toEqual(3);
				expect(val(actualResponse, 'pid')).toEqual('9E7A;3');
				// dummyLogger.debug('vista-subscribe-itest-spec.getDemographics: Got response: %j', actualResponse);
			});
		});
	});
});