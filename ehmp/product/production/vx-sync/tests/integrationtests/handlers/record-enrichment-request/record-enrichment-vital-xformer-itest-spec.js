'use strict';
//------------------------------------------------------------------------------------
// This contains a set of integration tests for record-enrichment-vital-xformer.js.
//
// Author: Les Westberg
//------------------------------------------------------------------------------------

require('../../../../env-setup');

var _ = require('underscore');

var xformer = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-vital-xformer');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-vital-xformer-spec',
//     level: 'debug'
// });

var vx_sync_ip = require(global.VX_INTTESTS + 'test-config');

var val = require(global.VX_UTILS + 'object-utils').getProperty;
var config = require(global.VX_ROOT + 'worker-config');
config.terminology.host = vx_sync_ip;

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
    'units': 'F'
};
var originalVaVitalJob = {
    record: originalVaVitalRecord
};
var jdsCodedVaValue = {
    system: 'http://loinc.org',
    code: '8310-5',
    display: 'Body termperature'
};


var originalDodVitalRecord = {
    'codes': [{
        'code': '2051',
        'display': '',
        'system': 'DOD_NCID'
    }, {
        'code': '8867-4',
        'display': 'Heart rate',
        'system': 'http://loinc.org'
    }],
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
var jdsCodedDodValue = {
    code: '8867-4',
    display: 'Heart rate',
    system: 'http://loinc.org'
};


describe('record-enrichment-vital-xformer.js', function() {
    describe('transformAndEnrichRecord()', function() {
        xit('Happy Path with VA Vitals', function() {
            var finished = false;
            var environment = {};
            var config = {};

            runs(function() {
                xformer(log, config, environment, originalVaVitalJob, function(error, record) {
                    expect(error).toBeNull();
                    expect(_.isObject(record)).toBe(true);
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
        it('Happy Path with Dod Vitals', function() {
            var finished = false;
            var environment = {};
            var config = {};

            runs(function() {
                xformer(log, config, environment, originalDodVitalJob, function(error, record) {
                    expect(error).toBeNull();
                    expect(_.isObject(record)).toBe(true);
                    // Verify that the code was inserted.
                    //-----------------------------------
                    expect(_.isArray(val(record, 'codes'))).toBe(true);
                    expect(val(record, 'codes', 'length')).toBeGreaterThan(0);
                    expect(val(record, 'codes')).toContain(jasmine.objectContaining(jdsCodedDodValue));
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 10000);
        });
    });
});