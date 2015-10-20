'use strict';

require('../../../env-setup');

var _ = require('underscore');
var async = require('async');

var logger = require('bunyan').createLogger({
	name: 'test:VistaJS-authenticate',
	level: 'fatal'
});

var wConfig = require(global.VX_ROOT + 'worker-config');
var RpcClient = require('vista-js').RpcClient;

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
		it('test with explicit connection command', function() {
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

		it('test automatic connection', function() {
			var testError;
			var testResult;
			var called = false;

			var expectedError = null;
			var expectedResult = {
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

		it('test automatic connection disabled', function() {
			var testError;
			var testResult;
			var called = false;

			var expectedError = 'Connection not initialized';
			var expectedResult = {
				execute: undefined
			};

			var disabledConfig = _.defaults({}, config, {
				noReconnect: true
			});

			function callback(error, result) {
				called = true;
				testError = error;
				testResult = result;
			}

			var client = new RpcClient(logger, disabledConfig);

			var rpc = {
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

		it('test multiple commands within single timeout', function() {
			// The important point of this test is that *all* commands are run
			// within the timeout. Indirectly proving that a connection is
			// only made once and used for all RPC calls.
			var testError;
			var testResult;
			var called = false;

			var expectedError = null;
			var expectedResult = {
				execute1: jasmine.any(String),
				execute2: jasmine.any(String),
				execute3: jasmine.any(String),
				execute4: jasmine.any(String),
				execute5: jasmine.any(String),
				close: 'SIGNOFF SUCCESSFUL'
			};

			function callback(error, result) {
				called = true;
				testError = error;
				testResult = result;
			}

			var client = new RpcClient(logger, config);

			var rpc = {
				execute1: client.execute.bind(client, 'ORWU USERINFO'),
				execute2: client.execute.bind(client, 'ORWU USERINFO'),
				execute3: client.execute.bind(client, 'ORWU USERINFO'),
				execute4: client.execute.bind(client, 'ORWU USERINFO'),
				execute5: client.execute.bind(client, 'ORWU USERINFO'),
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

	describe('test multiple commands executed synchronously in order', function() {
		function createTest(testFunction, expectedError, expectedResult, timeoutMillis) {
			return function tester() {
				var testError;
				var testResult;
				var called = false;

				testFunction(function(error, result) {
					called = true;
					testError = error;
					testResult = result;
				});

				waitsFor(function() {
					return called;
				}, 'test', timeoutMillis);

				runs(function() {
					expect(testError).toEqual(expectedError);
					expect(testResult).toEqual(expectedResult);
				});
			};
		}

		// The important point of this test is that all of the
		// commands are run serially and in order.

		var client = new RpcClient(logger, config);

		var expectedError = null;

		var execute = client.execute.bind(client, 'ORWU USERINFO');
		var close = client.close.bind(client);

		var tests = {
			'autoconnect and execute 1': createTest(execute, expectedError, jasmine.any(String), 5000),
			'close 1': createTest(close, expectedError, 'SIGNOFF SUCCESSFUL', 100),
			'autoconnect and execute 2': createTest(execute, expectedError, jasmine.any(String), 5000),
			'execute 1': createTest(execute, expectedError, jasmine.any(String), 100),
			'close 2': createTest(close, expectedError, 'SIGNOFF SUCCESSFUL', 100)
		};

		_.each(tests, function(test, testName) {
			it('test ' + testName, function() {
				test();
			});
		});
	});

	describe('verify incorrect config info yields error result', function() {
		it('test incorrect configuration', function() {
			var testError;
			var testResult;
			var called = false;

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
				expect(testError).toBeDefined();
				expect(testResult.connect).toBeDefined();
				expect(testResult.execute).toBeUndefined();
				expect(testResult.close).toBeUndefined();
			});
		});
	});

});