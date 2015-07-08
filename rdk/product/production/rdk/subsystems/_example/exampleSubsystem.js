'use strict';

var rdk = require('../../rdk/rdk');

module.exports.getSubsystemConfig = getSubsystemConfig;
module.exports.fetchExternalData = fetchExternalData;

function getSubsystemConfig() {
    return {
        healthcheck: {
            name: 'jds',
            interval: 5000,
            check: function(callback) {
                var localConfig = {
                    timeoutMillis: 4000,
                    protocol: 'http',
                    options: {
                        host: '127.0.0.1',
                        port: '8888',
                        path: '/ping',
                        method: 'GET'
                    }
                };
                rdk.utils.http.fetch(localConfig, function(err) {
                    if(err) {
                        return callback(false);
                    }
                    return callback(true);
                });
            }
        }
    };
}

function fetchExternalData(logger, callback) {
    logger.info('Fetching some external data');
    var pretendExternalData = {
        data: 'external'
    };
    var error = null;
    callback(error, pretendExternalData);
}
