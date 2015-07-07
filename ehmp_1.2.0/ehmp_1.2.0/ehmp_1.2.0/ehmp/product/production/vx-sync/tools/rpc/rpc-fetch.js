'use strict';

require('../../env-setup');
var inspect = require('util').inspect;
var RpcClient = require(global.VX_VISTAJS + 'RpcClient').RpcClient;

var argv = require('yargs')
	.usage('Usage: $0 [options...]')
	.demand(['host', 'port'])
	.describe('host', 'IP Address of the VistA host')
	.describe('port', 'Port of the VistA host')
	.describe('accessCode', 'Value to use for accessCode for validation. Defaults to pu1234')
	.describe('verifyCode', 'Value to use for verifyCode for validation. Defaults to pu1234!!')
	.describe('context', 'Context to set for running the RPC. Defaults to VPR SYNCHRONIZATION CONTEXT or HMP SYNCHRONIZATION CONTEXT')
	.describe('lastUpdate', 'Value of the lastUpdate received. Defaults to 0')
	.describe('hmpServerId', 'Value for the hmpServerId parameter. Defaults to hmp-development-box')
	.describe('logLevel', 'bunyan log levels, one of: trace, debug, info, warn, error, fatal. Defaults to error.')
	.argv;


var logger = require('bunyan').createLogger({
	name: 'rpc',
	level: argv.logLevel || 'error'
});

var config = {
	host: argv.host,
	port: argv.port,
	accessCode: argv.accessCode || 'pu1234',
	verifyCode: argv.verifyCode || 'pu1234!!',
	localIP: '127.0.0.1',
	localAddress: 'localhost',
	context: argv.context || 'HMP SYNCHRONIZATION CONTEXT',
	connectTimeout: 3000,
	sendTimeout: 10000
};

var rpc = 'HMPDJFS API';
var params = {
	'"command"': 'getPtUpdates',
	'"lastUpdate"': argv.lastUpdate ? String(argv.lastUpdate) : '0',
	'"getStatus"': true,
	'"max"': '1000',
	'"hmpVersion"': '0.7-S65',
	'"extractSchema"': '3.001',
	'"server"': argv.hmpServerId || 'hmp-development-box'
};


RpcClient.callRpc(logger, config, rpc, params, function(error, response) {
	logger.debug('Completed calling Fetch RPC for dfn: %s; result: %j', argv.dfn, response);
	if (error) {
		console.log('Error calling Fetch');
		console.log(error);
		if (response) {
			console.log(response);
		}
		process.exit(1);
	}

	console.log('Called Fetch');
	console.log('Response:');
	try {
		console.log(inspect(JSON.parse(response), {
			depth: null
		}));
	} catch (err) {
		console.log(response);
	}
	process.exit(0);
});