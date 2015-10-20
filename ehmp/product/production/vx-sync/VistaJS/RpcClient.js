'use strict';

var _ = require('underscore');
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
    sendTimeout ,
    noReconnect
};
*/
function RpcClient(logger, config) {
    logger.debug('RpcClient.RpcClient(%s:%s)', config.host, config.port);
    if (!(this instanceof RpcClient)) {
        return new RpcClient(logger, config);
    }

    this.queue = async.queue(this._worker.bind(this), 1);

    this.queue._noReconnect = config.noReconnect;
    this.queue._highWaterMark = 0;

    this.logger = logger;
    this.config = config;
    this.sender = null;
}


RpcClient.create = function create(logger, config) {
    logger.debug('RpcClient.create(%s:%s)', config.host, config.port);
    return new RpcClient(logger, config);
};


RpcClient.prototype._worker = function _worker(task, queueCallback) {
    this.logger.debug('RpcClient._worker(%s:%s)', this.config.host, this.config.port);

    function executeCallbacks(error, result) {
        // task.callback(error, result);
        // queueCallback();
        setTimeout(task.callback, 0, error, result);
        setTimeout(queueCallback);
    }

    if (task.isConnector) {
        return task(function(error, result) {
            executeCallbacks(error, result);
        });
    }

    var self = this;
    task(function(error, result) {
        if (error) {
            if (self.queue._noReconnect) {
                return executeCallbacks(error, result);
            }

            return self._connect(function(error) {
                if (error) {
                    return executeCallbacks(error);
                }

                task(function(error, result) {
                    return executeCallbacks(error, result);
                });
            });
        }

        executeCallbacks(error, result);
    });
};


RpcClient.prototype._enqueue = function _enqueue(task) {
    this.logger.debug('RpcClient._enqueue(%s:%s)', this.config.host, this.config.port);

    this.queue.push(task);
    this.queue._highWaterMark = this.queue.length() > this.queue._highWaterMark ? this.queue.length() : this.queue._highWaterMark;
};


// Send the greeting, signonSetup, verifyLogin and setContext commands.
//
// The callback will be called with the parameters:
//    callback(error, loginInfo)
RpcClient.prototype.connect = function connect(callback) {
    this.logger.debug('RpcClient.connect(%s:%s)', this.config.host, this.config.port);

    var task = this._connect.bind(this);
    task.callback = callback;
    task.command = 'connect';
    task.isConnector = true;

    this._enqueue(task);
};


