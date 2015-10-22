'use strict';

require('../../env-setup');
var inspect = require('util').inspect;
var RpcClient = require('vista-js').RpcClient;

var argv = require('yargs')
  .usage('Usage: $0 [options...]')
  .demand(['host', 'port'])
  .describe('host', 'IP Address of the VistA host')
  .describe('port', 'Port of the VistA host')
  .describe('accessCode', 'Value to use for accessCode for validation. Defaults to ep1234')
  .describe('verifyCode', 'Value to use for verifyCode for validation. Defaults to ep1234!!')
  .describe('context', 'Context to set for running the RPC. Defaults to VPR SYNCHRONIZATION CONTEXT or HMP SYNCHRONIZATION CONTEXT')
  .describe('rpc', 'Name of rpc to call.')
  .describe('parameters', 'Parameters to pass to rpc client.')
  .describe('logLevel', 'bunyan log levels, one of: trace, debug, info, warn, error, fatal. Defaults to error.')
  .argv;

var logger = require('bunyan').createLogger({
  name: 'rpc',
  level: argv.logLevel || 'error'
});

var config = {
  host: argv.host,
  port: argv.port,
  accessCode: argv.accessCode || 'ep1234',
  verifyCode: argv.verifyCode || 'ep1234!!',
  localIP: '127.0.0.1',
  localAddress: 'localhost',
  context: argv.context || 'HMP UI CONTEXT',
  connectTimeout: 3000,
  sendTimeout: 10000
};

var rpc = argv.rpc;
var params = JSON.parse(argv.params);

RpcClient.callRpc(logger, config, rpc, params, function(error, response) {
  console.log(params);
  logger.debug('Completed calling RPC: %s; result: %j', argv.rpc, response);
  if (error) {
    console.log('Error calling RPC');
    console.log(error);
    if (response) {
      console.log(response);
    }
    process.exit(1);
  }

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
