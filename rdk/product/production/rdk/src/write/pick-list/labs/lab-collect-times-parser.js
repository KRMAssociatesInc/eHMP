'use strict';

var _ = require('lodash');

/**
 * Takes the return string from the RPC 'ORWDLR32 IMMED COLLECT' and parses out the data.<br/><br/>
 *
 * Each element is as follows:<br/>
 * Collection Time</br>
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
        var textEntry = {};
        textEntry['text' + retValue.length] = line;
        retValue.push(textEntry);
    });

    //console.log(JSON.stringify(retValue, null, 2));
    logger.info({retValue: retValue});
    return retValue;
};
