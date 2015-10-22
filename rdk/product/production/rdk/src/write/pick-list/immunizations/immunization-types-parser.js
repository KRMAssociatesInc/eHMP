'use strict';

var _ = require('lodash');
var rpcUtil = require('./../utils/rpc-util');

/**
 * Parses out ien and name
 *
 * @param logger The logger
 * @param line The string to parse
 */
function createImmunizationTypes(logger, line) {
    logger.debug('line=' + line);

	var FIELD_LENGTH_EXPECTED = 2;

    var field = line.split('^');
    if (field.length !== FIELD_LENGTH_EXPECTED) {
        logger.error('The RPC "ORWPCE GET IMMUNIZATION TYPE" returned data but we couldn\'t understand it: ' + line);
        return null;
    }

	var obj = {
        ien: field[0],
        name: field[1]
    };

    logger.debug({obj: obj});
    return obj;
}

/**
 * Takes the return string from the RPC 'ORWPCE GET IMMUNIZATION TYPE' and parses out the data.<br/><br/>
 *
 * Example of the RPC Data that is returned:<br/>
 * <pre>
 * 1143^ADENOVIRUS TYPES 4 AND 7
 * 41^ANTHRAX
 * 1801^AS03 ADJUVANT
 * 42^BCG
 * </pre>
 * END Example of the RPC Data that is returned:<br/>
 *
 * @param logger The logger
 * @param rpcData The string to parse
 */
module.exports.parseImmunizationTypes = function(logger, rpcData) {
    logger.info({rpcData: rpcData});

    var retValue = [];
    var lines = rpcData.split('\r\n');
    lines = rpcUtil.removeEmptyValues(lines);

    _.each(lines, function(line) {
        var obj = createImmunizationTypes(logger, line);
        if (obj) {
            retValue.push(obj);
        }
    });

    logger.info({retValue: retValue});
    return retValue;
};
