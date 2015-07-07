'use strict';
//------------------------------------------------------------------------------------
// This contains a set of unit tests for record-enrichment-ptselect-xformer.js.
//
// Author: Les Westberg
//------------------------------------------------------------------------------------

require('../../../../env-setup');

var _ = require('underscore');

var xformer = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-ptselect-xformer');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-ptselect-xformer-spec',
//     level: 'debug'
// });

var originalVaPtSelectRecord = {
    'stampTime': '20150317115135',
    'birthDate': 19350407,
    'familyName': 'EIGHT',
    'fullName': 'EIGHT,PATIENT',
    'genderCode': 'urn:va:pat-gender:M',
    'genderName': 'Male',
    'givenNames': 'PATIENT',
    'icn': '10108V420871',
    'localId': 3,
    'pid': '9E7A;3',
    'sensitive': false,
    'ssn': 666000008,
    'uid': 'urn:va:pt-select:9E7A:3:3',
    'deceased': 19360407
};
var originalVaPtSelectJob = {
    record: originalVaPtSelectRecord
};

var removedRecord = {
    'pid': '9E7A;3',
    'stampTime': '20150226124943',
    'removed': true,
    'uid': 'urn:va:pt-select:9E7A:3:3'
};

var removedJob = {
    record: removedRecord
};

var config = {};

describe('record-enrichment-ptselect-xformer.js', function() {
    describe('transformAndEnrichRecord()', function() {
        it('Happy Path with VA PtSelect', function() {
            var finished = false;
            var environment = {};

            runs(function() {
                xformer(log, config, environment, originalVaPtSelectJob, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();

                    // Root level fields
                    //------------------
                    expect(record.displayName).toBe('Eight,Patient');
                    expect(record.summary).toBe('Eight,Patient');
                    expect(record.last4).toBe('0008');
                    expect(record.last5).toBe('E0008');
                    expect(typeof record.stampTime).toEqual('string');
                    expect(typeof record.birthDate).toEqual('string');
                    expect(typeof record.deceased).toEqual('string');
                    expect(typeof record.localId).toEqual('string');
                    expect(typeof record.ssn).toEqual('string');
                    expect(typeof record.last4).toEqual('string');
                    expect(typeof record.last5).toEqual('string');

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
                    expect(record.uid).toEqual('urn:va:pt-select:9E7A:3:3');
                    expect(record.pid).toEqual('9E7A;3');
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