'use strict';

var _ = require('lodash');
var rpcUtil = require('./../utils/rpc-util');

/**
 * @param logger The logger
 * @param line The string to parse, in the format: ien^name^code
 * @returns Object of the form {ien: <modifier ien>, name: <modifier name>, code: <modifier code>}
 */
function createCptModifier(logger, line) {
    logger.debug('cpt-modifier-parser.createCptModifier(): Entering method. Line %s', line);

    var FIELD_LENGTH_EXPECTED = 3;

    var field = line.split('^');
    if (field.length !== FIELD_LENGTH_EXPECTED) {
        logger.error('cpt-modifier-parser.createCptModifier(): Unexpected data in RPC result: %s', line);
        return null;
    }

    var obj = {
        ien: field[0],
        name: field[1],
        code: field[2]
    };

    logger.debug('cpt-modifier-parser.createCptModifier(): Parsed cpt modifier: %j', obj);
    return obj;
}

/**
 * Takes the return string from the RPC 'ORWPCE CPTMODS' and parses out the data.
 *
 * @param logger The logger
 * @param rpcData The string to parse, in the format: ien^name^code
 *                  Examples:
 *                      367^'OPT OUT' PHYS/PRACT EMERG OR URGENT SERVICE^GJ
 *                      390^ACTUAL ITEM/SERVICE ORDERED^GK
 *                      499^AMCC TEST FOR ESRD OR MCP MD^CD
 * @returns Array of cpt modifier objects: [{ien: <modifier ien>, name: <modifier name>, code: <modifier code>}, ...]
 */
module.exports.parseEncountersProceduresCptModifier = function(logger, rpcData) {
    logger.debug('cpt-modifier-parser.parseEncountersProceduresCptModifier(): Entering function');

    var retValue = [];

    if (!rpcData) {
        logger.error('cpt-modifier-parser.parseEncountersProceduresCptModifier(): rpcData was empty, null, or undefined');
        return retValue;
    }

    var lines = rpcData.split('\r\n');
    lines = rpcUtil.removeEmptyValues(lines);

    _.each(lines, function(line) {
        var obj = createCptModifier(logger, line);
        if (obj) {
            retValue.push(obj);
        }
    });

    logger.debug('cpt-modifier-parser.parseEncountersProceduresCptModifier(): Parsing completed. Return value: %j', retValue);
    return retValue;
};
