/**
 * Created by alexluong on 4/29/15.
 */

'use strict';

var _ = require('lodash');
var rdk = require('../rdk/rdk');
var http = rdk.utils.http;
var auditUtil = require('../../rdk/utils/audit/auditUtil');
var util = require('util');
var vistaSites = require('../config/config').vistaSites;

/**
 * Requires 'pid' parameter as icn|dfn|siteDfn
 * Uses jds jpid to convert: /vpr/jpid/:pid
 * Builds req.interceptorResults.patientIdentifiers with the corresponding pids for the CURRENT SITE
 *     => { icn, siteDfn|siteEdipi, dfn|edipi }
 * Recommended interceptor order: after 'synchronize' - jpid is only populated for a patient when the patient is synchronized
 */

module.exports = function(req, res, next) {
    req.logger.info('convertPid interceptor invoked');

    var pid = req.param('pid') || req.param('dfn');  // todo: just pid after resource parameter standardization

    req.audit.logCategory = 'SEARCH';
    auditUtil.addAdditionalMessage(req, 'searchCriteriaPid', util.format('pid=%s', pid));

    var jdsResource = '/vpr/jpid';
    if (isIcn(pid)) {
        req.logger.debug('jpid search: using icn');
    } else if (isSiteDfn(pid)) {
        req.logger.debug('jpid search: using pid (site;dfn)');
    } else if (isDfn(pid)) {
        pid = req.session.user.site + ';' + pid;
        req.logger.debug('jpid search: using pid (site;dfn)');
    } else {
        req.logger.debug('jpid search: pid or icn not detected. using pid');
    }
    var jdsPath = jdsResource + '/' + pid;
    var options = _.extend({}, req.app.config.jdsServer, {
        path: jdsPath,
        method: 'GET'
    });
    var httpConfig = {
        protocol: 'http',
        timeoutMillis: 120000,
        logger: req.logger,
        options: options
    };

    req.logger.info('performing search using pid [%s]', pid);
    http.fetch(httpConfig, function(error, result) {
        if (error) {
            req.logger.error('Error performing search', (error.message || error));
            return res.status(rdk.httpstatus.internal_server_error).send('There was an error performing pid search for your request. The error has been logged.');
        }
        try {
            result = JSON.parse(result);
        } catch (e) {
            req.logger.error(e);
            return res.status(rdk.httpstatus.internal_server_error).send('Invalid JSON.');
        }

        var patientIdentifiers = result.patientIdentifiers;
        if (!patientIdentifiers) {
            req.logger.error('pid search failed for [%s] - pid may be invalid', pid);
            return res.status(rdk.httpstatus.bad_request).send('[' + pid + '] - pid may be invalid.');
        }

        req.interceptorResults.patientIdentifiers = {};
        _.each(patientIdentifiers, function(pid) {
            if (isIcn(pid)) {
                req.interceptorResults.patientIdentifiers.icn = pid;
            } else if (isSiteDfn(pid) && isCurrentSite(req.session.user.site, pid)) {
                req.interceptorResults.patientIdentifiers.siteDfn = pid;
                req.interceptorResults.patientIdentifiers.dfn = pid.split(';')[1];
            } else if (isSiteEdipi(pid) && isCurrentSite(req.session.user.site, pid)) {
                req.interceptorResults.patientIdentifiers.siteEdipi = pid;
                req.interceptorResults.patientIdentifiers.edipi = pid.split(';')[1];
            }
        });
        req.logger.debug(req.interceptorResults.patientIdentifiers);

        next();
    });
};

// todo: centralize these functions to a common location and remove duplicates from pid resource
function containsSite(pid) {
    return pid.indexOf(';') !== -1;
}
function isCurrentSite(currentSite, pid) {
    return pid.split(';')[0] === currentSite;
}
function isPrimarySite(pid) {
    return vistaSites[pid.split(';')[0]];
}

var icnRegex = /^\d+V\d+$/;
var dfnRegex = /^\d+$/;
function isIcn(pid) {
    return !containsSite(pid) && icnRegex.test(pid);
}
function isDfn(pid) {
    return !containsSite(pid) && dfnRegex.test(pid);
}
function isSiteIcn(pid) {
    return containsSite(pid) && icnRegex.test(pid.split(';')[1]);
}
function isSiteDfn(pid) {
    return containsSite(pid) && dfnRegex.test(pid.split(';')[1]);
}
function isSiteEdipi(pid) {
    return containsSite(pid) && !isPrimarySite(pid) && !isSiteIcn(pid);
}
