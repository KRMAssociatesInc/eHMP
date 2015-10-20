'use strict';
//------------------------------------------------------------------------------------
// This contains a set of unit tests for record-enrichment-procedure-xformer.js.
//
// Author: Les Westberg
//------------------------------------------------------------------------------------

require('../../../../env-setup');

var _ = require('underscore');
var ncUtil = require(global.VX_UTILS + 'namecase-utils');

var xformer = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-procedure-xformer');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-procedure-xformer-spec',
//     level: 'debug'
// });

var originalVaProcedureRecord = {
    'category': 'CP',
    'dateTime': 198808051457,
    'facilityCode': 500,
    'facilityName': 'CAMP MASTER',
    'interpretation': 'BORDERLINE',
    'kind': 'Procedure',
    'lastUpdateTime': 19880805145700,
    'localId': '1;MCAR(691.6,',
    'name': 'HOLTER',
    'pid': '9E7A;8',
    'stampTime': 19880805145700,
    'statusName': 'COMPLETE',
    'uid': 'urn:va:procedure:9E7A:8:1;MCAR(691.6,',
    'providers': [{
        'providerUid': 'urn:va:user:9E7A:101',
        'providerName': 'PROVIDER,ONE'
    }, {
        'providerUid': 'urn:va:user:9E7A:102',
        'providerName': 'PROVIDER,TWO'
    }],
    'earliestDate': 198808051440,
    'results': [{
        'id': 101
    }, {
        'id': 102
    }],
    'links': [{
        'id': 201
    }, {
        'id': 202
    }],
    'modifiers': [{
        'id': 301,
        'code': 3001
    }, {
        'id': 302,
        'code': 3002
    }]
};
var originalVaProcedureJob = {
    record: originalVaProcedureRecord
};

var removedRecord = {
    'pid': '9E7A;8',
    'stampTime': '20150226124943',
    'removed': true,
    'uid': 'urn:va:procedure:9E7A:8:1;MCAR(691.6,'
};

var removedJob = {
    record: removedRecord
};

// There is no DOD data for this one.
//------------------------------------

var config = {};

describe('record-enrichment-procedure-xformer.js', function() {
    describe('transformAndEnrichRecord()', function() {
        it('Happy Path with VA Procedure', function() {
            var finished = false;
            var environment = {};
            var vaProcedureJob = JSON.parse(JSON.stringify(originalVaProcedureJob));

            runs(function() {
                xformer(log, config, environment, vaProcedureJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();

                    // Root level fields
                    //------------------
                    expect(record.providerUid).toBe('urn:va:user:9E7A:101');
                    expect(record.providerName).toBe('PROVIDER,ONE');
                    expect(record.providerDisplayName).toBe('Provider,One');
                    expect(record.kind).toBe('Procedure');
                    expect(record.summary).toBe('');
                    expect(typeof record.stampTime).toEqual('string');
                    expect(typeof record.lastUpdateTime).toEqual('string');
                    expect(typeof record.dateTime).toEqual('string');
                    expect(typeof record.earliestDate).toEqual('string');
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
                        expect(result.summary).toEqual('ProcedureResult{uid=\'\'}');
                    });

                    // Links Fields
                    //--------------
                    expect(_.isEmpty(record.links)).toBe(false);
                    _.each(record.links, function(link) {
                        expect(link.summary).toEqual('ProcedureLink{uid=\'\'}');
                    });

                    // Modifiers Fields
                    //------------------
                    expect(_.isEmpty(record.modifiers)).toBe(false);
                    _.each(record.modifiers, function(modifier) {
                        expect(modifier.summary).toEqual('Modifier{uid=\'\'}');
                        expect(typeof modifier.code).toEqual('string');
                    });

                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Happy Path with VA Procedure - Alternate if paths 1  (kind and summary)', function() {
            var finished = false;
            var environment = {};
            var vaProcedureJob = JSON.parse(JSON.stringify(originalVaProcedureJob));
            vaProcedureJob.record.kind = undefined;
            vaProcedureJob.record.category = 'C';
            vaProcedureJob.record.typeName = 'SomeTypeName';

            runs(function() {
                xformer(log, config, environment, vaProcedureJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.kind).toBe('Consult');
                    expect(record.summary).toBe('SomeTypeName');
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Happy Path with VA Procedure - Alternate if paths 2  (kind)', function() {
            var finished = false;
            var environment = {};
            var vaProcedureJob = JSON.parse(JSON.stringify(originalVaProcedureJob));
            vaProcedureJob.record.kind = undefined;
            vaProcedureJob.record.category = 'RA';

            runs(function() {
                xformer(log, config, environment, vaProcedureJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.kind).toBe('Imaging');
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Happy Path with VA Procedure - Alternate if paths 3  (kind)', function() {
            var finished = false;
            var environment = {};
            var vaProcedureJob = JSON.parse(JSON.stringify(originalVaProcedureJob));
            vaProcedureJob.record.kind = undefined;
            vaProcedureJob.record.category = 'SomethingElse';

            runs(function() {
                xformer(log, config, environment, vaProcedureJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.kind).toBe('Procedure');
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
                    expect(record.uid).toEqual('urn:va:procedure:9E7A:8:1;MCAR(691.6,');
                    expect(record.pid).toEqual('9E7A;8');
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