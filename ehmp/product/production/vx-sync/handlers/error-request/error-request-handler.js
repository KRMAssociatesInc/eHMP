'use strict';

var _ = require('underscore');
var async = require('async');

var writers;

function handle(log, config, environment, job, handlerCallback) {
    log.debug('error-request-handler.handle(): received error record', job);

    if (!config || !config['error-handling'] || _.isEmpty(config['error-handling'].writers)) {
        log.error('No error-handling writers configured');
        return setTimeout(handlerCallback, 0, null, 'success');
    }

    if (!writers) {
        writers = {};

        _.each(config['error-handling'].writers, function(writer) {
            writers[writer] = require('./' + writer).createErrorRecordWriter(config);
        });
    }

    var tasks = _.map(writers, function(writer) {
        return writer.bind(null, job);
    });

    async.parallel(tasks, function(error) {
        if (error) {
            log.error('Unable to write Error Record %j, %j', error, job);
        }

        // Always send back 'success', otherwise, a recursive situation
        // will occur, causing error records to be written with error
        // records in them.
        handlerCallback(null, 'success');
    });
}

module.exports = handle;
