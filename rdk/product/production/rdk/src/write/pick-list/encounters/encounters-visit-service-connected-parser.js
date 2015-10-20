'use strict';

var _ = require('lodash');

/**
 * Takes the return string from the RPC 'ORWPCE SCEL' and parses out the data.<br/><br/>
 *
 * @param logger The logger
 * @param rpcData The String from the RPC that you want parsed
 * @returns {Array}
 */
module.exports.serviceConnected = function(logger, rpcData) {
    var retValue = [];
    var fields = rpcData.split('^;');
    var FIELD_LENGTH = 8;

    if (fields.length === FIELD_LENGTH) {
        var data = {
            SC: fields[0],
            CV: fields[1],
            AO: fields[2],
            IR: fields[3],
            SAC: fields[4],
            SHD: fields[5],
            MST: fields[6],
            HNC: fields[7]
        };
        retValue.push(data);
    } else {
        throw new Error('The RPC returned data but we couldn\'t understand it: ' + rpcData);
    }
    return retValue;
};
