'use strict';
//-----------------------------------------------------------------------------------------
// This contains a set of integration tests for record-enrichment-immunization-xformer.js.
//
// Author: Les Westberg
//-----------------------------------------------------------------------------------------

require('../../../../env-setup');

var _ = require('underscore');

var ncUtil = require(global.VX_UTILS + 'namecase-utils');

var val = require(global.VX_UTILS + 'object-utils').getProperty;
var xformer = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-immunization-xformer');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-immunization-xformer-spec',
//     level: 'debug'
// });

var vx_sync_ip = require(global.VX_INTTESTS + 'test-config');

var config = require(global.VX_ROOT + 'worker-config');
config.terminology.host = vx_sync_ip;

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

// What it should be when the terminology translations are real...
//-----------------------------------------------------------------
// var jdsCodedVaValue = {
// 	code: '3',
// 	system: terminologyUtil.CODE_SYSTEMS.CODE_SYSTEM_CVX,
// 	display: 'measles, mumps and rubella virus vaccine'
// };
// What it is with the mock terminology translations.
//-----------------------------------------------------------------
var jdsCodedVaValue = {
    system: 'urn:oid:2.16.840.1.113883.12.292',
    code: '3',
    display: 'measles, mumps and rubella virus vaccine'
};

// NOTE:  There are no DOD transformations for Immunization... - No test needed for DOD
//-------------------------------------------------------------------------------------

describe('record-enrichment-immunization-xformer.js', function() {
    describe('transformAndEnrichRecord()', function() {
        it('Happy Path with VA Immunization', function() {
            var finished = false;
            var environment = {};
            var config = {};

            runs(function() {
                xformer(log, config, environment, originalVaImmunizationJob, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(_.isObject(record)).toBe(true);
                    expect(val(record, 'summary')).toEqual(record.name);
                    expect(val(record, 'kind')).toEqual('Immunization');
                    expect(_.isObject(val(record, 'performer'))).toBe(true);
                    expect(val(record, 'performer', 'displayName')).toEqual(ncUtil.namecase(val(record, 'performer', 'name')));
                    expect(val(record, 'performer', 'summary')).toEqual('Clinician{uid=\'' + val(record, 'performer', 'uid') + '\'}');
                    expect(_.isString(val(record, 'stampTime'))).toBe(true);
                    expect(_.isString(val(record, 'lastUpdateTime'))).toBe(true);
                    expect(_.isString(val(record, 'administeredDateTime'))).toBe(true);
                    expect(_.isString(val(record, 'localId'))).toBe(true);
                    expect(_.isString(val(record, 'facilityCode'))).toBe(true);

                    // Verify that the code was inserted.
                    //-----------------------------------
                    expect(_.isArray(val(record, 'codes'))).toBe(true);
                    expect(val(record, 'codes', 'length')).toBeGreaterThan(0);
                    expect(val(record, 'codes')).toContain(jasmine.objectContaining(jdsCodedVaValue));
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 10000);
        });
    });
});