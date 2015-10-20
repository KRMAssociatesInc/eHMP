'use strict';
var parse = require('./lab-order-specimens-parser').parseLabOrderSpecimens;
var rpcUtil = require('./../utils/rpc-util');

/**
 * Calls the RPC 'ORWDLR32 ALLSPEC' and parses out the data.<br/>
 * to retrieve a list of specimens<br/><br/>
 *
 * Each element is as follows:<br/>
 * 1. ien<br/>
 * 2. name  (SNOMED CODE)<br/>
 * The SNOMED CODE will appear inside parentheses.<br/>
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 */
module.exports.fetch = function(logger, configuration, callback) {
    return rpcUtil.standardRPCCall(logger, configuration, 'ORWDLR32 ALLSPEC', '', '1', parse, callback);
};
