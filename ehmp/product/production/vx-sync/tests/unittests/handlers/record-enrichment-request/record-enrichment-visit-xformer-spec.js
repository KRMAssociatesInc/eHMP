'use strict';
//------------------------------------------------------------------------------------
// This contains a set of integration tests for record-enrichment-visit-xformer.js.
//
// Author: Les Westberg
//------------------------------------------------------------------------------------

require('../../../../env-setup');
var ncUtil = require(global.VX_UTILS + 'namecase-utils');

var xformer = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-visit-xformer');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-visit-xformer-spec',
//     level: 'debug'
// });

var originalVaVisitRecord = {
    'categoryCode': 'urn:va:encounter-category:OV',
    'categoryName': 'Outpatient Visit',
    'dateTime': 20000521095731,
    'encounterType': 'P',
    'facilityCode': 500,
    'facilityName': 'CAMP MASTER',
    'lastUpdateTime': 20000521095731,
    'localId': 2200,
    'locationName': 'BECKY\'S CLINIC',
    'locationOos': false,
    'locationUid': 'urn:va:location:9E7A:136',
    'patientClassCode': 'urn:va:patient-class:AMB',
    'patientClassName': 'Ambulatory',
    'pid': '9E7A;3',
    'providers': [{
        'primary': true,
        'providerName': 'VEHU,TWENTYONE',
        'providerUid': 'urn:va:user:9E7A:20023',
        'role': 'P'
    }],
    'service': 'PSYCHIATRY',
    'shortLocationName': 'BJM',
    'stampTime': 20000521095731,
    'stopCodeName': 'GENERAL SURGERY',
    'stopCodeUid': 'urn:va:stop-code:401',
    'typeName': 'BECKY\'S CLINIC VISIT',
    'uid': 'urn:va:visit:9E7A:3:2200'
};

var originalVaVisitJob = {
    record: originalVaVisitRecord
};

var originalDodVisitRecord = {
    'appoinmentStatus': 'Complete',
    'categoryName': 'DoD Encounter',
    'dateTime': '20131203140359',
    'dispositionName': 'Sick at Home/Quarters',
    'facilityCode': 'DOD',
    'facilityName': 'DOD',
    'locationName': 'Family Practice Clinic',
    'pid': 'DOD;0000000003',
    'providers': [{
        'providerName': 'BHIE, USERONE'
    }],
    'reasonName': '',
    'stampTime': '20150317062317',
    'typeDisplayName': 'OUTPATIENT',
    'typeName': 'OUTPATIENT',
    'uid': 'urn:va:visit:DOD:0000000003:1000000375'
};
var originalDodVisitJob = {
    record: originalDodVisitRecord
};

var removedRecord = {
    'pid': 'DOD;0000000003',
    'stampTime': '20150226124943',
    'removed': true,
    'uid': 'urn:va:visit:DOD:0000000003:1000010340'
};

var removedJob = {
    record: removedRecord
};

var config = {};

describe('record-enrichment-visit-xformer.js', function() {
    describe('transformAndEnrichRecord()', function() {
        it('Happy Path with VA Visit', function() {
            var finished = false;
            var environment = {};
            var config = {};

            runs(function() {
                xformer(log, config, environment, originalVaVisitJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.current).toBe(false);
                    expect(record.summary).toEqual(originalVaVisitRecord.stopCodeName);
                    expect(record.kind).toEqual('Visit');
                    expect(record.typeDisplayName).toEqual(ncUtil.namecase(record.typeName));
                    expect(record.locationDisplayName).toEqual(ncUtil.namecase(record.locationName));
                    expect(record.providers).toBeTruthy();
                    expect(record.providers.length).toEqual(1);
                    expect(record.providers[0].summary).toEqual('EncounterProvider{uid=\'\'}');
                    expect(record.providers[0].providerDisplayName).toEqual('Vehu,Twentyone');
                    expect(typeof record.lastUpdateTime).toEqual('string');
                    expect(typeof record.stampTime).toEqual('string');
                    expect(typeof record.dateTime).toEqual('string');
                    expect(typeof record.localId).toEqual('string');
                    expect(typeof record.facilityCode).toEqual('string');
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Happy Path with Dod Visit', function() {
            var finished = false;
            var environment = {};
            var config = {};

            runs(function() {
                xformer(log, config, environment, originalDodVisitJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.current).toBe(false);
                    expect(record.summary).toBeUndefined();
                    expect(record.kind).toEqual(originalDodVisitRecord.categoryName);
                    expect(record.typeDisplayName).toEqual('OUTPATIENT');       // because it was already set - it will not get overridden
                    expect(record.locationDisplayName).toEqual(ncUtil.namecase(record.locationName));
                    expect(record.providers).toBeTruthy();
                    expect(record.providers.length).toEqual(1);
                    expect(record.providers[0].summary).toEqual('EncounterProvider{uid=\'\'}');
                    expect(record.providers[0].providerDisplayName).toEqual('Bhie, Userone');
                    expect(typeof record.stampTime).toEqual('string');
                    expect(typeof record.dateTime).toEqual('string');
                    expect(typeof record.facilityCode).toEqual('string');
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Job was null', function() {
            var finished = false;
            var environment = {};

            runs(function() {
                xformer(log, config, environment, null, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeNull();
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Job was removed', function() {
            var finished = false;
            var environment = {};

            runs(function() {
                xformer(log, config, environment, removedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.uid).toEqual('urn:va:visit:DOD:0000000003:1000010340');
                    expect(record.pid).toEqual('DOD;0000000003');
                    expect(record.stampTime).toEqual('20150226124943');
                    expect(record.removed).toEqual(true);
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });

    });
});