'use strict';

var _ = require('underscore');
var rdk = require('../core/rdk');
var http = rdk.utils.http;

function getSubsystemConfig(app) {
    return {
        healthcheck: {
            name: 'jds',
            interval: 100000,
            check: function(callback) {
                var patientrecordOptions = _.extend({}, app.config.jdsServer, {
                    path: '/ping',
                    method: 'GET',
                });
                var patientrecordConfig = {
                    timeoutMillis: 5000,
                    protocol: 'http',
                    options: patientrecordOptions
                };

                http.fetch(app.config, patientrecordConfig, function(err) {
                    if (err) {
                        // do stuff to handle error or pass it up
                        return callback(false);
                    }
                    // do stuff to handle success
                    callback(true);
                });
            },
            dependencies: ['authorization']
        }
    };
}

module.exports.getSubsystemConfig = getSubsystemConfig;
