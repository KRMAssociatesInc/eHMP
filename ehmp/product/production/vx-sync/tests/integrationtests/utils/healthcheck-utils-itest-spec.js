'use strict';

require('../../../env-setup');
var healthcheck = require(global.VX_UTILS + 'healthcheck-utils');
var dummyLog = require(global.VX_UTILS + 'dummy-logger');
var JdsClient = require(global.VX_SUBSYSTEMS + 'jds/jds-client');

var wConfig = require(global.VX_ROOT + 'worker-config');
var _ = require('underscore');

// dummyLog = require('bunyan').createLogger({
//     name: 'healthcheck-utils-itest-spec',
//     level: 'debug'
// });

var config = {
    healthcheck: {
        heartbeatEnabled: true,
        heartbeatIntervalMillis: 300000,
        heartbeatStaleAgeMillis: 600000
    },
    jds: _.defaults(wConfig.jds, {
        protocol: 'http',
        host: '10.2.2.110',
        port: 9080
    })
};

describe('healthcheck-utils-itest-spec', function() {
    describe('sendHeartbeat', function() {
        var jds = new JdsClient(dummyLog, dummyLog, config);
        var env = {
            jds: jds,
            metrics: dummyLog,
        };

        beforeEach(function() {
            var done = false;
            runs(function() {
                env.jds.deleteOperationalDataMutable('dummy-process', function() {
                    done = true;
                });
            });
            waitsFor(function() {
                return done;
            });
        });

        it('Normal Path', function() {
            spyOn(dummyLog, 'error');
            var done = false;

            runs(function() {
                healthcheck.sendHeartbeat(dummyLog, config, env, 'dummy-process', 'dummy-profile', 1234, '20150715014231', function() {
                    expect(dummyLog.error).not.toHaveBeenCalled();
                    done = true;
                });
            });

            waitsFor(function() {
                return done;
            });

            var done2 = false;

            runs(function() {
                env.jds.getOperationalDataMutable('dummy-process', function(err, response, result) {
                    expect(result).toEqual({
                        _id: 'dummy-process',
                        profile: 'dummy-profile',
                        process: 1234,
                        processStartTime: '20150715014231',
                        heartbeatTime: jasmine.any(String)
                    });
                    done2 = true;
                });
            });

            waitsFor(function() {
                return done2;
            });
        });

        afterEach(function() {
            var done = false;
            runs(function() {
                env.jds.deleteOperationalDataMutable('dummy-process', function() {
                    done = true;
                });
            });
            waitsFor(function() {
                return done;
            });
        });
    });
    describe('retrieveHeartbeats', function() {

        var jds = new JdsClient(dummyLog, dummyLog, config);
        var env = {
            jds: jds,
            metrics: dummyLog,
        };

        var testHeartbeat = {
            _id: 'dummy-process2',
            profile: 'dummy',
            process: 4435,
            processStartTime: '20150717112412',
            heartbeatTime: '20150717112712'
        };

        beforeEach(function() {
            var done = false;
            runs(function() {
                env.jds.deleteOperationalDataMutable('dummy-process2', function() {
                    done = true;
                });
            });
            waitsFor(function() {
                return done;
            });

            var done2 = false;
            runs(function() {
                env.jds.storeOperationalDataMutable(testHeartbeat, function() {
                    done2 = true;
                });
            });
            waitsFor(function() {
                return done2;
            });
        });

        it('Normal Path', function() {
            var done = false;
            healthcheck.retrieveHeartbeats(dummyLog, config, env, function(err, res) {
                expect(err).toBeFalsy();
                expect(res).toBeTruthy();
                expect(res.items).toBeTruthy();
                expect(res.items).toContain(testHeartbeat);
                done = true;
            });
            waitsFor(function() {
                return done;
            });
        });

        afterEach(function() {
            var done = false;
            runs(function() {
                env.jds.deleteOperationalDataMutable('dummy-process2', function() {
                    done = true;
                });
            });
            waitsFor(function() {
                return done;
            });
        });
    });
});