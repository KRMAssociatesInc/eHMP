'use strict';

var _ = require('underscore');
var uidUtils = require(global.VX_UTILS + 'uid-utils');
var xformUtils = require(global.VX_UTILS + 'xform-utils');
var moment = require('moment');

function dodRadiologyToVPR(dodRadiology, edipi){
    var vprImage = {};

    vprImage.codes = xformUtils.transformCodes(dodRadiology.codes);
    vprImage.facilityCode = 'DOD';
    vprImage.facilityName = 'DOD';

    var reportTextData = parseRadiologyReportText(dodRadiology.reportText);

    var imageLocation = reportTextData['Requesting Location'];
    if(imageLocation){
        vprImage.imageLocation = imageLocation;
        vprImage.locationName = imageLocation;
    }

    vprImage.statusName = reportTextData.status || 'Not Available';

    vprImage.name = dodRadiology.study;
    vprImage.typeName = 'RADIOLOGIC EXAMINATION' + dodRadiology.study;
    vprImage.kind = 'Radiology';
    vprImage.localId = dodRadiology.accessionNumber;
    vprImage.encounterUid = dodRadiology.examId;
    vprImage.dateTime = moment( dodRadiology.examDate, 'x').format('YYYYMMDDHHmmss');
    vprImage.hasImages = false;
    vprImage.reason = dodRadiology.reasonForOrder;
    vprImage.status = dodRadiology.status;
    vprImage.category = 'RA';

    vprImage.providers = [{
        providerName: dodRadiology.interpretingHCP,
        privderDisplayName: dodRadiology.interpretingHCP
    }];

    vprImage.results = [];

    var result = {
        localTitle: dodRadiology.study
    };

    if(reportTextData['Result Code']){
        result.report = dodRadiology.reportText;
    }

    vprImage.results.push(result);

    vprImage.uid = uidUtils.getUidForDomain('image', 'DOD', edipi, dodRadiology.cdrEventId);
    vprImage.pid = 'DOD;' + edipi;

    return vprImage;
}

//Parse report text into JSON object
function parseRadiologyReportText(text){
    if(!text){ return {};}

    var reportObject = {};
    var split = text.split('\n');

    _.each(split, function(item) {
        var pair  = item.split(':');

        if(pair.length === 2){
            reportObject[pair[0]] = pair[1];
        }
    });

    return reportObject;
}

module.exports = dodRadiologyToVPR;