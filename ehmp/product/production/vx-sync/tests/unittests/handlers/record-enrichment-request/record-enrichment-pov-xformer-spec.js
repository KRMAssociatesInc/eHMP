'use strict';
//------------------------------------------------------------------------------------
// This contains a set of unit tests for record-enrichment-allergy-xformer.js.
//
// Author: Les Westberg
//------------------------------------------------------------------------------------

require('../../../../env-setup');

var xformer = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-pov-xformer');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-pov-xformer-spec',
//     level: 'debug'
// });

var unenrichedPovRecord = {
    'encounterName': 'PRIMARY CARE May 21, 2000',
    'encounterUid': 'urn:va:visit:9E7A:3:2462',
    'entered': 20000521115440,
    'facilityCode': 998,
    'facilityName': 'ABILENE (CAA)',
    'icdCode': 'urn:icd:521.0',
    'lastUpdateTime': 20000521115440,
    'localId': 416,
    'locationName': 'PRIMARY CARE',
    'locationUid': 'urn:va:location:9E7A:32',
    'name': 'DENTAL CARIES',
    'pid': '9E7A;3',
    'stampTime': 20000521115440,
    'type': 'P',
    'uid': 'urn:va:pov:9E7A:3:416'
};

var unenrichedHdrPovRecord = {
    'encounterName': 'CECELIA\'S CLINIC Dec 01, 1997',
    'encounterUid': 'urn:va:visit:ABCD:85:927',
    'entered': '199712010800',
    'facilityCode': '561',
    'facilityName': 'New Jersey HCS',
    'icdCode': 'urn:icd:721.2',
    'localId': '158',
    'locationName': 'CECELIA\'S CLINIC',
    'locationUid': 'urn:va:location:ABCD:273',
    'name': 'THORACIC SPONDYLOSIS WITHOUT MYELOPATHY',
    'pid': 'HDR;10108V420871',
    'stampTime': '20150318095758',
    'summary': 'PurposeOfVisit{uid=\'urn:va:pov:ABCD:85:158\'}',
    'type': 'P',
    'uid': 'urn:va:pov:ABCD:85:158'
};

var removedRecord = {
    'pid': 'DOD;0000000003',
    'stampTime': '20150226124943',
    'removed': true,
    'uid': 'urn:va:pov:DOD:0000000003:1000010340'
};

var removedJob = {
    record: removedRecord
};

var config = {};

describe('record-enrichment-pov-xformer', function() {
    describe('transformAndEnrichRecord', function() {
        var done = false;
        var environment = {};
        it('Normal path (VA record)', function() {
            xformer(log, config, environment, unenrichedPovRecord,
            function(error, record) {
                //console.log(record);
                expect(error).toBeFalsy();
                expect(record.summary).toBeTruthy();
                expect(typeof record.entered).toEqual('string');
                expect(typeof record.facilityCode).toEqual('string');
                expect(typeof record.localId).toEqual('string');
                expect(typeof record.lastUpdateTime).toEqual('string');
                expect(typeof record.stampTime).toEqual('string');
                done = true;
            });
        });
        waitsFor(function() {
            return done;
        });
        it('Normal path (HDR record)', function() {
            xformer(log, config, environment, unenrichedHdrPovRecord,
            function(error, record) {
                //console.log(record);
                expect(error).toBeFalsy();
                expect(record.summary).toBeTruthy();
                expect(typeof record.entered).toEqual('string');
                expect(typeof record.facilityCode).toEqual('string');
                expect(typeof record.localId).toEqual('string');
                expect(typeof record.stampTime).toEqual('string');
                done = true;
            });
        });
        waitsFor(function() {
            return done;
        });
        it('Error path (No job)', function() {
            xformer(log, config, environment, null, function(error, record) {
                expect(error).toBeFalsy();
                expect(record).toBeFalsy();
                done = true;
            });
        });
        waitsFor(function() {
            return done;
        });

        it('Job was removed', function() {
            var finished = false;
            var environment = {};

            runs(function() {
                xformer(log, config, environment, removedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.uid).toEqual('urn:va:pov:DOD:0000000003:1000010340');
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
        waitsFor(function() {
            return done;
        });
    });

});