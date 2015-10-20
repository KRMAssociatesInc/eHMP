'use strict';
/*global describe, it, before, beforeEach, after, afterEach, spyOn, expect, runs, waitsFor */

require('../../../../env-setup');
var log = require(global.OSYNC_UTILS + 'dummy-logger');
var handler = require(global.OSYNC_HANDLERS + 'admission-request/admission-request');


var mockConfig = {
    inttest: true,
    "vistaSites": {
        "9E7A": {
            "name": "panorama",
                "host": "10.2.2.101",
                "port": 9210,
                "accessCode": "ep1234",
                "verifyCode": "ep1234!!",
                "localIP": "127.0.0.1",
                "stationNumber": 500,
                "localAddress": "localhost",
                "connectTimeout": 3000,
                "sendTimeout": 20000
        },
        "C877": {
            "name": "kodak",
                "host": "10.2.2.102",
                "port": 9210,
                "accessCode": "ep1234",
                "verifyCode": "ep1234!!",
                "localIP": "127.0.0.1",
                "stationNumber": 500,
                "localAddress": "localhost",
                "connectTimeout": 3000,
                "sendTimeout": 20000
        }
    },
    admissionRequest: {
        context: 'HMP UI CONTEXT',
        host: '10.2.2.101',
        port: 9210,
        accessCode: 'pu1234',
        verifyCode: 'pu1234!!',
        localIP: '10.2.2.1',
        localAddress: 'localhost'
    }
};

var mockHandlerCallback = {
    callback: function(error, response) {
    }
};

describe('admission-request-handler integration test', function() {
    beforeEach(function () {
        spyOn(mockHandlerCallback, 'callback');
    });

    it('has the correct job type', function () {
        var done = false;
        var testData = null;
        var testError = null;

        runs(function () {
            var job = {};
            job.type = 'admission-request';

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
        }, 'Callback not called', 5000);

        runs(function () {
            expect(mockHandlerCallback.callback).toHaveBeenCalled();

            expect(testError).toBe(null);
            expect(testData).not.toBe(undefined);

        });
    });
});
