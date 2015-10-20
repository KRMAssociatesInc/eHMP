'use strict';

var _ = require('underscore');

var inspect = require(global.VX_UTILS + 'inspect');
var logUtil = require(global.VX_UTILS + 'log');
var JdsClient = require(global.VX_SUBSYSTEMS + 'jds/jds-client');

function JobStatusUpdater(setLog, setConfig, jdsClient) {
    if (!(this instanceof JobStatusUpdater)) {
        return new JobStatusUpdater(setLog, setConfig, jdsClient);
    }

    this.jdsClient = jdsClient || new JdsClient(setLog, setConfig);
    this.log = logUtil.getAsChild('JobStatusUpdater', setLog);
    // this.log = require('bunyan').createLogger({
    //     name: 'JobStatusUpdater',
    //     level: 'debug'
    // });

    this.config = setConfig;
}

JobStatusUpdater.prototype.writeStatus = function(jobState, callback) {
    var self = this;
    jobState.timestamp = Date.now().toString();
    if (_.isUndefined(jobState.rootJobId) && jobState.type === 'enterprise-sync-request') {
        jobState.rootJobId = jobState.jobId;
    }
    if (jobState.status !== 'error') {
        if (_.isUndefined(jobState.jpid) || _.isUndefined(jobState.rootJobId)) {
            self.log.debug('JobStatusUpdater.writeStatus: No jpid or rootJobId');
            return callback(null, 'no job state for jobs not started by a user');
        }
        if (!_.isUndefined(jobState.record) || !_.isUndefined(jobState['event-uid'])) {
            self.log.debug('JobStatusUpdater.writeStatus: Job has a record, covered by metastamp, don\'t record job state');
            return callback(null, 'record job');
        }
    }
    self.jdsClient.saveJobState(jobState, function(error, response, result) {
        self.log.debug('JobStatusUpdater.writeStatus: Response from saveJobState: error: %s, response: %j, result: %j', error, response, result);
        if (error) {
            self.log.debug('JobStatusUpdater.writeStatus: An error occurred.  error: %s; response: %j; result: %j', error, response, result);
            return callback(error, response, result);
        }
        if ((response) && (response.statusCode !== 200)) {
            self.log.error('JobStatusUpdater.writeStatus: Response status code was not correct. error: %s; response: %j; result: %j', error, response, result);
        }
        return callback(error, response, jobState);
    });
};

JobStatusUpdater.prototype.errorJobStatus = function(job, error, callback) {
    var self = this;
    job.status = 'error';
    job.error = error;

    self.log.debug(inspect(job));

    this.writeStatus(job, callback);
};

JobStatusUpdater.prototype.createJobStatus = function(job, callback) {
    var self = this;
    job.status = 'created';

    self.log.debug(inspect(job));

    this.writeStatus(job, callback);
};

JobStatusUpdater.prototype.startJobStatus = function(job, callback) {
    var self = this;
    job.status = 'started';
    self.log.debug(inspect(job));
    this.writeStatus(job, callback);
};

JobStatusUpdater.prototype.completeJobStatus = function(job, callback) {
    var self = this;
    job.status = 'completed';
    self.log.debug('JobStatusUpdater.completeJobStatus: Saving job: %s', inspect(job));
    this.writeStatus(job, callback);
};

module.exports = JobStatusUpdater;
JobStatusUpdater._tests = {
    '_writeStatus': JobStatusUpdater.prototype.writeStatus,
    '_errorJobStatus': JobStatusUpdater.prototype.errorJobStatus,
    '_createJobStatus': JobStatusUpdater.prototype.createJobStatus,
    '_startJobStatus': JobStatusUpdater.prototype.startJobStatus,
    '_completeJobStatus': JobStatusUpdater.prototype.completeJobStatus
};