RpcClient.prototype._connect = function _connect(callback) {
    this.logger.debug('RpcClient._connect(%s:%s)', this.config.host, this.config.port);

    if (!_.isUndefined(this.sender) && !_.isNull(this.sender)) {
        this.sender.close();
    }

    this._createSender();
    this.logger.trace('RpcClient._connect(%s:%s) sender created', this.config.host, this.config.port);

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

RpcClient.prototype._createSender = function _createSender() {
    this.logger.debug('RpcClient._createSender(%s:%s)', this.config.host, this.config.port);
    this.sender = new RpcSender(this.logger, this.config);
};


/*
variadic function:
execute(rpcCall, callback)
execute(rpcName, [param]..., callback)
*/
RpcClient.prototype.execute = function execute(rpcCall, callback) {
    this.logger.debug('RpcClient.execute(%s:%s)', this.config.host, this.config.port);
    this.logger.debug('%s:%s -> %s', this.config.host, this.config.port, rpcCall);

    if (arguments.length < 2) {
        // no arguments won't even get this far
        callback = arguments[0];
        return setTimeout(callback, 0, 'Insufficient number of arguments');
    }

    // if (_.isUndefined(this.sender) || _.isNull(this.sender)) {
    //     // TODO: attempt to connect automatically if this condition is met?
    //     return setTimeout(callback, 0, 'RpcClient is not connected to the Vista server');
    // }

    var args = _.toArray(arguments);
    callback = args.pop();

    var rpcCallParams = args;
    if (_.isArray(_.first(args))) {
        rpcCallParams = _.first(rpcCallParams);
    }

    this.logger.debug('RpcClient.execute(%s:%s) -> rpcCallParams: %s', this.config.host, this.config.port, rpcCallParams);
    rpcCall = RpcCall.create(rpcCallParams);

    if (!rpcCall) {
        return setTimeout(callback, 0, 'Invalid arguments for rpcCall');
    }

    var task = this._execute.bind(this, rpcCall);
    task.callback = callback;
    task.command = 'execute';

    this._enqueue(task);
};


/*
variadic function:
_executeRpc(rpcCall, callback)
_executeRpc(rpcName, [param]..., callback)
*/
RpcClient.prototype._execute = function _execute(rpcCall, callback) {
    this.logger.debug('RpcClient._execute(%s:%s)', this.config.host, this.config.port);
    this.logger.debug(rpcCall);

    var rpcString = RpcSerializer.buildRpcString(rpcCall);

    var self = this;
    if (_.isUndefined(self.sender) || _.isNull(self.sender)) {
        return setTimeout(callback, 0, 'Connection not initialized');
        // return self._connect(function(error) {
        //     if (error) {
        //         return callback(error);
        //     }

        //     self.sender.send(rpcString, callback);
        // });
    }

    this.sender.send(rpcString, function(error, result) {
        // if (error) {
        //     return self._connect(function(error) {
        //         if (error) {
        //             return callback(error);
        //         }

        //         self.sender.send(rpcString, callback);
        //     });
        // }

        callback(error, result);
    });
};


RpcClient.prototype.close = function close(callback) {
    callback = callback || function() {};
    var self = this;
    self.logger.debug('RpcClient.close(%s:%s)', self.config.host, self.config.port);

    var task = this._close.bind(this);
    task.callback = callback;
    task.command = 'close';
    task.isConnector = true;

    this._enqueue(task);
};


RpcClient.prototype._close = function _close(callback) {
    callback = callback || function() {};
    var self = this;
    self.logger.debug('RpcClient._close(%s:%s)', self.config.host, self.config.port);

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
    self.logger.debug('RpcClient.greetingCommand(%s:%s)', self.config.host, self.config.port);

    var rpcString = RpcSerializer.buildRpcGreetingString(this.config.localIP, this.config.localAddress);
    this.sender.send(rpcString, function greetingCallback(error, result) {
        if (error) {
            self.logger.debug('RpcClient.greetingCommand(%s:%s) error: %j', self.config.host, self.config.port, error);
            return callback(error, result);
        }

        self.logger.debug('RpcClient.greetingCommand(%s:%s) received: %j', self.config.host, self.config.port, result);
        if (result !== 'accept') {
            return callback('Response to greeting was invalid', result);
        }

        callback(null, 'HANDSHAKE SUCCESSFUL');
    });
};

RpcClient.prototype.signonCommand = function signonCommand(callback) {
    var self = this;
    self.logger.debug('RpcClient.signonCommand(%s:%s)', self.config.host, self.config.port);

    var rpcString = RpcSerializer.buildRpcString('XUS SIGNON SETUP');
    this.sender.send(rpcString, function signonCallback(error, result) {
        if (error) {
            self.logger.debug('RpcClient.signonCommand(%s:%s) error: %j', self.config.host, self.config.port, error);
            return callback(error, result);
        }

        self.logger.debug('RpcClient.greetingCommand(%s:%s) received: %j', self.config.host, self.config.port, result);
        if (!result || result.length === 0) {
            return callback('No response to signon callback');
        }

        callback(null, 'SIGNON SETUP SUCCESSFUL');
    });
};

RpcClient.prototype.verifyCommand = function verifyCommand(callback) {
    var self = this;
    self.logger.debug('RpcClient.verifyCommand(%s:%s)', self.config.host, self.config.port);

    var accessCode = this.config.accessCode;
    var verifyCode = this.config.verifyCode;
    var rpcString = RpcSerializer.buildRpcString('XUS AV CODE', RpcParameter.encrypted(accessCode + ';' + verifyCode));
    this.sender.send(rpcString, function verifyCallback(error, result) {
        if (error) {
            self.logger.debug('RpcClient.verifyCommand(%s:%s) error: %j', self.config.host, self.config.port, error);
            return callback(error, result);
        }

        self.logger.debug('RpcClient.verifyCommand(%s:%s) received: %j', self.config.host, self.config.port, result);
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
    self.logger.debug('RpcClient.contextCommand(%s:%s)', self.config.host, self.config.port);

    var context = this.config.context;
    var rpcString = RpcSerializer.buildRpcString('XWB CREATE CONTEXT', RpcParameter.encrypted(context));
    this.sender.send(rpcString, function contextCallback(error, result) {
        if (error) {
            self.logger.debug('RpcClient.contextCommand(%s:%s) error: %j', self.config.host, self.config.port, error);
            return callback(error, result);
        }

        self.logger.debug('RpcClient.contextCommand(%s:%s) received: %j', self.config.host, self.config.port, result);
        if (result !== '1') {
            return callback('Authorization error', result);
        }

        callback(null, context);
    });
};

RpcClient.prototype.signoffCommand = function signoffCommand(callback) {
    var self = this;
    self.logger.debug('RpcClient.signoffCommand(%s:%s)', self.config.host, self.config.port);

    var rpcString = RpcSerializer.buildRpcSignOffString();
    this.sender.send(rpcString, function signOffCallback(error, result) {
        if (error) {
            self.logger.debug('RpcClient.signoffCommand(%s:%s) error: %j', self.config.host, self.config.port, error);
            return callback(error, result);
        }

        self.logger.debug('RpcClient.signoffCommand(%s:%s) received: %j', self.config.host, self.config.port, result);
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
    if (isClient(_.first(args))) {
        client = args.shift();
        logger = client.logger;
    } else {
        client = new RpcClient(args.shift(), args.shift());
    }

    callback = args.pop();
    rpc = args.shift();
    parameters = args;
    logger.debug('callRpc(%s:%s) rpc: %s parameters: %j', config.host, config.port, rpc, parameters);

    client.connect(function(error) {
        if (error) {
            logger.debug('error: %j', error);
            client.close();
            return callback(error);
        }

        client.execute(rpc, parameters, function(error, result) {
            client.close();
            return callback(error, result);
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
    if (isClient(_.first(args))) {
        client = args.shift();
        logger = client.logger;
    } else {
        client = new RpcClient(args.shift(), args.shift());
    }

    logger.debug('RpcClient.authenticate(%s:%s)', config.host, config.port);
    var authError;
    var authResult;

    client.connect(function(error, result) {
        authError = error;
        authResult = result;

        client.close();
        callback(authError, authResult);
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