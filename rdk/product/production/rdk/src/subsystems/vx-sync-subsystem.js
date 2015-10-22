'use strict';

var _ = require('underscore');
var rdk = require('../core/rdk');
var http = rdk.utils.http;

function getSubsystemConfig(app) {
    return {
        healthcheck: {
            name: 'vxSync',
            interval: 100000,
            check: function(callback){
                 //  console.log(1);
                 var vxSyncOptions = _.extend({}, app.config.vxSyncServer, {
                    path: '/ping',
                    method: 'GET'
                });
                //console.log(2);
                var vxSyncConfig = {
                    timeoutMillis: 5000,
                    protocol: 'http',
                    options: vxSyncOptions
                };

                http.fetch(app.config, vxSyncConfig, function(err) {
                 //  console.log(3);
                    if(err) {
                        // do stuff to handle error or pass it up
                        return callback(false);
                    }
                    // do stuff to handle success
                    callback(true);
                });
            }
        }
    };
}

module.exports.getSubsystemConfig = getSubsystemConfig;
