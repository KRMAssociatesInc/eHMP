'use strict';

require('../../../../env-setup');
var log = require(global.OSYNC_UTILS + 'dummy-logger');
var handler = require(global.OSYNC_HANDLERS + 'opportunistic-sync-request/opportunistic-sync-request');

var mockHandlerCallback = {
    callback: function(error, response) {
    }
};

describe('admission-request-handler unit test', function() {
    beforeEach(function() {
        //logger.debug("before executing an addmission-request-handler unit test");
        //console.log("before executing an addmission-request-handler unit test");
    });

    describe('opportunistic-sync-request.handle', function() {
        beforeEach(function () {
            spyOn(mockHandlerCallback, 'callback');
        });

        it('error condition: no jobs to publish', function () {
            var done = false;

            runs(function () {
                var job = {};

                var mockConfig = {
                    "beanstalk": {
                        "jobs": {
                        }
                    }
                };
                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, function () {
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