'use strict';

var _ = require('lodash');
var RpcClient = require(global.OSYNC_VISTAJS + 'RpcClient').RpcClient;
//var jobUtil = require(global.OSYNC_UTILS + 'job-utils');
var nullUtils = require(global.OSYNC_UTILS + 'null-utils');
var parseRpcResponsePatientList = require(global.OSYNC_UTILS + 'patient-sync-utils').parseRpcResponsePatientList;

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
 * Takes a job and validates all of the fields of that job to make sure it's a valid one.<br/>
 * Examples: job type and source are correct, patients exist and have correct identifiers.
 *
 * @param log The logger.
 * @param job The job to validate.
 * @param handlerCallback The callback method you want invoked if an error occurs
 * @returns {boolean} True if no errors exist with job.
 */
function validate(log, job, handlerCallback) {
    // make sure we have the correct jobtype
    if (nullUtils.isNullish(job.type)) {
        logError(log, 'patientlist.validate: Could not find job type', handlerCallback);
        return false;
    }
    //log.debug('Job Type exists');

    //Make sure the job sent to us is an patientlist
    if (job.type !== 'patientlist') {
        logError(log, 'patientlist.validate: job type was not patientlist', handlerCallback);
        return false;
    }
    //log.debug('Job type is patientlist');

    return true;
}

/**
 * Takes an individual entry in the configuration and makes sure it exists.
 *
 * @param log The logger.
 * @param configEntry The configuration entry to check.
 * @param configEntryString A String representation of the configEntry - to present to user if there's an error.
 * @param handlerCallback The callback method you want invoked if an error occurs
 * @returns {boolean} True if no errors exist with config entry.
 */
function validateConfigEntry(log, configEntry, configEntryString, handlerCallback) {
    //Make sure we have the correct Job Type
    if (nullUtils.isNullish(configEntry)) {
        logError(log, 'patientlist.validateConfigEntry: ' + configEntryString + ' cannot be null', handlerCallback);
        return false;
    }
    if (_.isString(configEntry) && _.isEmpty(configEntry)) {
        logError(log, 'patientlist.validateConfigEntry: ' + configEntryString + ' cannot be empty', handlerCallback);
        return false;
    }
    return true;
}

/**
 * Takes the config and validates all of the fields of that config to make sure it's a valid one.<br/>
 *
 * @param log The logger.
 * @param config The config to validate
 * @param handlerCallback The callback method you want invoked if an error occurs
 * @returns {boolean} True if no errors exist with config.
 */
function validateConfig(log, config, handlerCallback) {
    if (validateConfigEntry(log, config, "config", handlerCallback) === false)
        return false;
    if (validateConfigEntry(log, config.patientListRequest, "config.patientListRequest", handlerCallback) === false)
        return false;
    if (validateConfigEntry(log, config.patientListRequest.context, "config.patientListRequest.context", handlerCallback) === false)
        return false;
    if (validateConfigEntry(log, config.patientListRequest.host, "config.patientListRequest.host", handlerCallback) === false)
        return false;
    if (validateConfigEntry(log, config.patientListRequest.port, "config.patientListRequest.port", handlerCallback) === false)
        return false;
    if (validateConfigEntry(log, config.patientListRequest.accessCode, "config.patientListRequest.accessCode", handlerCallback) === false)
        return false;
    if (validateConfigEntry(log, config.patientListRequest.verifyCode, "config.patientListRequest.verifyCode", handlerCallback) === false)
        return false;
    if (validateConfigEntry(log, config.patientListRequest.localIP, "config.patientListRequest.localIP", handlerCallback) === false)
        return false;
    if (validateConfigEntry(log, config.patientListRequest.localAddress, "config.patientListRequest.localAddress", handlerCallback) === false)
        return false;

    return true;
}

function getPatientList(log, startName, result, config, job, handlerCallback) {
    if (validate(log, job, handlerCallback) === false)
        return;
    if (validateConfig(log, config, handlerCallback) === false)
        return;

    RpcClient.callRpc(log, config.patientListRequest, 'ORWPT LIST ALL', startName, '1', function(error, data) {
        if (error) {
            logError(log, 'An error occurred retrieving appointments: ' + error + ", data contained: " + data, handlerCallback);
        }

        if (nullUtils.isNullish(data) === false && _.isEmpty(data) === false) {
            var patients = parseRpcResponsePatientList(data);
console.log(patients[0].name);
            result.patients = result.patients.concat(patients);
            if (patients.length === 44) {
                var localStartName = patients[43].name;
                getPatientList(log, localStartName, result, config, job, handlerCallback);
                return;
            }
        }

        //TODO - Add any publishing to a tube
        handlerCallback(null, result);
    });

}

function handle(log, config, environment, job, handlerCallback) {
    log.debug('patientlist.handle : received request to sync for active users: %s', job);

    var result = {};
    result.type = "validation";
    result.source = "patientlist";
    result.patients = [];
    getPatientList(log, '', result, config, job, handlerCallback);
}

module.exports = handle;
