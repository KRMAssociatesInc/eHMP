'use strict';

var _ = require('lodash');
var rpcUtil = require('./../utils/rpc-util');

/**
 * 1 = symptom IEN<br/>
 * 2 = second piece is the synonym<br/>
 * 3 = third piece is the name<br/>
 * Where there is not a third piece, the synonym and name are the same.<br/>
 * Where there is a third piece, the synonym will contain a tab character followed by the name (same as 3rd field)
 * surrounded by less than and greater than symbols.
 *
 * @param logger The logger
 * @param line The string to parse
 * @returns {{ien: *, synonym: *, name: *}}
 */
function createSymptom(logger, line) {
    logger.debug('symptom=' + line);

    var SYMPTOM_WITH_NAME = 3;
    var SYMPTOM_WITHOUT_NAME = 2;

    var field = line.split('^');
    if (field.length !== SYMPTOM_WITH_NAME && field.length !== SYMPTOM_WITHOUT_NAME) {
        logger.error('The RPC returned data but we couldn\'t understand it: ' + line);
        return null;
    }

    var qualifier = {
        ien: field[0],
        synonym: field[1],
        name: field.length === 3 ? field[2] : field[1]
    };

    logger.debug({qualifier: qualifier});
    return qualifier;
}

/**
 * Takes the return string from the RPC 'ORWDAL32 SYMPTOMS' and parses out the data.
 *
 * @param logger The logger
 * @param rpcData The string to parse
 * @returns {Array} An array containing the the ien, synonym, and name for each symptom.
 */
module.exports.parseSymptoms = function(logger, rpcData) {
    logger.info({rpcData: rpcData});

    var retValue = [];
    var lines = rpcData.split('\r\n');
    lines = rpcUtil.removeEmptyValues(lines);

    _.each(lines, function(line) {
        var symptom = createSymptom(logger, line);
        if (symptom) {
            retValue.push(symptom);
        }
    });

    logger.info({retValue: retValue});
    return retValue;
};
