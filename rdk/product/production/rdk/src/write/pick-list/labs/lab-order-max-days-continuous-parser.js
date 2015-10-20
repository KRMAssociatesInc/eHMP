'use strict';

var validate = require('./../utils/validation-util');
var rpcUtil = require('./../utils/rpc-util');
var _ = require('lodash');


/**
 * Takes the return string from the RPC 'ORWDLR32 MAXDAYS' and parses out the data.<br/><br/>
 *
 * Example of the RPC Data that is returned:<br/>
 * <pre>
 * 3
 * </pre>
 * END Example of the RPC Data that is returned:<br/>
 *
 * @param logger The logger
 * @param rpcData The string to parse
 */
module.exports.parseLabOrderMaxDaysContinuous = function(logger, rpcData) {
    logger.info({rpcData: rpcData});

    var lines = rpcData.split('\r\n');
    lines = rpcUtil.removeEmptyValues(lines);

    if (!_.isArray(lines)) {
        throw new Error('Didn\'t receive data that we could understand: ' + rpcData);
    }
    if (!validate.isWholeNumber(lines[0])) {
        throw new Error('Not a whole number');
    }

    var retValue = {
        value: Number(lines[0])
    };

    logger.info({retValue: retValue});
    return retValue;
};
