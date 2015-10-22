'use strict';

var _ = require('underscore');
var rdk = require('../core/rdk');
var http = rdk.utils.http;

function getSubsystemConfig(app) {
    return {
        healthcheck: {
           name: 'solr',
            interval: 100000,
            check: function(callback){
                   //console.log(1);
                 var solrOptions = _.extend({}, app.config.solrServer, {
                    path: '/#/',
                    method: 'GET'
                });
                //console.log(2);
                var solrConfig = {
                    timeoutMillis: 5000,
                    protocol: 'http',
                    options: solrOptions
                };

                http.fetch(app.config, solrConfig, function(err) {
                  // console.log(3);
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
