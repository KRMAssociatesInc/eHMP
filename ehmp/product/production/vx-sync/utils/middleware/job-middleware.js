'use strict';

var _ = require('underscore');
var inspect = require('util').inspect;
var format = require('util').format;

var logUtil = require('../log');
var inspect = require('../inspect');

var JobStatusUpdater = require(global.VX_JOBFRAMEWORK + 'JobStatusUpdater');

/**
 * Configure Job Middleware to save a logger and a config, initializes a JDS client and a JobStatusUpdater
 */
function JobAPI(setLog, setConfig, setEnvironment) {
    if (!(this instanceof JobAPI)) { return new JobAPI(setLog, setConfig, setEnvironment); }
    if (_.isUndefined(setEnvironment)) { setEnvironment = {}; }
    this.jobStatusUpdater = setEnvironment.jobStatusUpdater || new JobStatusUpdater(setLog, setConfig);
    this.jdsClient = setEnvironment.jds;
    this.log = logUtil.getAsChild('job-util', setLog);
    // this.log = setLog;
    this.config = setConfig;

    this.buildJob = buildJob.bind(this);
    this.getJobHistory = getJobHistory.bind(this);
    this.getSyncStatus = getSyncStatus.bind(this);
    this.jobVerification = jobVerification.bind(this);
    this.publishJob = publishJob.bind(this);
    this.log.debug('job-middleware.JobAPI:  In constructor.');
}

/**
 * Middleware to build the enterprise-sync-request job
 *
 * Expects the request object to respond like a validated Express request with the JPID
 * (See dummy-request, add a pid/icn and an optional force parameter, and a JPID and patientIdentifier attribute)
 */
var buildJob = function(jobFactory, req, res, next) {
    var self = this;
    self.log.debug('buildJob()');

    var job = jobFactory(req);
    self.log.debug(inspect(job));

    res.job = job;
    next();
};

/**
 * Retrieve job status for JPID
 *
 * Expects the response object to have a valid job containing a JPID attribute
 */
var getJobHistory = function(req, res, next) {
    var self = this;
    self.log.debug('job-middleware.getJobHistory()');
    var job = res.job;
    var filter = res.filter;
    self.log.debug('job-middleware.getJobHistory - Getting job state history');
    if (typeof filter==='undefined'){
        self.jdsClient.getJobStatus(job, function(error, response, result) {
        if (error) {
            var errorTemplate = 'Could not determine whether or not job currently exists for %s\n%s';
            return res.status(500).send(format(errorTemplate, job.patientIdentifier.value, inspect(error)));
        }
        self.log.debug('job-middleware.getJobHistory - Job status received');
        self.log.debug(inspect(result));
        res.jobStates = result.items;
        next();
        });
    }
    else{
        self.jdsClient.getJobStatus(job, filter, function(error, response, result) {
        if (error) {
            var errorTemplate = 'Could not determine whether or not job currently exists for %s\n%s';
            return res.status(500).send(format(errorTemplate, job.patientIdentifier.value, inspect(error)));
        }
        self.log.debug('job-middleware.getJobHistory - Job status received');
        self.log.debug(inspect(result));
        res.jobStates = result.items;
        next();
        });
    }
};

/**
 * Middleware to get sync states for JPID
 *
 * Expects the response object to have a valid job containing a JPID attribute
 */
var getSyncStatus = function(req, res, next) {
    var self = this;
    self.log.debug('job-middleware.getSyncStatus()');
    var job = res.job;
    if (_.isUndefined(job.patientIdentifier)) {
        job.patientIdentifier = {
            'value': job.jpid
        };
    }

    self.log.debug('job-middleware.getSyncStatus - Getting sync status');
    self.jdsClient.getSyncStatus(job.patientIdentifier, function(error, response, result) {
        if (error) {
            return res.status(500).send('Could not retrieve sync status');
        }

        self.log.debug('job-middleware.getSyncStatus - Sync status received');
        self.log.debug(inspect(result));
        res.syncStatus = result;
        next();
    });
};

