'use strict';

var format = require('util').format;
var _ = require('underscore');
var bunyan = require('bunyan');
var MongoClient = require('mongodb').MongoClient;

/*
Variadic Function:
write(logger, config, record, callback)
write(config, record, callback)
write(record, callback)

config should have:
    host
    port
    database
    collection

if record is an array, the first value is treated
as the record and the properties of the succeeding
values are added to it
*/
function write(logger, config, record, callback) {
    if (arguments.length === 3) {
        logger = null;
        config = arguments[0];
        record = arguments[1];
        callback = arguments[2];
    } else if (arguments.length === 2) {
        logger = null;
        config = {};
        record = arguments[0];
        callback = arguments[1];
    }

    logger = logger || bunyan.createLogger({
        name: 'mongo',
        level: 'info'
    });
    logger.debug('mongo-writer.write() %j', config);

    if (!record) {
        logger.warn('Record was undefined or null');
        console.trace();
        return setTimeout(callback);
    }

    var values = [];
    if(_.isArray(record)) {
        values = _.rest(record);
        record = _.first(record);
    }

    record = record.toString();

    var mongoConfig = {
        host: config.host || 'localhost',
        port: config.port || '27017',
        database: config.database || 'beanstalk',
        collection: config.collection || 'jobsProcessed'
    };
    var connectString = format('mongodb://%s:%s/%s', mongoConfig.host, mongoConfig.port, mongoConfig.database);

    record = parseRecord(record);
    values.unshift(record);
    record = _.defaults.apply(_, values);

    MongoClient.connect(connectString, function(error, database) {
        if (error) {
            logger.error('mongo-writer.write() error connecting: %j', error);
            return callback(error);
        }

        logger.debug('mongo-writer.write() connected');
        database.collection(mongoConfig.collection).insert(record, function(error) {
            if (error) {
                logger.error('mongo-writer.write() error inserting: %j', error);
                return callback(error);
            }

            logger.debug('mongo-writer.write() record written');
            database.close();
            callback();
            logger.debug('mongo-writer.write() exiting');
        });
    });
}

/*
Variadic Function:
wrapCallback(logger, config, record, callback)
wrapCallback(config, record, callback)
wrapCallback(record, callback)

config should have:
    host
    port
    database
    collection


*/
function wrapCallback(logger, config, record, callback) {
    var startTime = process.hrtime();

    return function processJobCallbackWrapper(error, result) {
        if (!record) {
            return callback(error, result);
        }

        var elapsed = process.hrtime(startTime);
        record.elapsedMillis = (elapsed[0] * 1000) + (elapsed[1] / 1000000);
        record.error = !!error;
        write(logger, config, record, function() {
            callback(error, result);
        });
    };
}

function parseRecord(record) {
    if (_.isString(record)) {
        try {
            record = JSON.parse(record);
        } catch (e) {
            // do nothing
        }
    }

    if (!_.isObject(record)) {
        record = {
            record: record
        };
    }

    return record;
}

module.exports.write = write;
module.exports.wrapCallback = wrapCallback;
