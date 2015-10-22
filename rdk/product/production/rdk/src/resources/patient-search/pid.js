'use strict';

var rdk = require('../../core/rdk');
var httpUtil = rdk.utils.http;
var util = require('util');
var querystring = require('querystring');
var _ = require('underscore');
var auditUtil = require('../../utils/audit');
var pidValidator = require('../../utils/pid-validator');

module.exports = performPatientSearch;
module.exports.parameters = {
    get: {
        pid: {
            required: true
        }
    }
};

module.exports.apiDocs = {
    spec: {
        summary: 'Search for a patient by pid',
        notes: '',
        parameters: [
            rdk.docs.commonParams.pid
        ],
        responseMessages: []
    }
};

function performPatientSearch(req, res, next) {
    req.audit.logCategory = 'SEARCH';

    var pid = req.param('pid');
    if (!pid) {
        return next();
    }

    auditUtil.addAdditionalMessage(req, 'searchCriteriaPid', util.format('pid=%s', pid));

    var jdsResource;
    if (pidValidator.isIcn(pid)) {
        req.logger.debug('single patient search: using icn');
        jdsResource = '/data/index/pt-select-icn';
    } else if (pidValidator.isSiteDfn(pid)) {
        req.logger.debug('single patient search: using site;dfn');
        jdsResource = '/data/index/pt-select-pid';
    } else {
        req.logger.debug('single patient search: pid or icn not detected. using pid');
        jdsResource = '/data/index/pt-select-pid';
    }
    var jdsQuery = {
        range: '"' + pid + '"'
    };
    jdsQuery = querystring.stringify(jdsQuery);
    var jdsPath = jdsResource + '?' + jdsQuery;

    var options = _.extend({}, req.app.config.jdsServer, {
        path: jdsPath,
        method: 'GET'
    });
    var httpConfig = {
        protocol: 'http',
        logger: req.logger,
        options: options
    };

    req.logger.info('performing search using pid [%s]', pid);
    httpUtil.fetch(req.app.config, httpConfig, function(error, result) {
        if (error) {
            req.logger.error('Error performing search', (error.message || error));
            return res.status(500).rdkSend('There was an error processing your request. The error has been logged.');
        }
        try {
            result = JSON.parse(result);
        } catch (e) {
            req.logger.error(e);
            return res.status(500).rdkSend('There was an error processing your request. The error has been logged.');
        }
        return res.rdkSend(result);
    });
}
