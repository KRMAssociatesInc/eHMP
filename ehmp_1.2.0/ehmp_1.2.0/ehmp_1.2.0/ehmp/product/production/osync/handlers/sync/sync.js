'use strict';

var _ = require('lodash');
var nullUtil = require(global.OSYNC_UTILS + 'null-utils');
var errorUtil = require(global.OSYNC_UTILS + 'error');
var jobUtil = require(global.OSYNC_UTILS + 'job-utils');
var request = require('request');

/**
 * logs an error using the specified logger and then invokes the callback function.<br/>
 * This was created so there was a central point where I could enable/disable logging to the console quickly.
 *
 * @param log The logger to call log.error with.
 * @param errorMsg The message you want to have logged.
 * @param handlerCallback The callback method you want invoked passing in errorMsg as the first argument.
 */
function logError(log, errorMsg, handlerCallback) {
    console.log("ERROR: " + errorMsg); //Since logger won't print to console, do it here
    log.error("ERROR: " + errorMsg);
    handlerCallback("ERROR: " + errorMsg);
}

/**
 * logs a debug statement for messages that are specific to validating fields.
 *
 * @param log The logger to call log.debug with.
 * @param msg The message you want to have logged.
 */
function logDebugValidate(log, msg) {
    //console.log(msg); //Since logger won't print to console, do it here
    log.debug(msg);
}

/**
 * logs a debug statement
 *
 * @param log The logger to call log.debug with.
 * @param msg The message you want to have logged.
 */
function logDebug(log, msg) {
    //console.log(msg); //Since logger won't print to console, do it here
    log.debug(msg);
}

/**
 * Takes a job and validates all of the fields of that job to make sure it's a valid one.<br/>
 * Examples: job type and source are correct, patients exist and have correct identifiers.
 *
 * @param log The logger.
 * @param job The job to validate.
 * @param handlerCallback The callback method you want invoked if an error occurs
 * @returns {boolean} True if no errors exist with job.
 */
function validate(log, job, handlerCallback) {
    //Make sure we have the correct Job Type
    if (nullUtil.isNullish(job.type)) {
        logError(log, 'sync.validate: Could not find job type', handlerCallback);
        return false;
    }
    logDebugValidate(log, 'Job Type exists');

    if (job.type !== 'sync') {
        logError(log, 'sync.validate: job type was not sync', handlerCallback);
        return false;
    }
    logDebugValidate(log, "Job type is 'sync'");

    //Make sure the source is one of the 3 types we support.
    if (nullUtil.isNullish(job.source)) {
        logError(log, 'sync.validate: Could not find job source', handlerCallback);
        return false;
    }
    logDebugValidate(log, 'Job source exists');

    if (job.source !== "appointments" && job.source !== "admissions" && job.source !== "patient lists") {
        logError(log, 'sync.validate: job source was not "appointments" , "admissions" or "patient lists"', handlerCallback);
        return false;
    }
    logDebugValidate(log, "Job source is '" + job.source + "'");

    //Finally, make sure there are some patients actually in there.
    if (nullUtil.isNullish(job.patients)) {
        logError(log, 'sync.validate: Could not find job patients', handlerCallback);
        return false;
    }
    logDebugValidate(log, 'Job patients exists');

    for (var i = 0; i < job.patients.length; i++) {
        if (nullUtil.isNullish(job.patients[i].ien) && nullUtil.isNullish(job.patients[i].dfn)) {
            logError(log, 'sync.validate: Missing dfn and ien for patient', handlerCallback);
            return false;
        }
    }

    return true;
}

/**
 * Takes the config and validates all of the fields of that config to make sure it's a valid one.<br/>
 * Examples: vxsync.syncUrl, vxsync.numToSyncSimultaneously, and vxsync.waitBetween are all correct.
 *
 * @param log The logger.
 * @param config The config to validate
 * @param handlerCallback The callback method you want invoked if an error occurs
 * @returns {boolean} True if no errors exist with config.
 */
