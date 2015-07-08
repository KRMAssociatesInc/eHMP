'use strict';

var uidUtils = require(global.VX_UTILS + 'uid-utils');
var moment = require('moment');

/*
appointment - a single appointment record

*/
function dodAppointmentToVPR(appointment, edipi){
    var systemId = 'DOD';

    if(!appointment){
        return;
    }

    var vprRecord = {};
    if(appointment.apptDate) {
        vprRecord.dateTime = moment(appointment.apptDate, 'x').format('YYYYMMDDHHmmss');
    }
    vprRecord.categoryName = 'DoD Appointment';
    vprRecord.locationName = appointment.clinic;
    vprRecord.facilityName = systemId;
    vprRecord.facilityCode = systemId;
    vprRecord.appointmentStatus = appointment.status;
    vprRecord.typeName = appointment.apptType;
    vprRecord.typeDisplayName = appointment.apptType;
    vprRecord.reasonName = appointment.reason;
    vprRecord.providers = [];

    var provider = {};
    vprRecord.providers.push(provider);

    if(appointment.provider && appointment.provider.name) {
        provider.providerName = appointment.provider.name;
    }

    vprRecord.uid = uidUtils.getUidForDomain('appointment', 'DOD', edipi, appointment.cdrEventId);
    vprRecord.pid = 'DOD;'+edipi;

    return vprRecord;
}

module.exports = dodAppointmentToVPR;