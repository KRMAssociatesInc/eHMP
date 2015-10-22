'use strict';

var errUtil = require(global.VX_UTILS + 'error');
var inspect = require(global.VX_UTILS + 'inspect');
var Publisher = require('./publisher');
var _ = require('underscore');
var async = require('async');

function Router(log, config, metrics, jobStatusUpdater, PublisherClass) {
    if(!(this instanceof Router)) {
        return new Router(log, config, metrics, PublisherClass);
    }

    this.log = log;
    this.log.debug('publisherRouter.Router() : Enter');
    this.metrics = metrics;
    this.config = config;
    this.jobStatusUpdater = jobStatusUpdater;

    // This parameter is for unit testing, otherwise just leave it undefined.
    this.PublisherClass = PublisherClass || Publisher;

    this.log.debug('publisherRouter.Router() ');
// this.log.debug(inspect(config, { depth: null }))
    this.publishers = {};
}

/*
Variadic function:
publish(jobs, options, callback)
publish(jobs, callback)
*/
Router.prototype.publish = function(jobs, options, callback) {
    this.log.debug('publisherRouter.publish() : Enter');
    this.log.debug(inspect(jobs));
    // this.log.trace(beanstalkConfig);

    // second parameter is optional
    if (arguments.length === 2) {
        callback = arguments[1];
        options = {};
    }

    if (!_.isArray(jobs)) {
        jobs = [jobs];
    }

    var self = this;
    var asyncTasks = _.map(jobs, function(job) {
        var publisher = self.getPublisherForJob(job);
        return publisher.publish.bind(publisher, job, self.jobStatusUpdater);
    });

    // when this is just an unlimited parallel, the pollerHost will try to publish entirely too many
    // jobs and DDoS the beanstalkd client/server such that connections fail due to an 'EMFILE' error
    // async.parallelLimit(asyncTasks, this.config.parallelPublish || 10, function(err, results) {
    async.series(asyncTasks, function(err, results) {
        if (err) {
            self.log.debug('failed to publish job(s) [%s]', err);
            return callback(errUtil.createTransient(err));
        }
        self.log.debug(inspect(results));
        self.log.debug('publish job(s) complete [count=%s]', results.length);
        return callback(null, results);
    });
};


Router.prototype.getPublisherForJob = function(job) {
    var self = this;
    self.log.debug('publisherRouter.getPublisherForJob() : (%s)', job.type);
    self.log.debug(inspect(job));

    // TODO: What if there is no publisher for the job?
    if (_.isEmpty(job)) {
        return;
    }

    var type = job.type;

    var publisher = self.publishers[type];
    if (!publisher) {
        self.log.debug('publisherRouter.getPublisherForJob(): publisher not already created / in cache, creating publisher [%s]', type);
        publisher = new self.PublisherClass(self.log, self.metrics, self.config, type);
        self.publishers[type] = publisher;
    }

    return publisher;
};

Router.prototype.close = function() {
    this.log.debug('publisherRouter.close()');
    _.each(this.publishers, function(publisher) {
        publisher.close();
    });
};

module.exports = Router;
