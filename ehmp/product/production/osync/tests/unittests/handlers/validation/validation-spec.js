'use strict';

require('../../../../env-setup');
var log = require(global.OSYNC_UTILS + 'dummy-logger');
var handler = require(global.OSYNC_HANDLERS + 'validation-request/validation-request');

var mockHandlerCallback = {
    callback: function(error, response) {
    }
};

var mockConfig = {
    jds: {
        protocol: 'http',
        host: '10.2.2.110',
        port: 9080,
        osyncjobfrequency: 172800000
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

        it('error condition: incorrect job type (empty)', function () {
            var done = false;

            runs(function () {
                var job = {};

                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function () {
                    done = true;
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

        it('error condition: incorrect job type (wrong type)', function () {
            var done = false;

            runs(function () {
                var job = {};
                job.type = 'cds-xform-vpr';

                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function () {
                    done = true;
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

        it('error condition: incorrect job source (empty)', function () {
            var done = false;

            runs(function () {
                var job = {};
                job.type = 'validation-request';

                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function () {
                    done = true;
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

        it('error condition: incorrect job source (wrong source)', function () {
            var done = false;

            runs(function () {
                var job = {};
                job.type = 'validation-request';
                job.source = 'bogus';

                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function () {
                    done = true;
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

        it('error condition: incorrect job patients (empty)', function () {
            var done = false;

            runs(function () {
                var job = {};
                job.type = 'validation-request';
                job.source = 'appointments';

                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function () {
                    done = true;
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

        it('error condition: patient missing ien and dfn', function () {
            var done = false;
            var patients = [];
            var patient = {};

            runs(function () {
                var job = {};
                job.type = 'validation-request';
                job.source = 'appointments';

                patients.push(patient);
                job.patients = patients;

                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function (error, data) {
                    done = true;

                    expect(error).not.toBe(null);
                    expect(error).not.toBe(undefined);
                    expect(error).toBe("ERROR: Missing dfn and icn for patient");
                });
            });
        });
    });

});
