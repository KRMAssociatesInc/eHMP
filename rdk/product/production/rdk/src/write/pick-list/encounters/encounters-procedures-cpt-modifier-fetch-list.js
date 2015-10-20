'use strict';
var parse = require('./encounters-procedures-cpt-modifier-parser').parseEncountersProceduresCptModifier;
var rpcUtil = require('./../utils/rpc-util');
var _ = require('lodash');

/**
 * Calls the RPC 'ORWPCE CPTMODS' and parses out the data<br/><br/>
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param cptCode The CPT code you want to look up modifiers for.
 * @param visitDate The date of the visit (optional)
 * @param callback The function to call when done.
 */
function getEncountersProceduresCptModifier(logger, configuration, cptCode, visitDate, callback) {
    if (!cptCode) {
        return callback('cpt is a required parameter');
    }
    return rpcUtil.standardRPCCall(logger, configuration, 'ORWPCE CPTMODS', cptCode, visitDate, parse, callback);
}

module.exports.getEncountersProceduresCptModifier = getEncountersProceduresCptModifier;
module.exports.fetch = function(logger, configuration, callback, params) {
    getEncountersProceduresCptModifier(logger, configuration, _.get(params, 'cpt'), _.get(params, 'visitDate'), callback);
};
