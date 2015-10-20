'use strict';
var parse = require('./encounters-diagnosis-codes-for-clinic-parser').parseEncountersDiagnosisCodesForClinic;
var rpcUtil = require('./../utils/rpc-util');
var validate = require('./../utils/validation-util');
var _ = require('lodash');

/**
 * Calls the RPC 'ORWPCE DIAG' and parses out the data<br/><br/>
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param clinic to get diagnostic code for
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 */
function getEncountersDiagnosisCodesForClinic(logger, configuration, clinic, callback) {
    if (!validate.isWholeNumber(clinic)) {
        return callback('Clinic cannot be empty.');
    }

    return rpcUtil.standardRPCCall(logger, configuration, 'ORWPCE DIAG', clinic, parse, callback);
}

module.exports.getEncountersDiagnosisCodesForClinic = getEncountersDiagnosisCodesForClinic;
module.exports.fetch = function(logger, configuration, callback, params) {
    getEncountersDiagnosisCodesForClinic(logger, configuration, _.get(params, 'clinic'), callback);
};
