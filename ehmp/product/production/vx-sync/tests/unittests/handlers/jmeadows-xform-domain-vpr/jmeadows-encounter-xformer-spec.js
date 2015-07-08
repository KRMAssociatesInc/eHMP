'use strict';

require('../../../../env-setup');
//var _ = require('underscore');
var xformer = require(global.VX_HANDLERS + 'jmeadows-xform-domain-vpr/jmeadows-encounter-xformer');

var mockEdipi = '00001';

var sampleDodEncounter = {
    'cdrEventId': '1000000382',
    'codes': [],
    'patientId': null,
    'patientName': null,
    'site': {
        'agency': 'DOD',
        'dmisId': null,
        'endpoints': [],
        'id': null,
        'moniker': '2157584319',
        'name': 'AHLTA',
        'permissions': [],
        'region': null,
        'siteCode': '2.16.840.1.113883.3.42.126.100001.13',
        'status': null
    },
    'sourceProtocol': 'DODADAPTER',
    'appointmentDate': 1389373730000,
    'apptType': 'OUTPATIENT',
    'clinic': 'Family Practice Clinic',
    'diagnosis': [{
        'cdrEventId': null,
        'codes': [],
        'patientId': null,
        'patientName': null,
        'site': null,
        'sourceProtocol': null,
        'code': '784.0',
        'date': null,
        'description': 'Headache',
        'status': ''
    }],
    'dischargeDisposition': 'Released w/o Limitations',
    'encounterId': '2157584319',
    'encounterNumber': 'GTLK-3801',
    'enteredBy': 'BHIE, USERONE',
    'enteredByDate': 1389635742000,
    'evalManagementCode': '99212',
    'evaluations': [],
    'procedures': [],
    'provider': {
        'name': 'BHIE, USERONE'
    },
    'report': null,
    'reportFormat': null,
    'status': 'Complete',
    'visitReason': ''
};

var sampleVprEncounter = {
    dateTime: '20140110120850',
    categoryName: 'DoD Encounter',
    locationName: 'Family Practice Clinic',
    facilityName: 'DOD',
    facilityCode: 'DOD',
    appoinmentStatus: 'Complete',
    typeName: 'OUTPATIENT',
    typeDisplayName: 'OUTPATIENT',
    dispositionName: 'Released w/o Limitations',
    reasonName: '',
    providers: [{
        providerName: 'BHIE, USERONE'
    }],
    uid: 'urn:va:visit:DOD:00001:1000000382',
    pid: 'DOD;00001'
};

var result = xformer(sampleDodEncounter, mockEdipi);

//console.log(result);

describe('dodEncounterToVPR', function(){
    it('verify transform sample dod encounter to vpr', function(){
        expect(result.dateTime).toBeTruthy();
        expect(result.categoryName).toEqual(sampleVprEncounter.categoryName);
        expect(result.locationName).toEqual(sampleVprEncounter.locationName);
        expect(result.facilityName).toEqual(sampleVprEncounter.facilityName);
        expect(result.facilityCode).toEqual(sampleVprEncounter.facilityCode);
        expect(result.appoinmentStatus).toEqual(sampleVprEncounter.appoinmentStatus);
        expect(result.typeName).toEqual(sampleVprEncounter.typeName);
        expect(result.typeDisplayName).toEqual(sampleVprEncounter.typeDisplayName);
        expect(result.dispositionName).toEqual(sampleVprEncounter.dispositionName);
        expect(result.reasonName).toEqual(sampleVprEncounter.reasonName);
        expect(result.providers).toEqual(sampleVprEncounter.providers);
        expect(result.uid).toEqual(sampleVprEncounter.uid);
        expect(result.pid).toEqual(sampleVprEncounter.pid);
    });
});