'use strict';
var parse = require('./lab-sample-specimen-urgency-parser').parseLabSampleSpecimenUrgency;
var validate = require('./../utils/validation-util');
var rpcUtil = require('./../utils/rpc-util');
var _ = require('lodash');

/**
 * Calls the RPC 'ORWDLR32 LOAD' and parses out the data<br/><br/>
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param labTestIEN the IEN to obtain the lab sample, specimen, and urgency for.
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 */
function getLabSampleSpecimenUrgency(logger, configuration, labTestIEN, callback) {
    if (!validate.isWholeNumber(labTestIEN)) {
        return callback('labTestIEN cannot be empty and must be a whole number');
    }
    return rpcUtil.standardRPCCall(logger, configuration, 'ORWDLR32 LOAD', labTestIEN, parse, callback);
}

module.exports.getLabSampleSpecimenUrgency = getLabSampleSpecimenUrgency;
module.exports.fetch = function(logger, configuration, callback, params) {
    getLabSampleSpecimenUrgency(logger, configuration, _.get(params, 'labTestIEN'), callback);
};
