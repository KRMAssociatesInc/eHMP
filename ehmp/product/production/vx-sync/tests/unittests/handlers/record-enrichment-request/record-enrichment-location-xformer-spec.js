'use strict';
//------------------------------------------------------------------------------------
// This contains a set of unit tests for record-enrichment-location-xformer.js.
//
// Author: Les Westberg
//------------------------------------------------------------------------------------

require('../../../../env-setup');

var _ = require('underscore');

var xformer = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-location-xformer');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-location-xformer-spec',
//     level: 'debug'
// });

var originalVaLocationRecord = {
    'stampTime': 20150319111924,
    'facilityCode': 998,
    'facilityName': 'ABILENE (CAA)',
    'localId': 102,
    'name': 'NUR 8A',
    'oos': false,
    'refId': 102,
    'shortName': '',
    'type': 'Z',
    'uid': 'urn:va:location:9E7A:102'
};
var originalVaLocationJob = {
    record: originalVaLocationRecord
};

var removedRecord = {
    'stampTime': '20150226124943',
    'removed': true,
    'uid': 'urn:va:location:DOD:0000000003:1000010340'
};

var removedJob = {
    record: removedRecord
};

var config = {};

describe('record-enrichment-location-xformer.js', function() {
    describe('transformAndEnrichRecord()', function() {
        it('Happy Path with VA Location', function() {
            var finished = false;
            var environment = {};
            var vaLocationJob = JSON.parse(JSON.stringify(originalVaLocationJob));

            runs(function() {
                xformer(log, config, environment, vaLocationJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(_.isObject(record)).toBe(true);

                    // Root level fields
                    //------------------
                    expect(record.displayName).toBe('Nur 8A');
                    expect(record.summary).toEqual('Location{uid=\'' + record.uid + '\'}');
                    expect(record.typeName).toBe('Other Location');
                    expect(typeof record.stampTime).toEqual('string');
                    expect(typeof record.localId).toEqual('string');
                    expect(typeof record.refId).toEqual('string');
                    expect(typeof record.type).toEqual('string');
                    expect(typeof record.facilityCode).toEqual('string');

                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Happy Path with VA Location - Test typeName = clinic', function() {
            var finished = false;
            var environment = {};
            var vaLocationJob = JSON.parse(JSON.stringify(originalVaLocationJob));
            vaLocationJob.record.type = 'C';

            runs(function() {
                xformer(log, config, environment, vaLocationJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(_.isObject(record)).toBe(true);
                    expect(record.typeName).toBe('Clinic');

                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Happy Path with VA Location - Test typeName = module', function() {
            var finished = false;
            var environment = {};
            var vaLocationJob = JSON.parse(JSON.stringify(originalVaLocationJob));
            vaLocationJob.record.type = 'M';

            runs(function() {
                xformer(log, config, environment, vaLocationJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(_.isObject(record)).toBe(true);
                    expect(record.typeName).toBe('Module');

                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Happy Path with VA Location - Test typeName = ward', function() {
            var finished = false;
            var environment = {};
            var vaLocationJob = JSON.parse(JSON.stringify(originalVaLocationJob));
            vaLocationJob.record.type = 'W';

            runs(function() {
                xformer(log, config, environment, vaLocationJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(_.isObject(record)).toBe(true);
                    expect(record.typeName).toBe('Ward');

                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Happy Path with VA Location - Test typeName = non-clinic stop', function() {
            var finished = false;
            var environment = {};
            var vaLocationJob = JSON.parse(JSON.stringify(originalVaLocationJob));
            vaLocationJob.record.type = 'N';

            runs(function() {
                xformer(log, config, environment, vaLocationJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(_.isObject(record)).toBe(true);
                    expect(record.typeName).toBe('Non-Clinic Stop');

                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Happy Path with VA Location - Test typeName = file area', function() {
            var finished = false;
            var environment = {};
            var vaLocationJob = JSON.parse(JSON.stringify(originalVaLocationJob));
            vaLocationJob.record.type = 'F';

            runs(function() {
                xformer(log, config, environment, vaLocationJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(_.isObject(record)).toBe(true);
                    expect(record.typeName).toBe('File Area');

                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Happy Path with VA Location - Test typeName = imaging', function() {
            var finished = false;
            var environment = {};
            var vaLocationJob = JSON.parse(JSON.stringify(originalVaLocationJob));
            vaLocationJob.record.type = 'I';

            runs(function() {
                xformer(log, config, environment, vaLocationJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(_.isObject(record)).toBe(true);
                    expect(record.typeName).toBe('Imaging');

                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Happy Path with VA Location - Test typeName = operating room', function() {
            var finished = false;
            var environment = {};
            var vaLocationJob = JSON.parse(JSON.stringify(originalVaLocationJob));
            vaLocationJob.record.type = 'OR';

            runs(function() {
                xformer(log, config, environment, vaLocationJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(_.isObject(record)).toBe(true);
                    expect(record.typeName).toBe('Operating Room');

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
                    expect(record.uid).toEqual('urn:va:location:DOD:0000000003:1000010340');
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