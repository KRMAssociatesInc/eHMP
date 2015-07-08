'use strict';

require('../../../env-setup');

var Worker = require(global.VX_JOBFRAMEWORK + 'worker');
var Delay = require(global.VX_JOBFRAMEWORK + 'Delay');
var errUtil = require(global.VX_UTILS + 'error');

var logger = require(global.VX_UTILS + 'dummy-logger');

var beanstalkJobTypeConfig = {
    host: '192.168.0.2',
    port: 6000,
    tubename: 'vxs-enterprise-sync-request',
    tubePrefix: 'vxs-',
    jobTypeForTube: true,
    priority: 5,
    delay: 0,
    ttr: 0,
    timeout: 10,
    initMillis: 1000,
    maxMillis: 5000,
    incMillis: 1000
};


var handlerRegistry = {

};

describe('worker.js', function() {
    describe('Worker()', function() {
        it('call with new', function() {
            var worker = new Worker(logger, beanstalkJobTypeConfig, handlerRegistry);
            expect(worker.logger).toBe(logger);
            expect(worker.beanstalkJobTypeConfig).toEqual(beanstalkJobTypeConfig);
            expect(worker.handlerRegistry).toBe(handlerRegistry);
            expect(worker.client).toBeUndefined();
            expect(worker.delay).toEqual(new Delay(beanstalkJobTypeConfig.delay));
        });

        it('call as function', function() {
            /* jshint ignore:start */
            var worker = Worker(logger, beanstalkJobTypeConfig, handlerRegistry);
            expect(worker.logger).toBe(logger);
            expect(worker.beanstalkJobTypeConfig).toEqual(beanstalkJobTypeConfig);
            expect(worker.handlerRegistry).toBe(handlerRegistry);
            expect(worker.client).toBeUndefined();
            expect(worker.delay).toEqual(new Delay(beanstalkJobTypeConfig.delay));
            /* jshint ignore:end */
        });
    });

    describe('start()', function() {
        var called = false;
        var instance = {
            logger: logger,
            beanstalkJobTypeConfig: beanstalkJobTypeConfig,
            paused: true,
            _connect: function() {
                called = true;
            },
        };

        it('verify paused to true and _connect() called', function() {
            Worker.prototype.start.call(instance);
            expect(instance.paused).toBe(true);
            expect(called).toBe(true);
        });

        it('verify paused to false and _connect() called', function() {
            called = false;
            instance.paused = false;
            Worker.prototype.start.call(instance);
            expect(instance.paused).toBe(false);
            expect(called).toBe(true);
        });
    });

    describe('stop()', function() {
        var _clearClientCalled = false;
        var callbackCalled = false;
        var instance = {
            logger: logger,
            beanstalkJobTypeConfig: beanstalkJobTypeConfig,
            paused: false,
            _clearClient: function() {
                _clearClientCalled = true;
            }
        };
        var callback = function() {
            callbackCalled = true;
        };

        it('verify paused to true', function() {
            Worker.prototype.stop.call(instance, callback);

            waitsFor(function() {
                return callbackCalled;
            }, 'should be called', 100);

            runs(function() {
                expect(instance.paused).toBe(true);
                expect(_clearClientCalled).toBe(true);
                expect(callbackCalled).toBe(true);
            });
        });
    });

    xdescribe('_connect()', function() {
        xit('', function() {
            // This might be better served by integration testing
        });
    });

    describe('_listen()', function() {
        var called;
        var instance;
        var callback;

        beforeEach(function() {
            called = false;

            instance = {
                paused: true,
                logger: logger,
                beanstalkJobTypeConfig: beanstalkJobTypeConfig,
                client: {
                    ignore: function(tubename, callback) {
                        callback();
                    },
                    watch: function(tubename, callback) {
                        callback();
                    }
                },
                _receiveJob: function() {}
            };

            callback = function() {
                called = true;
            };
        });

        // TODO: fix and re-enable
        xit('verify paused does not call any of the functionality', function() {
            spyOn(instance, '_receiveJob').andCallThrough();
            spyOn(instance.client, 'ignore').andCallThrough();
            spyOn(instance.client, 'watch').andCallThrough();
            Worker.prototype._listen.call(instance, callback);

            waitsFor(function() {
                return called;
            }, 'should be called', 100);

            runs(function() {
                expect(instance._receiveJob).not.toHaveBeenCalled();
                expect(instance.client.ignore).not.toHaveBeenCalled();
                expect(instance.client.watch).not.toHaveBeenCalled();
            });
        });

        it('verify watch called on tube and "default" ignored and _receiveJob() called', function() {
            instance.paused = false;

            spyOn(instance, '_receiveJob').andCallThrough();
            spyOn(instance.client, 'ignore').andCallThrough();
            spyOn(instance.client, 'watch').andCallThrough();
            Worker.prototype._listen.call(instance, callback);

            waitsFor(function() {
                return called;
            }, 'should be called', 100);

            runs(function() {
                expect(instance._receiveJob).toHaveBeenCalled();
                // expect(instance.client.ignore).toHaveBeenCalled();
                expect(instance.client.watch).toHaveBeenCalled();
            });
        });
    });

    xdescribe('_receiveJob()', function() {
        xit('', function() {
            // This might be better served by integration testing
        });
    });

    describe('_processJob()', function() {
        var called;
        var instance;
        var callback;

        beforeEach(function() {
            called = false;

            instance = {
                logger: logger,
                _release: function() {},
                _destroy: function() {},
                _bury: function() {},
                handlerRegistry: {
                    get: function() {}
                },
                jobStatusUpdater: {
                    startJobStatus: function(job, callback) {
                        callback(null, {}, job);
                    },
                    completeJobStatus: function(job, callback) {
                        callback(null, {}, job);
                    },
                    errorJobStatus: jasmine.createSpy().andCallFake(function(job, error, callback) {
                        callback(null, {}, job);
                    })
                }
            };

            callback = function() {
                called = true;
            };
        });

        it('verify _destroy() called for invalid job format', function() {
            var jobId = 1;
            var payload = 'invalid JSON';
            spyOn(instance, '_destroy');
            Worker.prototype._processJob.call(instance, jobId, payload, callback);

            waitsFor(function() {
                return called;
            }, 'should be called', 100);

            runs(function() {
                expect(instance._destroy).toHaveBeenCalledWith(jobId);
            });
        });

        it('verify _destroy() called for undefined or null job.type', function() {
            var jobId = 1;
            var payload = '{}';
            spyOn(instance, '_destroy');
            Worker.prototype._processJob.call(instance, jobId, payload, callback);

            waitsFor(function() {
                return called;
            }, 'should be called', 100);

            runs(function() {
                expect(instance._destroy).toHaveBeenCalledWith(jobId);
            });
        });

        it('verify _bury() called for no handler', function() {
            var jobId = 1;
            var payload = '{ "type": "invalid" }';
            spyOn(instance, '_bury');
            Worker.prototype._processJob.call(instance, jobId, payload, callback);

            waitsFor(function() {
                return called;
            }, 'should be called', 100);

            runs(function() {
                expect(instance._bury).toHaveBeenCalledWith(jobId);
            });
        });

        it('verify _release() called for transient error', function() {
            var jobId = 1;
            var payload = '{ "type": "valid" }';
            instance.handlerRegistry.get = function() {
                return function(job, callback) {
                    callback(errUtil.createTransient());
                };
            };
            spyOn(instance, '_release');
            Worker.prototype._processJob.call(instance, jobId, payload, callback);

            waitsFor(function() {
                return called;
            }, 'should be called', 100);

            runs(function() {
                expect(instance._release).toHaveBeenCalledWith(jobId);
                expect(instance.jobStatusUpdater.errorJobStatus).toHaveBeenCalled();
            });
        });

        it('verify _bury() called other error types', function() {
            var jobId = 1;
            var payload = '{ "type": "invalid" }';
            instance.handlerRegistry.get = function() {
                return function(job, callback) {
                    callback(errUtil.createFatal());
                };
            };
            spyOn(instance, '_bury');
            Worker.prototype._processJob.call(instance, jobId, payload, callback);

            waitsFor(function() {
                return called;
            }, 'should be called', 100);

            runs(function() {
                expect(instance._bury).toHaveBeenCalledWith(jobId);
                expect(instance.jobStatusUpdater.errorJobStatus).toHaveBeenCalled();
            });
        });

        it('verify _destroy() called for successful job process', function() {
            var jobId = 1;
            var payload = '{ "type": "invalid" }';
            instance.handlerRegistry.get = function() {
                return function(job, callback) {
                    callback();
                };
            };
            spyOn(instance, '_destroy');
            Worker.prototype._processJob.call(instance, jobId, payload, callback);

            waitsFor(function() {
                return called;
            }, 'should be called', 100);

            runs(function() {
                expect(instance._destroy).toHaveBeenCalledWith(jobId);
            });
        });
    });

    describe('_bury()', function() {
        var called = false;
        var instance = {
            logger: logger,
            client: {
                bury: function() {
                    called = true;
                }
            }
        };

        it('verify client.bury() called', function() {
            Worker.prototype._bury.call(instance);
            expect(called).toBe(true);
        });
    });

    describe('_release()', function() {
        var called = false;
        var instance = {
            logger: logger,
            client: {
                release: function() {
                    called = true;
                }
            }
        };

        it('verify client.release() called', function() {
            Worker.prototype._release.call(instance);
            expect(called).toBe(true);
        });
    });

    describe('_destroy()', function() {
        var called = false;
        var instance = {
            logger: logger,
            client: {
                destroy: function() {
                    called = true;
                }
            }
        };

        it('verify client.destroy() called', function() {
            Worker.prototype._destroy.call(instance);
            expect(called).toBe(true);
        });
    });

    describe('_clearClient()', function() {
        var removeAllListenersCalled = false;
        var endCalled = false;
        var instance = {
            logger: logger,
            client: {
                removeAllListeners: function() {
                    removeAllListenersCalled = true;
                },
                end: function() {
                    endCalled = true;
                }
            }
        };

        it('verify listeners removed and client ended', function() {
            Worker.prototype._clearClient.call(instance);
            expect(removeAllListenersCalled).toBe(true);
            expect(endCalled).toBe(true);
        });
    });
});