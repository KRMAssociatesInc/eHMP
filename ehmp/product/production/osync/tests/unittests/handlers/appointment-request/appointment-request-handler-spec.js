'use strict';

require('../../../../env-setup');
var log = require(global.OSYNC_UTILS + 'dummy-logger');
var handler = require(global.OSYNC_HANDLERS + 'appointment-request/appointment-request');

var mockHandlerCallback = {
    callback: function(error, response) {
    }
};

describe('appointment-request-handler unit test', function() {
    beforeEach(function() {
        //logger.debug("before executing an appointment-request-handler unit test");
        //console.log("before executing an appointment-request-handler unit test");
    });

    //describe('does hello world work', function() {
    //    it('should print to console', function() {
    //        console.log("HELLO WORLD - THIS IS FOR YOU.");
    //    });
    //});

    describe('appointment-request.handle', function() {
        beforeEach(function () {
            spyOn(mockHandlerCallback, 'callback');
        });

        it('error condition: incorrect job type', function () {
            var done = false;

            runs(function () {
                var job = {};

                var mockConfig = null;
                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function () {
                    done = true;
                    mockHandlerCallback.callback();
                });
            });

            waitsFor(function () {
                return done;
            }, 'Callback not called', 100);

            runs(function () {
                expect(mockHandlerCallback.callback).toHaveBeenCalled();
            });
        });

        it('error condition: incorrect job type', function () {
            var done = false;

            runs(function () {
                var job = {};
                job.type = 'cds-xform-vpr';

                var mockConfig = null;
                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function () {
                    done = true;
                    mockHandlerCallback.callback();
                });
            });

            waitsFor(function () {
                return done;
            }, 'Callback not called', 100);

            runs(function () {
                expect(mockHandlerCallback.callback).toHaveBeenCalled();
            });
        });
    });

});