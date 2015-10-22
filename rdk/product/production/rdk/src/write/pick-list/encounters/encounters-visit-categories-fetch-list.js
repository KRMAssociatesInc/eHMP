'use strict';
var parse = require('./encounters-visit-categories-parser').parseEncountersVisitCategories;
var rpcUtil = require('./../utils/rpc-util');
var validate = require('./../utils/validation-util');
var _ = require('lodash');

/**
 * Calls the RPC 'ORWPCE VISIT' and parses out the data<br/><br/>
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param clinicIen The ien of the clinic for which to find visit categories
 * @param visitDate The date of the visit/encounter (optional)
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 */
function getEncountersVisitCategories(logger, configuration, clinicIen, visitDate, callback) {
    if (!validate.isWholeNumber(clinicIen)) {
        return callback('clinicIen cannot be empty and must be a whole number');
    }
    if (!validate.isWholeNumber(visitDate)) {
        visitDate = null;
    }

    return rpcUtil.standardRPCCall(logger, configuration, 'ORWPCE VISIT', clinicIen, visitDate, parse, callback);
}

module.exports.getEncountersVisitCategories = getEncountersVisitCategories;
module.exports.fetch = function(logger, configuration, callback, params) {
    getEncountersVisitCategories(logger, configuration, _.get(params, 'ien'), _.get(params, 'visitDate'), callback);
};
