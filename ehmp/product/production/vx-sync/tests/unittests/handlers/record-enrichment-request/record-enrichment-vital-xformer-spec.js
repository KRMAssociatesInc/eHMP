'use strict';
//------------------------------------------------------------------------------------
// This contains a set of unit tests for record-enrichment-vital-xformer.js.
//
// Author: Les Westberg
//------------------------------------------------------------------------------------

require('../../../../env-setup');

var xformer = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-vital-xformer');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-vital-xformer-spec',
//     level: 'debug'
// });

var originalVaVitalRecord = {
    'displayName': 'T',
    'enteredByName': 'LABTECH,SPECIAL',
    'enteredByUid': 'urn:va:user:9E7A:11745',
    'facilityCode': 998,
    'facilityName': 'ABILENE (CAA)',
    'high': 102,
    'kind': 'Vital Sign',
    'lastUpdateTime': 20040330215452,
    'localId': 12447,
    'locationName': 'NUR NEW LOCATION',
    'locationUid': 'urn:va:location:9E7A:278',
    'low': 95,
    'metricResult': '37.0',
    'metricUnits': 'C',
    'observed': 200403302131,
    'pid': '9E7A;3',
    'qualifiers': [{
        'name': 'AXILLARY',
        'vuid': 4688640
    }],
    'result': 98.6,
    'resulted': 20040330215452,
    'stampTime': 20040330215452,
    'summary': 'TEMPERATURE 98.6 F',
    'typeCode': 'urn:va:vuid:4500638',
    'typeName': 'TEMPERATURE',
    'uid': 'urn:va:vital:9E7A:3:12447',
    'units': 'F',
    'interpretationCode': 'SomeInterp',
    'organizer': {
        'observed': 200403302131,
        'resulted': 20040330215452,
        'localId': 12447,
        'facilityCode': 998,
        'encounter': {
            'localId': 998
        }
    },
    'encounter': {
        'localId': 998
    }
};
var originalVaVitalJob = {
    record: originalVaVitalRecord
};

var originalDodVitalRecord = {
    'codes': [{
        'code': '2051',
        'display': '',
        'system': 'DOD_NCID'
    }
    // , {
    //     'code': '8867-4',
    //     'display': 'Heart rate',
    //     'system': 'http://loinc.org'
    // }
    ],
    'facilityCode': 'DOD',
    'facilityName': 'DOD',
    'observed': '20140110151024',
    'pid': 'DOD;0000000003',
    'result': '40',
    'stampTime': '20150314140151',
    'typeName': 'PULSE',
    'uid': 'urn:va:vital:DOD:0000000003:1000000583',
    'units': '/min'
};
var originalDodVitalJob = {
    record: originalDodVitalRecord
};

var removedRecord = {
    'pid': 'DOD;0000000003',
    'stampTime': '20150226124943',
    'removed': true,
    'uid': 'urn:va:vital:DOD:0000000003:1000010340'
};

var removedJob = {
    record: removedRecord
};

var config = {};

var CODE_SYSTEMS = {
    CODE_SYSTEM_LOINC: 'http://loinc.org',
    SYSTEM_DOD_NCID: 'DOD_NCID'
};

var jlvMappedCodeValue = {
    code: 'SomeCode',
    codeSystem: CODE_SYSTEMS.CODE_SYSTEM_LOINC,
    displayText: 'SomeText'
};
var jdsCodedValue = {
    code: jlvMappedCodeValue.code,
    system: jlvMappedCodeValue.codeSystem,
    display: jlvMappedCodeValue.displayText
};

//-----------------------------------------------------------------------------
// Mock JLV function that simulates the return of a valuid JLV terminology
// mapping.
//
// parameters are ignored for this mock...
//-----------------------------------------------------------------------------
function getJlvMappedCode_ReturnValidCode(mappingType, sourceCode, callback) {
    return callback(null, jlvMappedCodeValue);
}
function TerminologyUtil(){}
TerminologyUtil.prototype.CODE_SYSTEMS = CODE_SYSTEMS;
TerminologyUtil.prototype.getJlvMappedCode = getJlvMappedCode_ReturnValidCode;

var terminologyUtil = new TerminologyUtil();

