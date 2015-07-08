/*jslint node: true */
'use strict';

var _ = require('underscore');
var util = require('util');

var operationDataLoaded = false;

module.exports = function(req, res, next) {
    var config = req.app.config;

    req.logger.info('calling operationalDataCheck() interceptor');

    if ('interceptors' in config && 'operationalDataCheck' in config.interceptors && config.interceptors.operationalDataCheck.disabled) {
        req.logger.warn('operationalDataCheck disabled');
        return next();
    }

    var syncConfig = _.clone(config.jdsSync.syncOperationalStatus),
        jds = _.clone(req.app.config.jdsServer);
    syncConfig.options.host = jds.host;
    syncConfig.options.port = jds.port;
    if((req.session.user || {}).site) {
        req.logger.debug('adding primary site information');
        var configPath = syncConfig.options.path;
        if (configPath.indexOf('/',configPath.length-1) !== -1) {
            syncConfig.options.path = configPath + req.session.user.site;
        }
    }
    else {
        req.logger.debug('adding the first site of the config');
        var configPath = syncConfig.options.path;
        if (configPath.indexOf('/',configPath.length-1) !== -1) {
            syncConfig.options.path = configPath + _.keys(config.vistaSites)[0];
        }
    }
    if (req.get('Authorization') !== undefined) {
        syncConfig.headers = {
            Authorization: req.get('Authorization')
        };
    }
    req.logger.debug(syncConfig);
    req.app.subsystems.jdsSync.fetchOperationalStatus(syncConfig, null, req.logger, function(err, result) {
        req.logger.info('operationalDataCheck callback invoked');

        if(operationDataLoaded) {
            req.logger.info('Used cached <true> operationalData value');
            return next();
        }

        if (err || !result) {
            res.send(500, 'There was an error processing your request. The error has been logged.');
        } else if (!('status' in result) || result.status === 500) {
            req.logger.error('fetchoOperationalStatus error with result: ' + util.inspect(result, {
                depth: null
            }));
            res.send(500, 'There was an error processing your request. The error and result have been logged.');
        } else {
            if (result.data && result.data.inProgress) {
                req.logger.debug('Operational data not fully synchronized');
                res.send(503, 'Operational data has not been fully synchronized.');
            } else {
                req.logger.debug('Operational data synchronized - continue');
                operationDataLoaded = true;
                next();
            }
        }
    });
};
