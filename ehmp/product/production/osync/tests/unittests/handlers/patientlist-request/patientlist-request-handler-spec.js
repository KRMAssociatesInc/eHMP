'use strict';
/*global describe, it, before, beforeEach, after, afterEach, spyOn, expect, runs, waitsFor */

require('../../../../env-setup');
var log = require(global.OSYNC_UTILS + 'dummy-logger');
var handler = require(global.OSYNC_HANDLERS + 'patientlist-request/patientlist-request');

var mockConfig = {
    inttest: true
};

var mockHandlerCallback = {
    callback: function(error, response) {
    }
};

function testError(config, job, errorMsg) {
    var done = false;
    var myData = null;
    var myError = null;

    runs(function () {
        var mockEnvironment = null;
        handler(log, config, mockEnvironment, job, function (error, data) {
            done = true;
            myData = data;
            myError = error;
            mockHandlerCallback.callback();
        });
    });
    waitsFor(function () {
        return done;
    }, 'Callback not called', 100);
    runs(function () {
        expect(mockHandlerCallback.callback).toHaveBeenCalled();

        expect(myError).toBe(errorMsg);
        expect(myData).toBe(undefined);
    });
}


describe('patientlist-request-handler unit test', function() {
    beforeEach(function() {
    });

    describe('patientlist-request.handle', function() {
        beforeEach(function () {
            spyOn(mockHandlerCallback, 'callback');
        });

        it('error condition: incorrect job type', function () {
            var job = {};
            job.users = [{"accessCode": "pu1234", "verifyCode": "pu1234!!", "lastlogin": "20150330"}, {"accessCode": "lu1234", "verifyCode": "lu1234!!", "lastlogin": "20150330"}];

            testError(mockConfig, job, "ERROR: patientlist-request.validate: Could not find job type");
        });

        it('error condition: incorrect job type', function () {
            var job = {};
            job.type = 'BOGUS';
            job.users = [{"accessCode": "pu1234", "verifyCode": "pu1234!!", "lastlogin": "20150330"}, {"accessCode": "lu1234", "verifyCode": "lu1234!!", "lastlogin": "20150330"}];

            testError(mockConfig, job, "ERROR: patientlist-request.validate: job type was not patientlist-request");
        });

        it('error condition: incorrect configuration', function () {
            var job = {};
            job.type = 'patientlist-request';
            job.users = [{"accessCode": "pu1234", "verifyCode": "pu1234!!", "lastlogin": "20150330"}, {"accessCode": "lu1234", "verifyCode": "lu1234!!", "lastlogin": "20150330"}];

            testError({inttest: true},
                job, "ERROR: patientlist.validateConfigEntry: config.patientListRequest cannot be null");
            testError({inttest: true, patientListRequest: {}},
                job, "ERROR: patientlist.validateConfigEntry: config.patientListRequest.context cannot be null");
            testError({inttest: true, patientListRequest: {context: 'HMP UI CONTEXT'}},
                job, "ERROR: patientlist.validateConfigEntry: config.patientListRequest.host cannot be null");
            testError({inttest: true, patientListRequest: {context: 'HMP UI CONTEXT', host: '10.2.2.101'}},
                job, "ERROR: patientlist.validateConfigEntry: config.patientListRequest.port cannot be null");
            testError({inttest: true, patientListRequest: {context: 'HMP UI CONTEXT', host: '10.2.2.101', port: 9210}},
                job, "ERROR: patientlist.validateConfigEntry: config.patientListRequest.accessCode cannot be null");
            testError({inttest: true, patientListRequest: {context: 'HMP UI CONTEXT', host: '10.2.2.101', port: 9210, accessCode: 'BOGUS'}},
                job, "ERROR: patientlist.validateConfigEntry: config.patientListRequest.verifyCode cannot be null");
            testError({inttest: true, patientListRequest: {context: 'HMP UI CONTEXT', host: '10.2.2.101', port: 9210, accessCode: 'BOGUS', verifyCode: 'BOGUS2'}},
                job, "ERROR: patientlist.validateConfigEntry: config.patientListRequest.localIP cannot be null");
            testError({inttest: true, patientListRequest: {context: 'HMP UI CONTEXT', host: '10.2.2.101', port: 9210, accessCode: 'BOGUS', verifyCode: 'BOGUS2', localIP: '10.2.2.1'}},
                job, "ERROR: patientlist.validateConfigEntry: config.patientListRequest.localAddress cannot be null");
        });
    });
});
