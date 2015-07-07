'use strict';

var rdk = require('../../rdk/rdk');
var _ = require('underscore');
var fs = require('fs');
var http = rdk.utils.http;

function getSubsystemConfig(app) {
    return {
        healthcheck: {
            name: 'mvi',
            interval: 100000,
            check: function(callback) {
                var httpConfig = getMVIHttpConfig(app.config);


                var soapCall = ''; // check with an empty query
                http.post(soapCall, httpConfig, function(err) {
                    if(err) {
                        return callback(false);
                    }
                    callback(true);
                });
            }
        }
    };
}

function getMVIHttpConfig(config, logger){
    var path;
    var httpConfig = {
                    protocol: config.mvi.protocol,
                    logger: logger,
                    options: {
                        hostname: config.mvi.host,
                        port: config.mvi.port,
                        method: 'POST',
                        path: config.mvi.search.path,   // search.path and sync.path are the same in config
                        headers: {
                            'Content-Type': 'text/xml; charset=utf-8'
                        }
                    }
                };
    if(config.mvi.options) {
        _.extend(httpConfig.options, config.mvi.options);
    }
    try {
        if(httpConfig.options.key){
            path = httpConfig.options.key;
            httpConfig.options.key = fs.readFileSync(path);
        }
        if(httpConfig.options.cert) {
            path = httpConfig.options.cert;
            httpConfig.options.cert = fs.readFileSync(path);
        }
    } catch(e) {
        if(logger) {
            logger.error('Error reading certificate for MVI');
        } else {
            console.log('Error reading certificate information for MVI');
        }
    }
    return httpConfig;
}

module.exports.getSubsystemConfig = getSubsystemConfig;
module.exports.getMVIHttpConfig = getMVIHttpConfig;
