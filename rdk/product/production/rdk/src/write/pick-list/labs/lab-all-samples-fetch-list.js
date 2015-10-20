'use strict';
var parse = require('./lab-all-samples-parser').parseLabSamples;
var rpcUtil = require('./../utils/rpc-util');

/**
 * Calls the RPC 'ORWDLR32 ALLSAMP' and parses out the data.<br/>
 * to retrieve a list of all lab samples<br/><br/>
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 */
module.exports.fetch = function(logger, configuration, callback) {
    return rpcUtil.standardRPCCall(logger, configuration, 'ORWDLR32 ALLSAMP', parse, callback);
};
