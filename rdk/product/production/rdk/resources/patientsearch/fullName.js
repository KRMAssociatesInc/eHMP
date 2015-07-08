'use strict';

var rdk = require('../../rdk/rdk');
var httpUtil = rdk.utils.http;
var util = require('util');
var querystring = require('querystring');
var _ = require('underscore');
var maskPtSelectSsn = require('./searchMaskSsn').maskPtSelectSsn;
var auditUtil = require('../../utils/audit/auditUtil');

module.exports = performPatientSearch;
module.exports.parameters = {
    get: {
        'name.full': {
            required: true,
            regex: /\w\d{4}/,
            description: 'first letter of last name + last 4 digits of SSN'
        },
        start: {
            required: false,
            regex: /\d+/,
            description: 'start showing results from this 0-based index'
        },
        limit: {
            required: false,
            regex: /\d+/,
            description: 'show this many results'
        },
        order: {
            required: false,
            regex: /\w+ (asc|desc)/,
            description: 'Field to sort by and order'
        },
        'rows.max': {
            required: false,
            regex: /\d+/,
            description: 'error if the total number of results exceeds this'
        }
    }
};

module.exports.apiDocs = {
    spec: {
        summary: 'Search for a patient by full name',
        notes: '',
        parameters: [
            rdk.docs.swagger.paramTypes.query('name.full', 'name of patient', 'string', true),
            rdk.docs.commonParams.jds.start,
            rdk.docs.commonParams.jds.limit,
            rdk.docs.commonParams.jds.order,
            rdk.docs.swagger.paramTypes.query('rows.max', 'error if returned item count exceeds this', 'string', false)
        ],
        responseMessages: []
    }
};

function performPatientSearch(req, res, next) {
    var fullName = req.param('name.full');
    var limit = req.param('limit') || req.param('itemsPerPage');
    var start = req.param('start') || req.param('startIndex') || 0;
    var resultsRecordType = req.param('resultsRecordType') || '';
    var order = req.query.order;
    var maxrows = req.query['rows.max'];

    req.audit.logCategory = 'SEARCH';
    auditUtil.addAdditionalMessage(req, 'searchCriteriaFullName', util.format('fullName=%s', fullName));

    if (!fullName) {
        return next();
    }

    fullName = jdsNameWorkaround(fullName);

    var summary = resultsRecordType === 'summary' ? '/summary' : '';
    var jdsResource = '/data/index/pt-select-name' + summary;
    var jdsQuery = {
        start: start,
        range: '"' + fullName + '"*'
    };
    if (limit) {
        jdsQuery.limit = limit;
    }
    if (order) {
        jdsQuery.order = order;
    }
    var jdsSiteSelector = req.session.user.site + '%';
    jdsQuery.filter = rdk.utils.jdsFilter.build([
        ['ilike', 'pid', jdsSiteSelector]
    ]);

    jdsQuery = querystring.stringify(jdsQuery);
    var jdsPath = jdsResource + '?' + jdsQuery;

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

    req.logger.info('performing search using fullName [%s]', fullName);
    httpUtil.fetch(httpConfig, function(error, result) {
        if (error) {
            req.logger.error('Error performing search', (error.message || error));
            return res.send(500, 'There was an error processing your request. The error has been logged.');
        }
        try {
            result = JSON.parse(result);
        } catch (e) {
            req.logger.error(e);
            return res.status(500).send('There was an error processing your request. The error has been logged.');
        }
        if (result.data.currentItemCount > maxrows) {
            return res.send(rdk.httpstatus.not_acceptable, 'Item count exceeds max rows.');
        }
        result = maskPtSelectSsn(result);
        res.send(result);
    });
}

function jdsNameWorkaround(fullName) {
    // DE274: JDS stores patient names without spaces between family and given name.
    // Get rid of spaces after commas to address this.
    var result = fullName.replace(/(,) +/g, '$1');
    return result;
}
