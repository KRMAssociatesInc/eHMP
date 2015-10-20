'use strict';
var VistaJS = require('../../core/VistaJS');
var parse = require('./printer-devices-parser').parsePrinterDevices;
var rpcUtil = require('./../utils/rpc-util');

/**
 * Calls the RPC 'ORWU DEVICE' and parses out the data.<br/>
 * to retrieve a list of printers<br/><br/>
 *
 * Each element is as follows:<br/>
 * ienName - ien and name separated by a semicolon<br/>
 * displayName<br/>
 * location<br/>
 * rMar<br/>
 * pLen<br/>
 * ien (we parse ienName and put it into this field)<br/>
 * name (we parse ienName and put it into this field)<br/>
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 */
module.exports.fetch = function(logger, configuration, callback) {
    return rpcUtil.standardRPCCall(logger, configuration, 'ORWU DEVICE', '', '1', parse, callback);
};
