'use strict';

var _ = require('lodash');
var async = require('async');
var errorUtil = require(global.OSYNC_UTILS + 'error');
var nullUtil = require(global.OSYNC_UTILS + 'null-utils');
var jobUtil = require(global.OSYNC_UTILS + 'job-utils');
var jdsUtil = require(global.OSYNC_UTILS + 'jds-utils');

/**
 * logs an error using the specified logger and then invokes the callback function.<br/>
 * This was created so there was a central point where I could enable/disable logging to the console quickly.
 *
 * @param log The logger to call log.error with.
 * @param errorMsg The message you want to have logged.
 * @param callback The callback method you want invoked passing in errorMsg as the first argument.
 */
function logError(log, errorMsg, callback) {
    log.error("ERROR: " + errorMsg);
    callback("ERROR: " + errorMsg);
}

/**
 * logs a debug statement
 *
 * @param log The logger to call log.debug with.
 * @param msg The message you want to have logged.
 */
function logDebug(log, msg) {
    log.debug(msg);
}

/**
 * logs a debug statement
 *
 * @param log The logger to call log.debug with.
 * @param msg The message you want to have logged.
 * @param obj The object you want converted to a JSON String.
 */
function logDebugJSON(log, msg, obj) {
    var output = msg + JSON.stringify(obj);
    logDebug(log, output);
}


/**
 * Takes a job and validates all of the fields of that job to make sure it's a valid one.<br/>
 * Examples: job type and source are correct, patients exist and have correct identifiers.
 *
 * @param log The logger.
 * @param job The job to validate.
 * @param callback The callback method you want invoked if an error occurs
 * @returns {boolean} True if no errors exist with job.
 */
function validate(log, job, callback) {
    //Make sure we have the correct Job Type
    if (nullUtil.isNullish(job.type)) {
        logError(log, 'validation-request.handle: Could not find job type', callback);
        return false;
    }
    if (job.type !== 'validation-request') {
        logError(log, 'validation-request.handle: job type was not validation', callback);
        return false;
    }

    //Make sure the source is one of the 3 types we support.
    if (nullUtil.isNullish(job.source)) {
        logError(log, 'validation-request.handle: Could not find job source', callback);
        return false;
    }
    if (job.source !== "appointments" && job.source !== "admissions" && job.source !== "patient lists") {
        logError(log, 'validation-request.handle: job source was not "appointments" , "admissions" or "patient lists"', callback);
        return false;
    }

    //Finally, make sure there are some patients actually in there.
    if (nullUtil.isNullish(job.patients)) {
        logError(log, 'validation-request.handle: Could not find job patients', callback);
        return false;
    }
    for (var i = 0; i < job.patients.length; i++) {
        if (nullUtil.isNullish(job.patients[i].icn) && nullUtil.isNullish(job.patients[i].dfn)) {
            logError(log, 'Missing dfn and icn for patient', callback);
            return false;
        }
    }

    return true;
}

/**
 * Retrieves JSON from JDS containing the blacklist last saved to JDS.
 *
 * @param log The logger.
 * @param config used to retrieve the URI
 * @param callback function with 2 parameters, the first will be null if no errors occurred.  The 2nd will contain the
 * json returned from the server.
 */
function getBlackListFromJDS(log, config, callback) {
    async.series({
        get: function (cb) {
            jdsUtil.getFromJDS(log, config, "osyncblacklist", cb);
        }
    }, function(error, response) {
        logDebugJSON(log, "response in blacklist .....", response);

        if (error) {
            logError(log, 'An error occurred retrieving blacklist: ' + error + ", response contained: " + JSON.stringify(response), callback);
        }
        else if (response.get.statusCode !== 200) {
            logError(log, 'An ' + response.get.statusCode + ' error occurred retrieving blacklist: ' + error + ", body contained: " + response.get.body, callback);
        }
        else {
            var json = JSON.parse(response.get.body);

            if (nullUtil.isNullish(json) || nullUtil.isNullish(json.patients)) {
                json = JSON.parse('{"_id": "get blacklist", "patients": []}');
            }
            callback(null, json);
        }
    });
}

/**
 * Retrieves JSON from JDS containing the patients synced with JDS that have been synced within the last 48 hours (configurable).
 *
 * @param log The logger.
 * @param config used to retrieve the URI
 * @param callback function with 2 parameters, the first will be null if no errors occurred.  The 2nd will contain the
 * json returned from the server.
 */
