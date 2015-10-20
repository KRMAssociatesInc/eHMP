'use strict';

require('../env-setup');

var _ = require('underscore');

var BeanstalkClient = require('./beanstalk-client');
var Delay = require('./Delay');
var uuid=require('node-uuid');

var errUtil = require(global.VX_UTILS + 'error');

var LOWEST_PRIORITY = 1;

/*
beanstalkJobTypeConfig parameters used:
    host
    port
    tubename
    timeout
    initMillis
    maxMillis
    incMillis
*/
var Worker = function(logger, beanstalkJobTypeConfig, metrics, handlerRegistry, jobStatusUpdater, errorPublisher, start) {
    if (!(this instanceof Worker)) {
        return new Worker(logger, beanstalkJobTypeConfig, metrics, handlerRegistry);
    }

    this.logger = logger;
    this.paused = !start;
    this.readyToShutdown = !start;
    this.handlerRegistry = handlerRegistry;
    this.metrics = metrics;

    this.beanstalkJobTypeConfig = beanstalkJobTypeConfig;
    this.client = undefined;
    this.jobStatusUpdater = jobStatusUpdater;
    this.errorPublisher = errorPublisher;
    this.pauseDelayMillis = 1000;

    this.delay = new Delay(this.beanstalkJobTypeConfig.delay);

    this.logger.debug('worker.Worker()');
    this.logger.trace('worker.Worker() %j', this.beanstalkJobTypeConfig);
};

Worker.prototype.start = function() {
    this.logger.debug('worker.start() %s:%s/%s', this.beanstalkJobTypeConfig.host, this.beanstalkJobTypeConfig.port, this.beanstalkJobTypeConfig.tubename);
    this._connect();
};

Worker.prototype.stop = function(callback) {
    this.logger.debug('worker.stop() %s:%s/%s', this.beanstalkJobTypeConfig.host, this.beanstalkJobTypeConfig.port, this.beanstalkJobTypeConfig.tubename);
    this.paused = true;
    callback = callback || _.noop;
    this._clearClient();

    callback();
};

Worker.prototype.updateRegistry = function(handlerRegistry) {
    this.handlerRegistry = handlerRegistry;
};

Worker.prototype.resume = function() {
    this.logger.debug('worker.resume()');
    this.paused = false;
};

Worker.prototype.pause = function() {
    this.logger.debug('worker.pause(%s)', this.beanstalkJobTypeConfig.tubename);
    this.paused = true;
};

Worker.prototype.getStatus = function() {
    this.logger.debug('worker.getStatus()');

    return {
        tube: this.beanstalkJobTypeConfig.host + ':' + this.beanstalkJobTypeConfig.port + '/' + this.beanstalkJobTypeConfig.tubename,
        status: this.paused ? 'paused' : 'running',
        pid: process.pid
    };
};

Worker.prototype.isReadyToShutdown = function(){
    var tubename = this.getTubeName();
    this.logger.debug('worker(%s).isReadyToShutdown: %s', tubename, this.readyToShutdown);
    return this.readyToShutdown;
};

Worker.prototype.getTubeName = function(){
    if(!this.beanstalkJobTypeConfig){
        return null;
    }

    return this.beanstalkJobTypeConfig.tubename;
};

//////////////////////////////////////////////////////////////////////////////////////////
// Below here are "private" methods
//////////////////////////////////////////////////////////////////////////////////////////

Worker.prototype._connect = function() {
    this.logger.debug('worker._connect(%s) started: %s', this.getTubeName(), !this.paused);

    var self = this;

    self.delay.increment();
    var timeout = self.delay.currentMillis;
    var _connect = self._connect.bind(self);

    self.client = new BeanstalkClient(self.logger, self.beanstalkJobTypeConfig.host, self.beanstalkJobTypeConfig.port);
    self.client.connect(function(error) {
        if (error) {
            self.logger.warn('worker._connect(%s) Unable to connect to beanstalk. ERROR: %j', self.getTubeName(), error);
            return setTimeout(_connect, timeout);
        }

        self.client.on('error', function(error) {
            self.logger.warn('worker._connect(%s) error with connection. ERROR: %j', self.getTubeName(), error);
            self._clearClient();
            setTimeout(_connect, timeout);
        });

        self.client.on('close', function(error) {
            self.logger.warn('worker._connect(%s) connection closed. ERROR: %j', self.getTubeName(), error);
            self._clearClient();
            setTimeout(_connect, timeout);
        });

        self.delay.reset();
        self._listen(function(error) {
            if (error) {
                self.logger.warn('worker._connect(%s) Unable to connect to beanstalk. ERROR: %j', self.getTubeName(), error);
                self._clearClient();
                setTimeout(_connect, timeout);
            }
        });
    });
};

