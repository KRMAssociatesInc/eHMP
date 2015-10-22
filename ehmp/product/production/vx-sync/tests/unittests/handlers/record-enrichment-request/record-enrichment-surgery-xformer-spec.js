'use strict';
//------------------------------------------------------------------------------------
// This contains a set of unit tests for record-enrichment-surgery-xformer.js.
//
// Author: Les Westberg
//------------------------------------------------------------------------------------

require('../../../../env-setup');

var _ = require('underscore');
var ncUtil = require(global.VX_UTILS + 'namecase-utils');

var xformer = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-surgery-xformer');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-surgery-xformer-spec',
//     level: 'debug'
// });

var originalVaSurgeryRecord = {
    'category': 'SR',
    'dateTime': 200612080730,
    'facilityCode': 500,
    'facilityName': 'CAMP MASTER',
    'kind': 'Surgery',
    'lastUpdateTime': 20061208073000,
    'localId': 10014,
    'pid': '9E7A;3',
    'providers': [{
        'providerName': 'PROVIDER,ONE',
        'providerUid': 'urn:va:user:9E7A:983'
    }],
    'results': [{
        'localTitle': 'OPERATION REPORT',
        'uid': 'urn:va:document:9E7A:3:3561'
    }, {
        'localTitle': 'NURSE INTRAOPERATIVE REPORT',
        'uid': 'urn:va:document:9E7A:3:3526'
    }, {
        'localTitle': 'ANESTHESIA REPORT',
        'uid': 'urn:va:document:9E7A:3:3525'
    }],
    'stampTime': 20061208073000,
    'statusName': 'COMPLETED',
    'summary': 'LEFT INGUINAL HERNIA REPAIR',
    'typeName': 'LEFT INGUINAL HERNIA REPAIR',
    'uid': 'urn:va:surgery:9E7A:3:10014'
};
var originalVaSurgeryJob = {
    record: originalVaSurgeryRecord
};

// There is no DOD data for this one.
//------------------------------------

var removedRecord = {
    'pid': '9E7A;3',
    'stampTime': '20150226124943',
    'removed': true,
    'uid': 'urn:va:surgery:9E7A:3:10014'
};

var removedJob = {
    record: removedRecord
};

var config = {};

describe('record-enrichment-surgery-xformer.js', function() {
    describe('transformAndEnrichRecord()', function() {
        it('Happy Path with VA Surgery', function() {
            var finished = false;
            var environment = {};
            var vaSurgeryJob = JSON.parse(JSON.stringify(originalVaSurgeryJob));

            runs(function() {
                xformer(log, config, environment, vaSurgeryJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();

                    // General Note:  Since we have already tested every field we have touched with
                    // procedure.  The goal of this test is only to test the fields we appear to
                    // be receiving in a surgery instance of this structure - knowing that all of the
                    // other fields are already tested by the procedure unit tests.
                    //--------------------------------------------------------------------------------

                    // Root level fields
                    //------------------
                    expect(record.providerUid).toBe('urn:va:user:9E7A:983');
                    expect(record.providerName).toBe('PROVIDER,ONE');
                    expect(record.providerDisplayName).toBe('Provider,One');
                    expect(record.kind).toBe('Surgery');
                    expect(record.summary).toBe('LEFT INGUINAL HERNIA REPAIR');
                    expect(typeof record.stampTime).toEqual('string');
                    expect(typeof record.lastUpdateTime).toEqual('string');
                    expect(typeof record.dateTime).toEqual('string');
                    expect(typeof record.localId).toEqual('string');
                    expect(typeof record.facilityCode).toEqual('string');

                    // Providers Fields
                    //------------------
                    expect(_.isEmpty(record.providers)).toBe(false);
                    _.each(record.providers, function(provider) {
                        expect(provider.uid).toEqual(provider.providerUid);
                        expect(provider.providerDisplayName).toEqual(ncUtil.namecase(provider.providerName));
                        expect(provider.summary).toEqual('ProcedureProvider{uid=\'' + provider.providerUid + '\'}');
                    });

                    // Results Fields
                    //------------------
                    expect(_.isEmpty(record.results)).toBe(false);
                    _.each(record.results, function(result) {
                        expect(result.summary).toEqual('ProcedureResult{uid=\'' + result.uid + '\'}');
                    });

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
                    expect(record.uid).toEqual('urn:va:surgery:9E7A:3:10014');
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