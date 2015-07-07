'use strict';

require('../../../../env-setup');
var xformer = require(global.VX_HANDLERS + 'jmeadows-xform-domain-vpr/jmeadows-radiology-xformer');

var mockEdipi = '00000099';

var sampleDodRadiology = {
    'cdrEventId': '1000001515',
    'codes': [],
    'patientId': null,
    'patientName': null,
    'site': {
        'agency': 'DOD',
        'dmisId': null,
        'endpoints': [],
        'id': null,
        'moniker': '4th Medical Group/0090',
        'name': 'AHLTA',
        'permissions': [],
        'region': null,
        'siteCode': '2.16.840.1.113883.3.42.126.100001.13',
        'status': null
    },
    'sourceProtocol': 'DODADAPTER',
    'accessionNumber': '07000073',
    'examDate': 1182422220000,
    'examId': '23564659',
    'reasonForOrder': 'test',
    'status': '',
    'study': 'CHEST,AP',
    'approvedBy': '',
    'caseNumber': null,
    'impressionText': '',
    'interpretingHCP': '100000059 LARRY, PROVIDER',
    'priority': '',
    'reportIEN': null,
    'reportStatus': 'Transcribed',
    'reportText': 'Procedure:CHEST,AP\n20070621103000\nOrder Comment: test\nReason for Order: test\nExam #:07000073\nExam Date/Time:20070621103700\nTranscription Date/Time:20070621103700\nProvider:100000059 LARRY, PROVIDER\nRequesting Location:INTERNAL MEDICINE     SEYMOUR JOHNSON AFB, NC\nStatus:TRANSCRIBED\nResult Code: 3 MAJOR ABNORMALITY, NO ATTN. NEEDED\nInterpreted By:100000059 LARRY, PROVIDER\nReport Text: test',
    'resultCode': '3',
    'severity': null,
    'transcribeDate': 1182422220000
};

var sampleVprRadiology = {
    codes: [],
    facilityCode: 'DOD',
    facilityName: 'DOD',
    imageLocation: 'INTERNAL MEDICINE     SEYMOUR JOHNSON AFB, NC',
    locationName: 'INTERNAL MEDICINE     SEYMOUR JOHNSON AFB, NC',
    statusName: 'Not Available',
    name: 'CHEST,AP',
    typeName: 'RADIOLOGIC EXAMINATIONCHEST,AP',
    kind: 'Radiology',
    localId: '07000073',
    encounterUid: '23564659',
    dateTime: '20070621063700',
    hasImages: false,
    reason: 'test',
    status: '',
    category: 'RA',
    providers: [{
        providerName: '100000059 LARRY, PROVIDER',
        privderDisplayName: '100000059 LARRY, PROVIDER'
    }],
    results: [{
        localTitle: 'CHEST,AP',
        report: 'Procedure:CHEST,AP\n20070621103000\nOrder Comment: test\nReason for Order: test\nExam #:07000073\nExam Date/Time:20070621103700\nTranscription Date/Time:20070621103700\nProvider:100000059 LARRY, PROVIDER\nRequesting Location:INTERNAL MEDICINE     SEYMOUR JOHNSON AFB, NC\nStatus:TRANSCRIBED\nResult Code: 3 MAJOR ABNORMALITY, NO ATTN. NEEDED\nInterpreted By:100000059 LARRY, PROVIDER\nReport Text: test'
    }],
    uid: 'urn:va:image:DOD:00000099:1000001515',
    pid: 'DOD;00000099'
};

describe('jmeadows-radiology-xformer', function() {
    var result = xformer(sampleDodRadiology, mockEdipi);
    it('tansforms sample radiology to vpr', function() {
        expect(result.codes).toEqual(sampleVprRadiology.codes);
        expect(result.facilityCode).toEqual(sampleVprRadiology.facilityCode);
        expect(result.facilityName).toEqual(sampleVprRadiology.facilityName);
        expect(result.imageLocation).toEqual(sampleVprRadiology.imageLocation);
        expect(result.locationName).toEqual(sampleVprRadiology.locationName);
        expect(result.statusName).toEqual(sampleVprRadiology.statusName);
        expect(result.name).toEqual(sampleVprRadiology.name);
        expect(result.typeName).toEqual(sampleVprRadiology.typeName);
        expect(result.kind).toEqual(sampleVprRadiology.kind);
        expect(result.localId).toEqual(sampleVprRadiology.localId);
        expect(result.encounterUid).toEqual(sampleVprRadiology.encounterUid);
        expect(result.dateTime).toBeTruthy();
        expect(result.hasImages).toEqual(sampleVprRadiology.hasImages);
        expect(result.reason).toEqual(sampleVprRadiology.reason);
        expect(result.status).toEqual(sampleVprRadiology.status);
        expect(result.category).toEqual(sampleVprRadiology.category);
        expect(result.providers).toEqual(sampleVprRadiology.providers);
        expect(result.results).toEqual(sampleVprRadiology.results);
        expect(result.uid).toEqual(sampleVprRadiology.uid);
        expect(result.pid).toEqual(sampleVprRadiology.pid);
    });
});