'use strict';
var parse = require('./lab-collect-times-parser').parseCollectTimes;
var rpcUtil = require('./../utils/rpc-util');

/**
 * Calls the RPC 'ORWDLR32 IMMED COLLECT' and parses out the data.<br/>
 * to retrieve a list of lab collection times<br/><br/>
 *
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 */
module.exports.fetch = function(logger, configuration, callback) {
    return rpcUtil.standardRPCCall(logger, configuration, 'ORWDLR32 IMMED COLLECT', parse, callback);
};
