'use strict';

var _ = require('lodash');
var async = require('async');

var RpcSerializer = require('./RpcSerializer').RpcSerializer;
var RpcParameter = require('./RpcParameter').RpcParameter;
var RpcCall = require('./RpcCall').RpcCall;
var RpcSender = require('./RpcSender').RpcSender;

/*
config = {
    host: ,
    port: ,
    accessCode: ,
    verifyCode: ,
    context: ,
    localIP: ,
    localAddress ,
    connectTimeout ,
    sendTimeout
};
*/
function RpcClient(logger, config) {
    logger.debug('RpcClient.RpcClient()');
    if (!(this instanceof RpcClient)) {
        return new RpcClient(logger, config);
    }

    this.logger = logger;
    this.config = config;
    this.sender = null;
}


RpcClient.create = function create(logger, config) {
    logger.debug('RpcClient.create()');
    return new RpcClient(logger, config);
};


// Send the greeting, signonSetup, verifyLogin and setContext commands.
//
// The callback will be called with the parameters:
//    callback(error, loginInfo)
RpcClient.prototype.connect = function connect(callback) {
    this.logger.debug('RpcClient.connect()');

    if (!_.isUndefined(this.sender) && !_.isNull(this.sender)) {
        this.sender.close();
    }

    this.createSender();

    async.series({
        connect: this.sender.connect.bind(this.sender),
        greeting: this.greetingCommand.bind(this),
        signon: this.signonCommand.bind(this),
        verify: this.verifyCommand.bind(this),
        context: this.contextCommand.bind(this)
    }, function(error, results) {
        if (error) {
            return callback(error, results);
        }

        callback(null, results.verify);
    });
};


RpcClient.prototype.createSender = function() {
    this.logger.debug('RpcClient.createSender()');
    this.sender = new RpcSender(this.logger, this.config);
};


/*
variadic function:
execute(rpcCall)
execute(rpcName, [param]..., callback)
execute([rpcName, [param]..., callback])
*/
RpcClient.prototype.execute = function execute(rpcCall, callback) {
    this.logger.debug('RpcClient.execute()');
    this.logger.debug(rpcCall);

    if (arguments.length < 2) {
        // no arguments won't even get this far
        callback = arguments[0];
        return callback('Insufficient number of arguments');
    }

    if (_.isUndefined(this.sender) || _.isNull(this.sender)) {
        // TODO: attempt to connect automatically if this condition is met?
        return callback('RpcClient is not connected to the Vista server');
    }

    var args = _.toArray(arguments);
    callback = args.pop();

    var rpcCallParams = args;
    if (_.isArray(_.first(args))) {
        rpcCallParams = _.first(rpcCallParams);
    }

    this.logger.debug('rpcCallParams');
    this.logger.debug(rpcCallParams);
    var call = RpcCall.create(rpcCallParams);

    if (!call) {
        return callback('Invalid arguments for rpcCall');
    }

    this.sender.send(RpcSerializer.buildRpcString(call), callback);
};


RpcClient.prototype.close = function close(callback) {
    var self = this;
    self.logger.debug('RpcClient.close()');

    if (_.isUndefined(self.sender) || _.isNull(self.sender)) {
        return callback();
    }

    self.signoffCommand(function(error, result) {
        // we don't care if it returns an error, because
        // we call sender.close() in any case.
        self.sender.close();
        self.sender = null;
        callback(null, result || error);
    });
};


RpcClient.prototype.greetingCommand = function greetingCommand(callback) {
    var self = this;
    self.logger.debug('RpcClient.greetingCommand()');

    var rpcString = RpcSerializer.buildRpcGreetingString(this.config.localIP, this.config.localAddress);
    this.sender.send(rpcString, function greetingCallback(error, result) {
        if (error) {
            self.logger.debug('RpcClient.greetingCommand() error: %j', error);
            return callback(error, result);
        }

        self.logger.debug('RpcClient.greetingCommand() received: %j', result);
        if (result !== 'accept') {
            return callback('Response to greeting was invalid', result);
        }

        callback(null, 'HANDSHAKE SUCCESSFUL');
    });
};

RpcClient.prototype.signonCommand = function signonCommand(callback) {
    var self = this;
    self.logger.debug('RpcClient.signonCommand()');

    var rpcString = RpcSerializer.buildRpcString('XUS SIGNON SETUP');
    this.sender.send(rpcString, function signonCallback(error, result) {
        if (error) {
            self.logger.debug('RpcClient.signonCommand() error: %j', error);
            return callback(error, result);
        }

        self.logger.debug('RpcClient.greetingCommand() received: %j', result);
        if (!result || result.length === 0) {
            return callback('No response to signon callback');
        }

        callback(null, 'SIGNON SETUP SUCCESSFUL');
    });
};