Worker.prototype._listen = function(callback) {
    this.logger.trace('worker._listen(%s) started: %s', this.getTubeName(),!this.paused);
    if (this.paused) {
        this.logger.debug('worker._listen(): paused == true, SKIPPING _listen() on "%s"', this.beanstalkJobTypeConfig.tubename);
        this.readyToShutdown = true;
        return setTimeout(this._listen.bind(this), this.pauseDelayMillis);
    } else {
        this.readyToShutdown = false;
    }

    var self = this;
    var tubename = self.beanstalkJobTypeConfig.tubename;
    self.client.watch(tubename, function(error) {
        if (error) {
            self.logger.warn('worker._listen() : error trying to use tube %s', tubename);
            return callback(error);
        }

        self.logger.debug('worker._listen() : Watching tube: %s', tubename);

        // ignore is removed
        self._receiveJob();
        callback();

        // always ignore the 'default' tube
        // return self.client.ignore('default', function(error) {
        //     if (error) {
        //         self.logger.warn('error trying to ignore default tube');
        //         return callback(error);
        //     }

        //     self.logger.debug('Ignoring "default" tube');
        //     self._receiveJob();
        //     callback();
        // });
    });
};

Worker.prototype._receiveJob = function() {
    this.logger.trace('worker._receiveJob(%s) started: %s', this.getTubeName(), !this.paused);
    if (this.paused) {
        this.logger.debug('worker._receiveJob(): paused == true, SKIPPING _receiveJob() on "%s"', this.beanstalkJobTypeConfig.tubename);
        this.readyToShutdown = true;
        return setTimeout(this._receiveJob.bind(this), this.pauseDelayMillis);
    } else {
        this.logger.trace('worker._receiveJob(): paused: %s; continuing...', this.paused);
        this.readyToShutdown = false;
    }

    var self = this;
    var timeout = self.beanstalkJobTypeConfig.timeout;
    var _receiveJob = self._receiveJob.bind(self);

    self.client.reserve_with_timeout(timeout, function(error, beanstalkJobId, beanstalkJobPayload) {
        if (error && error !== 'TIMED_OUT' && error !== 'DEADLINE_SOON') {
            self.logger.warn('worker._receiveJob(%s): error trying to reserve job with timeout. ERROR: %j', self.getTubeName(), error);

            setTimeout(_receiveJob, 0);
            return;
        }

        if (error === 'TIMED_OUT') {
            self.logger.trace('worker._receiveJob(%s): Timeout trying to reserve job', self.getTubeName());

            setTimeout(_receiveJob, 0);
            return;
        }
        self._processJob(beanstalkJobId, beanstalkJobPayload, function() {
            self.logger.debug('worker._receiveJob(%s): finished job %s, back to listening...', self.getTubeName(), beanstalkJobId);
            setTimeout(_receiveJob, 0);
        });
    });
};

