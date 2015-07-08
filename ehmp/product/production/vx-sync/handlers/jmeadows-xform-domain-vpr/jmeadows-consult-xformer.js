'use strict';

var uidUtils = require(global.VX_UTILS + 'uid-utils');
var xformUtils = require(global.VX_UTILS + 'xform-utils');
var moment = require('moment');

function dodConsultToVPR(dodConsult, edipi){
    var vprConsult = {};

    vprConsult.codes = xformUtils.transformCodes(dodConsult.codes);

    vprConsult.facilityCode='DOD';
    vprConsult.facilityName='DOD';

    vprConsult.status = 'COMPLETED';
    vprConsult.statusDisplayName = 'Completed';

    vprConsult.localTitle = dodConsult.service;

    vprConsult.referenceDateTime = moment(dodConsult.requestDate, 'x').format('YYYYMMDDHHmmss');

    vprConsult.documentTypeName = dodConsult.procedureConsult;

    //Sensitive items have a string of *'s at the beginning of the 'service' field
    vprConsult.sensitive = /^\*/.test(dodConsult.service);

    vprConsult.dodComplexNoteUri = dodConsult.complexDataUrl || null;

    vprConsult.uid = uidUtils.getUidForDomain('document', 'DOD', edipi, dodConsult.cdrEventId);

    vprConsult.text = [];

    //If dod consult note does not contain a link to external document but includes text instead
    if(!dodConsult.complexDataUrl && dodConsult.report){
        vprConsult.text = [{
            content: dodConsult.report,
            dateTime: vprConsult.referenceDateTime,
            status: 'completed',
            uid: vprConsult.uid
        }];
    }

    vprConsult.pid = 'DOD;' + edipi;

    return vprConsult;
}

module.exports = dodConsultToVPR;