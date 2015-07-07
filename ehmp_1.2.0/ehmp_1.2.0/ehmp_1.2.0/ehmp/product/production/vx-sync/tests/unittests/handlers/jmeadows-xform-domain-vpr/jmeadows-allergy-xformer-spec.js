'use strict';

require('../../../../env-setup');
var _ = require('underscore');
var xformer = require(global.VX_HANDLERS + 'jmeadows-xform-domain-vpr/jmeadows-allergy-xformer');

describe('jmeadows-allergy-xformer', function() {
    var mockEdipi = '00000099';

    var sampleDODAllergy = {
        cdrEventId: 1000001128,
        codes: [{
            code: 7090000,
            system: 'DOD_ALLERGY_IEN'
        }, {
            code: 'C0037494',
            display: 'Sodium Chloride',
            system: 'UMLS'
        }],
        site: {
            agency: 'DOD',
            moniker: 'NH Great Lakes IL/0056',
            name: 'AHLTA',
            siteCode: '2.16.840.1.113883.3.42.126.100001.13'
        },
        sourceProtocol: 'DODADAPTER',
        allergyName: 'SODIUM CHLORIDE {Class}',
        comment: 'Nausea'
    };

    var sampleVPRAllergy = {
        products: [{
            name: 'SODIUM CHLORIDE {Class}'
        }],
        summary: 'SODIUM CHLORIDE {Class}',
        codes: [{
            code: 7090000,
            system: 'DOD_ALLERGY_IEN'
        }, {
            code: 'C0037494',
            display: 'Sodium Chloride',
            system: 'urn:oid:2.16.840.1.113883.6.86'
        }],
        comments: [{
            comment: 'Nausea'
        }],
        facilityName: 'DOD',
        facilityCode: 'DOD',
        kind: 'Allergy/Adverse Reaction',
        uid: 'urn:va:allergy:DOD:00000099:1000001128',
        pid: 'DOD;00000099'
    };



    describe('dodAllergyToVPR', function() {

        it('verify transform sample allergy to VPR', function() {
            var vprData = xformer(sampleDODAllergy, mockEdipi);
            expect(vprData.products).toEqual(sampleVPRAllergy.products);
            expect(vprData.summary).toEqual(sampleVPRAllergy.summary);
            expect(vprData.codes).toEqual(sampleVPRAllergy.codes);
            expect(vprData.comments).toEqual(sampleVPRAllergy.comments);
            expect(vprData.facilityName).toEqual(sampleVPRAllergy.facilityName);
            expect(vprData.facilityCode).toEqual(sampleVPRAllergy.facilityCode);
            expect(vprData.kind).toEqual(sampleVPRAllergy.kind);
            expect(vprData.uid).toEqual(sampleVPRAllergy.uid);
            expect(vprData.pid).toEqual(sampleVPRAllergy.pid);
        });

    });

});