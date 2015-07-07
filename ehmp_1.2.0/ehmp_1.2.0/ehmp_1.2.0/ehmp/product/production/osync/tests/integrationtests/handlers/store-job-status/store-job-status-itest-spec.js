'use strict';

require('../../../../env-setup');
var log = require(global.OSYNC_UTILS + 'dummy-logger');
var handler = require(global.OSYNC_HANDLERS + 'store-job-status/store-job-status');

var mockConfig = {
    jds: {
        protocol: 'http',
        host: '10.2.2.110',
        port: 9080,
        "jdsSaveURI": "/user/set/this",
        "jdsGetURI": "/user/get"
    }
};

var mockHandlerCallback = {
    callback: function(error, response) {
    }
};

describe('store-job-status integration test', function() {
    beforeEach(function() {
    });

    describe('store-job-status.handle', function() {
        beforeEach(function () {
            spyOn(mockHandlerCallback, 'callback');
        });

        it('save 2 patients to JDS', function () {
            var done = false;

            runs(function () {
                var job = {};
                job.type = 'store-job-status';
                job.source = 'appointments';
                job.patients = ["9E7A;1", "9E7A;3"];

                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function (data) {
                    done = true;

                    expect(data).not.toBe(null);
                    expect(data).not.toBe(undefined);
                    expect(data).not.toBe(false);

                    mockHandlerCallback.callback();
                });
            });

            waitsFor(function () {
                return done;
            }, 'Callback not called', 5000);

            runs(function () {
                expect(mockHandlerCallback.callback).toHaveBeenCalled();
            });
        });
    });

});

