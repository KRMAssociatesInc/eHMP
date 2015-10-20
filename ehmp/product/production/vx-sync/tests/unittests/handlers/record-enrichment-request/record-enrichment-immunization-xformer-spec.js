'use strict';
//------------------------------------------------------------------------------------
// This contains a set of unit tests for record-enrichment-immunization-xformer.js.
//
// Author: Les Westberg
//------------------------------------------------------------------------------------

require('../../../../env-setup');
var ncUtil = require(global.VX_UTILS + 'namecase-utils');

var xformer = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-immunization-xformer');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-immunization-xformer-spec',
//     level: 'debug'
// });

var originalVaImmunizationRecord = {
    'administeredDateTime': 19950718091835,
    'contraindicated': false,
    'cptCode': 'urn:cpt:90707',
    'cptName': 'MMR VACCINE SC',
    'encounterName': '00',
    'encounterUid': 'urn:va:visit:9E7A:8:1797',
    'facilityCode': 500,
    'facilityName': 'CAMP MASTER',
    'lastUpdateTime': 19950718091835,
    'localId': 42,
    'name': 'MEASLES,MUMPS,RUBELLA (MMR)',
    'pid': '9E7A;8',
    'reactionCode': 'urn:va:reaction:9E7A:8:0',
    'reactionName': 'NONE',
    'seriesCode': 'urn:va:series:9E7A:8:BOOSTER',
    'seriesName': 'BOOSTER',
    'stampTime': 19950718091835,
    'summary': 'MMR VACCINE SC',
    'uid': 'urn:va:immunization:9E7A:8:42',
    'performer': {
        'name': 'DOE,JOHN',
        'uid': 'urn:va:user:9E7A:1111'
    }
};
var originalVaImmunizationJob = {
    record: originalVaImmunizationRecord
};

var originalDodImmunizationRecord = {
    'administeredDateTime': '20131023220000',
    'codes': [{
        'code': '16',
        'display': 'influenza virus vaccine, whole virus',
        'system': 'urn:oid:2.16.840.1.113883.12.292'
    }],
    'facilityCode': 'DOD',
    'facilityName': 'DOD',
    'name': 'Influenza',
    'pid': 'DOD;0000000008',
    'seriesName': '1',
    'stampTime': '20150305060000',
    'uid': 'urn:va:immunization:DOD:0000000008:1000001602'
};

var removedRecord = {
    'pid': 'DOD;0000000003',
    'stampTime': '20150226124943',
    'removed': true,
    'uid': 'urn:va:immunization:DOD:0000000003:1000010340'
};

var removedJob = {
    record: removedRecord
};

var originalDodImmunizationJob = {
    record: originalDodImmunizationRecord
};

var config = {};

var CODE_SYSTEMS = {
    CODE_SYSTEM_CVX: 'urn:oid:2.16.840.1.113883.12.292'
};

var jlvMappedCodeValue = {
    code: 'SomeCode',
    codeSystem: CODE_SYSTEMS.CODE_SYSTEM_CVX,
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

describe('record-enrichment-immunizaation-xformer.js', function() {
    describe('transformAndEnrichRecord()', function() {
        it('Happy Path with VA Immunization', function() {
            var finished = false;
            var environment = {
                terminologyUtils: {
                    CODE_SYSTEMS: CODE_SYSTEMS,
                    getJlvMappedCode: getJlvMappedCode_ReturnValidCode
                }
            };

            runs(function() {
                xformer(log, config, environment, originalVaImmunizationJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.summary).toEqual(record.name);
                    expect(record.kind).toEqual('Immunization');
                    expect(record.performer.displayName).toEqual(ncUtil.namecase(record.performer.name));
                    expect(record.performer.summary).toEqual('Clinician{uid=\'' + record.performer.uid + '\'}');
                    expect(typeof record.stampTime).toEqual('string');
                    expect(typeof record.lastUpdateTime).toEqual('string');
                    expect(typeof record.administeredDateTime).toEqual('string');
                    expect(typeof record.localId).toEqual('string');
                    expect(typeof record.facilityCode).toEqual('string');

                    // Verify that the code was inserted.
                    //-----------------------------------
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
        it('Happy Path with Dod Immunization', function() {
            var finished = false;
            var environment = {
                terminologyUtils: {
                    CODE_SYSTEMS: CODE_SYSTEMS,
                    getJlvMappedCode: getJlvMappedCode_ReturnValidCode
                }
            };

            runs(function() {
                xformer(log, config, environment, originalDodImmunizationJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.summary).toEqual(record.name);
                    expect(record.kind).toEqual('Immunization');
                    expect(typeof record.stampTime).toEqual('string');
                    expect(typeof record.administeredDateTime).toEqual('string');
                    expect(typeof record.facilityCode).toEqual('string');

                    // DOD has no terminology translation - nothing to check here for that.
                    //---------------------------------------------------------------------
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
                    expect(record.uid).toEqual('urn:va:immunization:DOD:0000000003:1000010340');
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