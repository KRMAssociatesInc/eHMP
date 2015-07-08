'use strict';

var uidUtils = require(global.VX_UTILS + 'uid-utils');
//var xformUtils = require(global.VX_UTILS + 'xform-utils');
var moment = require('moment');

function dodEncounterToVPR(dodEncounter, edipi){
    var vprEncounter = {
        dateTime: moment(dodEncounter.apptDate, 'x').format('YYYYMMDDHHmmss'),
        categoryName: 'DoD Encounter',
        locationName: dodEncounter.clinic,
        facilityName: 'DOD',
        facilityCode: 'DOD',
        appoinmentStatus: dodEncounter.status,
        typeName: dodEncounter.apptType,
        typeDisplayName: dodEncounter.apptType,
        dispositionName: dodEncounter.dischargeDisposition,
        reasonName: dodEncounter.visitReason,
        providers: [],
        uid: uidUtils.getUidForDomain('visit', 'DOD', edipi, dodEncounter.cdrEventId),
        pid: 'DOD;' + edipi
    };

    if(dodEncounter.provider && dodEncounter.provider.name){
        vprEncounter.providers.push({providerName: dodEncounter.provider.name});
    }

    return vprEncounter;
}

module.exports = dodEncounterToVPR;