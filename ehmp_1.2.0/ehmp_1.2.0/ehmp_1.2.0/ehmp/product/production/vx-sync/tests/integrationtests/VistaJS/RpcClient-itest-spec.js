'use strict';

require('../../../env-setup');

var _ = require('underscore');
var async = require('async');

var logger = require('bunyan').createLogger({
	name: 'test:VistaJS-authenticate',
	level: 'fatal'
});

var wConfig = require(global.VX_ROOT + 'worker-config');
var RpcClient = require(global.VX_VISTAJS + 'RpcClient').RpcClient;

var config = _.defaults(wConfig.vistaSites['9E7A'], {
	host: '10.2.2.101',
	port: 9210,
	accessCode: 'ep1234',
	verifyCode: 'ep1234!!',
	context: 'HMP SYNCHRONIZATION CONTEXT',
	localIP: '127.0.0.1',
	localAddress: 'localhost',
	connectTimeout: 1000,
	sendTimeout: 5000
});

describe('verify RpcClient() and instance methods against Panorama', function() {
	describe('verify correct config info yields good result', function() {
		it('verified', function() {
			var testError;
			var testResult;
			var called = false;

			var expectedError = null;
			var expectedResult = {
				connect: {
					accessCode: 'ep1234',
					verifyCode: 'ep1234!!',
					duz: jasmine.any(String)
				},
				execute: jasmine.any(String),
				close: 'SIGNOFF SUCCESSFUL'
			};

			function callback(error, result) {
				called = true;
				testError = error;
				testResult = result;
			}

			var client = new RpcClient(logger, config);

			var rpc = {
				connect: client.connect.bind(client),
				execute: client.execute.bind(client, 'ORWU USERINFO'),
				close: client.close.bind(client)
			};

			async.series(rpc, callback);

			waitsFor(function() {
				return called;
			}, 'should be called', 5000);

			runs(function() {
				expect(testError).toEqual(expectedError);
				expect(testResult).toEqual(expectedResult);
			});
		});
	});

	xdescribe('verify incorrect config info yields error result', function() {
		it('verified', function() {
			var testError;
			var testResult;
			var called = false;

			var expectedError = null;
			var expectedResult = {
				connect: {
					accessCode: 'ep1234',
					verifyCode: 'ep1234!!',
					duz: '10000000229'
				},
				execute: '10000000229^USER,PANORAMA^3^1^1^3^0^4000^20^1^1^20^PANORAMA.VISTACORE.US^0^240^1^1^^0^0^^1^0^500^^0',
				close: 'SIGNOFF SUCCESSFUL'
			};

			function callback(error, result) {
				called = true;
				testError = error;
				testResult = result;
			}

			var conf = _.clone(config);
			conf.port = 666;

			var client = new RpcClient(logger, conf);

			var rpc = {
				connect: client.connect.bind(client),
				execute: client.execute.bind(client, 'ORWU USERINFO'),
				close: client.close.bind(client)
			};

			async.series(rpc, callback);

			waitsFor(function() {
				return called;
			}, 'should be called', 5000);

			runs(function() {
				expect(testError).toEqual(expectedError);
				expect(testResult).toEqual(expectedResult);
			});
		});
	});

});