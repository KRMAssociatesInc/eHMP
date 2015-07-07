/*jslint node: true */
'use strict';

var S = require('string');
var _ = require('lodash');

module.exports.loadConfigByCommandLine = function(commandline, defaultConfigFile) {
    var config = require(defaultConfigFile);
    if (commandline.config) {
        var customConfigFile;
        if (S(commandline.config).startsWith('/')) {
            customConfigFile = commandline.config;
        } else {
            customConfigFile = '../' + commandline.config;
        }
        var customConfig = require(customConfigFile);
        config = _.defaults(customConfig, config);
    }
    return config;
};
