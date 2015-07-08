'use strict';

var _ = require('lodash');
var request = require('request');
var errorUtil = require(global.OSYNC_UTILS + 'error');
var nullUtil = require(global.OSYNC_UTILS + 'null-utils');
var jobUtil = require(global.OSYNC_UTILS + 'job-utils');

/**
 * logs an error using the specified logger and then invokes the callback function.<br/>
 * This was created so there was a central point where I could enable/disable logging to the console quickly.
 *
 * @param log The logger to call log.error with.
 * @param errorMsg The message you want to have logged.
 * @param callback The callback method you want invoked passing in errorMsg as the first argument.
 */
function logError(log, errorMsg, callback) {
    console.log("ERROR: " + errorMsg); //Since logger won't print to console, do it here
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
    console.log(msg); //Since logger won't print to console, do it here
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
        logError(log, 'validation.handle: Could not find job type', callback);
        return false;
    }
    if (job.type !== 'validation') {
        logError(log, 'validation.handle: job type was not validation', callback);
        return false;
    }

    //Make sure the source is one of the 3 types we support.
    if (nullUtil.isNullish(job.source)) {
        logError(log, 'validation.handle: Could not find job source', callback);
        return false;
    }
    if (job.source !== "appointments" && job.source !== "admissions" && job.source !== "patient lists") {
        logError(log, 'validation.handle: job source was not "appointments" , "admissions" or "patient lists"', callback);
        return false;
    }

    //Finally, make sure there are some patients actually in there.
    if (nullUtil.isNullish(job.patients)) {
        logError(log, 'validation.handle: Could not find job patients', callback);
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
    request(config.jds.getBlackListURI, function (error, response, body) {
        if (error) {
            logError(log, 'An error occurred retrieving blacklist: ' + error + ", body contained: " + body, callback);
        }
        else if (response.statusCode !== 200) {
            logError(log, 'An ' + response.statusCode + ' error occurred retrieving blacklist: ' + error + ", body contained: " + body, callback);
        }
        else {
            logDebug(log, 'get blacklist body: ' + body);

            var json = JSON.parse(body);
            logDebugJSON(log, 'get blacklist json: ', json);
            logDebugJSON(log, 'get blacklist json.patients: ', json.patients);

            if (nullUtil.isNullish(json) || nullUtil.isNullish(json.patients)) {
                json = JSON.parse('{"_id": "get blacklist", "patients": []}');
            }
            callback(null, json);
        }
    });
}

/**
 * Used to post JSON to JDS of the current blacklist of patients.
 *
 * @param log The logger.
 * @param config used to retrieve the URI
 * @param blacklist The current blacklist as retrieved by a call to getBlackListFromJDS.
 * @param patients The additional patients to add to the current blacklist before saving.
 */
