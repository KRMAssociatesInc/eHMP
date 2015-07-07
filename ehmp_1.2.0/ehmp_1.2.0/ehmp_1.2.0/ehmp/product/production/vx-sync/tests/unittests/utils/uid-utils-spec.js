'use strict';

require('../../../env-setup');

var uidUtil = require(global.VX_UTILS + 'uid-utils');

describe('uid-utils', function() {
    describe('extractPiecesFromUID', function() {
        it('vista event uid', function() {
            var result = uidUtil.extractPiecesFromUID('urn:va:allergy:9E7A:8:753');
            expect(result).toBeDefined();
            expect(result.prefix).toBe('urn');
            expect(result.organization).toBe('va');
            expect(result.domain).toBe('allergy');
            expect(result.site).toBe('9E7A');
            expect(result.patient).toBe('8');
            expect(result.localId).toBe('753');
        });
        it('vista patient uid', function() {
            var result = uidUtil.extractPiecesFromUID('urn:va:patient:9E7A:8:8');
            expect(result).toBeDefined();
            expect(result.prefix).toBe('urn');
            expect(result.organization).toBe('va');
            expect(result.domain).toBe('patient');
            expect(result.site).toBe('9E7A');
            expect(result.patient).toBe('8');
            expect(result.localId).toBe('8');
        });
        it('DOD event uid', function() {
            var result = uidUtil.extractPiecesFromUID('urn:va:allergy:DOD:0000000008:1000001122');
            expect(result).toBeDefined();
            expect(result.prefix).toBe('urn');
            expect(result.organization).toBe('va');
            expect(result.domain).toBe('allergy');
            expect(result.site).toBe('DOD');
            expect(result.patient).toBe('0000000008');
            expect(result.localId).toBe('1000001122');
        });
        it('HDR event uid', function() {
            var result = uidUtil.extractPiecesFromUID('urn:va:allergy:ABCD:16:106');
            expect(result).toBeDefined();
            expect(result.prefix).toBe('urn');
            expect(result.organization).toBe('va');
            expect(result.domain).toBe('allergy');
            expect(result.site).toBe('ABCD');
            expect(result.patient).toBe('16');
            expect(result.localId).toBe('106');
        });
        it('Operational uid', function() {
            var result = uidUtil.extractPiecesFromUID('urn:va:allergy-list::334');
            expect(result).toBeDefined();
            expect(result.prefix).toBe('urn');
            expect(result.organization).toBe('va');
            expect(result.domain).toBe('allergy-list');
            expect(result.site).toBe('');
            expect(result.patient).toBe('334');
            expect(result.localId).toBeUndefined();
        });
        it('extract valid sitehash from uid', function() {
            var result = uidUtil.extractSiteHash('urn:va:allergy:ABCD:16:106');
            expect(result).toBe('ABCD');
        });
        it('extract invalid sitehash from uid', function() {
            var result = uidUtil.extractSiteHash('urn:va:allergy::16:106');
            expect(result).toBe('');
        });
    });

    describe('get uid for domain', function() {
        var dummySite = 'ABCD';
        var dummyLocalPatientId = 1234;
        var dummyLocalId = 5678;

        it('allergy', function() {
            var uid = uidUtil.getUidForDomain('allergy', dummySite, dummyLocalPatientId, dummyLocalId);
            expect(uid).toEqual('urn:va:allergy:ABCD:1234:5678');
        });
        it('appointment', function() {
            var uid = uidUtil.getUidForDomain('appointment', dummySite, dummyLocalPatientId, dummyLocalId);
            expect(uid).toEqual('urn:va:appointment:ABCD:1234:5678');
        });
        it('consult', function() {
            var uid = uidUtil.getUidForDomain('consult', dummySite, dummyLocalPatientId, dummyLocalId);
            expect(uid).toEqual('urn:va:consult:ABCD:1234:5678');
        });
        it('cpt', function() {
            var uid = uidUtil.getUidForDomain('cpt', dummySite, dummyLocalPatientId, dummyLocalId);
            expect(uid).toEqual('urn:va:cpt:ABCD:1234:5678');
        });
        it('document', function() {
            var uid = uidUtil.getUidForDomain('document', dummySite, dummyLocalPatientId, dummyLocalId);
            expect(uid).toEqual('urn:va:document:ABCD:1234:5678');
        });
        it('vlerdocument', function() {
            var uid = uidUtil.getUidForDomain('vlerdocument', dummySite, dummyLocalPatientId, dummyLocalId);
            expect(uid).toEqual('urn:va:vlerdocument:ABCD:1234:5678');
        });
        it('exam', function() {
            var uid = uidUtil.getUidForDomain('exam', dummySite, dummyLocalPatientId, dummyLocalId);
            expect(uid).toEqual('urn:va:exam:ABCD:1234:5678');
        });
        it('education', function() {
            var uid = uidUtil.getUidForDomain('education', dummySite, dummyLocalPatientId, dummyLocalId);
            expect(uid).toEqual('urn:va:education:ABCD:1234:5678');
        });
        it('factor', function() {
            var uid = uidUtil.getUidForDomain('factor', dummySite, dummyLocalPatientId, dummyLocalId);
            expect(uid).toEqual('urn:va:factor:ABCD:1234:5678');
        });
        it('immunization', function() {
            var uid = uidUtil.getUidForDomain('immunization', dummySite, dummyLocalPatientId, dummyLocalId);
            expect(uid).toEqual('urn:va:immunization:ABCD:1234:5678');
        });
        it('lab', function() {
            var uid = uidUtil.getUidForDomain('lab', dummySite, dummyLocalPatientId, dummyLocalId);
            expect(uid).toEqual('urn:va:lab:ABCD:1234:5678');
        });
        it('med', function() {
            var uid = uidUtil.getUidForDomain('med', dummySite, dummyLocalPatientId, dummyLocalId);
            expect(uid).toEqual('urn:va:med:ABCD:1234:5678');
        });
        it('mh', function() {
            var uid = uidUtil.getUidForDomain('mh', dummySite, dummyLocalPatientId, dummyLocalId);
            expect(uid).toEqual('urn:va:mh:ABCD:1234:5678');
        });
        it('obs', function() {
            var uid = uidUtil.getUidForDomain('obs', dummySite, dummyLocalPatientId, dummyLocalId);
            expect(uid).toEqual('urn:va:obs:ABCD:1234:5678');
        });
        it('order', function() {
            var uid = uidUtil.getUidForDomain('order', dummySite, dummyLocalPatientId, dummyLocalId);
            expect(uid).toEqual('urn:va:order:ABCD:1234:5678');
        });
        it('problem', function() {
            var uid = uidUtil.getUidForDomain('problem', dummySite, dummyLocalPatientId, dummyLocalId);
            expect(uid).toEqual('urn:va:problem:ABCD:1234:5678');
        });
        it('procedure', function() {
            var uid = uidUtil.getUidForDomain('procedure', dummySite, dummyLocalPatientId, dummyLocalId);
            expect(uid).toEqual('urn:va:procedure:ABCD:1234:5678');
        });
        it('patient', function() {
            var uid = uidUtil.getUidForDomain('patient', dummySite, dummyLocalPatientId, dummyLocalId);
            expect(uid).toEqual('urn:va:patient:ABCD:1234:5678');
        });
        it('pov', function() {
            var uid = uidUtil.getUidForDomain('pov', dummySite, dummyLocalPatientId, dummyLocalId);
            expect(uid).toEqual('urn:va:pov:ABCD:1234:5678');
        });
        it('ptf', function() {
            var uid = uidUtil.getUidForDomain('ptf', dummySite, dummyLocalPatientId, dummyLocalId);
            expect(uid).toEqual('urn:va:ptf:ABCD:1234:5678');
        });
        it('image', function() {
            var uid = uidUtil.getUidForDomain('image', dummySite, dummyLocalPatientId, dummyLocalId);
            expect(uid).toEqual('urn:va:image:ABCD:1234:5678');
        });
        it('skin', function() {
            var uid = uidUtil.getUidForDomain('skin', dummySite, dummyLocalPatientId, dummyLocalId);
            expect(uid).toEqual('urn:va:skin:ABCD:1234:5678');
        });
        it('surgery', function() {
            var uid = uidUtil.getUidForDomain('surgery', dummySite, dummyLocalPatientId, dummyLocalId);
            expect(uid).toEqual('urn:va:surgery:ABCD:1234:5678');
        });
        it('task', function() {
            var uid = uidUtil.getUidForDomain('task', dummySite, dummyLocalPatientId, dummyLocalId);
            expect(uid).toEqual('urn:va:task:ABCD:1234:5678');
        });
        it('visit', function() {
            var uid = uidUtil.getUidForDomain('visit', dummySite, dummyLocalPatientId, dummyLocalId);
            expect(uid).toEqual('urn:va:visit:ABCD:1234:5678');
        });
        it('vital', function() {
            var uid = uidUtil.getUidForDomain('vital', dummySite, dummyLocalPatientId, dummyLocalId);
            expect(uid).toEqual('urn:va:vital:ABCD:1234:5678');
        });
        it('invalid domain', function() {
            var uid = uidUtil.getUidForDomain('invalid_domain', dummySite, dummyLocalPatientId, dummyLocalId);
            expect(uid).toBeNull();
        });
    });
});