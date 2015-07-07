'use strict';

var _ = require('underscore');
var moment = require('moment');
var uidUtils = require(global.VX_UTILS + 'uid-utils');
var xformUtils = require(global.VX_UTILS + 'xform-utils');

function dodVitalToVPR(record, edipi){
    var systemId = 'DOD';

    if (!record){
        return;
    }

    return {
        codes: xformUtils.transformCodes(record.codes),
        observed: moment(record.dateTimeTaken, 'x').format('YYYYMMDDHHmmss'),
        typeName: record.vitalType,
        result: record.rate,
        units: record.units,
        facilityName: systemId,
        facilityCode: systemId,
        uid: uidUtils.getUidForDomain('vital', 'DOD', edipi, record.cdrEventId),
        pid: 'DOD;' + edipi
    };
}

module.exports = dodVitalToVPR;