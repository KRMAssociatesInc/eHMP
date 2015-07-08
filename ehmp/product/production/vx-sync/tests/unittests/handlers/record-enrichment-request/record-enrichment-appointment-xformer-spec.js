'use strict';
//------------------------------------------------------------------------------------
// This contains a set of integration tests for record-enrichment-appointment-xformer.js.
//
// Author: Les Westberg
//------------------------------------------------------------------------------------

require('../../../../env-setup');

var _ = require('underscore');

var xformer = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-appointment-xformer');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-allergy-xformer-spec',
//     level: 'debug'
// });

var originalVaAppointmentRecord = {
    'appointmentStatus': 'SCHEDULED/KEPT',
    'categoryCode': 'urn:va:encounter-category:OV',
    'categoryName': 'Outpatient Visit',
    'checkOut': 200005211314,
    'dateTime': 200005210900,
    'facilityCode': 500,
    'facilityName': 'CAMP MASTER',
    'lastUpdateTime': 20000521131400,
    'localId': 'A;3000521.09;23',
    'locationName': 'GENERAL MEDICINE',
    'locationUid': 'urn:va:location:9E7A:23',
    'patientClassCode': 'urn:va:patient-class:AMB',
    'patientClassName': 'Ambulatory',
    'pid': '9E7A;3',
    'providers': [
        {
            'primary': true,
            'providerName': 'BHIE, USERONE'
        }
    ],
    'service': 'MEDICINE',
    'shortLocationName': 'GM',
    'stampTime': 20000521131400,
    'stopCodeName': 'GENERAL INTERNAL MEDICINE',
    'stopCodeUid': 'urn:va:stop-code:301',
    'typeCode': 9,
    'typeName': 'REGULAR',
    'uid': 'urn:va:appointment:9E7A:3:A;3000521.09;23',
    'movements': [{
        'dateTime': 200005210900,
        'localId': 100
    }],
    'stay': {
        'arrivalDateTime': 200005210900,
        'admitDecisionDateTime': 200005210900,
        'admitOrderDateTime': 200005210900,
        'dischargeDateTime': 200005210900,
        'admitCode': 100
    }
};

var originalVaAppointmentJob = {
    record: originalVaAppointmentRecord
};

var originalDodAppointmentRecord = {
    'appointmentStatus': 'KEPT',
    'categoryName': 'DoD Appointment',
    'dateTime': 20140110050800,
    'facilityCode': 'DOD',
    'facilityName': 'DOD',
    'locationName': 'Family Practice Clinic',
    'pid': 'DOD;0000000003',
    'providers': [
        {
            'providerName': 'BHIE, USERONE'
        }
    ],
    'reasonName': '',
    'stampTime': '20150302083258',
    'typeDisplayName': 'ACUT',
    'typeName': 'ACUT',
    'uid': 'urn:va:appointment:DOD:0000000003:1000010343'
};
var originalDodAppointmentJob = {
    record: originalDodAppointmentRecord
};

var removedRecord = {
    'pid': 'DOD;0000000003',
    'stampTime': '20150226124943',
    'removed': true,
    'uid': 'urn:va:appointment:DOD:0000000003:1000010340'
};

var removedJob = {
    record: removedRecord
};

var config = {};

