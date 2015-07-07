'use strict';

require('../../../../env-setup');
var log = require(global.OSYNC_UTILS + 'dummy-logger');
var handler = require(global.OSYNC_HANDLERS + 'patientlist-request/patientlist-request');

var mockConfig = {
    patientListRequest: {
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


xdescribe('validation unit test', function() {
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
            var patients = [];

            runs(function () {
                var job = {};
                job.type = 'patientlist';
                job.source = 'appointments';

                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function (error, data) {
                    done = true;

                    expect(data).not.toBe(null);
                    expect(data).not.toBe(undefined);
                    expect(data.type).toBe('validation');
                    expect(data.source).toBe('patientlist');
                    expect(data.patients).not.toBe(null);
                    expect(data.patients).not.toBe(undefined);

                    mockHandlerCallback.callback();
                });
            });

            waitsFor(function () {
                return done;
            }, 'Callback not called', 50000);

            runs(function () {
                expect(mockHandlerCallback.callback).toHaveBeenCalled();
            });
        });
    });

});

