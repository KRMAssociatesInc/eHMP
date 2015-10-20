'use strict';

function RpcClient() {}

RpcClient.create = function create(logger, config) {
    return new RpcClient(logger, config);
};


// Send the greeting, signonSetup, verifyLogin and setContext commands.
//
// The callback will be called with the parameters:
//    callback(error, loginInfo)
RpcClient.prototype.connect = function connect(callback) {
    var error = null;
    var results = '';
    return callback(error, results);
};


RpcClient.prototype.createSender = function() {};


RpcClient.prototype.execute = function execute(rpcCall, params, callback) {
    callback(null, null);
};


RpcClient.prototype.close = function close(callback) {
    callback(null, null);
};


RpcClient.prototype.greetingCommand = function greetingCommand(callback) {
    callback(null, 'HANDSHAKE SUCCESSFUL');
};

RpcClient.prototype.signonCommand = function signonCommand(callback) {
    callback(null, 'SIGNON SETUP SUCCESSFUL');
};

RpcClient.prototype.verifyCommand = function verifyCommand(callback) {
    callback(null, null);
};

RpcClient.prototype.contextCommand = function contextCommand(callback) {
    var context = null;
    callback(null, context);
};

RpcClient.prototype.signoffCommand = function signoffCommand(callback) {
    callback(null, 'SIGNOFF SUCCESSFUL');
};


///////////////////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////////////////

/*
Variadic function:
First: if the first parameter is an instance of a client
(i.e. it has functions named 'connect', 'execute', and 'close'),
then the signature is:
callRpc(client, rpc, parameters, callback)

Otherwise, it is:
callRpc(logger, config, rpc, parameters, callback)

The last parameter must *always* be a callback.

the rpc parameter must *always be present.

Parameters can be a single parameter, or can occur any
number of times. Also, it can be an array (of parameters).
*/
function callRpc(logger, config, rpc, parameters, callback) {
    var error = null;
    var rpcResult = null;
    callback(error, rpcResult);
}


/*
Variadic function:
First: if the first parameter is an instance of a client
(i.e. it has functions named 'connect', 'execute', and 'close'),
then the signature is:
callRpc(client, rpc, parameters, callback)

Otherwise, it is:
authenticate(logger, config, callback)

The last parameter must *always* be a callback.
*/
function authenticate(logger, config, callback) {
    var authResult = null;
    callback(null, authResult);
}


function isClient() {
    return true;
}


module.exports.RpcClient = RpcClient;
RpcClient.callRpc = callRpc;
RpcClient.authenticate = authenticate;
RpcClient.isClient = isClient;