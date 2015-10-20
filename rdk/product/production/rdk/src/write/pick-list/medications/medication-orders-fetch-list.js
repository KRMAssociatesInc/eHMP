'use strict';
var VistaJS = require('../../core/VistaJS');
var parse = require('./medication-orders-parser').parseMedicationOrders;
var validate = require('./../utils/validation-util');
var rpcUtil = require('./../utils/rpc-util');
var _ = require('lodash');

/**
 * Calls the RPC 'ORWUL FVSUB' and parses out the data to retrieve a list of available Med Orders<br/><br/>
 *
 * Each element is as follows:<br/>
 * <br/>
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param ien ien, from rpc 'ORWUL FV4DG' (call getMedicationList to get this value).
 * @param firstEntryFromArray parameter for the first entry you want returned from the array returned
 * @param lastEntryFromArray parameter for the last entry you want returned from the array returned
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 */
function getMedicationOrders(logger, configuration, ien, firstEntryFromArray, lastEntryFromArray, callback) {
    if (!validate.isWholeNumber(ien)) {
        return callback('ien cannot be empty, must be a whole number, and it must be obtained from a call to \'ORWUL FV4DG\' (ex. 31 = O RX = Outpatient Meds).');
    }
    if (!validate.isWholeNumber(firstEntryFromArray)) {
        return callback('firstEntryFromArray parameter cannot be empty (or a non-numeric value)');
    }
    if (!validate.isWholeNumber(lastEntryFromArray)) {
        return callback('lastEntryFromArray parameter cannot be empty (or a non-numeric value)');
    }

    return rpcUtil.standardRPCCall(logger, configuration, 'ORWUL FVSUB', ien, firstEntryFromArray, lastEntryFromArray, parse, callback);
}

module.exports.getMedicationOrders = getMedicationOrders;
module.exports.fetch = function(logger, configuration, callback, params) {
    getMedicationOrders(logger, configuration, _.get(params, 'ien'), _.get(params, 'first'), _.get(params, 'last'), callback);
};
