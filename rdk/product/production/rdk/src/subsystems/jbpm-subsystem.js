'use strict';

var rdk = require('../core/rdk');
var http = rdk.utils.http;
//var _ = require('underscore');
//var fs = require('fs');

function getSubsystemConfig(app) {
    return {
        healthcheck: {
            name: 'jbpm',
            interval: 100000,
            check: function(callback) {
                var httpConfig = getJBPMHttpConfig(app.config, app.logger);

                // [GET] /history/instances
                // Gets a list of ProcessInstanceLog instances
                // Returns a JaxbHistoryLogList instance that contains a list of JaxbProcessInstanceLog instances
                // This operation responds to pagination parameters

                httpConfig.options.path += app.config.jbpm.healthcheckEndpoint;

                //Add BASIC auth header to rest call
                if (app.config.jbpm.adminUser.username && app.config.jbpm.adminUser.password) {
                    httpConfig = addAuthToConfig(app.config.jbpm.adminUser.username, app.config.jbpm.adminUser.password, httpConfig);
                }

                http.fetch(app.config, httpConfig, function(err, data) {
                    try {
                        data = JSON.parse(data);
                        if (!data || !data.historyLogList) {
                            err = true;
                        }
                    } catch (error) {
                        err = true;
                    }

                    if (err) {
                        return callback(false);
                    }
                    callback(true);
                });
            }
        }
    };
}

function addAuthToConfig(username, password, config) {
    config.options.headers.Authorization = createBasicAuth(username, password);
    return config;
}

function getJBPMHttpConfig(config, logger) {
    var httpConfig = {
        protocol: config.jbpm.protocol,
        logger: logger,
        options: {
            host: config.jbpm.host,
            port: config.jbpm.port,
            method: 'GET',
            path: config.jbpm.apiPath,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Accept': 'application/json'
            }
        }
    };

    // if certs are needed for communication in the future, this should be uncommented
    // var path;
    // if (config.jbpm.options) {
    //     _.extend(httpConfig.options, config.jbpm.options);
    // }
    // try {
    //     if (httpConfig.options.key) {
    //         path = httpConfig.options.key;
    //         httpConfig.options.key = fs.readFileSync(path);
    //     }
    //     if (httpConfig.options.cert) {
    //         path = httpConfig.options.cert;
    //         httpConfig.options.cert = fs.readFileSync(path);
    //     }
    // } catch (e) {
    //     if (logger) {
    //         logger.error('Error reading certificate for JBPM');
    //     } else {
    //         console.log('Error reading certificate information for JBPM');
    //     }
    // }

    return httpConfig;
}

function createBasicAuth(username, password) {
    return 'Basic ' + new Buffer(username + ':' + password).toString('base64');
}

module.exports.getSubsystemConfig = getSubsystemConfig;
module.exports.getJBPMHttpConfig = getJBPMHttpConfig;
module.exports.addAuthToConfig = addAuthToConfig;
