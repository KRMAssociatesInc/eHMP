/*
    Refactor version of labsearchbytype/labsearchbytypeResource.js
 */
'use strict';

var rdk = require('../../core/rdk');
var _ = rdk.utils.underscore;
var querystring = require('querystring');
var Domains = require('./domains');
var nullchecker = rdk.utils.nullchecker;
var httpUtil = rdk.utils.http;
var jdsFilter = require('jds-filter');
var moment = require('moment');

var parameters = {
    get: {
        pid: {
            required: true,
            description: 'patient id'
        },
        type: {
            required: true,
            description: 'the selected type attribute (typeName of lab/vital or name of immunization) Results will always be returned sorted by descending date.'
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
        fromDate: {
            required: false,
            regex: /\d+/,
            description: 'From date which results should be gathered. Anything before this date will not be returned.'
        },
        toDate: {
            required: false,
            regex: /\d+/,
            description: 'To date which results should be gathered. Anything after this date will not be returned. Requires fromDate with same date precision.'
        },
        order: {
            required: false,
            regex: /\w+ (asc|desc)/,
            description: 'Field to sort by and order'
        }
    }
};

var apiDocs = {
    spec: {
        nickname: 'patient-record-searchbytype-{domain}',
        path: '/patient/record/labs/by-type/{domain}',
        summary: '',
        notes: '',
        parameters: [
            rdk.docs.commonParams.pid,
            rdk.docs.swagger.paramTypes.path('domain', undefined, 'string', _.sortBy(Domains.names(), function(domain) { return domain; })),
            rdk.docs.swagger.paramTypes.query('type', 'the selected type attribute (typeName of lab/vital or name of immunization) Results will always be returned sorted by descending date.', 'string', true),
            rdk.docs.swagger.paramTypes.query('date.start', 'From date which results should be gathered. Anything before this date will not be returned.', 'string', false),
            rdk.docs.swagger.paramTypes.query('date.end', 'To date which results should be gathered. Anything after this date will not be returned. Requires fromDate with same date precision.', 'string', false),
            rdk.docs.commonParams.jds.start,
            rdk.docs.commonParams.jds.limit,
            rdk.docs.commonParams.jds.order
        ],
        responseMessages: []
    }
};

var getResourceConfig = function() {
    return _.map(Domains.domains(), function(domain) {
        return {
            name: domain.name,
            index: domain.index,
            path: domain.name,
            get: performSearchByType.bind(null, domain.index, domain.name),
            healthcheck: {
                dependencies: ['patientrecord','jds', 'solr','jdsSync','authorization']
            },
            parameters: parameters,
            apiDocs: apiDocs,
            permissions: []
        };
    });
};

function performSearchByType(index, name, req, res, next) {
    req.audit.dataDomain = name;
    req.audit.logCategory = 'RETRIEVE';

    var type = req.param('type');
    var pid = req.param('pid');
    var fromDate = req.param('date.start');
    var toDate = req.param('date.end');
    var start = req.param('start') || 0;
    var limit = req.param('limit');
    var order = req.query.order;

    var jdsServer = req.app.config.jdsServer;

    req.logger.info(name + ' Seach by Type called with pid=%s type=%s from=%s to=%s', pid, type, fromDate, toDate);
    if (nullchecker.isNullish(type) || nullchecker.isNullish(pid)) {
        return next();
    }

    var jdsQuery = {};
    if (start && start >= 0) { //ensure start exists and is non-negative integer
        jdsQuery.start = start;
    }
    if (limit && limit > 0) { //ensure limit exists and is positive integer
        jdsQuery.limit = limit;
    }
    if (order) {
        jdsQuery.order = order;
    }

    var jdsFilters = [];
    var dateFilter = 'observed'; //for lab/vital
    if (name === 'immunization') {
        jdsFilters.push(['eq', 'name', '"' + type + '"']);
        dateFilter = 'administeredDateTime'; // for immunization
    } else { // lab/vital
        jdsFilters.push(['eq', 'typeName', '"' + type + '"']);
    }

    if (toDate) {
        //when we have an fromDate
        //make sure that toDate is a date after fromDate
        //make sure that both dates specify the same precision
        if (fromDate) {
            if ((toDate >= fromDate) && (toDate.length === fromDate.length)) {
                jdsFilters.push(['lte', dateFilter, toDate]);
            }
            //if no fromDate is present just add toDate param
        } else {
            jdsFilters.push(['lte', dateFilter, toDate]);

        }
    }

    if (!fromDate && !toDate) {
        //no explicit fromDate
        //no explicit toDate
        //default to 1 year
        fromDate = moment().subtract(1, 'year').format('YYYYMMDD');
        jdsFilters.push(['gte', dateFilter, fromDate]);
    } else if (fromDate) {
        jdsFilters.push(['gte', dateFilter, fromDate]);
    }

    var jdsFilterQuery = jdsFilter.build(jdsFilters);
    jdsQuery.filter = jdsFilterQuery;
    jdsQuery.order = dateFilter + ' desc';

    var jdsResource = '/vpr/' + pid + '/index/' + index;
    var jdsQueryString = querystring.stringify(jdsQuery);
    var jdsPath = jdsResource + '?' + jdsQueryString;
    var options = _.extend({}, jdsServer, {
        method: 'GET',
        path: jdsPath
    });
    var config = {
        options: options,
        protocol: 'http',
        logger: req.logger
    };
    var jdsStatusCode = 500; // default to server error in case the status code is not returned
    httpUtil.fetch(req.app.config, config,
        function(err, data) {
            if (!nullchecker.isNullish(err)) {
                res.status(500).rdkSend('500'); // TODO respond with real error
                return;
            }
            res.status(jdsStatusCode).rdkSend(data);
        },
        function responseProcessor(statusCode, data) {
            jdsStatusCode = statusCode;
            data = JSON.parse(data) || {};

            data.jdsApiVersion = data.apiVersion || null;
            delete data.apiVersion;

            return data;
        }
    );
}

module.exports.getResourceConfig = getResourceConfig;
