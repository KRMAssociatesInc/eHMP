'use strict';
/*global describe, it, before, beforeEach, after, afterEach, spyOn, expect, runs, waitsFor */

require('../../../../env-setup');
var log = require(global.OSYNC_UTILS + 'dummy-logger');
var handler = require(global.OSYNC_HANDLERS + 'sync/sync');

var mockConfig = {
    inttest: true,
    jds: {
        protocol: 'http',
        host: '10.2.2.110',
        port: 9080,
        osyncjobfrequency: 172800000
    },
    osync: {
        syncUrl: "http://10.3.3.6:8080/sync/doLoad?icn=",
        numToSyncSimultaneously: 3,
        waitBetween: 1000,
        "siteId": "9E7A"
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

        //it('error condition: invalid icn causing a 400 error', function () {
        //    var done = false;
        //    var patients = [];
        //    var patient = {};
        //
        //    var testData = null;
        //    var testError = null;
        //
        //    runs(function () {
        //        var job = {};
        //        job.type = 'sync';
        //        job.source = 'appointments';
        //
        //        patient.ien = '9E7A;1234';
        //        patient.dfn='1234';
        //        patients.push(patient);
        //        job.patients = patients;
        //
        //        var mockEnvironment = null;
        //        handler(log, mockConfig, mockEnvironment, job, function (error, data) {
        //            console.log("data " + data);
        //            testData = data;
        //            testError = error;
        //            done = true;
        //            mockHandlerCallback.callback();
        //        });
        //
        //        expect(mockHandlerCallback.callback).toHaveBeenCalled();
        //
        //        //expect(testData).toBe(undefined);
        //        expect(testError).toBe("ERROR: sync.validateSync: get didn't return a 202 response: 400\nBody: The value \"9E7A;1234\" for patient id type \"icn\" was not in a valid format");
        //
        //    });
        //
        //    waitsFor(function () {
        //        return done;
        //    }, 'Callback not called', 100);
        //
        //    runs(function () {
        //    });
        //});


    });

});

