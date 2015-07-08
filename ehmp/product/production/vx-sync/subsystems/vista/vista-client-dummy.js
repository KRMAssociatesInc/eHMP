'use strict';

var logUtil = require(global.VX_UTILS + 'log');
//var async = require('async');

function VistaClient(log, config, rpcClient) {
    this.log = log;
    this.rpcLog = logUtil.get('rpc', log);
    this.config = config.vistaSites;
//    this.hmpServerId = config['hmp.server.id'];
    this.rpcClient = rpcClient;
}

//callback: err, metastamp
VistaClient.prototype.subscribe = function(vistaId, patientIdentifier, rootJobId, jobId, subscribeCallback) {
    subscribeCallback(null, 'success');
};

VistaClient.prototype.unsubscribe = function(pid, unsubscribeCallback) {
    unsubscribeCallback(null, 'success');
};

VistaClient.prototype.fetchNextBatch = function(vistaId, batchCallback) {
    batchCallback(null, {});
};

VistaClient.prototype.fetchAppointment = function(vistaId, batchCallback) {
    batchCallback(null, {});
};

function _createRpcConfigVprContext(config, vistaId) {
    return ({});
}

module.exports = VistaClient;
module.exports._createRpcConfigVprContext = _createRpcConfigVprContext;