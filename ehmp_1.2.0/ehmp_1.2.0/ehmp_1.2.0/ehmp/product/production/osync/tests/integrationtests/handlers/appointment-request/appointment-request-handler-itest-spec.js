'use strict';

require('../../../../env-setup');
var log = require(global.OSYNC_UTILS + 'dummy-logger');
var handler = require(global.OSYNC_HANDLERS + 'appointment-request/appointment-request');


var mockConfig = {
    inttest: true,
    appointmentRequest: {
        context: 'HMP UI CONTEXT',
        host: '10.2.2.101',
        port: 9210,
        accessCode: 'pu1234',
        verifyCode: 'pu1234!!',
        localIP: '10.2.2.1',
        localAddress: 'localhost',
        appointments: {
            startDate: '3150401',
            endDate: '3150425'
        }
    }
};

var mockHandlerCallback = {
    callback: function(error, response) {
    }
};

xdescribe('appointment-request-handler integration test', function() {
    beforeEach(function () {
        spyOn(mockHandlerCallback, 'callback');
    });

    it('has the correct job type', function () {
        var done = false;
        runs(function () {
            var job = {};
            job.type = 'appointment-request';

            var mockEnvironment = null;
            handler(log, mockConfig, mockEnvironment, job, function (error, data) {
                done = true;
                expect(error).toBe(null);
                expect(data).not.toBe(undefined);

                expect(data.patients).not.toBe(undefined);

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
