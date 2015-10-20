'use strict';

var _ = require('underscore');
var rdk = require('../core/rdk');
var jdsFilterUtil = require('jds-filter');

/**
 * Applies business logic to incoming filters
 * Adds filter or error to req.interceptorResults.jdsFilter
 * Modifies req.query.filter
 */
module.exports = function(req, res, next) {
    req.logger.info('jdsFilterInterceptor invoked');
    req.interceptorResults = {};
    req.interceptorResults.jdsFilter = {};
    var filter = req.query.filter;
    if(!filter) {
        req.interceptorResults.jdsFilter.error = new Error('No jds filter query parameter');
        return next();
    }

    var filterObj;
    try {
        filterObj = jdsFilterUtil.parse(filter);
    } catch(e) {
        delete req.query.filter;
        req.interceptorResults.jdsFilter = {error: e};
        return next();
    }

    var newFilterObject = processFilters(filterObj);
    var newFilterString = jdsFilterUtil.build(newFilterObject);
    req.query.filter = newFilterString;
    req.interceptorResults.jdsFilter = {filter: filterObj};
    next();
};

function processFilters(filterObj) {
    // TODO: implement business logic
    var groupOperators = ['and', 'or', 'not'];
    var processedFilters = [];
    _.each(filterObj, function(filterFunction) {
        var operator = filterFunction[0];
        var args = filterFunction.slice(1);
        var isGroupOperator = _.contains(groupOperators, operator);
        if(isGroupOperator) {
            args = processFilters(args);
        } else {
            var processedFilterFunction = processFilterFunction(operator, args);
            operator = processedFilterFunction.operator;
            args = processedFilterFunction.args;
        }
        if(args.length === 0) {
            filterFunction = null;
        } else {
            filterFunction = [operator].concat(args);
        }
        processedFilters.push(filterFunction);
    });
    return processedFilters;
}

function processFilterFunction(operator, args) {
    // TODO: implement business logic
    var result = {};
    result.operator = operator;
    result.args = args;
    return result;
}
