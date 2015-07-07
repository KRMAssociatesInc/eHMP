'use strict';

var _ = require('lodash');
var RpcParameter = require('./RpcParameter').RpcParameter;

function RpcCall(rpcName, params) {
    if (!(this instanceof RpcCall)) {
        return new RpcCall(rpcName, params);
    }

    this.rpcName = rpcName;
    this.params = params || [];
}

/*
Variadic:
create(rpcName)
create(rpcName, processor)
create(rpcName, params...)
create(rpcName, [params...])
create(rpcCall)

Additionally, this function takes the form of a single
array argument with the array containing some combination
of the parameters described above in the variadic forms.
*/
RpcCall.create = function create(rpcName, params) {
    if (arguments.length === 0 || !_.isArray(arguments[0])) {
        return create(_.toArray(arguments));
    }

    var args = arguments[0];

    if (args.length < 1 || _.isEmpty(args[0])) {
        return;
    }

    if (RpcCall.isRpcCall(args[0])) {
        return args[0];
    }

    rpcName = args[0];

    if (args.length < 2) {
        return new RpcCall(rpcName);
    }

    params = processParamList(_.rest(args));

    return new RpcCall(rpcName, params);
};


RpcCall.isRpcCall = function isRpcCall(param) {
    return !_.isEmpty(param) && param instanceof RpcCall;
};


function flattenAndRemoveNullishValues(paramList) {
    if (_.isUndefined(paramList) || _.isNull(paramList)) {
        return [];
    }

    if (!_.isArray(paramList)) {
        return [paramList];
    }

    return _.filter(_.flatten(paramList), function(value) {
        return !_.isUndefined(value) && !_.isNull(value);
    });
}


function processParamList(paramList) {
    if (_.isUndefined(paramList) || _.isNull(paramList)) {
        return [];
    }

    var convertedParams = flattenAndRemoveNullishValues(paramList);

    return _.map(convertedParams, function(param) {
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

module.exports.RpcCall = RpcCall;
module.exports._flattenAndRemoveNullishValues = flattenAndRemoveNullishValues;
module.exports._processParamList = processParamList;