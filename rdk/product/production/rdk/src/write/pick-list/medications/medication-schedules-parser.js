'use strict';

var _ = require('lodash');
var rpcUtil = require('./../utils/rpc-util');

/**
 * Takes the return string from the RPC 'ORWDPS1 SCHALL' and parses out the data.<br/><br/>
 *
 * Each element is as follows:<br/>
 * scheduleName<br/>
 * outpatientExpansion<br/>
 * scheduleType<br/>
 * administrationTime
 *
 * @param logger The logger
 * @param rpcData The String from the RPC that you want parsed
 * @returns {Array}
 */
module.exports.parseMedicationSchedules = function(logger, rpcData) {
    logger.info({rpcData: rpcData});

    var retValue = [];
    var lines = rpcData.split('\r\n');
    lines = rpcUtil.removeEmptyValues(lines);

    var FIELD_LENGTH = 4;

    _.each(lines, function(line) {
        var fields = line.split('^');
        if (fields.length === FIELD_LENGTH) {
            var outpatientMedicationSchedule = {
                scheduleName: fields[0],
                outpatientExpansion: fields[1],
                scheduleType: fields[2],
                administrationTime: fields[3]
            };
            retValue.push(outpatientMedicationSchedule);
        }
        else {
            logger.error('The RPC returned data but we couldn\'t understand it: ' + rpcData);
        }
    });

    logger.info({retValue: retValue});
    return retValue;
};
