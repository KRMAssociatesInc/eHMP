'use strict';

var _ = require('lodash');

/**
 * Takes the return string from the RPC 'ORWDLR32 ALLSPEC' and parses out the data.<br/><br/>
 *
 * Each element is as follows:<br/>
 * 1. ien<br/>
 * 2. name  (SNOMED CODE)<br/>
 * The SNOMED CODE will appear inside parentheses.<br/>
 *
 * @param logger The logger
 * @param rpcData The String from the RPC that you want parsed
 * @returns {Array}
 */
module.exports.parseLabOrderSpecimens = function(logger, rpcData) {
    var retValue = [];
    var lines = rpcData.split('\r\n');
    lines = _.filter(lines, Boolean); //Remove all of the empty Strings.

    var FIELD_LENGTH = 2;

    _.each(lines, function(line) {
        var fields = line.split('^');
        if (fields.length === FIELD_LENGTH) {
            var labOrderSpecimen = {
                ien: fields[0],
                name: fields[1]
            };
            retValue.push(labOrderSpecimen);
        }
        else {
            throw new Error("The RPC returned data but we couldn't understand it: " + rpcData);
        }
    });

    logger.info({retValue: retValue});
    return retValue;
};
