/*jslint node: true */
'use strict';

module.exports = {
    LoggerService: {
        host: '10.2.2.49',
        port: '3000',
        responsepath: '/api/logresponse',
        requestpath: '/api/logrequest',
        method: 'POST'
    },
    MetricListener: {
        host: '10.2.2.49',
        port: '3001',
        path: '/metric'
    }
};
