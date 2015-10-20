'use strict';

var async = require('async');
var _ = require('underscore');

var BeanstalkClient = require('./beanstalk-client');

var inspect = require(global.VX_UTILS + 'inspect');

function Publisher(logger, metrics, config, jobType) {
    if (!(this instanceof Publisher)) {
        return new Publisher(logger, metrics, beanstalkConfig, jobType);
    }

    logger.debug('publisher.Publisher(%s)', jobType);

    this.logger = logger;
    this.metrics = metrics;
    this.client = undefined;
    this.jobType = jobType;
    var beanstalkConfig = config.beanstalk;
    this.beanstalkJobTypeConfig = beanstalkConfig.jobTypes[jobType] ||
        _.defaults({}, beanstalkConfig.repoUniversal, beanstalkConfig.repoDefaults, {
            usingDefaults: true
        });
    this.isConnected = false;

    this.logger.debug('publisher.Publisher(%s) %s:%s/%s', jobType, this.beanstalkJobTypeConfig.host, this.beanstalkJobTypeConfig.port, this.beanstalkJobTypeConfig.tubename);
}

/*
Variadic Function:
connect(callback)
connect()
*/
Publisher.prototype.connect = function(callback) {
    this.logger.debug('Publisher.connect()');
    var self = this;

    self.isConnected = false;

    var host = self.beanstalkJobTypeConfig.host;
    var port = self.beanstalkJobTypeConfig.port;
    var tubename = self.beanstalkJobTypeConfig.tubename;

    self.logger.debug('Publisher.connect() : instantiate beanstalk %s:%s/%s', host, port, this.jobType);
    self.client = new BeanstalkClient(self.logger, host, port);

    self.logger.debug('Publisher.connect() : connecting to beanstalkd %s:%s/%s', host, port, this.jobType);

    async.series({
        connect: self.client.connect.bind(self.client),
        use: self.client.use.bind(self.client, tubename)
    }, function(error) {
        if (error) {
            self.logger.debug('Publisher.connect() : failed to connect client %j', error);
            self.client = undefined;
            if (callback) {
                callback(error);
            }
            return;
        }

        self.client.on('error', function(err) {
            self.logger.warn('Publisher.connect() : beanstalk client error (%s) %j', self.jobType, err);
            // self.emitError(err);
        });

        self.client.on('close', function() {
            self.isConnected = false;
            self.logger.info('Publisher.connect() : disconnected from beanstalkd (%s)', self.jobType);
            self.client = undefined;
            // self.emitClose();
        });

        self.isConnected = true;
        self.logger.debug('Publisher.connect() : connected to beanstalkd tube (%s) %s@%s:%s', self.jobType, tubename, host, port);
        // self.emitConnect();
        if (callback) {
            callback();
        }
    });
};

/*
Variadic Function:
publish = function(job, options, jobStatusUpdater, publishCallback)
publish = function(job, jobStatusUpdater, publishCallback)

options = {
    priority: number,
    delay: seconds,
    ttr: seconds
}
*/
Publisher.prototype.publish = function(job, options, jobStatusUpdater, callback) {
    var self = this;
    var tubename = self.beanstalkJobTypeConfig.tubename;
    self.metrics.info('Queued Beanstalk Job', {'tubeName':tubename, 'jobType':job.type, 'jobId':job.jobId});

    // second parameter is optional
    if (arguments.length === 3) {
        jobStatusUpdater = arguments[1];
        callback = arguments[2];
        options = {};
    }

    options = _.defaults(options || {}, this.beanstalkJobTypeConfig);

    this.logger.debug('publisher.publish() : %s %s', job.type, (job.dataDomain ? job.dataDomain : ''));


    if (!self.isConnected) {
        self.logger.debug('publisher.publish() : attempting to (re)connect');

        self.connect(function(err) {
            if (err) {
                return callbackWrapper(err);
            }

            doPublish(self.client, job, options, callbackWrapper);
        });

        return;
    }


    self.logger.debug('already connected');
    doPublish(self.client, job, options, callbackWrapper);

    function callbackWrapper(err, beanstalkJobId) {
        if (err) {
            self.logger.warn('publisher.publish():callbackWrapper() failed to publish job: %s %j', beanstalkJobId, err);
            return callback(err, beanstalkJobId);
        }

        self.logger.debug('published job [beanstalkJobId:%s]', beanstalkJobId);
        // job.jobId = beanstalkJobId;
        self.logger.debug('creating job state report', inspect(job));
        jobStatusUpdater.createJobStatus(job, function(error) {
            if (error) {
                return callback(error);
            }

            callback(err, beanstalkJobId);
        });
    }
};

function doPublish(client, job, options, callback) {
    client.put(options.priority, options.delay, options.ttr, JSON.stringify(job), callback);
}


// Only connect if not connected
Publisher.prototype.reconnect = function(callback) {
    var self = this;

    if (self.isConnected) {
        return setTimeout(callback, 0);
    }

    self.logger.debug('publisher.reconnect() : attempting to (re)connect');
    self.connect(callback);
};


Publisher.prototype.close = function() {
    this.logger.debug('Publisher.close()');
    if (this.client) {
        this.client.end();
    }
};


module.exports = Publisher;