function postBlackListToJDS(log, config, blacklist, patients, callback) {
    logDebugJSON(log, 'post blacklist: ', blacklist);
    logDebugJSON(log, 'post blacklist.patients: ', blacklist.patients);

    //Add all of the patients to the existing blacklist.
    _.forEach(patients, function(n) {
        blacklist.patients.push(n);
    });

    var postdata = {};
    postdata._id = "osyncblacklist";
    postdata.patients = _.uniq(blacklist.patients); //Remove duplicate occurrences of patients.

    logDebugJSON(log, 'post blacklist postdata.patients: ', postdata);

    request.post(config.jds.postBlackListURI, postdata, function (error, response, body) {
        if (response.statusCode !== 200) {
            logError(log, "An " + response.statusCode + " error occurred trying to post blacklist to '" + config.jds.postBlackListURI + "': body-: " + body, callback);
        }
        else {
            logDebug(log, "POST of the blacklist was successful");
            callback();
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
    request(config.jds.getPatientSyncURI, function (error, response, body) {
        if (error) {
            logError(log, 'An error occurred retrieving synclist: ' + error + ", body contained: " + body, callback);
        }
        else if (response.statusCode !== 200) {
            logError(log, 'An ' + response.statusCode + ' error occurred retrieving synclist: ' + error + ", body contained: " + body, callback);
        }
        else {
            logDebug(log, 'get synclist body: ' + body);

            var json = JSON.parse(body);
            logDebugJSON(log, 'get synclist json: ', json);
            logDebugJSON(log, 'get synclist json.patients: ', json.patients);

            //If the last time we synced was more than 48 hours ago, then we can just send back an empty JSON.
            var syncTime = 1000*60*60*48;
            if (nullUtil.isNullish(config) === false && nullUtil.isNullish(config.jds) === false && nullUtil.isNullish(config.jds.osyncjobfrequency) === false) {
                syncTime = config.jds.osyncjobfrequency;
                logDebug(log, "get synclist updating syncTime from configuration: " + syncTime);
            }
            var utc_timestamp = Date.now() - syncTime;

            if (nullUtil.isNullish(json) || nullUtil.isNullish(json.patients) || utc_timestamp > json.syncDate) {
                json = JSON.parse('{"_id": "osyncjobstatus", "syncDate": "", "source": "", "patients": []}');
            }

            logDebug(log, "get synclist utc_timestamp: " + utc_timestamp + ", json.syncDate: " + json.syncDate);

            callback(null, json);
        }
    });
}

/**
 * Used to post JSON to JDS of the current synclist of patients (including the current timestamp).
 *
 * @param log The logger.
 * @param config used to retrieve the URI
 * @param source
 * @param synclist The current synclist as retrieved by a call to getPatientsSyncedFromJDS.
 * @param patients The additional patients to add to the current synclist before saving.
 * @returns {boolean} true if no problems occurred saving.
 */
function postPatientsSyncedToJDS(log, config, source, synclist, patients, callback) {
    logDebugJSON(log, 'post synclist: ', synclist);
    logDebugJSON(log, 'post synclist.patients: ', synclist.patients);

    //Add all of the patients to the existing synclist.
    _.forEach(patients, function(n) {
        synclist.patients.push(n);
    });

    var postdata = {};
    postdata._id = "osyncjobstatus";
    postdata.patients = _.uniq(synclist.patients); //Remove duplicate occurrences of patients.
    var utc_timestamp = Date.now();
    postdata.syncDate = utc_timestamp;
    postdata.source = source;

    logDebugJSON(log, "post synclist: ", postdata);
    logDebugJSON(log, 'post synclist postdata.patients: ', postdata.patients);

    request.post(config.jds.postPatientSyncURI, postdata, function (error, response, body) {
        if (response.statusCode !== 200) {
            logError(log, "An " + response.statusCode + " error occurred trying to post synclist to '" + config.jds.postPatientSyncURI + "': body-" + body, callback);
        }
        else {
            logDebug(log, "POST of the synclist was successful");
            callback();
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
function patientExistsIn(ien, dfn, arr) {
    for (var i=0; i<arr.length; i++) {
        if (arr[i].icn === ien || arr[i].dfn === dfn)
            return true;
    }
    return false;
}

function handle(log, config, environment, job, handlerCallback) {
    logDebug(log, 'validation.handle : received request to save');

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
                if (patientExistsIn(patient.icn, patient.dfn, blacklist.patients))
                    add = false;
                //Check to see if patient in synced list, if so skip
                if (patientExistsIn(patient.icn, patient.dfn, patientsSynced.patients))
                    add = false;

                if (add === true)
                    patients.push(patient);
            });

            //Remove any duplicates from resulting list
            patients = _.uniq(patients);

           postBlackListToJDS(log, config, blacklist, patients, function (error) {
               if (error) {
                   logError(log, 'postBlackListToJDS error: ' + error, handlerCallback);
                   return;
               }

               postPatientsSyncedToJDS(log, config, job.source, patientsSynced, patients, function (error) {
                   if (error) {
                       logError(log, 'postPatientsSyncedToJDS error: ' + error, handlerCallback);
                       return;
                   }

                   //Create job for sync handler, passing remaining patients with payload
                   var result = {};
                   result.type = "sync";
                   result.source = job.source;
                   result.patients = patients;

                   //console.log('result.type: ' + result.type);
                   //console.log('result.source: ' + result.source);
                   //console.log('result.patients.length: ' + result.patients.length);
                   //for (i=0; i<result.patients.length; i++)
                   //    console.log('result.patients[' + i + '].id: ' + result.patients[i].id);

                   //TODO - Add any publishing to a tube
                   //handlerCallback(null, result);
                   var jobToPublish = jobUtil.createSync(log, config, environment, handlerCallback, job);

                   environment.publisherRouter.publish(jobToPublish, handlerCallback);
               });
           });
        });
    });
}

module.exports = handle;