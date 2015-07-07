'use strict';

require('../../../../env-setup');
var log = require(global.OSYNC_UTILS + 'dummy-logger');
var handler = require(global.OSYNC_HANDLERS + 'validation/validation');

//var mockHandlerCallback = {
//    callback: function(error, response) {
//    }
//};

var mockConfig = {
    jds: {
        protocol: 'http',
        host: '10.2.2.110',
        port: 9080,
        osyncjobfrequency: 172800000,
        getBlackListURI: 'http://10.2.2.110:9080/user/get/osyncblacklist',
        postBlackListURI: 'http://10.2.2.110:9080/user/set/this',
        getPatientSyncURI: 'http://10.2.2.110:9080/user/get/osyncjobstatus',
        postPatientSyncURI: 'http://10.2.2.110:9080/user/set/this'
    }
};

xdescribe('validation unit test', function() {
    beforeEach(function() {
        //logger.debug("before executing an appointment-request-handler unit test");
        //console.log("before executing an appointment-request-handler unit test");
    });

    describe('validation.handle', function() {
        beforeEach(function () {
            //spyOn(mockHandlerCallback, 'callback');
        });

        it('valid job', function () {
            var done = false;
            var patients = [];
            var patient = {};

            runs(function () {
                var job = {};
                job.type = 'validation';
                job.source = 'appointments';

                patient.icn = '1234';
                patients.push(patient);
                job.patients = patients;

                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function (error, data) {
                    done = true;

                    expect(data).not.toBe(null);
                    expect(data).not.toBe(undefined);
                    expect(data.type).toBe('sync');
                    expect(data.source).toBe('appointments');
                    expect(data.patients.length).toBe(1);
                    expect(data.patients[0].icn).toBe('1234');

                    //mockHandlerCallback.callback();
                });
            });
            //
            //waitsFor(function () {
            //    return done;
            //}, 'Callback not called', 100);
            //
            //runs(function () {
            //    expect(mockHandlerCallback.callback).toHaveBeenCalled();
            //});
        });
    });

});
