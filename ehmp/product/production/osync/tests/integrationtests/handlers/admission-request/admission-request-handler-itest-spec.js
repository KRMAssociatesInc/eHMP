'use strict';

require('../../../../env-setup');
var log = require(global.OSYNC_UTILS + 'dummy-logger');
var handler = require(global.OSYNC_HANDLERS + 'admission-request/admission-request');


var mockConfig = {
    inttest: true,
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

xdescribe('admission-request-handler integration test', function() {
    beforeEach(function () {
        spyOn(mockHandlerCallback, 'callback');
    });

    it('has the correct job type', function () {
        var done = false;
        runs(function () {
            var job = {};
            job.type = 'admission-request';

            var mockEnvironment = null;
            handler(log, mockConfig, mockEnvironment, job, function (error, data) {
                done = true;
                expect(error).toBe(null);
                expect(data).not.toBe(undefined);

                expect(data.patients).not.toBe(undefined);
                expect(data.patients).not.toBe(null);

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
