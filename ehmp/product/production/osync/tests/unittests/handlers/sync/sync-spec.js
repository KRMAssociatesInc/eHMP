'use strict';

require('../../../../env-setup');
var log = require(global.OSYNC_UTILS + 'dummy-logger');
var handler = require(global.OSYNC_HANDLERS + 'sync/sync');

var mockHandlerCallback = {
    callback: function(error, response) {
    }
};

describe('validation unit test', function() {
    beforeEach(function() {
        //logger.debug("before executing an appointment-request-handler unit test");
        //console.log("before executing an appointment-request-handler unit test");
    });

    describe('validation.handle error conditions for jobs passed in', function() {
        beforeEach(function () {
            spyOn(mockHandlerCallback, 'callback');
        });

        it('error condition: incorrect job type (empty)', function () {
            var done = false;

            runs(function () {
                var job = {};

                var mockConfig = null;
                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function (error, data) {
                    done = true;
                    expect(error).toBe("ERROR: sync.validate: Could not find job type");
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
                job.type = 'BOGUS';

                var mockConfig = null;
                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function (error, data) {
                    done = true;
                    expect(error).toBe("ERROR: sync.validate: job type was not sync");
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
                job.type = 'sync';

                var mockConfig = null;
                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function (error, data) {
                    done = true;
                    expect(error).toBe("ERROR: sync.validate: Could not find job source");
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
                job.type = 'sync';
                job.source = 'bogus';

                var mockConfig = null;
                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function (error, data) {
                    done = true;
                    expect(error).toBe("ERROR: sync.validate: job source was not \"appointments\" , \"admissions\" or \"patient lists\"");
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
                job.type = 'sync';
                job.source = 'appointments';

                var mockConfig = null;
                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function (error, data) {
                    done = true;
                    expect(error).toBe("ERROR: sync.validate: Could not find job patients");
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
                job.type = 'sync';
                job.source = 'appointments';

                patients.push(patient);
                job.patients = patients;

                var mockConfig = null;
                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function (error, data) {
                    done = true;
                    expect(error).toBe("ERROR: sync.validate: Missing dfn and ien for patient");
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
    });







    describe('validation.handle error conditions for configuration passed in', function() {
        beforeEach(function () {
            spyOn(mockHandlerCallback, 'callback');
        });

        it('error condition: config missing', function () {
            var done = false;
            var patients = [];
            var patient = {};

            runs(function () {
                var job = {};
                job.type = 'sync';
                job.source = 'appointments';

                patient.ien = '9E7A;1234';
                patients.push(patient);
                job.patients = patients;

                var mockConfig = null;
                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function (error, data) {
                    done = true;
                    expect(error).toBe("ERROR: sync.validateConfig: Configuration cannot be null");
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

        it('error condition: config missing syncUrl', function () {
            var done = false;
            var patients = [];
            var patient = {};

            runs(function () {
                var job = {};
                job.type = 'sync';
                job.source = 'appointments';

                patient.ien = '9E7A;1234';
                patients.push(patient);
                job.patients = patients;

                var mockConfig = {
                    osync: {
                        numToSyncSimultaneously: 3,
                        waitBetween: 5000
                    }
                };
                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function (error, data) {
                    done = true;
                    expect(error).toBe("ERROR: sync.validateConfig: osync.syncUrl cannot be null");
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

        it('error condition: config missing numToSyncSimultaneously', function () {
            var done = false;
            var patients = [];
            var patient = {};

            runs(function () {
                var job = {};
                job.type = 'sync';
                job.source = 'appointments';

                patient.ien = '9E7A;1234';
                patients.push(patient);
                job.patients = patients;

                var mockConfig = {
                    osync: {
                        syncUrl: "http://10.3.3.6:8080/sync/doLoad?icn=",
                        waitBetween: 5000
                    }
                };
                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function (error, data) {
                    done = true;
                    expect(error).toBe("ERROR: sync.validateConfig: osync.numToSyncSimultaneously cannot be null");
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

        it('error condition: config numToSyncSimultaneously < 2', function () {
            var done = false;
            var patients = [];
            var patient = {};

            runs(function () {
                var job = {};
                job.type = 'sync';
                job.source = 'appointments';

                patient.ien = '9E7A;1234';
                patients.push(patient);
                job.patients = patients;

                var mockConfig = {
                    osync: {
                        syncUrl: "http://10.3.3.6:8080/sync/doLoad?icn=",
                        numToSyncSimultaneously: 1,
                        waitBetween: 5000
                    }
                };
                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function (error, data) {
                    done = true;
                    expect(error).toBe("ERROR: sync.validateConfig: osync.numToSyncSimultaneously cannot be less than 2");
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

        it('error condition: config missing waitBetween', function () {
            var done = false;
            var patients = [];
            var patient = {};

            runs(function () {
                var job = {};
                job.type = 'sync';
                job.source = 'appointments';

                patient.ien = '9E7A;1234';
                patients.push(patient);
                job.patients = patients;

                var mockConfig = {
                    osync: {
                        syncUrl: "http://10.3.3.6:8080/sync/doLoad?icn=",
                        numToSyncSimultaneously: 3
                    }
                };
                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function (error, data) {
                    done = true;
                    expect(error).toBe("ERROR: sync.validateConfig: osync.waitBetween cannot be null");
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

        it('error condition: config waitBetween < 1000', function () {
            var done = false;
            var patients = [];
            var patient = {};

            runs(function () {
                var job = {};
                job.type = 'sync';
                job.source = 'appointments';

                patient.ien = '9E7A;1234';
                patients.push(patient);
                job.patients = patients;

                var mockConfig = {
                    osync: {
                        syncUrl: "http://10.3.3.6:8080/sync/doLoad?icn=",
                        numToSyncSimultaneously: 3,
                        waitBetween: 500
                    }
                };
                var mockEnvironment = null;
                handler(log, mockConfig, mockEnvironment, job, function (error, data) {
                    done = true;
                    expect(error).toBe("ERROR: sync.validateConfig: osync.waitBetween cannot be less than 1000");
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
    });

});
