'use strict';

var parse = require('./lab-default-immediate-collect-time-parser').parseDefaultImmediateCollectTime;
var rpcUtil = require('./../../../pick-list/utils/rpc-util');

/**
 * Calls the RPC 'ORWDLR32 IC DEFAULT' and parses out the data.<br/>
 * to retrieve a default immediate collect time.<br/><br/>
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 */
module.exports.getDefaultImmediateCollectTime = function(logger, configuration, callback) {
    return rpcUtil.standardRPCCall(logger, configuration, 'ORWDLR32 IC DEFAULT', parse, callback);
};