Worker.prototype._processJob = function(beanstalkJobId, beanstalkJobPayload, callback) {
    this.logger.debug('worker._processJob(%s) beanstalkJobId: %s', this.getTubeName(), beanstalkJobId);
    var self = this;

    var handler;

    // This is a vxsync-job, NOT a beanstalkJob
    var job;

    try {
        job = JSON.parse(beanstalkJobPayload);
    } catch (parseError) {
        self.metrics.info('Dequeued Invalid Beanstalk Job',{'tubeName':self.getTubeName()});
        self.logger.debug('worker._processJob(%s): Job invalid format: %s', self.getTubeName(), beanstalkJobId);
        self.logger.debug('worker._processJob(%s): Destroy job: %s', self.getTubeName(), beanstalkJobId);
        self._destroy(beanstalkJobId);
        return setTimeout(callback, 0);
    }

    if (_.isUndefined(job.type) || _.isNull(job.type)) {
        self.metrics.info('Dequeued Invalid Beanstalk Job',{'tubeName':self.getTubeName()});
        self.logger.debug('worker._processJob(%s): No job type for job: %s', self.getTubeName(), beanstalkJobId);
        self.logger.debug('worker._processJob(%s): Destroy job: %s', self.getTubeName(), beanstalkJobId);
        self._destroy(beanstalkJobId);
        return setTimeout(callback, 0);
    }
    self.metrics.info('Dequeued Beanstalk Job',{'tubeName':self.getTubeName(), 'jobType':job.type, 'jobId':job.jobId});

    handler = this.handlerRegistry.get(job);

    if (!handler) {
        self.logger.info('worker._processJob(%s): No handler for job: %s', self.getTubeName(), beanstalkJobId);
        self.logger.debug('worker._processJob(%s): Bury job: %s (%s)', self.getTubeName(), beanstalkJobId, job.type);
        self._bury(beanstalkJobId);
        return self.jobStatusUpdater.errorJobStatus(job, errUtil.createFatal('No handler for job'), function(errorJobError) {
            if (errorJobError) {
                self.logger.debug(errorJobError);
            }
            return callback();
        });
    }

    self.jobStatusUpdater.startJobStatus(job, function(startJobError) {
        if (startJobError) {
            self._release(beanstalkJobId);
            self.logger.debug('worker._processJob(%s): error starting job state:', self.getTubeName(), startJobError);
            return setTimeout(callback, 0);
        }
        var processId = uuid.v4();
        self.metrics.info('Handler Processing',{'timer':'start','process':processId,'jobType':job.type, 'domain':job.dataDomain, 'jobId':job.jobId, 'rootJobId':job.rootJobId});
        handler(job, function(handlerError) {
            if (handlerError) {
                self.metrics.info('Handler Processing in Error',{'timer':'stop','process':processId,'jobType':job.type});
                var errorType = handlerError.type ? handlerError.type : errUtil.transient; // default to be transient
                self.errorPublisher.publishHandlerError(job, handlerError, errorType, function() {
                    self.logger.warn('worker._processJob(%s): publish error:', self.getTubeName());
                    return self._destroy(beanstalkJobId);
                });
                self.jobStatusUpdater.errorJobStatus(job, handlerError, function(errorJobError) {
                    if (errorJobError) {
                        self.logger.debug('worker._processJob(%s): error saving error state:', self.getTubeName(), errorJobError);
                    }
                });
                return callback();
            }
            self.metrics.info('Handler Processing',{'timer':'stop','process':processId,'jobType':job.type});

            self.logger.debug('worker._processJob(%s): Destroy job: %s (%s)', self.getTubeName(), beanstalkJobId, job.type);
            self._destroy(beanstalkJobId);
            self.jobStatusUpdater.completeJobStatus(job, function(error) {
                if (error) {
                    self.logger.debug('worker._processJob(%s): error completing job status:',self.getTubeName(), error);
                }

                callback();
            });
        }, doTouch.bind(self, beanstalkJobId));
    });

    function doTouch(beanstalkJobId) {
        self.client.touch(beanstalkJobId, function(err) {
            if (err) {
                self.logger.error('worker._processJob : touching error - %s', err);
            }
        });
    }
};

Worker.prototype._bury = function(beanstalkJobId) {
    this.logger.debug('worker._bury(%s) beanstalkJobId: %s', this.getTubeName(), beanstalkJobId);
    var self = this;
    var priority = LOWEST_PRIORITY;
    self.client.bury(beanstalkJobId, priority, function(error) {
        if (error) {
            self.logger.warn('worker._bury(%s): Unable to bury job: %s', self.getTubeName(), beanstalkJobId);
        }
    });
};

Worker.prototype._release = function(beanstalkJobId) {
    this.logger.debug('worker._release(%s) beanstalkJobId: %s', this.getTubeName(), beanstalkJobId);
    var self = this;
    var priority = LOWEST_PRIORITY;
    var delay = 30;
    self.client.release(beanstalkJobId, priority, delay, function(error) {
        if (error) {
            self.logger.warn('worker._release(%s): Unable to release job: %s', self.getTubeName(), beanstalkJobId);
        }
    });
};

Worker.prototype._destroy = function(beanstalkJobId) {
    this.logger.debug('worker._destroy(%s) beanstalkJobId: %s', this.getTubeName(), beanstalkJobId);
    var self = this;
    self.client.destroy(beanstalkJobId, function(error) {
        if (error) {
            self.logger.warn('worker._destroy(%s): Unable to destroy job: %s', self.getTubeName(), beanstalkJobId);
        }
    });
};

Worker.prototype._clearClient = function() {
    this.logger.debug('worker._clearClient(%s)', this.getTubeName());
    if (this.client) {
        this.client.removeAllListeners();
        this.client.end();
    }
};

module.exports = Worker;