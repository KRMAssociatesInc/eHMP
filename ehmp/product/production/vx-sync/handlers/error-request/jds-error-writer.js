'use strict';

require('../../env-setup');

var _ = require('underscore');

var logUtil = require(global.VX_UTILS + 'log');
var Metrics = require(global.VX_UTILS + 'metrics');
var JdsClient = require(global.VX_SUBSYSTEMS + 'jds/jds-client');

function writeErrorRecord(jds, errorRecord, callback) {
    callback = _.isFunction(callback) ? callback : function() {};

    // these are necessary for searching via JDS filter
    if (_.has(errorRecord, 'job')) {
        errorRecord.jobJpid = errorRecord.job.jpid;
        errorRecord.jobType = errorRecord.job.type;

        if (_.has(errorRecord.job, 'patientIdentifier')) {
            errorRecord.patientIdentifierType = errorRecord.job.patientIdentifier.type;
            errorRecord.patientIdentifierValue = errorRecord.job.patientIdentifier.value;
        }
    } else if (_.has(errorRecord, 'patientIdentifier')) {
        errorRecord.patientIdentifierType = errorRecord.patientIdentifier.type;
        errorRecord.patientIdentifierValue = errorRecord.patientIdentifier.value;
    }

    jds.addErrorRecord(errorRecord, callback);
}

/*
Variadic Function:
createErrorRecordWriter(config)
createErrorRecordWriter(logger, config)

Use this function to create an error record writer bound
to the given configuration.

logger should be a bunyan logger object.
config should be worker-config.json 'config' object.
*/
function createErrorRecordWriter(logger, config) {
    if (arguments.length === 1) {
        config = arguments[0];
        logUtil.initialize(config.loggers);
        logger = logUtil.get('jds-error-writer');
    }

    var metrics = new Metrics(config);
    var jdsClient = new JdsClient(logger, metrics, config);


    return writeErrorRecord.bind(null, jdsClient);
}

module.exports.writeErrorRecord = writeErrorRecord;
module.exports.createErrorRecordWriter = createErrorRecordWriter;