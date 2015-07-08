/*jslint node: true */
'use strict';

var util = require('util');
var _ = require('underscore');

var defaultLogger = require('bunyan').createLogger({
    name: 'VistaJS-default',
    level: 'trace'
});

var NodeCache = require('node-cache');
var cache = new NodeCache({
    stdTTL: 600,
    checkperiod: 120
});
var cacheEnabled = true;
var cacheCommands = {
    'AUTHORIZE' : true,
    'ORWU USERINFO': true,
    'YTQ ALLKEYS': true
};

var VistaJSLibrary = require('./VistaJSLibrary');

function RpcParameter(stringifiedValue) {
    if (!this instanceof RpcParameter) {
        return new RpcParameter(stringifiedValue);
    }

    this.value = stringifiedValue;
}

RpcParameter.list = function(param) {
    return new RpcParameter(VistaJSLibrary.buildListParamString(_.map(param, function(value, key) {
        return {
            key: key,
            value: value
        };
    })));
};

RpcParameter.literal = function(param) {
    return new RpcParameter(VistaJSLibrary.buildLiteralParamString(param));
};

RpcParameter.encrypted = function(param, assocIndex, idIndex) {
    return new RpcParameter(VistaJSLibrary.buildEncryptedParamString(param, assocIndex, idIndex));
};

RpcParameter.reference = function(param) {
    return new RpcParameter(VistaJSLibrary.buildReferenceParamString(param));
};

RpcParameter.isRpcParameter = function(param) {
    return param instanceof RpcParameter;
};

var configRequiredKeys = [
    'host',
    'port',
    'accessCode',
    'verifyCode',
    'context',
    'localIP',
    'localAddress'
];


function buildCommand(logger, rpcName, parameterStringList) {
    logger.debug('RpcClient.buildCommand()');
    logger.debug('RpcClient param: %s', parameterStringList);

    var params = parameterStringList || [];
    if (!_.isArray(parameterStringList)) {
        params = [parameterStringList];
    }

    var rpc = VistaJSLibrary.buildRpcString(rpcName, params);

    logger.debug('RpcClient rpc: %s', rpc);
    return {
        rpc: rpc,

        process: function(data) {
            logger.trace('Response: ');
            logger.trace(data);

            return data;
        }
    };
}


function callRpc(logger, configuration, rpc, parameters, callback) {
    logger = logger || defaultLogger;

    if (!configuration) {
        throw new Error('no configuration parameter was passed to callRpc()');
    }

    var diff = _.difference(configRequiredKeys, _.keys(configuration));
    if (diff.length > 0) {
        throw new Error('the configuration parameter was missing the following keys: ' + diff);
    }

    if (!rpc) {
        throw new Error('no rpc parameter was passed to callRpc()');
    }

    if (arguments.length < 4) {
        throw new Error('Invalid number of arguments passed to callRpc()');
    }

    if (!(arguments[arguments.length - 1] instanceof Function)) {
        throw new Error('No callback function was passed to callRpc()');
    }

    callback = arguments[arguments.length - 1];

    var params = [];
    if (arguments.length > 4) {
        var args = _.toArray(arguments);
        params = _.map(args.slice(3, args.length - 1), function(param) {
            return param;
        });
    }

    params = _.flatten(params);
    params = _.filter(params, function(param) {
        return param !== null && param !== undefined;
    });

    var rpcParamList = processParamList(params);

    var key = createKey(logger, configuration, rpc, rpcParamList);    

    logger.debug('RpcClient call rpc: "%s" with config:\n%s ', rpc, util.inspect(configuration));

    var commandList = VistaJSLibrary.buildConnectionCommandList(logger, configuration);
    commandList.push(buildCommand(logger, rpc, _.map(rpcParamList, function(param) {
        return param.value;
    })));

    commandList.push(VistaJSLibrary.buildSignOffCommand(logger));

    var cachedResult = fetch(logger, key);
    if (cachedResult) {
        logger.debug('callRpc("%s") via cache', rpc);
        return callback(null, cachedResult);
    } else {
        var client = new VistaJSLibrary.RpcClient(logger, configuration, commandList, function(error, result) {
            logger.debug('callRpc("%s") via Vista-RPC', rpc);

            if (error) {
                return callback(error);
            }

            if (result.length && result.length > 4) {
                var rpcResult = result[4];
                save(logger, key, rpcResult);
                return callback(null, rpcResult);
            }

            callback(new Error('results were incomplete or undefined'));
        });

        client.start();
    }
}


function authenticate(logger, configuration, callback) {
    logger = logger || defaultLogger;

    var key = createKey(logger, configuration, 'AUTHORIZE');

    if (!configuration) {
        throw new Error('no configuration parameter was passed to authenticate()');
    }

    var diff = _.difference(configRequiredKeys, _.keys(configuration));
    if (diff.length > 0) {
        throw new Error('the configuration parameter was missing the following keys: ' + diff);
    }

    if (!(callback instanceof Function)) {
        throw new Error('No callback function was passed to authenticate()');
    }

    var commandList = VistaJSLibrary.buildConnectionCommandList(logger, configuration);
    commandList.push(VistaJSLibrary.buildSignOffCommand(logger));

    var cachedResult = fetch(logger, key);
    if (cachedResult) {
        logger.debug('authenticate() via cache');
        return callback(null, cachedResult);
    } else {
        var client = new VistaJSLibrary.RpcClient(logger, configuration, commandList, function(error, result) {
            logger.debug('authenticate() via Vista-RPC');
            if (error) {
                return callback(error);
            }

            if (result.length && result.length > 2) {
                var authInfo = result[2];
                save(logger, key, authInfo);
                return callback(null, authInfo);
            }

            callback(new Error('results were incomplete or undefined'));
        });

        client.start();
    }
}


