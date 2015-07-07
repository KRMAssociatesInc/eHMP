'use strict';
//------------------------------------------------------------------------------------
// This contains a set of unit tests for record-enrichment-image-xformer.js.
//
// Author: Les Westberg
//------------------------------------------------------------------------------------

require('../../../../env-setup');

var xformer = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-image-xformer');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-image-xformer-spec',
//     level: 'debug'
// });

var originalVaImageRecord = {
    'case': 45,
    'category': 'RA',
    'dateTime': 199702261300,
    'diagnosis': [{
        'code': 'NORMAL',
        'primary': true
    }],
    'encounterName': 'RADIOLOGY MAIN FLOOR Feb 26, 1997',
    'encounterUid': 'urn:va:visit:ABCD:379:308',
    'facilityCode': 561,
    'facilityName': 'New Jersey HCS',
    'hasImages': false,
    'imageLocation': 'RADIOLOGY MAIN FLOOR',
    'imagingTypeUid': 'urn:va:imaging-Type:GENERAL RADIOLOGY',
    'kind': 'Imaging',
    'localId': '7029773.8699-1',
    'locationName': 'RADIOLOGY MAIN FLOOR',
    'locationUid': 'urn:va:location:ABCD:40',
    'name': 'ANKLE 2 VIEWS',
    'pid': 'HDR;10108V420871',
    'providers': [{
        'providerName': 'WARDCLERK,SIXTYTHREE',
        'providerUid': 'urn:va:user:ABCD:11273'
    }],
    'results': [{
        'localTitle': 'ANKLE 2 VIEWS',
        'uid': 'urn:va:document:ABCD:379:7029773.8699-1'
    }],
    'stampTime': '20150319133240',
    'statusName': 'COMPLETE',
    'summary': 'RADIOLOGIC EXAMINATION, ANKLE; 2 VIEWS',
    'typeName': 'RADIOLOGIC EXAMINATION, ANKLE; 2 VIEWS',
    'uid': 'urn:va:image:ABCD:379:7029773.8699-1',
    'verified': true
};
var originalVaImageJob = {
    record: originalVaImageRecord
};

var removedRecord = {
    'pid': 'CDS;10108V420871',
    'stampTime': '20150226124943',
    'removed': true,
    'uid': 'urn:va:image:ABCD:379:7029773.8699-1'
};

var removedJob = {
    record: removedRecord
};

// There is no DOD data for this one.
//------------------------------------

var config = {};

describe('record-enrichment-image-xformer.js', function() {
    describe('transformAndEnrichRecord()', function() {
        it('Happy Path with VA Procedure', function() {
            var finished = false;
            var environment = {};
            var vaImageJob = JSON.parse(JSON.stringify(originalVaImageJob));

            runs(function() {
                xformer(log, config, environment, vaImageJob, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();

                    // We do not need to be very thorough because we simply are calling the
                    // underlying procedure transformation and that one did all the deep
                    // checking.  We just have to make sure that at least one enrichment
                    // occurred.
                    //----------------------------------------------------------------------
                    expect(record.providerName).toBe('WARDCLERK,SIXTYTHREE');
                    expect(record.providerDisplayName).toBe('Wardclerk,Sixtythree');
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
                    expect(record.uid).toEqual('urn:va:image:ABCD:379:7029773.8699-1');
                    expect(record.pid).toEqual('CDS;10108V420871');
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