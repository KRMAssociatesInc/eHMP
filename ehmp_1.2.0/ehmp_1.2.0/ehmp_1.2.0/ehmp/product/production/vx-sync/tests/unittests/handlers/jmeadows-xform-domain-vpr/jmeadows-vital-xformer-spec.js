'use strict';

require('../../../../env-setup');
var xformer = require(global.VX_HANDLERS + 'jmeadows-xform-domain-vpr/jmeadows-vital-xformer');

describe('jmeadows-vitals-xformer', function() {
    var mockEdipi = '0000000003';

    var sampleDODVital = { 'cdrEventId' : '1000000582',
        'codes' : [ { 'code' : '55284-4', 'display' : 'Blood pressure systolic and diastolic', 'system' : 'LOINC' } ],
        'patientId' : null,
        'patientName' : null,
        'site' : { 'agency' : 'DOD', 'dmisId' : null, 'endpoints' : [ ], 'id' : null,
                   'moniker' : 'NH Great Lakes IL/0056', 'name' : 'AHLTA', 'permissions' : [ ], 'region' : null,
                   'siteCode' : '2.16.840.1.113883.3.42.126.100001.13', 'status' : null
                 },
        'sourceProtocol' : 'DODADAPTER',
        'dateTimeTaken' : 1389391824000,
        'qualifiers' : null,
        'rate' : '110/40',
        'units' : 'mmHg',
        'unitsCode' : 'mmHg',
        'vitalType' : 'BLOOD PRESSURE',
        'vitalsIEN' : '2157584331'
    };

    var sampleVPRVital = {
        codes: [ { code : '55284-4', display : 'Blood pressure systolic and diastolic', system : 'http://loinc.org' } ],
        observed: '20140110171024',
        typeName: 'BLOOD PRESSURE',
        result: '110/40',
        units: 'mmHg',
        facilityName: 'DOD',
        facilityCode: 'DOD',
        uid: 'urn:va:vital:DOD:0000000003:1000000582'
    };

    it('verify transform sample appointment to VPR', function() {
        var vprData = xformer(sampleDODVital, mockEdipi);
        expect(vprData.codes).toEqual(sampleVPRVital.codes);
        expect(vprData.observed).toBeDefined();
        expect(vprData.typeName).toEqual(sampleVPRVital.typeName);
        expect(vprData.result).toEqual(sampleVPRVital.result);
        expect(vprData.units).toEqual(sampleVPRVital.units);
        expect(vprData.facilityName).toEqual(sampleVPRVital.facilityName);
        expect(vprData.facilityCode).toEqual(sampleVPRVital.facilityCode);
        expect(vprData.uid).toEqual(sampleVPRVital.uid);
    });
});