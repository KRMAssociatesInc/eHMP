'use strict';

require('../../env-setup');

var _ = require('underscore');

function writeErrorRecord(error, errorRecord, callback) {
    callback = _.isFunction(callback) ? callback : function() {};

    if (error) {
        return setTimeout(callback, 0, 'error');
    }

    setTimeout(callback);
}

function createErrorRecordWriter(config) {
    return writeErrorRecord.bind(null, config.error);
}

module.exports.writeErrorRecord = writeErrorRecord;
module.exports.createErrorRecordWriter = createErrorRecordWriter;