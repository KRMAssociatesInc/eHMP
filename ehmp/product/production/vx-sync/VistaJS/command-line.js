'use strict';

var util = require('util');
var _ = require('underscore');

var inspect = _.partial(util.inspect, _, {
    depth: null
});

var argv = require('yargs')
    .usage('Usage: $0 --host <host> --port <port> --credentials [accessCode;verifyCode] --context [context] --rpc <rpc> --params [params] --paramType [type] --paramDelimiter [char] --connectTimeout [millis] --sendTimeout [millis] --logLevel [level]')
    .demand(['host', 'port', 'rpc'])
    .argv;

var bunyan = require('bunyan');
var RpcClient = require('./RpcClient').RpcClient;
var RpcParameter = require('./RpcParameter').RpcParameter;

var defaultConfig = {
    // host: '10.2.2.102',
    // port: 9210,
    accessCode: 'pu1234',
    verifyCode: 'pu1234!!',
    context: 'VPR UI CONTEXT',
    localIP: '127.0.0.1',
    localAddress: 'localhost',
    connectTimeout: 3000,
    sendTimeout: 10000
};

var config = {
    host: argv.host,
    port: argv.port
};

var paramDelimiter = argv.paramDelimiter || ',';

var argList = [];
if (argv.params) {
    argList = argv.params.split(paramDelimiter);
    if (argv.paramType === 'list') {
        argList = [RpcParameter.list(JSON.parse(argv.params))];
    }
}

if (argv.credentials) {
    config.accessCode = argv.credentials.split(';')[0];
    config.verifyCode = argv.credentials.split(';')[1];
}

if (argv.context) {
    config.context = argv.context;
}

if (argv.connectTimeout) {
    config.connectTimeout = argv.connectTimeout;
}

if (argv.sendTimeout) {
    config.sendTimeout = argv.sendTimeout;
}

config = _.defaults(config, defaultConfig);

var log = bunyan.createLogger({
    name: 'rpc',
    level: argv.logLevel || 'error'
});

log.debug(config);

console.log('RUNNING RPC: "%s"', argv.rpc);
if (argList.length > 0) {
    console.log('\twith "%s"', util.inspect(argList));
}
// RpcClient.callRpc(log, config, 'VPR GET PATIENT DATA JSON', '1', '2', function(error, result) {
RpcClient.callRpc(log, config, argv.rpc, argList, function(error, result) {
    if (error) {
        console.log();
        console.error('Unable to run RPC "%s"', argv.rpc);
        console.error(error);
        process.exit(1);
        return;
    }

    console.log();
    try {
        result = JSON.parse(result);
    } catch (e) {
        // do nothing
    }
    console.log('RESULT:');
    console.log(inspect(result));
    console.log();
    process.exit(0);
});