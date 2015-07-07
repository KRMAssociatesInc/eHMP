'use strict';

require('../../../../env-setup');
var log = require(global.OSYNC_UTILS + 'dummy-logger');
var handler = require(global.OSYNC_HANDLERS + 'sync/sync');

var mockConfig = {
    jds: {
        protocol: 'http',
        host: '10.2.2.110',
        port: 9080,
        osyncjobfrequency: 172800000
    },
    osync: {
        syncUrl: "http://10.3.3.6:8080/sync/doLoad?icn=",
        numToSyncSimultaneously: 3,
        waitBetween: 1000
    }
};

var mockHandlerCallback = {
    callback: function(error, response) {
    }
};

xdescribe('validation unit test', function() {
    beforeEach(function() {
        //logger.debug("before executing an appointment-request-handler unit test");
        //console.log("before executing an appointment-request-handler unit test");
    });

    describe('validation.handle', function() {
        beforeEach(function () {
            spyOn(mockHandlerCallback, 'callback');
        });

        it('error condition: invalid icn causing a 400 error', function () {
            var done = false;
            var patients = [];
            var patient = {};

            runs(function () {
                var job = {};
                job.type = 'sync';
                job.source = 'appointments';

                patient.ien = '9E7A;1234';
                patients.push(patient);
                job.patients = patients;

                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function (error, data) {
                    done = true;

                    expect(data).toBe(undefined);
                    expect(error).toBe("ERROR: sync.validateSync: get didn't return a 202 response: 400\nBody: The value \"9E7A;1234\" for patient id type \"icn\" was not in a valid format");

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

        it('error condition: invalid icn causing a 404 error', function () {
            var done = false;
            var patients = [];
            var patient = {};

            runs(function () {
                var job = {};
                job.type = 'sync';
                job.source = 'appointments';

                patient.ien = '4325678V4325678';
                patients.push(patient);
                job.patients = patients;

                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function (error, data) {
                    done = true;

                    expect(data).toBe(undefined);
                    expect(error).toContain("sync.validateSync: get didn't return a 202 response");

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

        it('valid job with 10 patients', function () {
            var done = false;
            var patients = [];

            runs(function () {
                var job = {};
                job.type = 'sync';
                job.source = 'appointments';

                //Add patients.
                for (var i=0; i<10; i++) {
                    var patient = {};
                    patient.ien = '1234' + i;
                    patients.push(patient);
                }

                job.patients = patients;

                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function (error, data) {
                    done = true;

                    expect(data).not.toBe(null);
                    expect(data).not.toBe(undefined);
                    var json = JSON.parse(data);
                    expect(json.type).toBe('enterprise-sync-request');

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

