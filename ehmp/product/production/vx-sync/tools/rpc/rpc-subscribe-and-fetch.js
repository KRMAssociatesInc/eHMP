'use strict';

require('../../env-setup');
var inspect = require('util').inspect;
var _ = require('underscore');
var RpcClient = require('vista-js').RpcClient;

var argv = require('yargs')
	.usage('Usage: $0 [options...]')
	.demand(['host', 'port', 'dfn'])
	.describe('host', 'IP Address of the VistA host')
	.describe('port', 'Port of the VistA host')
	.describe('dfn', 'DFN of the patient for the subscribe request (\'OP\' for operational data)')
	.describe('accessCode', 'Value to use for accessCode for validation. Defaults to ep1234')
	.describe('verifyCode', 'Value to use for verifyCode for validation. Defaults to ep1234!!')
	.describe('localIP', 'Value to use for the localIP parameter in the RPC call. Defaults to 127.0.0.1')
	.describe('localAddress', 'Value to use for the localAddress parameter in the RPC call. Defaults to localhost')
	.describe('connectTimeout', 'Value in milliseconds to use for the connectTimeout parameter in the RPC call. Defaults to 3000')
	.describe('sendTimeout', 'Value in milliseconds to use for the sendTimeout parameter in the RPC call. Defaults to 10000')
	.describe('context', 'Context to set for running the RPC. Defaults to HMP SYNCHRONIZATION CONTEXT')
	.describe('hmpServerId', 'Value for the hmpServerId parameter. Defaults to hmp-development-box')
	.describe('logLevel', 'Bunyan log levels, one of: trace, debug, info, warn, error, fatal. Defaults to error.')
	.describe('fetchTimeout', 'Time in seconds to wait for fetch data before timing out. Defaults to 10. Set to 0 to eliminate the timeout.')
	.describe('maxDepth', 'Maximum depth of the output (used in util.inspect()). If not given, then depth is "null" (full depth).')
	.describe('noSub', 'Optional parameter indicating that the "subscribe" RPC should not be called.')
	.describe('noUnsub', 'Optional parameter indicating that the "unsubscribe-all" RPC should not be called.')
	.describe('fetchDelay', 'Delay in milliseconds between each invocation of fetch. If not included, there is no delay')
	.describe('json', 'If present, then all of the output will be returned as a json array, unless an error occurs')
	.argv;

var depth = argv.maxDepth || null;
var asJson = !!argv.json;

var logger = require('bunyan').createLogger({
	name: 'rpc',
	level: argv.logLevel || 'error'
});

var unsubscribeRpc = 'HMPDJFS API';
var unsubscribeParams = {
	'"server"': argv.hmpServerId || 'hmp-development-box',
	'"command"': 'resetAllSubscriptions'
};

var subscribeRpc = 'HMPDJFS API';
var subscribeParams = {
	'"server"': argv.hmpServerId || 'hmp-development-box',
	'"command"': 'putPtSubscription',
	'"localId"': String(argv.dfn)
};

var fetchRpc = 'HMPDJFS API';
var fetchParams = {
	'"command"': 'getPtUpdates',
	'"lastUpdate"': '0',
	'"getStatus"': true,
	'"max"': '1000',
	'"hmpVersion"': '0.7-S65',
	'"extractSchema"': '3.001',
	'"server"': argv.hmpServerId || 'hmp-development-box'
};

// TODO: Change default to 30 seconds
var fetchTimeoutMillis = (_.has(argv, 'fetchTimeout') ? argv.fetchTimeout : 10) * 1000;
var fetchDelayMillis = argv.fetchDelay || 0;

var config = {
	host: argv.host,
	port: argv.port,
	accessCode: argv.accessCode || 'ep1234',
	verifyCode: argv.verifyCode || 'ep1234!!',
	localIP: argv.localIP || '127.0.0.1',
	localAddress: argv.localAddress || 'localhost',
	context: argv.context || 'HMP SYNCHRONIZATION CONTEXT',
	connectTimeout: argv.connectTimeout || 3000,
	sendTimeout: argv.sendTimeout || 10000
};


var client = RpcClient.create(logger, config);

var unsubscribe = argv.noUnsub ? dummyUnsubscribe : client.execute.bind(client, unsubscribeRpc, unsubscribeParams);
var subscribe = argv.noSub ? dummySubscribe : client.execute.bind(client, subscribeRpc, subscribeParams);

var startTime;
var started = false;
logger.debug('Connect to %s:%s', config.host, config.port);
client.connect(function(error, result) {
	if (error) {
		console.log('RpcClient unable to connect to %s:%s', config.host, config.port);
		console.log(error);
		return process.exit(1);
	}

	logger.debug('Connected to %s:%s as %j', config.host, config.port, result);

	logger.info('Unsubscribe: ' + !argv.noUnsub);
	unsubscribe(function(error, response) {
		var json = checkError(error, response, 'fetch');
		if (!argv.noUnsub) {
			logger.debug('Unsubscribe all : %j', json);
		}

		logger.info('Subscribe to %s: %s', argv.dfn, !argv.noSub);
		subscribe(function(error, response) {
			var json = checkError(error, response, 'fetch');

			if (asJson) {
				console.log('[');
				console.log(JSON.stringify(json));
			} else {
				console.log(inspect(json, {
					depth: depth
				}));
			}

			startTime = Date.now();
			setTimeout(fetch, fetchDelayMillis, client, fetchRpc, fetchParams, function() {
				client.close(function() {
					if (asJson) {
						console.log(']');
					}
					process.exit(0);
				});
			});
		});
	});
});


function dummyUnsubscribe(callback) {
	setTimeout(callback, 0, null, '{ "apiVersion": "1.0", "removed": "true" }');
}

function dummySubscribe(callback) {
	setTimeout(callback, 0, null, '{ "apiVersion": "1.0" }');
}

function fetch(client, rpc, params, callback) {
	client.logger.info('Fetch');
	if (!started && fetchTimeoutMillis && Date.now() - startTime > fetchTimeoutMillis) {
		console.log('Timeout: fetch exceeded %d seconds', Math.floor(fetchTimeoutMillis / 1000));
		return process.exit(1);
	}

	client.execute(rpc, params, function(error, response) {
		var json = checkError(error, response, 'fetch');

		client.logger.debug(json);

		if (asJson) {
			console.log(',');
			console.log(JSON.stringify(json));
		} else {
			console.log(inspect(json, {
				depth: depth
			}));
		}

		// Testing on patient "3", the very first fetch always returned
		// one item, but then returned 0 items several times until the
		// sync data started coming
		if (params['"lastUpdate"'] !== '0') {
			started = started || json.data.items.length > 0;
		}

		// console.log(inspect(json, { depth: null }));
		params['"lastUpdate"'] = json.data.lastUpdate;

		client.logger.info('lastUpdate: %s', json.data.lastUpdate);
		if (started && json.data.items.length < 1) {
			return callback();
		}

		setTimeout(fetch, fetchDelayMillis, client, rpc, params, callback);
	});
}

function checkError(error, response, operation) {
	if (error) {
		console.log('RpcClient error on %s against %s:%s', operation, config.host, config.port);
		console.log(error);
		process.exit(1);
	}

	try {
		return JSON.parse(response);
	} catch (parseError) {
		console.log('Unable to parse response to %s: %j', operation, parseError);
		console.log(response);
		process.exit(1);
	}
}