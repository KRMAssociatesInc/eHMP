'use strict';

require('../env-setup');

var _ = require('underscore');
var async = require('async');
var request = require('request');
var yargs = require('yargs');
var fs = require('fs');

var config = require(global.VX_ROOT + 'worker-config');
var pidUtils = require(global.VX_UTILS + 'patient-identifier-utils');
var log = require('bunyan').createLogger({
    name: 'unsubscribe-patient-util',
    level: 'trace'
});

var argv = parseOptions(log);

var optionConfig = _.clone(config.syncRequestApi);

//Default to using VM sync endpoint
if (!argv.local && !argv.l) {
    optionConfig.host = '10.3.3.6';
}
log.debug('Using sync endpoint location: ', optionConfig.host);

log.info('unsubscribe-patient-util: Starting process...');
getListOfPatients(log, argv, function(err, patients) {
    if (err) {
        log.error(err);
        log.info('unsubscribe-patient-util: Error encountered when reading file.');
        return;
    }

    log.trace('Got list of patients: ', patients);
    log.trace('Now filtering invalid patients...');
    patients = filterInvalidIcnsOrPids(log, patients);

    if (_.isEmpty(patients)) {
        log.error('No valid PIDs or ICNs were provided!');
        return;
    }

    log.info('Unsubscribing patients: ', patients);
    sendUnsubscribeRequests(log, optionConfig, patients, function(error) {
        if (error) {
            log.error(error);
            log.info('unsubscribe-patient-util: Error encountered when unsubscribing.');
        } else {
            log.info('unsubscribe-patient-util: Completed successfully.');
        }
    });
});

function parseOptions(logger) {
    var argv = yargs
        .check(function(args) {
            if ((!args.patient && !args.p && !args.file && !args.f)) {
                logger.error('You must select at least one option. See usage.');
                return false;
            }
            return true;
        })
        .option('p', {
            alias: 'patient',
            describe: 'The pid or icn to unsubscribe. This can appear multiple times and all values will be used. Can be a comma-delimited list.',
            type: 'string'
        })
        .option('f', {
            alias: 'file',
            describe: 'A path to a plain-text file containing a comma or newline delimited list of patient ICNs or PIDs to unsubscribe.',
            type: 'string'
        })
        .option('l', {
            alias: 'local',
            describe: 'Use this option if you are running VX-Sync locally on your machine (as opposed to running the VX-Sync VM).',
            type: 'string'
        })
        .usage('Usage: ./unsubscribe-patients.sh -p <string> -f <string>')
        .argv;

    return argv;
}

function getListOfPatients(logger, argv, callback) {
    logger.trace('getListOfPatients(): entering method...');
    var patientArray = [];
    if (argv.patient) {
        patientArray = patientArray.concat(parsePatients(argv.patient));
        logger.trace('patientArray after extracting patients from \'patient\' argument: ', patientArray);
    }

    if (argv.file) {
        fs.readFile(argv.file, {
            encoding: 'utf8'
        }, function(err, data) {
            if (!err) {
                patientArray = patientArray.concat(parsePatients(data));
                logger.trace('patientArray after extracting patients from file: ', patientArray);
            }
            logger.trace('getListOfPatients(): returning patientArray through callback');
            callback(err, patientArray);
        });
    } else {
        logger.trace('getListOfPatients(): returning patientArray through callback');
        callback(null, patientArray);
    }
}

function parsePatients(patients) {
    if (!_.isArray(patients)) {
        patients = [patients];
    }

    //Separate comma-delimited string of patient ids into array
    patients = _.flatten(_.map(patients, function(patient) {
        return _.without(_.isString(patient) ? _.invoke(patient.split(','), 'trim') : [''], '');
    }));
    //Separate newline-delimited string of patient ids into array
    patients = _.flatten(_.map(patients, function(patient) {
        return _.without(_.isString(patient) ? _.invoke(patient.split('\n'), 'trim') : [''], '');
    }));

    return patients;
}

function filterInvalidIcnsOrPids(logger, ids) {
    return _.filter(ids, function(id) {
        log.trace('_.filter: ', id);
        var isIcn = pidUtils.isIcn(id);
        var isPid = pidUtils.isPid(id);
        log.trace('isIcn', isIcn);
        log.trace('idPid', isPid);
        return isIcn || isPid;
    });
}

function getUnsyncRequest(options, patient) {
    var parameter = (pidUtils.isIcn(patient)) ? 'icn=' + patient : 'pid=' + patient;
    return {
        url: options.protocol + '://' + options.host + ':' + options.port + options.patientUnsyncPath + '?' + parameter,
        method: options.method
    };
}

function sendUnsubscribeRequests(logger, syncReqConfig, patients, callback) {
    async.each(patients, function(patient, stepCallback) {
        var unsyncRequest = getUnsyncRequest(syncReqConfig, patient);
        logger.info('sending unsubscribe request: %s %s', unsyncRequest.method, unsyncRequest.url);
        request(unsyncRequest, function(error, response) {
            if (response) {
                logger.debug('Got response for ' + patient + ' : ' + response.statusCode);
            }
            stepCallback(error);
        });
    }, function(error) {
        callback(error);
    });
}

module.exports._steps = {
    _parsePatients: parsePatients,
    _filterInvalidIcnsOrPids: filterInvalidIcnsOrPids,
    _getUnsyncRequest: getUnsyncRequest
};