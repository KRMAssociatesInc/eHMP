'use strict';

require('../env-setup');

var _ = require('underscore');

var BeanstalkClient = require('./beanstalk-client');
var Delay = require('./Delay');

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
var Worker = function(logger, beanstalkJobTypeConfig, handlerRegistry, jobStatusUpdater, start) {
    if (!(this instanceof Worker)) {
        return new Worker(logger, beanstalkJobTypeConfig, handlerRegistry);
    }

    this.logger = logger;
    this.paused = !start;
    this.handlerRegistry = handlerRegistry;

    this.beanstalkJobTypeConfig = beanstalkJobTypeConfig;
    this.client = undefined;
    this.jobStatusUpdater = jobStatusUpdater;
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
    this.logger.debug('worker.pause()');
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

//////////////////////////////////////////////////////////////////////////////////////////
// Below here are "private" methods
//////////////////////////////////////////////////////////////////////////////////////////

Worker.prototype._connect = function() {
    this.logger.debug('worker._connect() started: %s', !this.paused);

    var self = this;

    self.delay.increment();
    var timeout = self.delay.currentMillis;
    var _connect = self._connect.bind(self);

    self.client = new BeanstalkClient(self.logger, self.beanstalkJobTypeConfig.host, self.beanstalkJobTypeConfig.port);
    self.client.connect(function(error) {
        if (error) {
            self.logger.warn('Unable to connect to beanstalk. ERROR: %j', error);
            return setTimeout(_connect, timeout);
        }

        self.client.on('error', function(error) {
            self.logger.warn('error with connection. ERROR: %j', error);
            self._clearClient();
            setTimeout(_connect, timeout);
        });

        self.client.on('close', function(error) {
            self.logger.warn('connection closed. ERROR: %j', error);
            self._clearClient();
            setTimeout(_connect, timeout);
        });

        self.delay.reset();
        self._listen(function(error) {
            if (error) {
                self.logger.warn('Unable to connect to beanstalk. ERROR: %j', error);
                self._clearClient();
                setTimeout(_connect, timeout);
            }
        });
    });
};

Worker.prototype._listen = function(callback) {
    this.logger.trace('worker._listen() started: %s', !this.paused);
    if (this.paused) {
        this.logger.debug('worker._listen(): paused == true, SKIPPING _listen() on "%s"', this.beanstalkJobTypeConfig.tubename);
        return setTimeout(this._listen.bind(this), this.pauseDelayMillis);
    }

    var self = this;
    var tubename = self.beanstalkJobTypeConfig.tubename;
    self.client.watch(tubename, function(error) {
        if (error) {
            self.logger.warn('error trying to use tube %s', tubename);
            return callback(error);
        }

        self.logger.debug('Watching tube: %s', tubename);

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
    this.logger.trace('worker._receiveJob() started: %s', !this.paused);
    if (this.paused) {
        this.logger.debug('worker._receiveJob(): paused == true, SKIPPING _receiveJob() on "%s"', this.beanstalkJobTypeConfig.tubename);
        return;
    }

    var self = this;
    var timeout = self.beanstalkJobTypeConfig.timeout;
    var _receiveJob = self._receiveJob.bind(self);

    self.client.reserve_with_timeout(timeout, function(error, jobId, payload) {
        if (error && error !== 'TIMED_OUT' && error !== 'DEADLINE_SOON') {
            self.logger.warn('error trying to reserve job with timeout. ERROR: %j', error);

            setTimeout(_receiveJob, 0);
            return;
        }

        if (error === 'TIMED_OUT') {
            self.logger.trace('Timeout trying to reserve job');

            setTimeout(_receiveJob, 0);
            return;
        }

        self._processJob(jobId, payload, function() {
            self.logger.trace('finished job, back to listening...');
            setTimeout(_receiveJob, 0);
        });
    });
};

Worker.prototype._processJob = function(jobId, payload, callback) {
    this.logger.debug('worker._processJob() jobId: %s', jobId);
    var self = this;

    var handler;
    var job;

    try {
        job = JSON.parse(payload);
        job.jobId = jobId;
    } catch (parseError) {
        self.logger.debug('Job invalid format: %s', jobId);
        self.logger.debug('Destroy job: %s', jobId);
        self._destroy(jobId);
        return setTimeout(callback, 0);
    }

    if (_.isUndefined(job.type) || _.isNull(job.type)) {
        self.logger.debug('No job type for job: %s', jobId);
        self.logger.debug('Destroy job: %s', jobId);
        self._destroy(jobId);
        return setTimeout(callback, 0);
    }

    handler = this.handlerRegistry.get(job);

    if (!handler) {
        self.logger.info('No handler for job: %s', jobId);
        self.logger.debug('Bury job: %s (%s)', jobId, job.type);
        self._bury(jobId);
        return self.jobStatusUpdater.errorJobStatus(job, errUtil.createFatal('No handler for job'), function(errorJobError) {
            if (errorJobError) {
                self.logger.debug(errorJobError);
            }
            return callback();
        });
    }

    self.jobStatusUpdater.startJobStatus(job, function(startJobError) {
        if (startJobError) {
            self._release(jobId);
            self.logger.debug('error starting job state:', startJobError);
            return setTimeout(callback, 0);
        }

        handler(job, function(handlerError) {
            if (handlerError) {
                if (handlerError.type === errUtil.transient) {
                    self.logger.debug('Release job: %s (%s)', jobId, job.type);
                    self._release(jobId);
                } else {
                    self.logger.debug('Bury job: %s (%s)', jobId, job.type);
                    self._bury(jobId);
                }

                self.jobStatusUpdater.errorJobStatus(job, handlerError, function(errorJobError) {
                    if (errorJobError) {
                        self.logger.debug('error saving error state:', errorJobError);
                    }
                    callback();
                });

                return callback();
            }

            self.logger.debug('Destroy job: %s (%s)', jobId, job.type);
            self._destroy(jobId);
            self.jobStatusUpdater.completeJobStatus(job, function(error) {
                if (error) {
                    self.logger.debug('error completing job status:', error);
                }

                callback();
            });
        });
    });
};

Worker.prototype._bury = function(jobId) {
    this.logger.debug('worker._bury() jobId: %s', jobId);
    var self = this;
    var priority = LOWEST_PRIORITY;
    self.client.bury(jobId, priority, function(error) {
        if (error) {
            self.logger.warn('Unable to bury job: %s', jobId);
        }
    });
};

Worker.prototype._release = function(jobId) {
    this.logger.debug('worker._release() jobId: %s', jobId);
    var self = this;
    var priority = LOWEST_PRIORITY;
    var delay = 30;
    self.client.release(jobId, priority, delay, function(error) {
        if (error) {
            self.logger.warn('Unable to release job: %s', jobId);
        }
    });
};

Worker.prototype._destroy = function(jobId) {
    this.logger.debug('worker._destroy() jobId: %s', jobId);
    var self = this;
    self.client.destroy(jobId, function(error) {
        if (error) {
            self.logger.warn('Unable to destroy job: %s', jobId);
        }
    });
};

Worker.prototype._clearClient = function() {
    this.logger.debug('worker._clearClient()');
    if (this.client) {
        this.client.removeAllListeners();
        this.client.end();
    }
};

module.exports = Worker;