describe('record-enrichment-appointment-xformer.js', function() {
    describe('transformAndEnrichRecord()', function() {
        it('Happy Path with VA Appointment', function() {
            var finished = false;
            var environment = {};
            var config = {};

            runs(function() {
                xformer(log, config, environment, originalVaAppointmentJob, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.current).toBe(false);
                    expect(record.summary).toEqual(originalVaAppointmentRecord.stopCodeName);
                    expect(record.kind).toEqual('Visit');
                    expect(record.typeDisplayName).toEqual('Regular');
                    expect(record.locationDisplayName).toEqual('General Medicine');
                    expect(record.providers).toBeTruthy();
                    expect(record.providers.length).toEqual(1);
                    expect(record.providers[0].summary).toEqual('EncounterProvider{uid=\'\'}');
                    expect(record.providers[0].providerDisplayName).toEqual('Bhie, Userone');
                    expect(record.primaryProvider).toEqual(record.providers[0]);
                    expect(record.movements).toBeTruthy();
                    expect(_.isArray(record.movements)).toBe(true);
                    expect(record.movements.length).toEqual(1);
                    expect(record.movements[0].summary).toEqual('EncounterMovement{uid=\'\'}');

                    expect(typeof record.lastUpdateTime).toEqual('string');
                    expect(typeof record.stampTime).toEqual('string');
                    expect(typeof record.dateTime).toEqual('string');
                    expect(typeof record.localId).toEqual('string');
                    expect(typeof record.facilityCode).toEqual('string');
                    expect(typeof record.typeCode).toEqual('string');
                    expect(typeof record.checkOut).toEqual('string');
                    expect(typeof record.movements[0].dateTime).toEqual('string');
                    expect(typeof record.movements[0].localId).toEqual('string');
                    expect(typeof record.stay.arrivalDateTime).toEqual('string');
                    expect(typeof record.stay.admitDecisionDateTime).toEqual('string');
                    expect(typeof record.stay.admitOrderDateTime).toEqual('string');
                    expect(typeof record.stay.dischargeDateTime).toEqual('string');
                    expect(typeof record.stay.admitCode).toEqual('string');

                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Happy Path with Dod Appointment', function() {
            var finished = false;
            var environment = { };
            var config = {};

            runs(function() {
                xformer(log, config, environment, originalDodAppointmentJob, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.current).toBe(false);
                    expect(record.summary).toBeUndefined();
                    expect(record.kind).toEqual(originalDodAppointmentRecord.categoryName);
                    expect(record.typeDisplayName).toEqual('ACUT');
                    expect(record.locationDisplayName).toEqual('Family Practice Clinic');
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
        it('Checking some \'else\' logic conditions', function() {
            var finished = false;
            var environment = {};
            var config = {};

            var appointmentRecord = {
                'appointmentStatus': 'SCHEDULED/KEPT',
                'categoryCode': undefined,                          // Will force a kind setting of 'unknown'
                'categoryName': undefined,                          // Will force a kind setting of 'unknown'
                'checkOut': 200005211314,
                'dateTime': 200005210900,
                'facilityCode': 500,
                'facilityName': 'CAMP MASTER',
                'lastUpdateTime': 20000521131400,
                'localId': 'A;3000521.09;23',
                'locationName': undefined,                          // Will force us to leave locationDisplayName as undefined
                'locationUid': 'urn:va:location:9E7A:23',
                'patientClassCode': 'urn:va:patient-class:AMB',
                'patientClassName': 'Ambulatory',
                'pid': '9E7A;3',
                'providers': undefined,                             // Will force no conversion on provider array
                'service': 'MEDICINE',
                'shortLocationName': 'GM',
                'stampTime': 20000521131400,
                'stopCodeName': 'GENERAL INTERNAL MEDICINE',
                'stopCodeUid': 'urn:va:stop-code:301',
                'typeCode': 9,
                'typeName': undefined,                          // Will force us to leave typeDisplayName as undefined
                'uid': 'urn:va:appointment:9E7A:3:A;3000521.09;23'
            };

            var appointmentJob = {
                record: appointmentRecord
            };

            runs(function() {
                xformer(log, config, environment, appointmentJob, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.current).toBe(false);
                    expect(record.summary).toEqual(appointmentRecord.stopCodeName);
                    expect(record.kind).toEqual('Unknown');
                    expect(record.typeDisplayName).toBeUndefined();
                    expect(record.locationDisplayName).toBeUndefined();
                    expect(record.providers).toBeFalsy();
                    expect(typeof record.dateTime).toEqual('string');
                    expect(typeof record.localId).toEqual('string');
                    expect(typeof record.facilityCode).toEqual('string');
                    expect(typeof record.typeCode).toEqual('string');
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
        it('Job.record was null', function() {
            var finished = false;
            var environment = {};

            runs(function() {
                xformer(log, config, environment, {}, function(error, record) {
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
                xformer(log, config, environment, removedJob, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.uid).toEqual('urn:va:appointment:DOD:0000000003:1000010340');
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