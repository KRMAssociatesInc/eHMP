'use strict';

require('../../env-setup');

var _ = require('underscore');
var format = require('util').format;
var request = require('request');
var inspect = require(global.VX_UTILS + 'inspect');
var errorUtil = require(global.VX_UTILS + 'error');
var logUtil = require(global.VX_UTILS + 'log');
var log, config;

function configure(setLog, setConfig) {
    log = logUtil.getAsChild('jds-client', setLog);
    config = setConfig.jds;
    if (config) {
        config.host = '127.0.0.1';
    }

    return module.exports;
}

function saveSyncStatus(metastamp, callback) {
    log.debug('jds-client-mock.saveSyncStatus()');
    log.debug(inspect(metastamp));
    var path = '/status/sync';

    execute(path, metastamp, callback, 'POST');
}

function getSyncStatus(jpidJson, callback) {
    log.debug('jds-client-mock.getSyncStatus()');
    log.debug(inspect(jpidJson));
    var path = '/status/sync/' + jpidJson.jpid;

    execute(path, jpidJson, callback);
}

function saveJobState(jobState, callback) {
    log.debug('jds-client-mock.saveJobState()');
    log.debug(inspect(jobState));
    var path = '/status/job';

    execute(path, jobState, callback, 'POST');
}

function getJobStatus(job, callback) {
    log.debug('jds-client-mock.getJobStatus()');
    log.debug(inspect(job));
    var path = '/status/job/' + job.jpid;

    execute(path, job, callback);
}

function getPatientIdentifier(job, callback) {
    log.debug('jds-client-mock.getJPID()');
    log.debug(job.patientIdentifier.value);
    var path = '/patientIdentifiers/' + job.patientIdentifier.value;

    execute(path, job, callback);
}

function storePatientIdentifier(job, callback) {
    log.debug('jds-client-mock.storePatientIdentifier()');
    log.debug(job.jpid || 'No JPID provided.');
    var path = '/patientIdentifiers';
    if (typeof job.jpid !== 'undefined') {
        path += '/' + job.jpid;
    }

    execute(path, job, callback, 'POST');
}

function storeOperationalData(operationalData, callback) {
    var path = '/operational/data';

    if (_.isEmpty(operationalData.record)) {
        return callback(errorUtil.createFatal('No record passed in'));
    }

    execute(path, operationalData, callback, 'POST');
}

function storePatientDataFromJob(job, callback) {
    var path = '/patient/data';

    if (_.isEmpty(job.record)) {
        return callback(errorUtil.createFatal('No record passed in job'));
    }

    execute(path, job, callback, 'POST');
}

function execute(path, job, callback, method) {
    log.debug(path);
    log.debug(inspect(job));
    if (_.isEmpty(config)) {
        return callback(errorUtil.createFatal('No value passed for jds configuration'));
    }

    if (_.isEmpty(job)) {
        return callback(errorUtil.createFatal('No job passed to store'));
    }

    var url = format('%s://%s:%s%s', config.protocol, config.host, config.port, path);
    log.info('Invoking JDS: ' + url);

    request({
        url: url,
        method: method || 'GET',
        json: (method === 'POST'?job:undefined)
    }, function(error, response, body) {
        if (error || response.statusCode === 500) {
            log.error('jds-client-mock.execute: Unable to access JDS endpoint: %s %s', method, url);
            log.error(error);

            return callback(response.statusCode, errorUtil.createFatal((error || body || 'Unknown Error')));
        }

        var json;
        try {
            json = (typeof body === 'object')?body:JSON.parse(body);
        } catch (parseError) {
            log.debug('jds-client-mock.execute: Response is not JSON');
            log.debug(parseError);
            log.debug(body);
            json = body;
        }
        callback(response.statusCode, json);
    });
}

module.exports = {
    'configure': configure,
    'saveSyncStatus': saveSyncStatus,
    'getSyncStatus': getSyncStatus,
    'saveJobState': saveJobState,
    'getJobStatus': getJobStatus,
    'getPatientIdentifier': getPatientIdentifier,
    'storePatientIdentifier': storePatientIdentifier,
    'storeOperationalDataFromJob': storeOperationalData,
    'storePatientDataFromJob': storePatientDataFromJob
};
