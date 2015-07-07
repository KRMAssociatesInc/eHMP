/*jslint node: true */
'use strict';

var bunyan = require('bunyan');
var _ = require('underscore');

module.exports = function(loggerConfigurations) {
    var loggers = {};

    function createLogger(singleLoggerConfig) {
        var newLogger = bunyan.createLogger(singleLoggerConfig);
        loggers[singleLoggerConfig.name] = newLogger;
    }

    // create a default 'root'
    // createLogger({
    //     name: 'root',
    //     level: 'info'
    // });

    _.each(loggerConfigurations.loggers, function(singleLoggerConfig) {
        createLogger(singleLoggerConfig);
    });

    return {
        get: function(name) {
            return loggers[name];
        },

        // this should take a configuration for
        // a bunyan logger, if it fails, it won't
        // overwrite a previous working logger 
        // by the same name
        create: function(singleLoggerConfig) {
            return createLogger(singleLoggerConfig);
        },

        getNames: function() {
            return _.map(loggers, function(value, key) {
                return key;
            });
        }
    };
};
