'use strict';
var parse = require('./encounters-visit-service-connected-parser').serviceConnected;
var validate = require('./../utils/validation-util');
var rpcUtil = require('./../utils/rpc-util');
var _ = require('lodash');

/**
 * Calls the RPC 'ORWPCE SCSEL' and parses out the data.<br/>
 *
 * input:dfn, visitDatTime, locien<br/>
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param dfn
 * @param visitData
 * @param loc
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 */
function serviceConnected(logger, configuration, dfn, visitDate, loc, callback) {
    //TODO We also need to figure out if these parameters are really required or if some of them are optional.
    //     For now, they really are optional, because we just return mock data that doesn't change based on any parameters.
    if (validate.isStringNullish(dfn)) {
        dfn = null;
    }
    if (validate.isStringNullish(visitDate)) {
        visitDate = null;
    }
    if (validate.isStringNullish(loc)) {
        loc = null;
    }

    //TODO DELETE FROM HERE TO THE END TAG ONCE WE CAN START CALLING THE DATA FROM THE RPC
    //For now we are mocking RPC Data. Once we start calling, data should be in this format 0^;0^;0^;0^;0^;0^;0^;0
    var rpcData = '1^;0^;0^;0^;0^;0^;0^;0';
    try {
        var obj = parse(logger, rpcData);
        return callback(null, obj);
    }
    catch (parseError) {
        return callback(parseError.message);
    }
    //TODO DELETE FROM ABOVE TO HERE ONCE WE CAN START CALLING THE DATA FROM THE RPC

    return rpcUtil.standardRPCCall(logger, configuration, 'ORWPCE SCSEL', dfn, visitDate, loc, parse, callback);
}

module.exports.serviceConnected = serviceConnected;
module.exports.fetch = function(logger, configuration, callback, params) {
    serviceConnected(logger, configuration, _.get(params, 'dfn'), _.get(params, 'visitDate'), _.get(params, 'loc'), callback);
};
