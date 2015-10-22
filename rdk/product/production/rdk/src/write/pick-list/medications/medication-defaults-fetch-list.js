'use strict';
var VistaJS = require('../../core/VistaJS');
var parse = require('./medication-defaults-parser').parseMedicationDefaults;
var validate = require('./../utils/validation-util');
var rpcUtil = require('./../utils/rpc-util');
var _ = require('lodash');

/**
 * Calls the RPC 'ORWDPS1 ODSLCT' and parses out the data to retrieve values for medication dialog<br/><br/>
 *
 * Each element is as follows:<br/>
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param pharmacyType Pharmacy Type (U = Unit Dose, F = IV Fluids, and O = Outpatient)
 * @param outpatientDfn Patient DFN
 * @param locationIen Encounter Location
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 */
function getMedicationDefaults(logger, configuration, pharmacyType, outpatientDfn, locationIen, callback) {
    if (validate.isStringNullish(pharmacyType)) {
        return callback("pharmacyType cannot be empty and it must be 'U', 'F', or 'O'");
    }
    if (validate.isStringNullish(outpatientDfn)) {
        outpatientDfn = null;
    }
    if (!validate.isWholeNumber(locationIen)) {
        locationIen = null;
    }

    pharmacyType = pharmacyType.toUpperCase();

    //NOTE: If more types are supported, add them with documentation in the Javadoc as to what those types represent.
    if (pharmacyType !== 'U' && pharmacyType !== 'F' && pharmacyType !== 'O')
        return callback("view must be 'U', 'F', or 'O'");

    return rpcUtil.standardRPCCall(logger, configuration, 'ORWDPS1 ODSLCT', pharmacyType, outpatientDfn, locationIen, parse, callback);
}

module.exports.getMedicationDefaults = getMedicationDefaults;
module.exports.fetch = function(logger, configuration, callback, params) {
    getMedicationDefaults(logger, configuration, _.get(params, 'pharmacyType'), _.get(params, 'outpatientDfn'), _.get(params, 'locationIen'), callback);
};
