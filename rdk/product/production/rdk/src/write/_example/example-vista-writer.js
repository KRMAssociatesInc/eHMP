'use strict';

var async = require('async');
var VistaJS = require('../core/VistaJS');
var RpcParameter = VistaJS.RpcParameter;

module.exports.create = function(writebackContext, callback) {
    var pid = writebackContext.pid;
    async.series([
        function sendDataToVista(callback) {
            var parameters = [];
            var rpcName = 'ORQPT MYRPC';
            parameters.push(new RpcParameter.literal('MYPARAM'));
            VistaJS.callRpc(
                writebackContext.logger,
                writebackContext.vistaConfig,
                rpcName,
                parameters,
                callback);
        }
    ], function(err, data) {
        if(err) {
            return callback(err, data);
        }
        writebackContext.vprModel = null;  // TODO set this by the VistA response
        var error = null;  // TODO set error if trouble writing back
        return callback(error);
    });
};

module.exports.update = function(writebackContext, callback) {
    var pid = writebackContext.pid;
    async.series([
        function sendDataToVista(callback) {
            var parameters = [];
            var rpcName = 'ORQPT MYRPC';
            parameters.push(new RpcParameter.literal('MYPARAM'));
            VistaJS.callRpc(
                writebackContext.logger,
                writebackContext.vistaConfig,
                rpcName,
                parameters,
                callback);
        }
    ], function(err, data) {
        if(err) {
            return callback(err, data);
        }
        writebackContext.vprModel = null;  // TODO set this by the VistA response
        var error = null;  // TODO set error if trouble writing back
        return callback(error);
    });
};

module.exports.readNexTime = function(writebackContext, callback) {
    var pid = writebackContext.pid;
    async.series([
        function getDataFromVista(callback) {
            var parameters = [];
            var rpcName = 'ORQPT MYRPC';
            parameters.push(new RpcParameter.literal('MYPARAM'));
            VistaJS.callRpc(
                writebackContext.logger,
                writebackContext.vistaConfig,
                rpcName,
                parameters,
                callback);
        }
    ], function(err, data) {
        if(err) {
            return callback(err, data);
        }
        writebackContext.vprModel = null;  // TODO set this by the VistA response
        var error = null;  // TODO set error if trouble writing back
        return callback(error);
    });
};

