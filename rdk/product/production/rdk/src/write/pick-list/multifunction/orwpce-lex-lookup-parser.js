'use strict';

var _ = require('lodash');
var rpcUtil = require('./../utils/rpc-util');

/**
 * Each of the values returned will contain an ien and a name.
 *
 * @param logger The logger
 * @param line The string to parse
 */
function createOrwpceLexLookUp(logger, line) {
    logger.debug('line=' + line);

	var FIELD_LENGTH_EXPECTED = 2;

    var field = line.split('^');
    if (field.length !== FIELD_LENGTH_EXPECTED) {
        logger.error('The RPC "ORWPCE LEX" returned data but we couldn\'t understand it: ' + line);
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
 * Takes the return string from the RPC 'ORWPCE LEX' and parses out the data.<br/><br/>
 *
 * Example of the RPC Data that is returned:<br/>
 * <pre>
 * 303849^CAD *
 * 28528^Coronary Artery Disease *
 * 276205^Toxic effect of cadmium and its compounds *
 * </pre>
 * END Example of the RPC Data that is returned:<br/>
 *
 * @param logger The logger
 * @param rpcData The string to parse
 */
module.exports.parseOrwpceLexLookUp = function(logger, rpcData) {
    logger.info({rpcData: rpcData});

    var retValue = [];
    var lines = rpcData.split('\r\n');
    lines = rpcUtil.removeEmptyValues(lines);

    _.each(lines, function(line) {
        var obj = createOrwpceLexLookUp(logger, line);
        if (obj) {
            retValue.push(obj);
        }
    });

	//console.log(JSON.stringify(retValue, null, 2));
    logger.info({retValue: retValue});
    return retValue;
};
