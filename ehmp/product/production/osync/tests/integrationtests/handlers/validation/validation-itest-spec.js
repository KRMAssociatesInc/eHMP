'use strict';
/*global describe, it, before, beforeEach, after, afterEach, spyOn, expect, runs, waitsFor */

require('../../../../env-setup');
var log = require(global.OSYNC_UTILS + 'dummy-logger');
var handler = require(global.OSYNC_HANDLERS + 'validation-request/validation-request');

var mockHandlerCallback = {
    callback: function(error, response) {
    }
};

var mockConfig = {
    inttest: true,
    jds: {
        protocol: 'http',
        host: '10.2.2.110',
        port: 9080,
        "jdsSaveURI": "/user/set/this",
        "jdsGetURI": "/user/get",
        osyncjobfrequency: 172800000
    }
};

describe('validation unit test', function() {
    beforeEach(function() {
        //logger.debug("before executing an appointment-request-handler unit test");
        //console.log("before executing an appointment-request-handler unit test");
    });

    describe('validation-request.handle', function() {
        beforeEach(function () {
            spyOn(mockHandlerCallback, 'callback');
        });

        it('valid job', function () {
            var done = false;
            var patients = [];
            var patient = {};

            var testData = null;
            var testError = null;

            runs(function () {
                var job = {};
                job.type = 'validation-request';
                job.source = 'appointments';

                patient.icn = '1234';
                patients.push(patient);
                job.patients = patients;

                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function (error, data) {
                    testData = data;
                    testError = error;
                    done = true;
                    mockHandlerCallback.callback();
                });
            });

            waitsFor(function () {
                return done;
            }, 'Callback not called', 5000);

            runs(function () {
                expect(mockHandlerCallback.callback).toHaveBeenCalled();

                expect(testData).not.toBe(null);
                expect(testData).not.toBe(undefined);
                expect(testData.type).toBe('validation-request');
                expect(testData.source).toBe('appointments');
                expect(testError).toBe(null);
            });
        });
    });

});