function validateConfig(log, config, handlerCallback) {
    //Make sure we have the correct Job Type
    if (nullUtil.isNullish(config)) {
        logError(log, 'sync.validateConfig: Configuration cannot be null', handlerCallback);
        return false;
    }
    if (nullUtil.isNullish(config.osync.syncUrl)) {
        logError(log, 'sync.validateConfig: osync.syncUrl cannot be null', handlerCallback);
        return false;
    }
    if (nullUtil.isNullish(config.osync.numToSyncSimultaneously)) {
        logError(log, 'sync.validateConfig: osync.numToSyncSimultaneously cannot be null', handlerCallback);
        return false;
    }
    if (config.osync.numToSyncSimultaneously < 2) {
        logError(log, 'sync.validateConfig: osync.numToSyncSimultaneously cannot be less than 2', handlerCallback);
        return false;
    }
    if (nullUtil.isNullish(config.osync.waitBetween)) {
        logError(log, 'sync.validateConfig: osync.waitBetween cannot be null', handlerCallback);
        return false;
    }
    if (config.osync.waitBetween < 1000) {
        logError(log, 'sync.validateConfig: osync.waitBetween cannot be less than 1000', handlerCallback);
        return false;
    }

    return true;
}

/**
 * Validates that the response received from vxsync is a 202 status code.
 *
 * @param log The logger.
 * @param response The response to validate received a 202 status code.
 * @param handlerCallback The callback method you want invoked if an error occurs
 * @returns {boolean} True if no errors exist with config.
 */
function validateSync(log, response, handlerCallback) {
    if (response.statusCode !== 202) {
        logError(log, "sync.validateSync: get didn't return a 202 response: " + response.statusCode + "\nBody: " + response.body, handlerCallback);
        return false;
    }

    return true;
}

/**
 * Syncs a patient with vxsync.
 *
 * @param log The logger.
 * @param syncUrl The url to append the ien to for syncing this patient.
 * @param ien The ien of the patient about to be synced.
 * @param handlerCallback The callback method you want invoked when either an error occurs or processing has finished
 * with syncing this specific patient.  If an error occurs, the first parameter of the callback will be populated with
 * a non-null value.
 */
function syncPatient(log, syncUrl, ien, handlerCallback)
{
    logDebug(log, syncUrl + ien);

    request.get(syncUrl + ien, function(error, response, body) {
        if (validateSync(log, response, handlerCallback) === false)
            return;

        logDebug(log, "Got response: " + response.statusCode + ", for ien " + ien);
        //TODO - Add any publishing to a tube
        handlerCallback(null, body);
    }).on('error', function(error) {
        logError(log, "sync.syncPatient: Got error: " + error, handlerCallback);
    });
}

/**
 * Takes the array of patients and submits them in batches to be sent to vxsync.  It currently does this by using setTimeout
 * to break the entire list of patients into smaller subsets that are spaced apart in time.<br/>
 * For example, suppose we have the scenario of config.vxsync.waitBetween set to 10000 (10 seconds),
 * config.vxsync.numToSyncSimultaneously set to 3 (3 patients sent at a time), and we get a job with 10 patients in it.
 * We will send 3 patients immediately, the next 3 will be scheduled to be sent 10 seconds from now, the next 3 will
 * be scheduled to be sent 20 seconds from now, and the last one will be scheduled to be sent 30 seconds from now.
 *
 * @param log The logger.
 * @param config The configuration for this environment.  Must contain the following 3 values: vxsync.syncUrl, vxsync.numToSyncSimultaneously, and vxsync.waitBetween
 * @param environment Currently unused.
 * @param job Contains an array of patients needing to be synced.
 * @param handlerCallback The callback method you want invoked when either an error occurs or processing has finished
 * with syncing this specific patient.  If an error occurs, the first parameter of the callback will be populated with
 * a non-null value.
 */
function handle(log, config, environment, job, handlerCallback) {
    logDebug(log, 'sync.handle : received request to save ' + job);

    var result;

    if (validate(log, job, handlerCallback) === false)
        return;
    if (validateConfig(log, config, handlerCallback) === false)
        return;

    var patients = job.patients;
    var waitBetween = config.osync.waitBetween;
    var numToSyncSimultaneously = config.osync.numToSyncSimultaneously;
    var syncUrl = config.osync.syncUrl;
    var counter = 0;
    var batchNum = 0;

    _.forEach(patients, function(n) {
        setTimeout(function () {syncPatient(log, syncUrl, n.ien, handlerCallback);}, batchNum * waitBetween);
        if ((++counter) % numToSyncSimultaneously === 0) {
            counter = 0;
            batchNum++;
        }
    });

    var jobToPublish = jobUtil.createStoreJobStatus(log, config, environment, handlerCallback, job);

    environment.publisherRouter.publish(jobToPublish, handlerCallback);
}

module.exports = handle;