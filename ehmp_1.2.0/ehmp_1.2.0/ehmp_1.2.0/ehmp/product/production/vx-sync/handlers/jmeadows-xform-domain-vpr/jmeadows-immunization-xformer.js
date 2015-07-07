'use strict';

//var _ = require('underscore');
var uidUtils = require(global.VX_UTILS + 'uid-utils');
var xformUtils = require(global.VX_UTILS + 'xform-utils');
var moment = require('moment');

function dodImmunizationToVPR(dodImmunization, edipi){
    var vprImmunization = {};

    vprImmunization.codes = xformUtils.transformCodes(dodImmunization.codes);
    vprImmunization.administeredDateTime = moment(dodImmunization.dateTime, 'x').format('YYYYMMDDHHmmss');
    vprImmunization.name = dodImmunization.name;
    vprImmunization.seriesName = dodImmunization.series;
    vprImmunization.facilityName = 'DOD';
    vprImmunization.facilityCode = 'DOD';
    vprImmunization.uid = uidUtils.getUidForDomain('immunization', 'DOD', edipi, dodImmunization.cdrEventId);
    vprImmunization.pid = 'DOD;' + edipi;

    return vprImmunization;
}

module.exports = dodImmunizationToVPR;