'use strict';
var parse = require('./immunization-types-parser').parseImmunizationTypes;
var rpcUtil = require('./../utils/rpc-util');

/**
 * Calls the RPC 'ORWPCE GET IMMUNIZATION TYPE' and parses out the data<br/><br/>
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 */
module.exports.fetch = function(logger, configuration, callback) {
	return rpcUtil.standardRPCCall(logger, configuration, 'ORWPCE GET IMMUNIZATION TYPE', '', parse, callback);
};