function authenticateSSO(logger, configuration, callback) {
    logger = logger || defaultLogger;

    var key = createKey(logger, configuration, 'AUTHORIZE');

    if (!configuration) {
        throw new Error('no configuration parameter was passed to authenticate()');
    }

   var diff = _.difference(configRequiredKeys, _.keys(configuration));
   if (diff.length > 0) {
       throw new Error('the configuration parameter was missing the following keys: ' + diff);
   }

    if (!(callback instanceof Function)) {
        throw new Error('No callback function was passed to authenticate()');
    }

    var commandList = VistaJSLibrary.buildConnectionCommandListForSSO(logger, configuration);
    commandList.push(VistaJSLibrary.buildSignOffCommand(logger));

    var cachedResult = fetch(logger, key);
    if (cachedResult) {
        logger.debug('authenticate() via cache');
        return callback(null, cachedResult);
    } else {
        var client = new VistaJSLibrary.RpcClient(logger, configuration, commandList, function(error, result) {
            logger.debug('authenticate() via Vista-RPC');
            if (error) {
                return callback(error);
            }

            if (result.length && result.length > 2) {
                var authInfo = result[2];
                save(logger, key, authInfo);
                return callback(null, authInfo);
            }

            callback(new Error('results were incomplete or undefined'));
        });

        client.start();
    }
}


function callRpcSSO(logger, configuration, rpc, parameters, callback) {
    logger = logger || defaultLogger;

    if (!configuration) {
        throw new Error('no configuration parameter was passed to callRpc()');
    }

   var diff = _.difference(configRequiredKeys, _.keys(configuration));
   if (diff.length > 0) {
       throw new Error('the configuration parameter was missing the following keys: ' + diff);
   }

    if (!rpc) {
        throw new Error('no rpc parameter was passed to callRpc()');
    }

    if (arguments.length < 4) {
        throw new Error('Invalid number of arguments passed to callRpc()');
    }

    if (!(arguments[arguments.length - 1] instanceof Function)) {
        throw new Error('No callback function was passed to callRpc()');
    }

    callback = arguments[arguments.length - 1];

    var params = [];
    if (arguments.length > 4) {
        var args = _.toArray(arguments);
        params = _.map(args.slice(3, args.length - 1), function(param) {
            return param;
        });
    }

    params = _.flatten(params);
    params = _.filter(params, function(param) {
        return param !== null && param !== undefined;
    });

    var rpcParamList = processParamList(params);

    var key = createKey(logger, configuration, rpc, rpcParamList);

    logger.debug('RpcClient call rpc: "%s" with config:\n%s ', rpc, util.inspect(configuration));

    var commandList = VistaJSLibrary.buildConnectionCommandListForSSO(logger, configuration);
    commandList.push(buildCommand(logger, rpc, _.map(rpcParamList, function(param) {
        return param.value;
    })));

    commandList.push(VistaJSLibrary.buildSignOffCommand(logger));

    var cachedResult = fetch(logger, key);
    if (cachedResult) {
        logger.debug('callRpc("%s") via cache', rpc);
        return callback(null, cachedResult);
    } else {
    var client = new VistaJSLibrary.RpcClient(logger, configuration, commandList, function(error, result) {
        logger.debug('callRpc("%s") via Vista-RPC', rpc);
        if (error) {
            return callback(error);
        }

        if (result.length && result.length > 4) {
            var rpcResult = result[4];
            save(logger, key, rpcResult);
            return callback(null, rpcResult);
        }

        callback(new Error('results were incomplete or undefined'));
    });

    client.start();
}
}



function processParamList(paramList) {
    if (paramList === null || paramList === undefined) {
        return [];
    }

    return _.map(paramList, function(param) {
        if (RpcParameter.isRpcParameter(param)) {
            return param;
        }

        var stringParam = param;
        if (_.isNumber(param)) {
            stringParam = String(param);
        }

        if (_.isString(stringParam)) {
            return RpcParameter.literal(stringParam);
        }

        return RpcParameter.list(param);
    });
}

// TODO: restructure key to keep pieces to allow easier
// introspection for exclusions, etc.

function createKey(logger, configuration, rpc, paramList) {
    var paramStrings = _.map(paramList, function(param){
        return param.value;
    });

    var hashString = (rpc || 'AUTHORIZE') + '@' + _.values(configuration).join(':') + (paramStrings.length > 0 ? ('=>' + paramStrings.join('^')) :'');
    
    logger.debug('hashString: %s', hashString);
    return {
        hashString: hashString,
        rpc: rpc
    };
}

function fetch(logger, key) {
    var object;

    if(cacheCommands[key.rpc]) {
        logger.debug('fetched %s', key.hashString);
        object = cache.get(key.hashString);
    }

    if (!cacheEnabled || _.isEmpty(object)) {
        return undefined;
    }

    logger.debug('returning for %s: %s', key.hashString, util.inspect(object[key.hashString], {depth: null}));
    return object[key.hashString];
}

function save(logger, key, result) {
    if (cacheEnabled) {
        logger.debug('saved cache %s', key.hashString);
        cache.set(key.hashString, result);
    }
}

// PUBLIC functions
module.exports.RpcParameter = RpcParameter;
module.exports.callRpc = callRpc;
module.exports.authenticate = authenticate;
module.exports.authenticateSSO = authenticateSSO;
module.exports.callRpcSSO = callRpcSSO;
