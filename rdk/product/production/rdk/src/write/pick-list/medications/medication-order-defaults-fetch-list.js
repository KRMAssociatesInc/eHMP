'use strict';
var VistaJS = require('../../core/VistaJS');
var parse = require('./medication-order-defaults-parser').parseMedicationOrderDefaults;
var validate = require('./../utils/validation-util');
var rpcUtil = require('./../utils/rpc-util');
var _ = require('lodash');

/**
 * Calls the RPC 'ORWDPS2 OISLCT' and parses out the data to retrieve values for medication dialog<br/><br/>
 *
 * Each element is as follows:<br/>
 *
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param ien medication ien (from ORWUL FVSUB)
 * @param pharmacyType Pharmacy Type (U = Unit Dose, O = Outpatient, X = Non-VA Med)
 * @param outpatientDfn Patient DFN
 * @param needPatientInstructions boolean for whether you need patient instructions
 * @param pkiEnabled boolean for whether pki is enabled on this server - obtained from RPC 'ORWOR PKISITE'.
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 */
function getMedicationOrderDefaults(logger, configuration, ien, pharmacyType, outpatientDfn, needPatientInstructions, pkiEnabled, callback) {
    if (!validate.isWholeNumber(ien)) {
        ien = null;
    }
    if (validate.isStringNullish(pharmacyType)) {
        return callback('pharmacyType cannot be empty');
    }
    if (!validate.isWholeNumber(outpatientDfn)) {
        outpatientDfn = null;
    }
    if (!_.isBoolean(needPatientInstructions)) {
        needPatientInstructions = false;
    }
    if (!_.isBoolean(pkiEnabled)) {
        pkiEnabled = false;
    }

    pharmacyType = pharmacyType.toUpperCase();

    //NOTE: If more types are supported, add them with documentation in the Javadoc as to what those types represent.
    if (pharmacyType !== 'U' && pharmacyType !== 'O' && pharmacyType !== 'X') {
        return callback("view must be 'U', 'O', or 'X'");
    }

    needPatientInstructions = rpcUtil.convertBooleanToYN(needPatientInstructions);
    pkiEnabled = rpcUtil.convertBooleanToYN(pkiEnabled);

    return rpcUtil.standardRPCCall(logger, configuration, 'ORWDPS2 OISLCT', ien, pharmacyType, outpatientDfn, needPatientInstructions, pkiEnabled, parse, callback);
}

module.exports.getMedicationOrderDefaults = getMedicationOrderDefaults;
module.exports.fetch = function(logger, configuration, callback, params) {
    getMedicationOrderDefaults(logger, configuration, _.get(params, 'ien'), _.get(params, 'pharmacyType'), _.get(params, 'outpatientDfn'), Boolean(_.get(params, 'needPatientInstructions')), Boolean(_.get(params, 'pkiEnabled')), callback);
};