RpcClient.prototype.verifyCommand = function verifyCommand(callback) {
    var self = this;
    self.logger.debug('RpcClient.verifyCommand()');

    var accessCode = this.config.accessCode;
    var verifyCode = this.config.verifyCode;
    var rpcString = RpcSerializer.buildRpcString('XUS AV CODE', RpcParameter.encrypted(accessCode + ';' + verifyCode));
    this.sender.send(rpcString, function verifyCallback(error, result) {
        if (error) {
            self.logger.debug('RpcClient.verifyCommand() error: %j', error);
            return callback(error, result);
        }

        self.logger.debug('RpcClient.verifyCommand() received: %j', result);
        if (_.isUndefined(result) || _.isNull(result) || result.length === 0) {
            return callback('No response to login request');
        }

        var parts = result.split('\r\n');

        if (parts[0] === '0') {
            return callback('No DUZ returned from login request', result);
        }

        var response = {
            accessCode: accessCode,
            verifyCode: verifyCode,
            duz: parts[0]
        };

        callback(null, response);
    });
};

RpcClient.prototype.contextCommand = function contextCommand(callback) {
    var self = this;
    self.logger.debug('RpcClient.contextCommand()');

    var context = this.config.context;
    var rpcString = RpcSerializer.buildRpcString('XWB CREATE CONTEXT', RpcParameter.encrypted(context));
    this.sender.send(rpcString, function contextCallback(error, result) {
        if (error) {
            self.logger.debug('RpcClient.contextCommand() error: %j', error);
            return callback(error, result);
        }

        self.logger.debug('RpcClient.contextCommand() received: %j', result);
        if (result !== '1') {
            return callback('Authorization error', result);
        }

        callback(null, context);
    });
};

RpcClient.prototype.signoffCommand = function signoffCommand(callback) {
    var self = this;
    self.logger.debug('RpcClient.signoffCommand()');

    var rpcString = RpcSerializer.buildRpcSignOffString();
    this.sender.send(rpcString, function signOffCallback(error, result) {
        if (error) {
            self.logger.debug('RpcClient.signoffCommand() error: %j', error);
            return callback(error, result);
        }

        self.logger.debug('RpcClient.signoffCommand() received: %j', result);
        callback(null, 'SIGNOFF SUCCESSFUL');
    });
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
    var args = _.toArray(arguments);

    if (args.length < 3) {
        throw new Error('Invalid number of arguments passed to callRpc()');
    }

    if (!(_.last(args) instanceof Function)) {
        throw new Error('No callback function was passed to callRpc()');
    }

    var client;
    if(isClient(_.first(args))) {
        client = args.shift();
        logger = client.logger;
    } else {
        client = new RpcClient(args.shift(), args.shift());
    }

    callback = args.pop();
    rpc = args.shift();
    parameters = args;
    logger.debug('callRpc(%s) parameters: %j', rpc, parameters);

    client.connect(function(error) {
        if (error) {
            logger.debug('error: %j', error);
            client.close(function() {
                // don't fail on disconnect, since the
                // connection is closed no matter what
                return callback(error);
            });

            return callback(error);
        }

        client.execute(rpc, parameters, function(error, result) {
            if (error) {
                return callback(error, result);
            }

            client.close(function() {
                // don't fail on disconnect, since the
                // connection is closed no matter what
                return callback(error, result);
            });
        });
    });
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
    var args = _.toArray(arguments);

    callback = args.pop();
    var client;
    if(isClient(_.first(args))) {
        client = args.shift();
        logger = client.logger;
    } else {
        client = new RpcClient(args.shift(), args.shift());
    }

    logger.debug('RpcClient.authenticate()');
    var authError;
    var authResult;

    client.connect(function(error, result) {
        authError = error;
        authResult = result;

        client.close(function() {
            // don't fail on disconnect, since the
            // connection is closed no matter what
            callback(authError, authResult);
        });
    });
}


function isClient(obj) {
    if (_.isEmpty(obj)) {
        return false;
    }

    var funcList = ['connect', 'execute', 'close'];
    return _.every(funcList, function(funcName) {
        return _.isFunction(obj[funcName]);
    });
}


module.exports.RpcClient = RpcClient;
RpcClient.callRpc = callRpc;
RpcClient.authenticate = authenticate;
RpcClient.isClient = isClient;