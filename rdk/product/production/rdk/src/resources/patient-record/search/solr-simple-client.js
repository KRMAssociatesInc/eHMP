'use strict';
var rdk = require('../../../core/rdk');
var httpUtil = rdk.utils.http;
var _ = require('underscore');
var moment = require('moment');

module.exports.executeSolrQuery = executeSolrQuery;
module.exports.compileQueryParameters = compileQueryParameters;
module.exports.generateFacetMap = generateFacetMap;
module.exports.emulatedHmpGetRelativeDate = emulatedHmpGetRelativeDate;
module.exports.escapeQueryChars = escapeQueryChars;

function executeSolrQuery(queryString, method, req, callback) {
    var config = {
        protocol: 'http',
        logger: req.logger,
        options: {
            host: req.app.config.solrServer.host,
            port: req.app.config.solrServer.port,
            path: req.app.config.solrServer.path + '/' + method + '?' + queryString,
            method: 'GET'
        }
    };

    req.logger.info(config.options.method + ' ' + config.options.host + ':' + config.options.port + config.options.path);

    httpUtil.fetch(req.app.config, config, function(error, result) {
        if (error) {
            req.logger.error('Error performing search', (error.message || error));
            return callback(error);
            //            res.status(500).rdkSend('There was an error processing your request. The error has been logged.');
        } else {
            try {
                var solrResult = JSON.parse(result);
                return callback(null, solrResult);
            } catch (parseError) {
                return callback(parseError);
            }
        }
    });
}


/**
 * Final individual query parameter manipulations before assembling the full query string
 * @param queryParameters
 * @returns {*}
 */
function compileQueryParameters(queryParameters) {
    if (queryParameters.hasOwnProperty('fl')) {
        queryParameters.fl = queryParameters.fl.join(',');
    }
    if (queryParameters.hasOwnProperty('hl.fl')) {
        queryParameters['hl.fl'] = queryParameters['hl.fl'].join(',');
    }
    return queryParameters;
}


function generateFacetMap() {
    var facetMap = {
        '{!ex=dt}datetime:[* TO *]': 'all'
    };
    // relative date solr facets
    ['T-24h', 'T-72h', 'T-7d', 'T-1m', 'T-3m', 'T-1y', 'T-2y'].forEach(function(teeMinus) {
        var solrFacet = '{!ex=dt}datetime:[' + emulatedHmpGetRelativeDate(teeMinus) + ' TO *]';
        facetMap[solrFacet] = teeMinus;
    });

    return facetMap;
}


/**
 * Reverse engineered RelativeDateTimeFormat.parse()
 *
 * @see RelativeDateTimeFormat.java:31
 * @param teeMinus "T-{number}{h|d|m|y}" (hour, day, month, year)
 * @returns "YYYYMMDD"
 */
function emulatedHmpGetRelativeDate(teeMinus) {
    teeMinus = teeMinus.toLowerCase();
    var match = teeMinus.match(/^(t-)(\d+)(h|d|m|y)$/);
    // T-72h = ['T-72h', 'T-', '72', 'h']
    if (match === null) {
        return;
    }
    // must be valid
    var count = parseInt(match[2]);
    var unit = match[3];
    var calculatedDate = moment();
    var timeType = {
        h: 'hours',
        d: 'days',
        m: 'months',
        y: 'years'
    };
    calculatedDate.subtract(count, timeType[unit]);
    var response = calculatedDate.format('YYYYMMDD');
    return response;
}


/**
 * Named to be the same as solr's ClientUtils java method, escapeQueryChars
 * @param unescaped
 */
function escapeQueryChars(unescaped) {
    var buffer = '';
    _.each(unescaped.split(''), function(c) {
        if (c.match(/[\\\+\-\!\(\)\:\^\[\]\"\{\}\~\*\?\|\&\;\/\s]/)) {
            // match the comment below and any whitespace
            // \+-!():^[]"{}~*?|&;
            buffer += '\\'; // friendly reminder that \\ in JS strings escapes to a single \
        }
        buffer += c;
    });
    return buffer;
}