/**
 * Middleware to verify the job has not already been started
 *
 * Expects the response object to have a valid job attribute and a jobStates atttibute with an array of current job states
 *
 * allowsStatus:  An array of status that are OK and will NOT be marked as a conflict.
 * req: Not being used for anything in this method.
 * res: Job History object  ({ job: xxx, jobStates: [...]})
 */
var jobVerification = function(allowedStatus, req, res, next) {
    var self = this;
    // self.log.trace('jobVerification:  Entered method..  res: %s', inspect(res, { depth: null }));
    self.log.debug('job-middleware.jobVerification() - Parsing job state history for recent %s jobs', res.job.type);
    self.log.debug('job-middleware.jobVerification() - Jobs with %j status will be allowed', allowedStatus);

    var currentJob = parseJobsForRecentStatus.call(self, res.jobStates, res.job.type, allowedStatus);

    if (currentJob !== false) {
        res.job.status = 'error';
        res.job.error = currentJob;
        if (_.isEmpty(req)) {
            res.currentJob = currentJob;
            next();
        } else {
            res.status(200).json(currentJob[0]);
        }
    } else {
        next();
    }
};

var parseJobsForRecentStatus = function(jdsJobsResponse, type, status) {
    var self = this;
    var currentJob = false;
    self.log.debug('parseJobsForRecentStatus: Entered method, searching for job type: %s', type);
    self.log.debug('parseJobsForRecentStatus: Starting with %s job(s)', (jdsJobsResponse?jdsJobsResponse.length:0));
    var typeMatchedJobs = _.filter(jdsJobsResponse, function(job) {
        return job.type === type;
    });
    self.log.debug('parseJobsForRecentStatus: filtered %s jobs, %s found', type, typeMatchedJobs.length);
    self.log.debug('parseJobsForRecentStatus: checking job status, allowed states: %j', status);
    var conflictingJobs = _.filter(typeMatchedJobs, function(job) {
        if (!_.contains(status, job.status)) {
            return true;
        }
    });

    if (conflictingJobs.length) {
        self.log.debug('parseJobsForRecentStatus: %s conflicting jobs found', conflictingJobs.length);
        currentJob = conflictingJobs;
    } else {
        self.log.debug('parseJobsForRecentStatus: No conflict found...');
    }

    return currentJob;
};

/**
 * Middleware to publish the enterprise-sync-request
 *
 * Expects the response object to have a valid job attribute to be published and any job being forced over
 * set to the currentJob attribute.  Any currentJob's state will be errored out while the job's state is created.
 */
var publishJob = function(currentRouter, req, res, next) {
    var self = this;
    var job = res.job,
        currentJob = res.currentJob;

    self.log.debug('publishJob()');
    self.log.debug(inspect(job));
    currentRouter.publish(job, function(error, jobIds) {
        if (error) {
            return res.status(500).send(format('Unable to publish request: \n%s', inspect(error)));
        }
        self.log.debug('job-middleware.publishJob - Job published successfully');
        self.log.debug(inspect(job));
        self.log.debug(jobIds[0]);

        job.jobId = job.rootJobId = jobIds[0];

        if (typeof currentJob !== 'undefined') {
            forceCurrentJob.call(self, currentJob, next);
        } else { next(); }
    });
};

var forceCurrentJob = function(currentJob, callback) {
    var self = this;
    currentJob.status = 'error';
    currentJob.error = 'Forced resync';
    self.jobStatusUpdater.writeStatus(currentJob, function(error, response) {
        self.log.debug('job-middleware.forceCurrentJob - In progress job logged error: ' + currentJob.error);
        self.log.debug(inspect(response));

        callback();
    });
};

module.exports = JobAPI;
JobAPI._test = {
    '_buildJob': buildJob,
    '_getJobHistory': getJobHistory,
    '_getSyncStatus': getSyncStatus,
    '_jobVerification': jobVerification,
    '_publishJob': publishJob
};