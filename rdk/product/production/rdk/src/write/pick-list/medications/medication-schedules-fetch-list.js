'use strict';
var VistaJS = require('../../core/VistaJS');
var parse = require('./medication-schedules-parser').parseMedicationSchedules;
var rpcUtil = require('./../utils/rpc-util');

/**
 * Calls the RPC 'ORWDPS1 SCHALL' to retrieve a list of printers<br/><br/>
 *
 * Each element is as follows:<br/>
 * scheduleName<br/>
 * outpatientExpansion<br/>
 * scheduleType<br/>
 * administrationTime
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 */
module.exports.fetch = function(logger, configuration, callback) {
    return rpcUtil.standardRPCCall(logger, configuration, 'ORWDPS1 SCHALL', parse, callback);
};
