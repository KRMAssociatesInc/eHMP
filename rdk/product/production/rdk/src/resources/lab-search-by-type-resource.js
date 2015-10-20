'use strict';

var rdk = require('../core/rdk');
var _ = require('underscore');
var querystring = require('querystring');
var nullchecker = rdk.utils.nullchecker;
var httpUtil = rdk.utils.http;
var moment = require('moment');
var jdsFilter = require('jds-filter');

var apiDocs = {
    spec: {
        summary: 'Get labs by type for a patient',
        notes: '',
        parameters: [
            rdk.docs.commonParams.pid,
            rdk.docs.swagger.paramTypes.query('type.name', 'typeName attribute of the laboratories being selected. Results will always be returned sorted by descending observed date.', 'string', true),
            rdk.docs.swagger.paramTypes.query('date.start', 'Last date on which a lab result was observed from which results should be gathered. Anything before this date will not be returned.', 'string', false),
            rdk.docs.swagger.paramTypes.query('date.end', 'Most recent date on which a lab result was observed from which results should be gathered. Anything after this date will not be returned. Requires date-start with same date precision.', false),
            rdk.docs.commonParams.jds.start,
            rdk.docs.commonParams.jds.limit,
            rdk.docs.commonParams.jds.order
        ],
        responseMessages: []
    }
};

function getResourceConfig() {
    return [{
        name: '',
        path: '',
        get: performLabSearchByType,
        apiDocs: apiDocs,
        healthcheck: {
            dependencies: ['patientrecord','jds','solr','jdsSync','authorization']
        },
        permissions: []
    }];
}

function performLabSearchByType(req, res, next) {
    req.audit.dataDomain = 'laboratory';
    req.audit.logCategory = 'RETRIEVE';

    var typeName = req.param('type.name');
    var pid = req.param('pid');
    var dateStart = req.param('date.start');
    var dateEnd = req.param('date.end');
    var start = req.param('start') || 0;
    var limit = req.param('limit');
    var order = req.query.order;

    var jdsServer = req.app.config.jdsServer;

    req.logger.info('Lab Search by Type called with pid=%s type=%s from=%s to=%s', pid, typeName, dateStart, dateEnd);
    if (nullchecker.isNullish(typeName)) {
        return next();  // require typeName
    }

    if (nullchecker.isNullish(pid)) {
        return next();  // require pid
    }

    var jdsQuery = {};
    if (start && start >= 0) {  //ensure start exists and is non-negative integer
        jdsQuery.start = start;
    }
    if (limit && limit > 0) {  //ensure limit exists and is positive integer
        jdsQuery.limit = limit;
    }
    if (order) {
        jdsQuery.order = order;
    }

    var jdsFilters = [];
    jdsFilters.push(['eq', 'typeName', '"' + typeName + '"']);

    if(dateEnd) {
        // when we have a dateStart
        // make sure that dateEnd is after dateStart
        // make sure that both dates specify the same precision
        if(dateStart) {
            if ((dateEnd >= dateStart) && (dateEnd.length === dateStart.length)) {
                jdsFilters.push(['lte', 'observed', dateEnd]);
            }
            // if no dateStart is present just add dateEnd
        } else {
            jdsFilters.push(['lte', 'observed', dateEnd]);
        }
    }

    if(!dateStart && !dateEnd) {
        // no explicit dateStart
        // no explicit dateEnd
        // default to 1 year
        dateStart = moment().subtract(1, 'year').format('YYYYMMDD');
        jdsFilters.push(['gte', 'observed', dateStart]);
    } else if (dateStart) {
        jdsFilters.push(['gte', 'observed', dateStart]);
    }

    var jdsFilterQuery = jdsFilter.build(jdsFilters);
    jdsQuery.filter = jdsFilterQuery;
    jdsQuery.order = 'observed desc';

    var jdsResource = '/vpr/' + pid + '/index/laboratory';
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
