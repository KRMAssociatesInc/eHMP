'use strict';

var _ = require('lodash');
var rpcUtil = require('./../utils/rpc-util');

/**
 * Takes the return string from the RPC 'ORWU DEVICE' and parses out the data.<br/><br/>
 *
 * Each element is as follows:<br/>
 * ienName - ien and name separated by a semicolon<br/>
 * displayName<br/>
 * location<br/>
 * rMar<br/>
 * pLen<br/>
 * ien (we parse ienName and put it into this field)<br/>
 * name (we parse ienName and put it into this field)<br/>
 *
 * @param logger The logger
 * @param rpcData The String from the RPC that you want parsed
 * @returns {Array}
 */
module.exports.parsePrinterDevices = function(logger, rpcData) {
    logger.info({rpcData: rpcData});

    var retValue = [];
    var lines = rpcData.split('\r\n');
    lines = rpcUtil.removeEmptyValues(lines);

    var FIELD_LENGTH = 5;

    _.each(lines, function(line) {
        var fields = line.split('^');
        if (fields.length === FIELD_LENGTH) {
            var ienName = fields[0].split(';');
            if (ienName.length !== 2) {
                logger.error('The RPC returned data but we couldn\'t understand the ienName field: ' + rpcData);
            }
            else {
                var printerDevices = {
                    ienName: fields[0],
                    displayName: fields[1],
                    location: fields[2],
                    rMar: fields[3],
                    pLen: fields[4],
                    ien: ienName[0],
                    name: ienName[1]
                };

                retValue.push(printerDevices);
            }
        }
        else {
            logger.error('The RPC returned data but we couldn\'t understand it: ' + rpcData);
        }
    });

    logger.info({retValue: retValue});
    return retValue;
};
