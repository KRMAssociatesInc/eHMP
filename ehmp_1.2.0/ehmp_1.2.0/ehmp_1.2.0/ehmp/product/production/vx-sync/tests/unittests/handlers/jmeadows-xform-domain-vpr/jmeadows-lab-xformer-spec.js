'use strict';

require('../../../../env-setup');
var _ = require('underscore');

var handler = require(global.VX_HANDLERS + 'jmeadows-xform-domain-vpr/jmeadows-xform-domain-vpr-handler');
var xformer = require(global.VX_HANDLERS + 'jmeadows-xform-domain-vpr/jmeadows-lab-xformer');
var log = require(global.VX_UTILS + 'dummy-logger');
var util = require('util');

describe('jmeadows-lab-xformer', function() {

    var mockEdipi = '000000121';
    var sampleDODLab = {
        'cdrEventId': '1000010437',
        'codes': [{
            'code': '6827',
            'display': null,
            'system': 'DOD_NCID'
        }, {
            'code': '2823-3',
            'display': 'Potassium [Moles/volume] in Serum or Plasma',
            'system': 'LOINC'
        }],
        'patientId': null,
        'patientName': null,
        'site': {
            'agency': 'DOD',
            'dmisId': null,
            'endpoints': [],
            'id': null,
            'moniker': 'NH Great Lakes IL/0056',
            'name': 'AHLTA',
            'permissions': [],
            'region': null,
            'siteCode': '2.16.840.1.113883.3.42.126.100001.13',
            'status': null
        },
        'sourceProtocol': 'DODADAPTER',
        'accession': '130505 BCH 1659^CH',
        'comment': '3001 GREENBAY ROAD ATTENTION LABORATORY SERVICES NORTH CHICAGO, IL  60064 556 = NORTH CHICAGO VETERAN\'S ADMINISTRATION HOSP Test performed at:',
        'facilityName': 'NH Great Lakes IL/0056',
        'hiLoFlag': 'Higher Than Normal',
        'orderDate': 1367763000000,
        'orderId': '2157546463',
        'printName': null,
        'referenceRange': '(3.5-4.7)',
        'result': '5.4',
        'resultDate': 1367755560000,
        'resultStatus': null,
        'specimen': 'PLASMA',
        'stationNumber': null,
        'testId': null,
        'testName': 'Potassium, Serum or Plasma Quantitative',
        'units': 'mmol/L',
        'verifiedBy': ''
    }; //require('../../../data/secondary/dod/lab');

    var sampleDODLabDocument = {
        'cdrEventId': '1000001199',
        'codes': [{
            'code': '719',
            'display': null,
            'system': 'DOD_NCID'
        }],
        'patientId': null,
        'patientName': null,
        'site': {
            'agency': 'DOD',
            'dmisId': null,
            'endpoints': [],
            'id': null,
            'moniker': 'TMDS',
            'name': 'TMDS',
            'permissions': [],
            'region': null,
            'siteCode': '2.16.840.1.113883.3.42.10009.100001.13',
            'status': null
        },
        'sourceProtocol': 'DODADAPTER',
        'accession': '080523 BM 15^AP',
        'comment': 'Mock data from TMDS for 50002',
        'facilityName': null,
        'hiLoFlag': null,
        'orderDate': 1211572800000,
        'orderId': null,
        'printName': null,
        'referenceRange': null,
        'result': '080523 CN 19',
        'resultDate': 1211515200000,
        'resultStatus': 'COMPLETE',
        'specimen': 'BONE MARROW',
        'stationNumber': null,
        'testId': null,
        'testName': 'CYTOLOGIC NON-GYN',
        'units': null,
        'verifiedBy': 'MCDERMOTT,BARB 1'
    };

    var sampleVPRLab = {
        codes: [{
            code: '6827',
            system: 'DOD_NCID'
        }, {
            code: '2823-3',
            display: 'Potassium [Moles/volume] in Serum or Plasma',
            system: 'http://loinc.org'
        }],
        facilityCode: 'DOD',
        facilityName: 'NH Great Lakes IL/0056',
        localId: '130505 BCH 1659^CH',
        labType: 'CH',
        categoryCode: 'urn:va:lab-category:CH',
        categoryName: 'Laboratory',
        observed: '20130505101000',
        resulted: '20130505080600',
        specimen: 'PLASMA',
        orderId: '2157546463',
        comment: '3001 GREENBAY ROAD ATTENTION LABORATORY SERVICES NORTH CHICAGO, IL  60064 556 = NORTH CHICAGO VETERAN\'S ADMINISTRATION HOSP Test performed at:',
        units: 'mmol/L',
        result: '5.4',
        summary: 'Potassium, Serum or Plasma Quantitative',
        kind: 'Laboratory',
        displayName: 'Potassium, Serum or Plasma Quantitative',
        low: '3.5',
        high: '4.7',
        organizerType: 'organizerType',
        typeName: 'Potassium, Serum or Plasma Quantitative',
        uid: 'urn:va:lab:DOD:000000121:20130505101000_130505-BCH-1659-CH_6827',
        pid: 'DOD;000000121',
        statusCode: 'urn:va:lab-status:completed',
        statusName: 'completed',
        interpretationCode: 'urn:hl7:observation-interpretation:H',
        interpretationName: 'High'
    };

    var sampleVPRLabDocument = [{
        codes: [{
            code: '719',
            system: 'DOD_NCID'
        }],
        facilityCode: 'DOD',
        facilityName: null,
        localId: '080523 BM 15^AP',
        labType: 'AP',
        categoryCode: 'urn:va:lab-category:AP',
        categoryName: 'Pathology',
        observed: '20080523160000',
        resulted: '20080523000000',
        specimen: 'BONE MARROW',
        orderId: null,
        comment: 'Mock data from TMDS for 50002',
        units: null,
        result: '080523 CN 19',
        summary: 'CYTOLOGIC NON-GYN',
        kind: 'Pathology',
        displayName: 'CYTOLOGIC NON-GYN',
        organizerType: 'accession',
        typeName: null,
        uid: 'urn:va:lab:DOD:000000121:20080523160000_080523-BM-15-AP_719',
        pid: 'DOD;000000121',
        statusName: 'COMPLETE',
        statusCode: 'urn:va:lab-status:COMPLETE',
        interpretationCode: '',
        interpretationName: '',
        results: [{
            localTitle: 'PATHOLOGY REPORT',
            summary: 'PATHOLOGY REPORT',
            resultUid: 'urn:va:document:DOD:000000121:20080523160000_080523-BM-15-AP_719',
            uid: 'urn:va:lab:DOD:000000121:20080523160000_080523-BM-15-AP_719'
        }]
    }, {
        documentTypeName: 'Laboratory Report',
        author: '',
        authorDisplayName: '',
        status: 'completed',
        statusName: 'completed',
        facilityName: 'DOD',
        facilityCode: 'DOD',
        pid: 'DOD;000000121',
        uid: 'urn:va:document:DOD:000000121:20080523160000_080523-BM-15-AP_719',
        localTitle: 'PATHOLOGY REPORT',
        referenceDateTime: '20080523160000',
        text: [{
            content: '080523 CN 19',
            dateTime: '20080523160000',
            status: 'completed',
            uid: 'urn:va:document:DOD:000000121:20080523160000_080523-BM-15-AP_719',
            summary: 'DocumentText{uid=\'urn:va:document:DOD:000000121:20080523160000_080523-BM-15-AP_719\'}'
        }]
    }];

    it('transform sample lab to VPR', function() {
        var result = xformer(sampleDODLab, mockEdipi);
        expect(result.codes).toEqual(sampleVPRLab.codes);
        expect(result.facilityCode).toEqual(sampleVPRLab.facilityCode);
        expect(result.facilityName).toEqual(sampleVPRLab.facilityName);
        expect(result.localId).toEqual(sampleVPRLab.localId);
        expect(result.labType).toEqual(sampleVPRLab.labType);
        expect(result.categoryCode).toEqual(sampleVPRLab.categoryCode);
        expect(result.categoryName).toEqual(sampleVPRLab.categoryName);
        expect(result.statusCode).toEqual(sampleVPRLab.statusCode);
        expect(result.statusName).toEqual(sampleVPRLab.statusName);
        expect(result.observed).toBeTruthy(); //Actual value will vary based on the machine's time zone
        expect(result.resulted).toBeTruthy(); //Actual value will vary based on the machine's time zone
        expect(result.specimen).toEqual(sampleVPRLab.specimen);
        expect(result.orderId).toEqual(sampleVPRLab.orderId);
        expect(result.comment).toEqual(sampleVPRLab.comment);
        expect(result.units).toEqual(sampleVPRLab.units);
        expect(result.result).toEqual(sampleVPRLab.result);
        expect(result.summary).toEqual(sampleVPRLab.summary);
        expect(result.kind).toEqual(sampleVPRLab.kind);
        expect(result.displayName).toEqual(sampleVPRLab.displayName);
        expect(result.low).toEqual(sampleVPRLab.low);
        expect(result.high).toEqual(sampleVPRLab.high);
        expect(result.organizerType).toEqual(sampleVPRLab.organizerType);
        expect(result.typeName).toEqual(sampleVPRLab.typeName);
        expect(result.interpretationName).toEqual(sampleVPRLab.interpretationName);
        expect(result.interpretationCode).toEqual(sampleVPRLab.interpretationCode);
        expect(result.uid).toMatch(/^(urn:va:lab:DOD:000000121:\d{14}_130505-BCH-1659-CH_6827)/);
        expect(result.pid).toEqual(sampleVPRLab.pid);
    });

    it('transform sample lab document record to VRP types', function() {
        var resultDoc = xformer(sampleDODLabDocument, mockEdipi);
        // console.log(util.inspect(resultDoc, {
        //     depth: 4
        // }));
        expect(_.isArray(resultDoc)).toBeTruthy();
        expect(resultDoc.length).toBe(2);
        expect(_.isArray(resultDoc[0].codes)).toBeTruthy();
        // expect(resultDoc[0].codes[0].code).toEqual(sampleDODLabDocument[0].codes[0].code);
        // expect(resultDoc[0].codes[0].system).toEqual(sampleDODLabDocument[0].codes[0].system);
        expect(resultDoc[0].facilityCode).toEqual(sampleVPRLabDocument[0].facilityCode);
        expect(resultDoc[0].facilityName).toEqual(sampleVPRLabDocument[0].facilityName);
        expect(resultDoc[0].localId).toEqual(sampleVPRLabDocument[0].localId);
        expect(resultDoc[0].labType).toEqual(sampleVPRLabDocument[0].labType);
        expect(resultDoc[0].categoryCode).toEqual(sampleVPRLabDocument[0].categoryCode);
        expect(resultDoc[0].categoryName).toEqual(sampleVPRLabDocument[0].categoryName);
        expect(resultDoc[0].observed).toBeDefined();
        expect(resultDoc[0].resulted).toBeDefined();
        expect(resultDoc[0].specimen).toEqual(sampleVPRLabDocument[0].specimen);
        expect(resultDoc[0].orderId).toEqual(sampleVPRLabDocument[0].orderId);
        expect(resultDoc[0].comment).toEqual(sampleVPRLabDocument[0].comment);
        expect(resultDoc[0].units).toEqual(sampleVPRLabDocument[0].units);
        expect(resultDoc[0].result).toEqual(sampleVPRLabDocument[0].result);
        expect(resultDoc[0].summary).toEqual(sampleVPRLabDocument[0].summary);
        expect(resultDoc[0].kind).toEqual(sampleVPRLabDocument[0].kind);
        expect(resultDoc[0].displayName).toEqual(sampleVPRLabDocument[0].displayName);
        expect(resultDoc[0].organizerType).toEqual(sampleVPRLabDocument[0].organizerType);
        expect(resultDoc[0].typeName).toEqual(sampleVPRLabDocument[0].typeName);
        expect(resultDoc[0].uid).toMatch('urn:va:lab:DOD:000000121:'+resultDoc[0].observed+'_080523-BM-15-AP_719');
        expect(resultDoc[0].pid).toEqual(sampleVPRLabDocument[0].pid);
        expect(resultDoc[0].statusName).toEqual(sampleVPRLabDocument[0].statusName);
        expect(resultDoc[0].statusCode).toEqual(sampleVPRLabDocument[0].statusCode);
        expect(resultDoc[0].interpretationCode).toEqual(sampleVPRLabDocument[0].interpretationCode);
        expect(resultDoc[0].interpretationName).toEqual(sampleVPRLabDocument[0].interpretationName);
        expect(resultDoc[1].documentTypeName).toEqual(sampleVPRLabDocument[1].documentTypeName);
        expect(resultDoc[1].author).toEqual(sampleVPRLabDocument[1].author);
        expect(resultDoc[1].authorDisplayName).toEqual(sampleVPRLabDocument[1].authorDisplayName);
        expect(resultDoc[1].status).toEqual(sampleVPRLabDocument[1].status);
        expect(resultDoc[1].statusName).toEqual(sampleVPRLabDocument[1].statusName);
        expect(resultDoc[1].facilityName).toEqual(sampleVPRLabDocument[1].facilityName);
        expect(resultDoc[1].facilityCode).toEqual(sampleVPRLabDocument[1].facilityCode);
        expect(resultDoc[1].pid).toEqual(sampleVPRLabDocument[1].pid);
        expect(resultDoc[1].uid).toMatch('urn:va:document:DOD:000000121:'+resultDoc[1].referenceDateTime+'_080523-BM-15-AP_719');
        expect(resultDoc[1].localTitle).toEqual(sampleVPRLabDocument[1].localTitle);
        expect(resultDoc[1].referenceDateTime).toEqual(resultDoc[0].observed);
        expect(resultDoc[1].text[0].content).toEqual(sampleVPRLabDocument[1].text[0].content);
        expect(resultDoc[1].text[0].dateTime).toEqual(resultDoc[0].observed);
        expect(resultDoc[1].text[0].status).toEqual(sampleVPRLabDocument[1].text[0].status);
        expect(resultDoc[1].text[0].uid).toEqual(resultDoc[1].uid);
        expect(resultDoc[1].text[0].summary).toMatch('DocumentText{uid=\''+resultDoc[1].uid+'\'}');
        expect(resultDoc[0].results[0].resultUid).toEqual(resultDoc[1].uid);
        expect(resultDoc[0].results[0].localTitle).toEqual(sampleVPRLabDocument[0].results[0].localTitle);
        expect(resultDoc[0].results[0].summary).toEqual(sampleVPRLabDocument[0].results[0].summary);
        expect(resultDoc[0].results[0].uid).toEqual(resultDoc[0].uid);
    });

});