describe('record-enrichment-vital-xformer.js', function() {
    describe('transformAndEnrichRecord()', function() {
        it('Happy Path with VA vital', function() {
            var finished = false;
            var environment = {
                terminologyUtils: terminologyUtil
            };

            runs(function() {
                xformer(log, config, environment, originalVaVitalJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();

                    // Verify root level fields
                    //-------------------------
                    expect(record.kind).toBe('Vital Sign');
                    expect(record.summary).toBe('TEMPERATURE 98.6 SomeInterp F');
                    expect(record.qualifiedName).toBe(record.typeName);
                    expect(typeof record.stampTime).toEqual('string');
                    expect(typeof record.lastUpdateTime).toEqual('string');
                    expect(typeof record.observed).toEqual('string');
                    expect(typeof record.resulted).toEqual('string');
                    expect(typeof record.localId).toEqual('string');
                    expect(typeof record.facilityCode).toEqual('string');
                    expect(typeof record.result).toEqual('string');
                    expect(typeof record.units).toEqual('string');
                    expect(typeof record.metricResult).toEqual('string');
                    expect(typeof record.metricUnits).toEqual('string');
                    expect(typeof record.low).toEqual('string');
                    expect(typeof record.high).toEqual('string');


                    // Organizer
                    //----------
                    expect(record.organizer).toBeTruthy();
                    var organizer = record.organizer;
                    expect(organizer.kind).toBe('Vital Sign Organizer');
                    expect(organizer.summary).toEqual('VitalSignOrganizer{uid=\'\'}');
                    expect(typeof organizer.observed).toEqual('string');
                    expect(typeof organizer.resulted).toEqual('string');
                    expect(typeof organizer.localId).toEqual('string');
                    expect(typeof organizer.facilityCode).toEqual('string');
                    // Since Encouter is fully tested using the appointment - we just want to make sure that
                    // the encounter is connected - so we are just going to test one field.
                    //--------------------------------------------------------------------------------------
                    expect(organizer.encounter).toBeTruthy();
                    expect(typeof organizer.encounter.localId).toEqual('string');

                    // Encounter
                    // Since Encouter is fully tested using the appointment - we just want to make sure that
                    // the encounter is connected - so we are just going to test one field.
                    //--------------------------------------------------------------------------------------
                    expect(record.encounter).toBeTruthy();
                    expect(typeof record.encounter.localId).toEqual('string');

                    // // Verify that the code was inserted.
                    // //-----------------------------------
                    expect(record.codes).toBeTruthy();
                    expect(record.codes.length).toBeGreaterThan(0);
                    expect(record.codes).toContain(jasmine.objectContaining(jdsCodedValue));
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Happy Path with VA vital - Alternate path checking patientGeneratedFlag of true', function() {
            var finished = false;
            var environment = {
                terminologyUtils: terminologyUtil
            };
            var vaVitalJob = JSON.parse(JSON.stringify(originalVaVitalJob));
            vaVitalJob.record.locationCode = 'PGD';

            runs(function() {
                xformer(log, config, environment, vaVitalJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.patientGeneratedDataFlag).toBe(true);

                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Happy Path with Dod Vital', function() {
            var finished = false;
            var environment = {
                terminologyUtils: terminologyUtil
            };

            runs(function() {
                xformer(log, config, environment, originalDodVitalJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    // Verify root level fields
                    //-------------------------
                    expect(record.kind).toBe('Vital Sign');
                    expect(record.summary).toBe('PULSE 40 /min');
                    expect(typeof record.stampTime).toEqual('string');
                    expect(typeof record.observed).toEqual('string');
                    expect(typeof record.facilityCode).toEqual('string');
                    expect(typeof record.result).toEqual('string');
                    expect(typeof record.units).toEqual('string');

                    // // Verify that the code was inserted.
                    // //-----------------------------------
                    expect(record.codes).toBeTruthy();
                    expect(record.codes.length).toBeGreaterThan(0);
                    expect(record.codes).toContain(jasmine.objectContaining(jdsCodedValue));
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
            var environment = {
                terminologyUtils: terminologyUtil
            };

            runs(function() {
                xformer(log, config, environment, removedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.uid).toEqual('urn:va:vital:DOD:0000000003:1000010340');
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