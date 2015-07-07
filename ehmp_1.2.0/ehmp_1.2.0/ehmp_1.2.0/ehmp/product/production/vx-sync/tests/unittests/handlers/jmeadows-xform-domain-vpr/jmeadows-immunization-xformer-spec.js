'use strict';

require('../../../../env-setup');
//var _ = require('underscore');
var xformer = require(global.VX_HANDLERS + 'jmeadows-xform-domain-vpr/jmeadows-immunization-xformer');

describe('jmeadows-immunization-xformer', function() {
    var mockEdipi = '00000099';

    var sampleDodImmunization = {
        'cdrEventId': '1000000653',
        'codes': [{
            'code': '24',
            'display': 'anthrax vaccine',
            'system': 'CVX'
        }],
        'patientId': null,
        'patientName': null,
        'site': {
            'agency': 'DOD',
            'dmisId': null,
            'endpoints': [],
            'id': null,
            'moniker': 'AHLTA',
            'name': 'AHLTA',
            'permissions': [],
            'region': null,
            'siteCode': '2.16.840.1.113883.3.42.126.100001.13',
            'status': null
        },
        'sourceProtocol': 'DODADAPTER',
        'dateTime': 1389225600000,
        'encounterProvider': null,
        'id': null,
        'name': 'Anthrax',
        'orderingProvider': null,
        'reaction': null,
        'series': '2'
    };

    var sampleVPRImmunization = {
        codes: [{
            code: '24',
            display: 'anthrax vaccine',
            system: 'urn:oid:2.16.840.1.113883.12.292'
        }],
        administeredDateTime: '20140108190000',
        name: 'Anthrax',
        seriesName: '2',
        facilityName: 'DOD',
        facilityCode: 'DOD',
        uid: 'urn:va:immunization:DOD:00000099:1000000653',
        pid: 'DOD;00000099'
    };

    it('verify transform sample immunization to VPR', function() {
        var vprData = xformer(sampleDodImmunization, mockEdipi);

        //console.log(vprData);
        expect(vprData.codes).toEqual(sampleVPRImmunization.codes);
        expect(vprData.administeredDateTime).toBeTruthy();
        expect(vprData.name).toEqual(sampleVPRImmunization.name);
        expect(vprData.seriesName).toEqual(sampleVPRImmunization.seriesName);
        expect(vprData.facilityName).toEqual(sampleVPRImmunization.facilityName);
        expect(vprData.facilityCode).toEqual(sampleVPRImmunization.facilityCode);
        expect(vprData.uid).toEqual(sampleVPRImmunization.uid);
        expect(vprData.pid).toEqual(sampleVPRImmunization.pid);
    });
});