function getPatientsSyncedFromJDS(log, config, callback) {

    async.series({
        get: function (cb) {
            jdsUtil.getFromJDS(log, config, "osyncstatus", cb);
        }
    }, function(error, response) {
        if (error) {
            logError(log, 'An error occurred retrieving synclist: ' + error + ", body contained: " + response.get.body, callback);
        }
        else if (response.get.statusCode !== 200) {
            logError(log, 'An ' + response.get.statusCode + ' error occurred retrieving synclist: ' + error + ", body contained: " + response.get.body, callback);
        }
        else {
            var json = JSON.parse(response.get.body);
           // logDebugJSON(log, 'get synclist json: ', json);

            //If the last time we synced was more than 48 hours ago, then we can just send back an empty JSON.
            var syncTime = 1000 * 60 * 60 * 48;
            if (nullUtil.isNullish(config) === false && nullUtil.isNullish(config.jds) === false && nullUtil.isNullish(config.jds.osyncjobfrequency) === false) {
                syncTime = config.jds.osyncjobfrequency;
                logDebug(log, "get synclist updating syncTime from configuration: " + syncTime);
            }
            var utc_timestamp = Date.now() - syncTime;
            var syncDate = null;
            if(nullUtil.isNotNullish(json.patients)) {
                syncDate = new Date(json.patients[json.patients.length - 1].syncDate).getTime();
            }

            if (nullUtil.isNullish(json) || nullUtil.isNullish(json.patients) || nullUtil.isNullish(syncDate) || utc_timestamp > syncDate) {
                json = JSON.parse('{"_id": "osyncjobstatus", "syncDate": "", "source": "", "patients": []}');
            }

            callback(null, json);
        }
    });
}


/**
 * Returns true if the ien or dfn matches any of the entries in arr
 *
 * @param ien The ien you want to see if it exists.
 * @param dfn The dfn you want to see if it exists.
 * @param arr The array to search through.
 * @returns {boolean} true if the ien or dfn matches any of the entries in arr.
 */
function patientExistsIn(log, ien, dfn, arr) {
    for (var i=0; i<arr.length; i++) {
        if ((nullUtil.isNotNullish(ien) && nullUtil.isNotNullish(arr[i].patient.icn) && arr[i].patient.icn === ien ) || (nullUtil.isNotNullish(dfn) && nullUtil.isNotNullish(arr[i].patient.dfn) && arr[i].patient.dfn === dfn)) {
            return true;
        }
    }
    return false;
}

function handle(log, config, environment, job, handlerCallback) {
    log.debug('validation.handle : received request to save' + JSON.stringify(job));

    if (validate(log, job, handlerCallback) === false)
        return;

    var patients = [];


    //Fetch Black list of patients from JDS
    getBlackListFromJDS(log, config, function (error, blacklist) {
        if (error) {
            logError(log, 'getBlackListFromJDS error: ' + error, handlerCallback);
            return;
        }

        //Fetch list of patients synced on previous run from JDS (the ones stored by the Store Job Status Handler) in the last 48 hours (set in configuration)
        getPatientsSyncedFromJDS(log, config, function (error, patientsSynced) {
            if (error) {
                logError(log, 'getPatientsSyncedFromJDS error: ' + error, handlerCallback);
                return;
            }

            _.forEach(job.patients, function(n) {
                var patient = n;
                var add = true;
                //Check to see if patient exists in blacklist, if so skip
                if (patientExistsIn(log, patient.icn, patient.dfn, blacklist.patients))
                    add = false;
                //Check to see if patient in synced list, if so skip
                if (patientExistsIn(log, patient.icn, patient.dfn, patientsSynced.patients))
                    add = false;

                if (add === true)
                    patients.push(patient);
            });

            //Remove any duplicates from resulting list
            patients = _.uniq(patients);

            if (config.inttest === true) {
                handlerCallback(null, job);
                return;
            }
            else if (nullUtil.isNullish(patients) || _.isEmpty(patients) === true) {
                logDebug(log, 'There are no patients to sync of job type ' + job.source);
                handlerCallback(null, job);
                return;
            }
            else {
                handlerCallback(null, job);
                //Create job for sync handler, passing remaining patients with payload
                job.patients = patients;
                var jobToPublish = jobUtil.createSync(log, config, environment, handlerCallback, job);

                environment.publisherRouter.publish(jobToPublish, handlerCallback);

                handlerCallback(null, job);
            }

        });
    });
}

module.exports = handle;