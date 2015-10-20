'use strict';

require('../../../env-setup');

var _ = require('underscore');
var async = require('async');
var moment = require('moment');

var logger = require(global.VX_UTILS + 'dummy-logger');

// logger = require('bunyan').createLogger({
//     name: 'jds-client',
//     level: 'debug'
// });

var config = require(global.VX_ROOT + 'worker-config');

var JdsClient = require(global.VX_SUBSYSTEMS + 'jds/jds-client');
var jdsClient = new JdsClient(logger, logger, config);

var count = 1;

function buildErrorRecord() {
    return {
        name: 'test record: ' + count++,
        timestamp: moment.utc().format()
    };
}


describe('jds-client.js (Error Record)', function() {
    describe('addErrorRecord()', function() {
        it('Successfully writes without error', function() {
            var complete;
            var expectedError;
            var expectedResult;

            runs(function() {
                jdsClient.addErrorRecord(buildErrorRecord(), function(error, result) {
                    expectedError = error;
                    expectedResult = result;
                    complete = true;
                });
            });

            waitsFor(function() {
                return complete;
            }, 'Should complete without error', 3000);

            runs(function() {
                expect(expectedError).toBeUndefined();
            });
        });
    });

    describe('getErrorRecordCount()', function() {
        it('Successfully get error record count', function() {
            var complete;
            var expectedError;
            var expectedResult;

            runs(function() {
                async.series({
                    addErrorRecord: jdsClient.addErrorRecord.bind(jdsClient, buildErrorRecord()),
                    getErrorRecordCount: jdsClient.getErrorRecordCount.bind(jdsClient)
                }, function(error, result) {
                    expectedError = error;
                    expectedResult = result;
                    complete = true;
                });
            });

            waitsFor(function() {
                return complete;
            }, 'Should complete without error', 3000);

            runs(function() {
                expect(expectedError).toBeUndefined();
                expect(expectedResult.getErrorRecordCount).toBeGreaterThan(0);
            });
        });
    });

    describe('deleteAllErrorRecords()', function() {
        it('Successfully deletes all error records', function() {
            var complete;
            var expectedError;
            var expectedResult;

            runs(function() {
                async.series({
                    deleteAllErrorRecords: jdsClient.deleteAllErrorRecords.bind(jdsClient),
                    getErrorRecordCount: jdsClient.getErrorRecordCount.bind(jdsClient)
                }, function(error, result) {
                    expectedError = error;
                    expectedResult = result;
                    complete = true;
                });
            });

            waitsFor(function() {
                return complete;
            }, 'Should complete without error', 3000);

            runs(function() {
                expect(expectedError).toBeUndefined();
                expect(String(expectedResult.getErrorRecordCount)).toBe('0');
            });
        });
    });

    describe('getErrorRecordCount()', function() {
        it('Successfully get error record count', function() {
            var complete;
            var expectedError;
            var expectedResult;

            runs(function() {
                async.series({
                    addErrorRecord: jdsClient.addErrorRecord.bind(jdsClient, buildErrorRecord()),
                    getErrorRecordCount: jdsClient.getErrorRecordCount.bind(jdsClient)
                }, function(error, result) {
                    expectedError = error;
                    expectedResult = result;
                    complete = true;
                });
            });

            waitsFor(function() {
                return complete;
            }, 'Should complete without error', 3000);

            runs(function() {
                expect(expectedError).toBeUndefined();
                expect(expectedResult.getErrorRecordCount).toBeGreaterThan(0);
            });
        });
    });

    describe('findErrorRecordById()', function() {
        it('Successfully retrieves a record by id', function() {
            var complete;
            var expectedError;
            var expectedResult;

            var record = {
                type: 'test',
                value: 'value'
            };

            var storedRecord = {
                id: 1,
                type: 'test',
                value: 'value'
            };

            runs(function() {
                async.series({
                    deleteAllErrorRecords: jdsClient.deleteAllErrorRecords.bind(jdsClient),
                    addErrorRecord: jdsClient.addErrorRecord.bind(jdsClient, record),
                    findErrorRecordById: jdsClient.findErrorRecordById.bind(jdsClient, storedRecord.id)
                }, function(error, result) {
                    expectedError = error;
                    expectedResult = result;
                    complete = true;
                });
            });

            waitsFor(function() {
                return complete;
            }, 'Should complete without error', 3000);

            runs(function() {
                expect(expectedError).toBeUndefined();
                expect(expectedResult.findErrorRecordById).toEqual([storedRecord]);
            });
        });
    });

    describe('findErrorRecordById()', function() {
        it('Successfully retrieves a record by id', function() {
            var complete;
            var expectedError;
            var expectedResult;

            var record = {
                type: 'test',
                value: 'value'
            };

            var storedRecord = {
                id: 1,
                type: 'test',
                value: 'value'
            };

            runs(function() {
                async.series({
                    deleteAllErrorRecords: jdsClient.deleteAllErrorRecords.bind(jdsClient),
                    addErrorRecord: jdsClient.addErrorRecord.bind(jdsClient, record),
                    deleteErrorRecordById: jdsClient.deleteErrorRecordById.bind(jdsClient, storedRecord.id),
                    getErrorRecordCount: jdsClient.getErrorRecordCount.bind(jdsClient)
                }, function(error, result) {
                    expectedError = error;
                    expectedResult = result;
                    complete = true;
                });
            });

            waitsFor(function() {
                return complete;
            }, 'Should complete without error', 3000);

            runs(function() {
                expect(expectedError).toBeUndefined();
                expect(String(expectedResult.getErrorRecordCount)).toBe('0');
            });
        });
    });

    describe('findErrorRecordById()', function() {
        it('Successfully retrieves a record by id', function() {
            var complete;
            var expectedError;
            var expectedResult;

            var errorRecord = {
                type: 'error',
                value: 'error value'
            };

            var jobRecord = {
                type: 'job',
                value: 'job value'
            };

            runs(function() {
                async.series({
                    deleteAllErrorRecords: jdsClient.deleteAllErrorRecords.bind(jdsClient),
                    addErrorRecord1: jdsClient.addErrorRecord.bind(jdsClient, errorRecord),
                    addErrorRecord2: jdsClient.addErrorRecord.bind(jdsClient, errorRecord),
                    addErrorRecord3: jdsClient.addErrorRecord.bind(jdsClient, errorRecord),
                    addJobRecord1: jdsClient.addErrorRecord.bind(jdsClient, jobRecord),
                    addJobRecord2: jdsClient.addErrorRecord.bind(jdsClient, jobRecord),
                    findErrorRecordsByFilter: jdsClient.findErrorRecordsByFilter.bind(jdsClient, 'eq(type,"job")')
                }, function(error, result) {
                    expectedError = error;
                    expectedResult = result;
                    complete = true;
                });
            });

            waitsFor(function() {
                return complete;
            }, 'Should complete without error', 3000);

            runs(function() {
                expect(expectedError).toBeUndefined();
                expect(expectedResult.findErrorRecordsByFilter.length).toBe(2);
            });
        });
    });

    // Clean up everything in Error Storage
    afterEach(function() {
        var complete;
        var expectedError;
        var expectedResult;

        runs(function() {
            runs(function() {
                async.series({
                    deleteAllErrorRecords: jdsClient.deleteAllErrorRecords.bind(jdsClient),
                    getErrorRecordCount: jdsClient.getErrorRecordCount.bind(jdsClient)
                }, function(error, result) {
                    expectedError = error;
                    expectedResult = result;
                    complete = true;
                });
            });
        });

        waitsFor(function() {
            return complete;
        }, 'Should complete without error', 3000);

        runs(function() {
            expect(expectedError).toBeUndefined();
            expect(String(expectedResult.getErrorRecordCount)).toBe('0');
        });
    });
});