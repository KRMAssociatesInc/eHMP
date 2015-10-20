'use strict';

var rdk = require('../../core/rdk');
var _ = require('underscore');
var querystring = require('querystring');
var jdsFilter = require('jds-filter');
var nullchecker = rdk.utils.nullchecker;
var httpUtil = rdk.utils.http;
var maskPtSelectSsn = require('./search-mask-ssn').maskPtSelectSsn;

module.exports = performPatientLast5Search;
module.exports.parameters = {
    get: {
        last5: {
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
        }
    }
};

module.exports.apiDocs = {
    spec: {
        summary: 'Search for a patient by last5: first letter of last name + last 4 digits of SSN',
        notes: '',
        parameters: [
            rdk.docs.swagger.paramTypes.query('last5', 'first letter of last name + last 4 digits of SSN', 'string', true),  // TODO: use param with pattern
            rdk.docs.commonParams.jds.start,
            rdk.docs.commonParams.jds.limit,
            rdk.docs.commonParams.jds.order
        ],
        responseMessages: []
    }
};

// http://localhost:8888/patient-search/last5/B0008
function performPatientLast5Search(req, res, next) {
    req.audit.logCategory = 'RETRIEVE';

    var jdsServer = req.app.config.jdsServer;
    var last5 = req.param('last5');
    var start = req.param('start') || 0;
    var limit = req.param('limit');
    var order = req.query.order;

    if(nullchecker.isNullish(last5)) {
        return next();  // require path
    }
    if (!last5.match(/\w\d{4}/)) {  // return 0 results on invalid format for tests and UI compatibility
        return res.rdkSend({
            'data': {
                'updated': 0,
                'totalItems': 0,
                'currentItemCount': 0,
                'items': []
            }
        });
    }

    var jdsResource = '/data/index/pt-select-last5';
    var jdsQuery = {
        start: start,
        range: '"' + last5 + '"'
    };
    if(limit) {
        jdsQuery.limit = limit;
    }
    if(order) {
        jdsQuery.order = order;
    }
    var jdsSiteSelector = req.session.user.site + '%';
    jdsQuery.filter = jdsFilter.build([ ['ilike', 'pid', jdsSiteSelector] ]);

    jdsQuery = querystring.stringify(jdsQuery);
    var options = _.extend({}, jdsServer, {
        method: 'GET',
        // path: encodeURI('/vpr/all/find/patient?filter=eq(last5,"' + last5 + '")')
        path: jdsResource + '?' + jdsQuery
    });
    var config = {
        options: options,
        protocol: 'http',
        logger: req.logger
    };
    httpUtil.fetch(req.app.config, config,
        function(err, data, statusCode) {
            if(err) {
                return res.status(500).rdkSend(err);
            }
            data = JSON.parse(data);
            data = maskPtSelectSsn(data);
            res.status(statusCode).rdkSend(data);
        }
    );
}
