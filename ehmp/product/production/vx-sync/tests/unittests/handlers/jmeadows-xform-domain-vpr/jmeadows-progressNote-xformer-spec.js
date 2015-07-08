'use strict';

require('../../../../env-setup');
//var _ = require('underscore');
var xformer = require(global.VX_HANDLERS + 'jmeadows-xform-domain-vpr/jmeadows-progressNote-xformer');

var vx_sync_ip = require(global.VX_INTTESTS + 'test-config');

var mockEdipi = '00001';

var sampleDodNote = {
    'cdrEventId': '1000000648',
    'codes': [{
        'code': '15149135',
        'display': null,
        'system': 'DOD_NCID'
    }, {
        'code': '11536-0',
        'display': null,
        'system': 'DOD_NOTES'
    }, {
        'code': '28570-0',
        'display': 'Provider-unspecified Procedure note',
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
    'amended': null,
    'complexDataUrl': 'http://' + vx_sync_ip + ':8080/MockDoDAdaptor/async/complex/note/2157585042',
    'images': null,
    'location': 'NH Great Lakes IL/0056',
    'noteDate': 1320950895000,
    'noteId': null,
    'noteText': '',
    'noteTitle': 'Procedure Note (Provider) Document',
    'noteTitleId': null,
    'noteType': 'Procedure Note (Provider) Document',
    'provider': {
        'name' : 'BHIE, USERONE'
    },
    'status': 'rtf',
    'userIen': null,
    'visitDate': null
};

var sampleVprNote = {
    referenceDateTime: 20111110134815,
    codes: [{
        code: '15149135',
        system: 'DOD_NCID'
    }, {
        code: '11536-0',
        system: 'DOD_NOTES'
    }, {
        code: '28570-0',
        display: 'Provider-unspecified Procedure note',
        system: 'http://loinc.org'
    }],
    localTitle: 'Procedure Note (Provider) Document',
    documentTypeName: 'Procedure Note (Provider) Document',
    author: 'BHIE, USERONE',
    authorDisplayName: 'BHIE, USERONE',
    status: 'completed',
    statusName: 'completed',
    facilityName: 'DOD',
    facilityCode: 'DOD',
    uid: 'urn:va:document:DOD:00001:1000000648',
    pid: 'DOD;00001',
    text: [],
    dodComplexNoteUri: 'http://' + vx_sync_ip + ':8080/MockDoDAdaptor/async/complex/note/2157585042'
};

var result = xformer(sampleDodNote, mockEdipi);
//console.log(result);

describe('dodNoteToVpr', function() {
    it('verify transform sample note to vpr', function() {
        expect(result.referenceDateTime).toBeTruthy();
        expect(result.codes).toEqual(sampleVprNote.codes);
        expect(result.localTitle).toEqual(sampleVprNote.documentTypeName);
        expect(result.author).toEqual(sampleVprNote.author);
        expect(result.authorDisplayName).toEqual(sampleVprNote.authorDisplayName);
        expect(result.status).toEqual(sampleVprNote.status);
        expect(result.statusName).toEqual(sampleVprNote.statusName);
        expect(result.facilityName).toEqual(sampleVprNote.facilityName);
        expect(result.facilityCode).toEqual(sampleVprNote.facilityCode);
        expect(result.uid).toEqual(sampleVprNote.uid);
        expect(result.pid).toEqual(sampleVprNote.pid);
        expect(result.text).toEqual(sampleVprNote.text);
        expect(result.dodComplexNoteUri).toEqual(sampleVprNote.dodComplexNoteUri);
    });
});