'use strict';

var S = require('string');
var _ = require('lodash');

/*
    Support function to load a configuration file.  Currently support both json and javascript files.
 */
module.exports.loadConfigByCommandLine = function(commandline, defaultConfigFile) {
    var config = null;

    if (defaultConfigFile) {
        config = reloadFile(defaultConfigFile);
    }

    if (commandline.config) {
        var customConfigFile = buildFileName(commandline.config);
        var customConfig = reloadFile(customConfigFile);

        config = _.defaults(customConfig, config);
    }
    return config;
};

var reloadFile = function(fileName) {
    delete require.cache[require.resolve(fileName)];
    return require(fileName);
}

var buildFileName = function(configName) {
    return S(configName).startsWith('/') ? configName : '../' + configName;
}
