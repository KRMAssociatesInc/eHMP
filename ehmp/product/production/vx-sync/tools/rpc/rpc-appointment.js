'use strict';

require('../../env-setup');
var _ = require('underscore');
var inspect = require('util').inspect;
var RpcClient = require('vista-js').RpcClient;

var argv = require('yargs')
	.usage('Usage: $0 [options...]')
	.demand(['host', 'port'])
	.describe('host', 'IP Address of the VistA host')
	.describe('port', 'Port of the VistA host')
	.describe('accessCode', 'Value to use for accessCode for validation. Defaults to ep1234')
	.describe('verifyCode', 'Value to use for verifyCode for validation. Defaults to ep1234!!')
	.describe('localIP', 'Value to use for the localIP parameter in the RPC call. Defaults to 127.0.0.1')
	.describe('localAddress', 'Value to use for the localAddress parameter in the RPC call. Defaults to localhost')
	.describe('connectTimeout', 'Value in milliseconds to use for the connectTimeout parameter in the RPC call. Defaults to 3000')
	.describe('sendTimeout', 'Value in milliseconds to use for the sendTimeout parameter in the RPC call. Defaults to 10000')
	.describe('context', 'Context to set for running the RPC. Defaults to VPR SYNCHRONIZATION CONTEXT or HMP SYNCHRONIZATION CONTEXT')
	.describe('logLevel', 'bunyan log levels, one of: trace, debug, info, warn, error, fatal. Defaults to error.')
	.argv;


var logger = require('bunyan').createLogger({
	name: 'rpc',
	level: argv.logLevel || 'error'
});

var rpc = 'HMP PATIENT ACTIVITY';


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

RpcClient.callRpc(logger, config, rpc, function(error, response) {
	logger.debug('Completed calling Patient Activity. result: %j', response);
	if (error) {
		console.log('Error calling Patient Activity');
		console.log(error);
		if (response) {
			console.log(response);
		}
		process.exit(1);
	}

	console.log('Called Patient Activity');
	console.log('Response:');
	if(_.isEmpty(response) || _.isEmpty(response.trim())){
		console.log('(Empty Response)');
		process.exit(0);
	}

	try {
		console.log(inspect(JSON.parse(response), {
			depth: null
		}));
	} catch (err) {
		console.log('<Invalid JSON>');
		console.log(response);
	}

	process.exit(0);
});