'use strict';

var path = require('path');
var bunyan = require('bunyan');
var _ = require('underscore');

var dummyLog = require('./dummy-logger');

var defaultLog = bunyan.createLogger({
    name: 'Logger',
    level: 'error'
});

var loggers = {};

function getDefaultLog() {
    return defaultLog;
}

function getLoggers() {
    return loggers;
}

function clearLoggers() {
    loggers = {};
}

function createLogger(config) {
    var log = bunyan.createLogger(config);
    loggers[log.fields.name] = log;
    return log;
}

function initialize(loggerConfigurations) {
    defaultLog.debug('initialize logger');
    convertStreamConfigsToStreams(loggerConfigurations);

    if (_.isEmpty(loggers.root)) {
        var rootLog = defaultLog.child;
        rootLog.fields.name = 'root';
        loggers.root = rootLog;
    }

    defaultLog.info('initialized Logger [loggers=%s]', _.keys(loggers).length);

    return module.exports;
}

function convertStreamConfigsToStreams(loggerConfigurations) {
    _.each(loggerConfigurations, function(singleLoggerConfig) {
        convertStreamConfigEntryToStreams(singleLoggerConfig);

        var newLogger = bunyan.createLogger(singleLoggerConfig);
        loggers[singleLoggerConfig.name] = newLogger;
    });
}

/*
Convert configuration settings of 'process.stdout' and 'process.stderr'
to reference the actual streams.
*/
function convertStreamConfigEntryToStreams(singleLoggerConfig) {
    _.each(singleLoggerConfig.streams, function(streamConfigEntry) {
        // this is needed if the config is from a config file
        // need to replace the string 'stout' with the object process.stdout
        if (streamConfigEntry.stream === 'process.stdout') {
            streamConfigEntry.stream = process.stdout;
        }

        if (streamConfigEntry.stream === 'process.stderr') {
            streamConfigEntry.stream = process.stderr;
        }

        if(_.has(process.env, 'VXSYNC_LOG_SUFFIX')) {
            convertFilenames(singleLoggerConfig, '', '-' + process.env.VXSYNC_LOG_SUFFIX);
        }
    });
}

function convertFilenames(singleLoggerConfig, prefix, suffix) {
    prefix = prefix || '';
    suffix = suffix || '';

    var file;
    var parts;
    var newPath;

    _.each(singleLoggerConfig.streams, function(streamConfigEntry) {
        if (streamConfigEntry.path) {
            parts = streamConfigEntry.path.split(path.sep);

            file = parts.pop().split('.');
            newPath = parts.join(path.sep);

            streamConfigEntry.path = (!_.isEmpty(newPath) ? newPath + path.sep : '') + prefix + file[0] + suffix + (!_.isEmpty(file[1]) ? ('.' + file[1]) : '');
        }
    });
}

/*
Variadic Function:
getAsChild(newLogName, parent)
getAsChild(newLogName)

Returns a new log named as a child of the parent log.
The 'parent' param can either be a string (the log name)
or a log. If 'parent' is null or undefined, then 'root'
will be used.
*/
function getAsChild(newLogName, parent) {
    var parentName = getLogName(parent);
    var childName = parentName + '.' + newLogName;

    return get(childName, parentName);
}

/*
Variadic function:
get(logName, prototypeLogName)
get(logName)

Return the requested log. If the log does not
exist, create it named as a child of prototypeLog
or as a child of 'root' if prototype log does
not exist or was not passed to this function
*/
function get(logName, prototypeLogName) {
    logName = getLogName(logName);
    prototypeLogName = getLogName(prototypeLogName);

    if (logName === dummyLog.fields.name || prototypeLogName === dummyLog.fields.name) {
        return dummyLog;
    }

    var requestedLog = loggers[logName];
    if (requestedLog) {
        return requestedLog;
    }

    var prototypeLog = loggers[prototypeLogName] || loggers.root;

    requestedLog = prototypeLog.child();
    requestedLog.fields.name = logName;
    loggers[logName] = requestedLog;

    return requestedLog;
}


function getLogName(log) {
    if (_.isString(log) && !_.isEmpty(log)) {
        return log;
    }

    if (log && log.fields && _.isString(log.fields.name) && !_.isEmpty(log.fields.name)) {
        return log.fields.name;
    }

    return 'root';
}


module.exports.initialize = initialize;
module.exports.get = get;
module.exports.getAsChild = getAsChild;
module.exports._createLogger = createLogger;
module.exports._getDefaultLog = getDefaultLog;
module.exports._getLogName = getLogName;
module.exports._getLoggers = getLoggers;
module.exports._clearLoggers = clearLoggers;
module.exports._convertFilenames = convertFilenames;
module.exports._convertStreamConfigsToStreams = convertStreamConfigsToStreams;
module.exports._convertStreamConfigEntryToStreams = convertStreamConfigEntryToStreams;