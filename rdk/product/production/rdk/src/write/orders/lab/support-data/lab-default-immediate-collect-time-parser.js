'use strict';

var filemanDateUtil = require('../../../../utils/fileman-date-converter');

/**
 * Takes the return string from the RPC 'ORWDLR32 IC DEFAULT' and parses out the data.<br/><br/>
 * to retrieve default immediate collect time.<br/><br/>
 * Convert fileman timestamp to VPR data time.<br/><br/>
 *
 * @param logger The logger
 * @param rpcData The String from the RPC that you want parsed
 * @returns {Array}
 */
module.exports.parseDefaultImmediateCollectTime = function(logger, rpcData) {
    var retValue = [];
    var fields = rpcData.split('^');
    if (fields.length > 1) {
        var defaultImmediateCollectTime = {
            defaultImmediateCollectTime: filemanDateUtil.getVprDateTime(fields[0])
        };
        retValue.push(defaultImmediateCollectTime);
    } else {
        throw new Error("The RPC returned data but we couldn't understand it: " + rpcData);
    }
    logger.info({
        retValue: retValue
    });
    return retValue;
};
