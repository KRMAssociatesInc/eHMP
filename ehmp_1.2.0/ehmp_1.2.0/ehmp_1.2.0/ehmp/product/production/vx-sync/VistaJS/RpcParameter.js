'use strict';

var _ = require('underscore');

// Don't use this constructor, use the type factory functions:
//    list(), literal(), reference(), encrypted()
function RpcParameter(value, type, attributes) {
    if (!(this instanceof RpcParameter)) {
        return new RpcParameter(value, type, attributes);
    }

    this.value = value;
    this.type = type;

    this.attributes = {};

    if (!_.isUndefined(attributes) && !_.isNull(attributes)) {
        this.attributes = attributes;
    }
}

RpcParameter.list = function(param) {
    return new RpcParameter(param, 'list');
};

RpcParameter.literal = function(param) {
    return new RpcParameter(param, 'literal');
};

RpcParameter.encrypted = function(param, assocIndex, idIndex) {
    return new RpcParameter(param, 'encrypted', {
        assocIndex: assocIndex,
        idIndex: idIndex
    });
};

RpcParameter.reference = function(param) {
    return new RpcParameter(param, 'reference');
};

RpcParameter.isRpcParameter = function(param) {
    return !_.isUndefined(param) && !_.isNull(param) && param instanceof RpcParameter;
};

module.exports.RpcParameter = RpcParameter;