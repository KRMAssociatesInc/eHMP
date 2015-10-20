/**
 * Created by alexluong on 4/29/15.
 */

'use strict';

var _ = require('lodash');
var rdk = require('../core/rdk');
var http = rdk.utils.http;
var auditUtil = require('../utils/audit');
var util = require('util');
var nullchecker = rdk.utils.nullchecker;
var pidValidator = require('../utils/pid-validator');

/**
 * Requires 'pid' parameter as icn|dfn|siteDfn
 * Uses jds jpid to convert: /vpr/jpid/:pid
 * Builds req.interceptorResults.patientIdentifiers with the corresponding pids for the CURRENT SITE
 *     => { icn, siteDfn|siteEdipi, dfn|edipi }
 * Recommended interceptor order: after 'synchronize' - jpid is only populated for a patient when the patient is synchronized
 */

module.exports = function(req, res, next) {
    req.logger.info('convertPid interceptor invoked');

    var pid = req.param('pid');
    if (nullchecker.isNullish(pid)) {
        return next();
    }

    req.audit.logCategory = 'SEARCH';
    auditUtil.addAdditionalMessage(req, 'searchCriteriaPid', util.format('pid=%s', pid));

    var jdsResource = '/vpr/jpid';
    if (pidValidator.isDfn(pid)) {
        pid = req.session.user.site + ';' + pid;
    }
    req.logger.info('jpid search using pid [%s]', pid);

    var jdsPath = jdsResource + '/' + pid;
    var options = _.extend({}, req.app.config.jdsServer, {
        path: jdsPath,
        method: 'GET'
    });
    var httpConfig = {
        protocol: 'http',
        logger: req.logger,
        options: options
    };

    req.interceptorResults.patientIdentifiers = {};

    http.fetch(req.app.config, httpConfig, function(error, result) {
        if (error) {
            req.interceptorResults.patientIdentifiers.error = 'Error performing search - ' + error.toString();
            req.logger.debug(req.interceptorResults.patientIdentifiers);
            return next();
        }
        try {
            result = JSON.parse(result);
        } catch (e) {
            req.interceptorResults.patientIdentifiers.error = 'Error parsing JSON in convert-pid.js - ' + e.toString();
            req.logger.debug(req.interceptorResults.patientIdentifiers);
            return next();
        }

        var patientIdentifiers = result.patientIdentifiers;
        if (!patientIdentifiers) {
            req.interceptorResults.patientIdentifiers.error = 'Convert pid failed for ['+pid+'] - pid may be invalid';
            req.logger.debug(req.interceptorResults.patientIdentifiers);
            return next();
        }
        _.each(patientIdentifiers, function(pid) {
            if (pidValidator.isIcn(pid)) {
                req.interceptorResults.patientIdentifiers.icn = pid;
            } else if (pidValidator.isSiteDfn(pid) && pidValidator.isCurrentSite(req.session.user.site, pid)) {
                req.interceptorResults.patientIdentifiers.siteDfn = pid;
                req.interceptorResults.patientIdentifiers.dfn = pid.split(';')[1];
            } else if (pidValidator.isSiteEdipi(pid) && pidValidator.isCurrentSite(req.session.user.site, pid)) {
                req.interceptorResults.patientIdentifiers.siteEdipi = pid;
                req.interceptorResults.patientIdentifiers.edipi = pid.split(';')[1];
            }
        });

        req.logger.debug(req.interceptorResults.patientIdentifiers);
        next();
    });
};
