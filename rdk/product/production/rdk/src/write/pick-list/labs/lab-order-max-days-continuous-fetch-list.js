'use strict';
var parse = require('./lab-order-max-days-continuous-parser').parseLabOrderMaxDaysContinuous;
var validate = require('./../utils/validation-util');
var rpcUtil = require('./../utils/rpc-util');
var _ = require('lodash');

/**
 * Calls the RPC 'ORWDLR32 MAXDAYS' and parses out the data<br/><br/>
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param location The location of the lab order
 * @param schedule The schedule of the lab order
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 */
function getLabOrderMaxDaysContinuous(logger, configuration, location, schedule, callback) {
    if (!validate.isWholeNumber(location)) {
        return callback('location cannot be empty and must be a whole number');
    }
    if (!validate.isWholeNumber(schedule)) {
        return callback('schedule cannot be empty and must be a whole number');
    }

    return rpcUtil.standardRPCCall(logger, configuration, 'ORWDLR32 MAXDAYS', location, schedule, parse, callback);
}

module.exports.getLabOrderMaxDaysContinuous = getLabOrderMaxDaysContinuous;
module.exports.fetch = function(logger, configuration, callback, params) {
    getLabOrderMaxDaysContinuous(logger, configuration, _.get(params, 'location'), _.get(params, 'schedule'), callback);
};
