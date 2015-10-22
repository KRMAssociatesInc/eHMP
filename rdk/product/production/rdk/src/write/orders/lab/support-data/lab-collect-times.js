/**
 * This is temporary until 'ORWDLR32 GET LAB TIMES' is in pick-list resource
 */
'use strict';

var parse = require('./lab-collect-times-parser').parseCollectTimes;
var rpcUtil = require('./../../../pick-list/utils/rpc-util');
var validate = require('./../../../pick-list/utils/validation-util');

/**
 * Calls the RPC 'ORWDLR32 GET LAB TIMES' and parses out the data.<br/>
 * to retrieve list of lab collect times for a date & location.<br/><br/>
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param dateSelected The date selected
 * @param location The location of the lab order
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 */
module.exports.getLabCollectTimes = function(logger, configuration, dateSelected, location, callback) {
    if (!validate.isWholeNumber(dateSelected)) {
        return callback('dateSelected cannot be empty and must be a whole number');
    }
    if (!validate.isWholeNumber(location)) {
        return callback('location cannot be empty and must be a whole number');
    }

    return rpcUtil.standardRPCCall(logger, configuration, 'ORWDLR32 GET LAB TIMES', dateSelected, location, parse, callback);
};
