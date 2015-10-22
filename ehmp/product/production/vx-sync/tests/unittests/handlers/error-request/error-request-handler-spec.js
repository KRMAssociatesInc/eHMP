'use strict';

require('../../../../env-setup');

var _ = require('underscore');
var handle = require(global.VX_HANDLERS + 'error-request/error-request-handler');
var logger = require(global.VX_UTILS + 'dummy-logger');

describe('error-request-handler.js', function() {
    var config;
    var callback;
    var complete;
    var expectedError;
    var expectedResult;

    beforeEach(function() {
        complete = false;
        expectedError = null;
        expectedResult = null;

        callback = function(error, result) {
            complete = true;
            expectedError = error;
            expectedResult = result;
        };
    });

    describe('handle()', function() {
        it('test no config and no "error-handling" in config', function() {
            config = null;

            handle(logger, config, {}, {}, callback);

            waitsFor(function() {
                return complete;
            }, 'Handler callback invoked', 2000);

            runs(function() {
                expect(expectedError).toBeNull();
            });

            config = {};

            handle(logger, config, {}, {}, callback);

            waitsFor(function() {
                return complete;
            }, 'Handler callback invoked', 2000);

            runs(function() {
                expect(expectedError).toBeNull();
            });

            handle(logger, config, {}, {}, callback);

            config = {
                'error-handling': []
            };

            waitsFor(function() {
                return complete;
            }, 'Handler callback invoked', 2000);

            runs(function() {
                expect(expectedError).toBeNull();
            });
        });

        it('test error when writing error record', function() {
            config = {
                error: true,
                'error-handling': {
                    writers: ['./dummy-error-writer']
                }
            };

            handle(logger, config, {}, {}, callback);

            waitsFor(function() {
                return complete;
            }, 'Handler callback invoked', 2000);

            runs(function() {
                expect(expectedError).toBeNull();
            });
        });

        it('test success when writing error record', function() {
            config = {
                'error-handling': {
                    writers: ['./dummy-error-writer']
                }
            };

            handle(logger, config, {}, {}, callback);

            waitsFor(function() {
                return complete;
            }, 'Handler callback invoked', 2000);

            runs(function() {
                expect(expectedError).toBeNull();
            });
        });
    });
});