'use strict';

require('../../../../env-setup');
//var _ = require('underscore');
var xformer = require(global.VX_HANDLERS + 'jmeadows-xform-domain-vpr/jmeadows-consult-xformer');

var vx_sync_ip = require(global.VX_INTTESTS + 'test-config');

var mockEdipi = '00001';

var sampleDodConsult = {
    'cdrEventId': '1000000649',
    'codes': '[ ]',
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
    'complexDataUrl': 'http://' + vx_sync_ip + ':8080/MockDoDAdaptor/async/complex/note/2157584289',
    'consultType': null,
    'id': null,
    'patientNextAppointment': null,
    'procedureConsult': 'Consultation Note (Provider) Document',
    'providerName': null,
    'report': '',
    'requestDate': 1389374124000,
    'service': 'Consultation Note (Provider) Document',
    'status': null
};

var sampleVprConsult = {
    codes: [],
    facilityCode: 'DOD',
    facilityName: 'DOD',
    status: 'COMPLETED',
    statusDisplayName: 'Completed',
    localTitle: 'Consultation Note (Provider) Document',
    referenceDateTime: '20140110121524',
    documentTypeName: 'Consultation Note (Provider) Document',
    sensitive: false,
    dodComplexNoteUri: 'http://' + vx_sync_ip + ':8080/MockDoDAdaptor/async/complex/note/2157584289',
    uid: 'urn:va:document:DOD:00001:1000000649',
    pid: 'DOD;00001'
};

//console.log(xformer(sampleDodConsult, mockEdipi));

describe('jmeadows-consult-xformer', function(){
    var vprResult = {};
    it('transforms sample dod consult note to vpr (not sensitive)', function(){

        vprResult = xformer(sampleDodConsult, mockEdipi);

        expect(vprResult.codes).toEqual(sampleVprConsult.codes);
        expect(vprResult.facilityCode).toEqual(sampleVprConsult.facilityCode);
        expect(vprResult.facilityName).toEqual(sampleVprConsult.facilityName);
        expect(vprResult.status).toEqual(sampleVprConsult.status);
        expect(vprResult.statusDisplayName).toEqual(sampleVprConsult.statusDisplayName);
        expect(vprResult.localTitle).toEqual(sampleVprConsult.localTitle);
        expect(vprResult.referenceDateTime).toBeTruthy();
        expect(vprResult.documentTypeName).toEqual(sampleVprConsult.documentTypeName);
        expect(vprResult.sensitive).toEqual(sampleVprConsult.sensitive);
        expect(vprResult.dodComplexNoteUri).toEqual(sampleVprConsult.dodComplexNoteUri);
        expect(vprResult.uid).toEqual(sampleVprConsult.uid);
        expect(vprResult.pid).toEqual(sampleVprConsult.pid);
    });
    it('sets vpr sensitive flag to \'true\' when dod consult service field begins with *\'s', function(){
        sampleDodConsult.service = '*****Consultation Note (Provider) Document';
        vprResult = xformer(sampleDodConsult, mockEdipi);

        expect(vprResult.sensitive).toBe(true);
    });
    it('fills vpr text field when consult note includes \'report\' instead of \'complexDataUrl\'', function(){
        sampleDodConsult.complexDataUrl = null;
        sampleDodConsult.report = 'Lorem ipsum dolor sit amet';

        var sampleVprConsultText = [{
            content: 'Lorem ipsum dolor sit amet',
            dateTime: '20140110121524',
            status: 'completed',
            uid: 'urn:va:document:DOD:00001:1000000649'
        }];

        vprResult = xformer(sampleDodConsult, mockEdipi);
        //console.log(JSON.stringify(vprResult));
        expect(vprResult.text[0]).toBeTruthy();
        expect(vprResult.text[0].content).toEqual(sampleVprConsultText[0].content);
        expect(vprResult.text[0].dateTime).toBeTruthy();
        expect(vprResult.text[0].status).toEqual(sampleVprConsultText[0].status);
        expect(vprResult.text[0].uid).toEqual(sampleVprConsultText[0].uid);
    });

});