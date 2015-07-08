'use strict';

var _ = require('lodash');
var errorUtil = require(global.OSYNC_UTILS + 'error');
var RpcClient = require(global.OSYNC_VISTAJS + 'RpcClient').RpcClient;
var nullUtils = require(global.OSYNC_UTILS + 'null-utils');
var jobUtil = require(global.OSYNC_UTILS + 'job-utils');
var parseRpcResponseAppointments = require(global.OSYNC_UTILS + 'patient-sync-utils').parseRpcResponseAppointments;


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
   // log.error("ERROR: " + errorMsg);
   // handlerCallback("ERROR: " + errorMsg);
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
        logError(log, 'appointment-request.validate: Could not find job type', handlerCallback);
        return false;
    }
   // log.debug('Job Type exists');

    //Make sure the job sent to us is an appointment-request
    if (job.type !== 'appointment-request') {
        logError(log, 'appointment-request.validate: job type was not appointment-request', handlerCallback);
        return false;
    }
   // log.debug('Job type is admission-request');

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
        logError(log, 'appointment-request.validateConfigEntry: ' + configEntryString + ' cannot be null', handlerCallback);
        return false;
    }
    if (_.isString(configEntry) && _.isEmpty(configEntry)) {
        logError(log, 'appointment-request.validateConfigEntry: ' + configEntryString + ' cannot be empty', handlerCallback);
        return false;
    }
    return true;
}

/**
 * Takes the config and validates all of the fields of that config to make sure it's a valid one.
 *
 * @param log The logger.
 * @param config The config to validate
 * @param handlerCallback The callback method you want invoked if an error occurs
 * @returns {boolean} True if no errors exist with config.
 */
function validateConfig(log, config, handlerCallback) {
    if (validateConfigEntry(log, config, "config", handlerCallback) === false)
        return false;
    if (validateConfigEntry(log, config.appointmentRequest, "config.appointmentRequest", handlerCallback) === false)
        return false;

    if (validateConfigEntry(log, config.appointmentRequest.context, "config.appointmentRequest.context", handlerCallback) === false)
        return false;
    if (validateConfigEntry(log, config.appointmentRequest.host, "config.appointmentRequest.host", handlerCallback) === false)
        return false;
    if (validateConfigEntry(log, config.appointmentRequest.port, "config.appointmentRequest.port", handlerCallback) === false)
        return false;
    if (validateConfigEntry(log, config.appointmentRequest.accessCode, "config.appointmentRequest.accessCode", handlerCallback) === false)
        return false;
    if (validateConfigEntry(log, config.appointmentRequest.verifyCode, "config.appointmentRequest.verifyCode", handlerCallback) === false)
        return false;
    if (validateConfigEntry(log, config.appointmentRequest.localIP, "config.appointmentRequest.localIP", handlerCallback) === false)
        return false;
    if (validateConfigEntry(log, config.appointmentRequest.localAddress, "config.appointmentRequest.localAddress", handlerCallback) === false)
        return false;

    if (validateConfigEntry(log, config.appointmentRequest.appointments, "config.appointmentRequest.appointments", handlerCallback) === false)
        return false;
    if (validateConfigEntry(log, config.appointmentRequest.appointments.startDate, "config.appointmentRequest.appointments.startDate", handlerCallback) === false)
        return false;
    if (validateConfigEntry(log, config.appointmentRequest.appointments.endDate, "config.appointmentRequest.appointments.endDate", handlerCallback) === false)
        return false;

    return true;
}

/**
 * Will return an array of patients that will include their
 * DFN^DATE of event (appt or admit)^location name^location IEN
 *
 * @param log
 * @param config
 * @param environment
 * @param job
 * @param handlerCallback
 * @returns {*}
 */
function handle(log, config, environment, job, handlerCallback) {
    log.debug('appointment-request.handle : received request to save %s', JSON.stringify(job));

    if (validate(log, job, handlerCallback) === false)
        return;
    if (validateConfig(log, config, handlerCallback) === false)
        return;

    //per requirements beginning/end date are configurable and will be set in config file
    var startDate = config.appointmentRequest.appointments.startDate;
    var endDate = config.appointmentRequest.appointments.endDate;
    var patients = [];

    var result = {
        source: 'appointments',
        patients: patients
    };

    RpcClient.callRpc(log, config.appointmentRequest, 'HMP PATIENT SCHED SYNC', startDate, endDate, function(error, data) {
    //RpcClient.callRpc(log, config, 'ORWPT APPTLST', '100022', function(error, data) {
        if (error) {
            logError(log, 'An error occurred retrieving appointments: ' + error + ", data contained: " + data, handlerCallback);
        }

        if (nullUtils.isNullish(data) === false && _.isEmpty(data) === false) {
            patients = parseRpcResponseAppointments(data);
        }
        log.debug("***result created " + JSON.stringify(result));

        if (config.inttest === true) {
            handlerCallback(null, result);
        }
        else {
            var jobToPublish = jobUtil.createValidationRequest(log, config, environment, handlerCallback, job, result);

            environment.publisherRouter.publish(jobToPublish, handlerCallback);
        }
    });
}

module.exports = handle;