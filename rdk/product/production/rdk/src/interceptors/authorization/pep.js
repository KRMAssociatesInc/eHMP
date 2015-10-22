'use strict';

var rdk = require('../../core/rdk');
var JsonAuth = require('../../subsystems/pep/json-auth');
var _ = require('underscore');
var interceptor = rdk.utils.interceptor;
var now = require('performance-now');

/**
 * Check for authorization via policy decision point
 *
 * @namespace pep
 * @param {Object} req The request object
 * @param {Object} res The response object
 * @param {Function} next A callback function
 * @return {undefined}
 */
module.exports = function(req, res, next) {

    var config = req.app.config;
    req.audit.sensitive = 'false';
    if (interceptor.isDisabled(config)) {
        req.logger.warn('PEP: pep authorization disabled');
        next();
        return;
    }

    var requestUser = req.session.user || undefined;
    req.logger.info('PEP: pep authorization invoked');
    if (!checkUserPermissions()) {
        res.status(rdk.httpstatus.forbidden).rdkSend(
            'User lacks sufficient permissions for this resource.');
        return;
    }

    function checkUserPermissions() {
        var passed;
        req.logger.info('Required permissions: [ %s ]',
            req._resourceConfigItem.permissions);
        req.logger
            .info('User permissions:     [ %s ]', requestUser.permissions);
        var missingPermissions = _.difference(
            req._resourceConfigItem.permissions, requestUser.permissions);
        if (_.isEmpty(missingPermissions)) {
            req.logger
                .info('User has the required permissions for this resource. Continuing pep...');
            passed = true;
        } else {
            req.logger
                .info('User lacks sufficient permissions for this resource - UNAUTHORIZED');
            passed = false;
        }
        return passed;
    }

    var pepMetricsTiming = {};

    var runPep = function(pepConfig) {
        pepMetricsTiming.path = req.method + ' ' + req.originalUrl;
        pepMetricsTiming.start = now();
        if (_.isUndefined(pepConfig) || pepConfig === false) {
            res.status(rdk.httpstatus.forbidden).rdkSend(
                'Valid PDP rules set is required, ' + pepConfig + ' doesn\'t exist.');
            return;
        }
        var pdp = new JsonAuth();
        pdp.getAuth(req, res, endPep);
    };

    var endPep = function() {
        // Record the ending time
        pepMetricsTiming.end = now();
        pepMetricsTiming.elapsedMilliseconds = pepMetricsTiming.end - pepMetricsTiming.start;
        // Write them in res-server.log file now
        req.logger.info({
            'pep-metrics': pepMetricsTiming
        });
        return next();
    };
    var pepRulesConfig = req._resourceConfigItem.interceptors.pep;
    runPep(pepRulesConfig);
};
