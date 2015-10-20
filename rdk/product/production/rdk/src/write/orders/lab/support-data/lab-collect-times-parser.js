/**
 * This is temporary until 'ORWDLR32 GET LAB TIMES' is in pick-list resource
 */
'use strict';

var _ = require('lodash');

/**
 * Takes the return string from the RPC 'ORWDLR32 GET LAB TIMES' and parses out the data.<br/><br/>
 *
 * Each element is as follows:<br/>
 * Lab Time</br>
 *
 * @param logger The logger
 * @param rpcData The String from the RPC that you want parsed
 * @returns {Array}
 */
module.exports.parseCollectTimes = function(logger, rpcData) {
    logger.info({rpcData: rpcData});

    var retValue = [];
    var lines = rpcData.split('\r\n');
    lines = _.filter(lines, Boolean); //Remove all of the empty Strings.
    _.each(lines, function(line) {
        retValue.push(line);
    });

    logger.info({retValue: retValue});
    return retValue;
};
