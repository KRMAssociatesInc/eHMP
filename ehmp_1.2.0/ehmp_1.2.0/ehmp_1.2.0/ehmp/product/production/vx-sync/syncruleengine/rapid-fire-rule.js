'use strict';

var _ = require('underscore');
var inspect = require(global.VX_UTILS + 'inspect');
var jobUtil = require(global.VX_UTILS + 'job-utils');

function rapidFire(log, config, environment, patientIdentifiers, exceptions, callback) {
    log.debug('rapid-fire-rule.rapidFire() : Running rapid-fire-rule on ' + inspect(patientIdentifiers));
    log.debug('Getting job state for %s', patientIdentifiers[0].value);
    environment.jds.getJobStatus({ 'jpid': patientIdentifiers[0].value }, function(error, response, result) {
        if (error) {
            return callback(error, []);
        }
        log.debug('Filtering job states for source sync jobs');
        var sourceSyncJobs = _.filter(result.items, function(job) {
            return jobUtil.isSyncJobType(job);
        });
        log.debug('Found source sync jobs.  Find jobs in progress', inspect(sourceSyncJobs));
        var incompleteJobs = _.filter(sourceSyncJobs, function(job) {
            return job.status !== 'error' && job.status !== 'completed';
        });
        log.debug('Found incomplete jobs.  Extracting PIDs', inspect(incompleteJobs));
        var incompletePids = _.pluck(incompleteJobs, 'patientIdentifier');
        incompletePids = _.pluck(incompletePids, 'value');
        log.debug('Found PIDs for incomplete jobs, removing from rule result', inspect(incompletePids));
        patientIdentifiers = _.filter(patientIdentifiers, function(patientIdentifier) {
            return !_.contains(incompletePids, patientIdentifier.value);
        });
        log.debug('Filtered incomplete pids', inspect(patientIdentifiers));
        return callback(null, patientIdentifiers);
    });
}

function loadRule() {
    return rapidFire;
}

module.exports = loadRule;