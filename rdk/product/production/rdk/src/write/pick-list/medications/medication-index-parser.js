'use strict';

var _ = require('lodash');
var rpcUtil = require('./../utils/rpc-util');


/**
 * Takes the return string from the RPC 'ORWUL FVIDX' and parses out the data.<br/><br/>
 *
 * Each element is as follows:<br/>
 * ien<br/>
 * name
 *
 * @param logger The logger
 * @param rpcData The String from the RPC that you want parsed
 * @returns {Array}
 */
module.exports.parseMedicationIndex = function(logger, rpcData) {
    logger.info({rpcData: rpcData});

    var retValue = [];
    var lines = rpcData.split('\r\n');
    lines = rpcUtil.removeEmptyValues(lines);

    _.each(lines, function(line) {
        var fields = line.split('^');
        if (fields.length === 2) {
            var medicationIndex = {
                ien: fields[0],
                name: fields[1]
            };
            retValue.push(medicationIndex);
        }
        else {
            logger.error('The RPC returned data but we couldn\'t understand it: ' + rpcData);
        }
    });

    logger.info({retValue: retValue});
    return retValue;
};
