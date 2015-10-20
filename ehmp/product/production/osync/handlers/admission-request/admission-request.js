/*jslint node: true */
'use strict';

var _ = require('lodash');
var errorUtil = require(global.OSYNC_UTILS + 'error');
var RpcClient = require(global.OSYNC_VISTAJS + 'RpcClient').RpcClient;
var nullUtils = require(global.OSYNC_UTILS + 'null-utils');
var parseRpcResponseAdmissions = require(global.OSYNC_UTILS + 'patient-sync-utils').parseRpcResponseAdmissions;
var jobUtil = require(global.OSYNC_UTILS + 'job-utils');

/**
 * logs an error using the specified logger and then invokes the callback function.<br/>
 * This was created so there was a central point where I could enable/disable logging to the console quickly.
 *
 * @param log The logger to call log.error with.
 * @param errorMsg The message you want to have logged.
 * @param handlerCallback The callback method you want invoked passing in errorMsg as the first argument.
 */
function logError(log, errorMsg, handlerCallback) {
    //console.log("ERROR: " + errorMsg); //Since logger won't print to console, do it here
    log.error("ERROR: " + errorMsg);
    handlerCallback("ERROR: " + errorMsg);
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
        logError(log, 'admission-request.validateConfigEntry: ' + configEntryString + ' cannot be null', handlerCallback);
        return false;
    }
    if (_.isString(configEntry) && _.isEmpty(configEntry)) {
        logError(log, 'admission-request.validateConfigEntry: ' + configEntryString + ' cannot be empty', handlerCallback);
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
    if (validateConfigEntry(log, config.admissionRequest, "config.admissionRequest", handlerCallback) === false)
        return false;

    if (validateConfigEntry(log, config.admissionRequest.context, "config.admissionRequest.context", handlerCallback) === false)
        return false;
    if (validateConfigEntry(log, config.admissionRequest.host, "config.admissionRequest.host", handlerCallback) === false)
        return false;
    if (validateConfigEntry(log, config.admissionRequest.port, "config.admissionRequest.port", handlerCallback) === false)
        return false;
    if (validateConfigEntry(log, config.admissionRequest.accessCode, "config.admissionRequest.accessCode", handlerCallback) === false)
        return false;
    if (validateConfigEntry(log, config.admissionRequest.verifyCode, "config.admissionRequest.verifyCode", handlerCallback) === false)
        return false;
    if (validateConfigEntry(log, config.admissionRequest.localIP, "config.admissionRequest.localIP", handlerCallback) === false)
        return false;
    if (validateConfigEntry(log, config.admissionRequest.localAddress, "config.admissionRequest.localAddress", handlerCallback) === false)
        return false;

    return true;
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
        logError(log, 'admission-request.validate: Could not find job type', handlerCallback);
        return false;
    }
    //log.debug('Job Type exists');

    //Make sure the job sent to us is an admission-request
    //console.log("job type " + job.type);
    if (job.type !== 'admission-request') {
        logError(log, 'admission-request.validate: job type was not admission-request', handlerCallback);
        return false;
    }
    //log.debug('Job type is admission-request');

    return true;
}

/**
 * Will return an array of patients that will include their
 * DFN^DATE of event (appt or admit)^location name^roomBed^location IEN
 *
 * @param log
 * @param config
 * @param environment
 * @param job
 * @param handlerCallback
 * @returns {*}
 */
function handle(log, config, environment, job, handlerCallback) {
    log.debug('admission-request.handle : received request to save %s', JSON.stringify(job));

    if (validate(log, job, handlerCallback) === false)
        return;
    if (validateConfig(log, config, handlerCallback) === false)
        return;

    var configVistaSites = config.vistaSites;
    var sites = _.keys(configVistaSites);
    log.debug("sites " + JSON.stringify(sites));
    if(_.isArray(sites) && sites.length > 0) {
        _.each(sites, function (site) {
            var admissionRequest = config.admissionRequest;
            admissionRequest.host = configVistaSites[site].host;
            admissionRequest.port = configVistaSites[site].port;

            RpcClient.callRpc(log, admissionRequest, 'HMP PATIENT ADMIT SYNC', '', function (error, data) {
                if (error) {
                    logError(log, 'An error occurred retrieving appointments: ' + error + ", data contained: " + data, handlerCallback);
                }

                var patients = [];

                if (config.inttest === true) {
                    handlerCallback(null, job);
                    return;
                }

                if (nullUtils.isNullish(data) === false && _.isEmpty(data) === false) {
                    patients = parseRpcResponseAdmissions(data);

                    job.source = 'admissions';
                    job.patients = patients;
                    job.siteId = site;
                    var jobToPublish = jobUtil.createValidationRequest(log, config, environment, handlerCallback, job);
                    environment.publisherRouter.publish(jobToPublish, handlerCallback);
                } else {
                    log.debug("There are no admissions to process");
                    handlerCallback(null, job);
                    return;
                }
            });
        });
    }
}

module.exports = handle;