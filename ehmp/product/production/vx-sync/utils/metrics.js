'use strict';

var path = require('path');
var bunyan = require('bunyan');
var _ = require('underscore');
var uidUtil = require(global.VX_UTILS + 'uid-utils');
var pidUtil = require(global.VX_UTILS + 'patient-identifier-utils');
var inspect = require('util').inspect;

var LOG_LEVEL_VALUES = {
    TRACE: 10,
    DEBUG: 20,
    INFO: 30,
    WARN: 40,
    ERROR: 40,
    FATAL: 60,
    NONE: 1000
};

function Metrics(config){
    this.config = config;
    this.logLevel = config.metrics[0].level;
    switch(config.type) {
        case 'log':
         /*fall through*/
        default:
            this.output = new LogFile(config.metrics);
    }
}

Metrics.prototype.fatal = function(message, object) {
    this.log(LOG_LEVEL_VALUES.FATAL, arguments);
};
Metrics.prototype.error = function(message, object) {
    this.log(LOG_LEVEL_VALUES.ERROR, arguments);
};
Metrics.prototype.warn = function(message, object) {
    this.log(LOG_LEVEL_VALUES.WARN, arguments);
};
Metrics.prototype.info = function(message, object) {
    this.log(LOG_LEVEL_VALUES.INFO, arguments);
};
Metrics.prototype.debug = function(message, object) {
    this.log(LOG_LEVEL_VALUES.DEBUG, arguments);
};
Metrics.prototype.trace = function(message, object) {
    this.log(LOG_LEVEL_VALUES.TRACE, arguments);
};

Metrics.prototype.log = function(level, attributes) {
    if(level <= this.logLevel) {
        return;
    }
    var message;
    var formattedMsg;
    if(attributes) {
        if(attributes['1']) {
            if(_.isString(attributes['0'])) {
                message = attributes['0'];
            }
            formattedMsg = this._formatRecord(attributes['1']);
            formattedMsg.message = message;
        } else {
            formattedMsg = attributes['0'];
        }
    } else {
        formattedMsg = attributes;
    }

    if(level <= LOG_LEVEL_VALUES.TRACE) {
        this.output.trace(formattedMsg, message);
    } else if(level <= LOG_LEVEL_VALUES.DEBUG) {
        this.output.debug(formattedMsg, message);
    } else if(level <= LOG_LEVEL_VALUES.INFO) {
        this.output.info(formattedMsg, message);
    } else if(level <= LOG_LEVEL_VALUES.WARN) {
        this.output.warn(formattedMsg, message);
    } else if(level <= LOG_LEVEL_VALUES.ERROR) {
        this.output.error(formattedMsg, message);
    } else if(level <= LOG_LEVEL_VALUES.FATAL) {
        this.output.fatal(formattedMsg, message);
    }
    //else ignore
};

Metrics.prototype._formatRecord = function(attributes) {
    var message = {};
    if(_.isArray(attributes)) {
        var filteredObj = _.pick(attributes, 'jpid','pid','jobId','rootJobId','tubeName','jobType','site','uid','domain','action','handler','subsystem','process', 'timer');
        _.each(filteredObj, function(value, key){
            if(!_.isUndefined(value) && value !== null) {
                message[key] = value;
            }
        });
    } else {
        message = attributes;
    }
    message.timestamp = _.now();
    //if has UID, fill in missing domain, site
    if(message.uid && !(message.domain && message.site && message.pid)) {
        var uidParts = uidUtil.extractPiecesFromUID(message.uid);
        message.domain = uidParts.domain;
        message.site = uidParts.site;
        message.pid = uidParts.site + ';'+uidParts.patient;
    }
    //if has PID fill in site if possible
    if(message.pid && !message.site) {
        var pidParts = pidUtil.extractPiecesFromPid(message.pid);
        if(pidParts.site) {
            message.site = pidParts.site;
        }
    }
    return message;
};


function LogFile(config){
    this.defaultLog = bunyan.createLogger({
        name: 'Logger',
        level: 'error'
    });
    this.loggers = {'metrics':this.defaultLog};
    this.initialize(config);
}

LogFile.prototype.trace = function(){
    this.loggers.metrics.trace.apply(this.loggers.metrics, arguments);
};
LogFile.prototype.debug = function(){
    this.loggers.metrics.debug.apply(this.loggers.metrics, arguments);
};
LogFile.prototype.info = function(){
    this.loggers.metrics.info.apply(this.loggers.metrics, arguments);
};
LogFile.prototype.warn = function(){
    this.loggers.metrics.warn.apply(this.loggers.metrics, arguments);
};
LogFile.prototype.error = function(){
    this.loggers.metrics.error.apply(this.loggers.metrics, arguments);
};
LogFile.prototype.fatal = function(){
    this.loggers.metrics.fatal.apply(this.loggers.metrics, arguments);
};
LogFile.prototype.initialize = function(loggerConfigurations) {
    var self = this;
    self.convertStreamConfigsToStreams(loggerConfigurations);

    if (_.isEmpty(this.loggers.metrics)) {
        var rootLog = self.defaultLog.child;
        rootLog.fields.name = 'metrics';
        self.loggers.metrics = rootLog;
    }
};

LogFile.prototype.convertStreamConfigsToStreams = function(loggerConfigurations) {
    var self = this;
    _.each(loggerConfigurations, function(singleLoggerConfig) {
        self.convertStreamConfigEntryToStreams(singleLoggerConfig);
        var newLogger = bunyan.createLogger(singleLoggerConfig);
        self.loggers = self.loggers || {};          //This doesn't appear to be the same object as the constrcutor
        self.loggers[singleLoggerConfig.name] = newLogger;
    });
};

/*
Convert configuration settings of 'process.stdout' and 'process.stderr'
to reference the actual streams.
*/
LogFile.prototype.convertStreamConfigEntryToStreams = function(singleLoggerConfig) {
    var self = this;
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
            self.convertFilenames(singleLoggerConfig, '', '-' + process.env.VXSYNC_LOG_SUFFIX);
        }
        self.convertFilenames(singleLoggerConfig, '', '-metrics');
    });
};

LogFile.prototype.convertFilenames = function(singleLoggerConfig, prefix, suffix) {
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
};

module.exports = Metrics;