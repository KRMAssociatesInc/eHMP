'use strict';
/*global describe, it, before, beforeEach, after, afterEach, spyOn, expect, runs, waitsFor */

require('../../../../env-setup');
var log = require(global.OSYNC_UTILS + 'dummy-logger');
var handler = require(global.OSYNC_HANDLERS + 'patientlist-request/patientlist-request');

var mockConfig = {
    inttest: true,
    patientListRequest: {
        context: 'HMP UI CONTEXT',
        host: '10.2.2.101',
        port: 9210,
        accessCode: 'BOGUS',
        verifyCode: 'BOGUS2',
        localIP: '10.2.2.1',
        localAddress: 'localhost'
    }
};

var mockHandlerCallback = {
    callback: function(error, response) {
    }
};


describe('validation unit test', function() {
    beforeEach(function() {
        //logger.debug("before executing an appointment-request-handler unit test");
        //console.log("before executing an appointment-request-handler unit test");
    });

    describe('validation.handle', function() {
        beforeEach(function () {
            spyOn(mockHandlerCallback, 'callback');
        });

        it('should call without error', function () {
            var done = false;
            var testData = null;
            var testError = null;

            runs(function () {
                var job = {};
                job.type = 'patientlist-request';
                job.source = 'appointments';
                job.users = [{"accessCode": "pu1234", "verifyCode": "pu1234!!", "lastlogin": "20150330"}, {"accessCode": "lu1234", "verifyCode": "lu1234!!", "lastlogin": "20150330"}];

                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function (error, data) {
                    done = true;
                    testData = data;
                    testError = error;
                    mockHandlerCallback.callback();
                });
            });

            waitsFor(function () {
                return done;
            }, 'Callback not called', 180000);

            runs(function () {
                expect(mockHandlerCallback.callback).toHaveBeenCalled();

                expect(testError).toBe(null);
                expect(testData).not.toBe(null);
                expect(testData).not.toBe(undefined);
                expect(testData.type).toBe('patientlist-request');
                expect(testData.source).toBe('appointments');
                expect(testData.patients).not.toBe(null);
                expect(testData.patients).not.toBe(undefined);
            });
        });
    });

});

