'use strict';
var _ = require('underscore');
var moment = require('moment');
var uidUtils = require(global.VX_UTILS + 'uid-utils');
var xformUtils = require(global.VX_UTILS + 'xform-utils');


function dodLabToVPR(dodLab, edipi) {
    var vprLab = {};

    if(!dodLab.orderDate || !dodLab.resultDate) {
        return null;
    }

    vprLab.codes = xformUtils.transformCodes(dodLab.codes);

    vprLab.facilityCode = 'DOD';
    vprLab.facilityName = dodLab.facilityName;

    var accession = dodLab.accession || '';
    vprLab.localId = accession;


    var temp = accession.split('^');
    vprLab.labType = (temp.length > 1) ? temp[1] : null;

    vprLab.categoryCode = 'urn:va:lab-category:' + vprLab.labType;

    var labTypeToCategoryName = {
        CH: 'Laboratory',
        AP: 'Pathology',
        MI: 'Microbiology'
    };

    vprLab.categoryName = labTypeToCategoryName[vprLab.labType] || '';

    //TODO: figure out timezone adjustments...
    vprLab.observed = moment(dodLab.orderDate, 'x').format('YYYYMMDDHHmmss');
    vprLab.resulted = moment(dodLab.resultDate, 'x').format('YYYYMMDDHHmmss');

    vprLab.specimen = dodLab.specimen;
    vprLab.orderId = dodLab.orderId;
    vprLab.comment = dodLab.comment;
    vprLab.units = dodLab.units;

    vprLab.result = dodLab.result;
    vprLab.summary = dodLab.testName || null;

    vprLab.kind = vprLab.categoryName;
    vprLab.displayName = dodLab.testName;

    if (dodLab.referenceRange) {
        // Not sure this REGEX is very well designed, but it is an exact copy from eHMP
        var referenceRange = /\(*(\d*\.*\d*)\s*-\s*(\d*\.*\d*)\)*/.exec(dodLab.referenceRange);

        vprLab.low = referenceRange[1] || null;
        vprLab.high = referenceRange[2] || null;
    }

    if (vprLab.labType === 'AP' || vprLab.labType === 'MI') {
        vprLab.organizerType = 'accession';
        vprLab.typeName = null;
    } else {
        vprLab.organizerType = 'organizerType';
        vprLab.typeName = dodLab.testName;
    }

    //Calculate DOD UID
    var modifiedLocalId = null;
    if(vprLab.observed) {
        modifiedLocalId = vprLab.observed;
    }
    if(modifiedLocalId && vprLab.localId) {
        modifiedLocalId += '_';
    }
    if(vprLab.localId) {
        modifiedLocalId += vprLab.localId.replace(/[ \^]/g, '-');
    }
    var uidCode = '';
    var code = _.findWhere(dodLab.codes, {system: 'DOD_NCID'});
    if(code){
        uidCode = code.code;
    }
    if(uidCode) {
        modifiedLocalId += '_' + uidCode;
    }

    vprLab.uid = uidUtils.getUidForDomain('lab', 'DOD', edipi, modifiedLocalId);
    //END DOD UID calculation

    vprLab.pid = 'DOD;' + edipi;

    vprLab.statusName = dodLab.resultStatus || 'completed';
    vprLab.statusCode = 'urn:va:lab-status:' + vprLab.statusName;


    vprLab.interpretationCode = '';
    vprLab.interpretationName = '';
    if (dodLab.hiLoFlag && !_.isEmpty(dodLab.hiLoFlag)) {
        var dodHiLoFlagToHl7Abnormal = {
            'critical low': {
                code: 'urn:hl7:observation-interpretation:LL',
                name: 'Low alert'
            },
            'lower than normal': {
                code: 'urn:hl7:observation-interpretation:L',
                name: 'Low'
            },
            'critical high': {
                code: 'urn:hl7:observation-interpretation:HH',
                name: 'High alert'
            },
            'higher than normal': {
                code: 'urn:hl7:observation-interpretation:H',
                name: 'High'
            }
        };

        var hl7Abnormal = dodHiLoFlagToHl7Abnormal[dodLab.hiLoFlag.toLowerCase()] || {code: '', name: ''};

        vprLab.interpretationCode = hl7Abnormal.code;
        vprLab.interpretationName = hl7Abnormal.name;
    }

    if(vprLab.labType !== 'CH') {
        var results = [{}];
        if(vprLab.labType === 'AP') {
            results[0].localTitle = 'PATHOLOGY REPORT';
            results[0].summary = 'PATHOLOGY REPORT';
        } else if(vprLab.labType === 'MI') {
            results[0].localTitle = 'MICROBIOLOGY REPORT';
            results[0].summary = 'MICROBIOLOGY REPORT';
        }
        results[0].resultUid = vprLab.uid.replace('lab', 'document');
        results[0].uid = vprLab.uid;
        vprLab.results = results;
        return [vprLab, getVPRDocument(vprLab, edipi)];
    } else {
        return vprLab;
    }
}

function getVPRDocument(vprLab) {
    var vprDocument = {
        documentTypeName: 'Laboratory Report',
        author: '',
        authorDisplayName: '',
        status: 'completed',
        statusName: 'completed',
        facilityName: 'DOD',
        facilityCode: 'DOD',
        pid: vprLab.pid,
        uid: vprLab.uid.replace('lab', 'document')
    };
    if(vprLab.labType === 'AP') {
        vprDocument.localTitle = 'PATHOLOGY REPORT';
    } else if(vprLab.labType === 'MI') {
        vprDocument.localTitle = 'MICROBIOLOGY REPORT';
    }
    vprDocument.referenceDateTime = vprLab.observed || vprLab.resulted || '';

    if(vprLab.result) {
        vprDocument.text = [{
            content: vprLab.result,
            dateTime: vprDocument.referenceDateTime,
            status: 'completed',
            uid: vprDocument.uid,
            summary: 'DocumentText{uid=\''+vprDocument.uid+'\'}'
        }];
    }

    return vprDocument;
}

module.exports = dodLabToVPR;