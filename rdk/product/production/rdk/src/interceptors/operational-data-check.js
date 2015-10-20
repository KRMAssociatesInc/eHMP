'use strict';

var util = require('util');

var operationDataLoaded = false;

module.exports = function(req, res, next) {
    var config = req.app.config;

    req.logger.info('calling operationalDataCheck() interceptor');

    if ('interceptors' in config && 'operationalDataCheck' in config.interceptors && config.interceptors.operationalDataCheck.disabled) {
        req.logger.warn('operationalDataCheck disabled');
        return next();
    }

    req.app.subsystems.jdsSync.getOperationalStatus(null, req, function(err, result) {
        req.logger.info('operationalDataCheck callback invoked');

        if(operationDataLoaded) {
            req.logger.info('Used cached <true> operationalData value');
            return next();
        }

        if (err || !result) {
            res.status(500).rdkSend('There was an error processing your request. The error has been logged.');
        } else if (!('status' in result) || result.status === 500) {
            req.logger.error('fetchoOperationalStatus error with result: ' + util.inspect(result, {
                depth: null
            }));
            res.status(500).rdkSend('There was an error processing your request. The error and result have been logged.');
        } else {
            if (result.data && result.data.inProgress) {
                req.logger.debug('Operational data not fully synchronized');
                res.status(503).rdkSend('Operational data has not been fully synchronized.');
            } else {
                req.logger.debug('Operational data synchronized - continue');
                operationDataLoaded = true;
                next();
            }
        }
    });
};
