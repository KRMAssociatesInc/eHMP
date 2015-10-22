'use strict';

var rdk = require('../../../core/rdk');
var nullchecker = rdk.utils.nullchecker;
var _ = rdk.utils.underscore;
var fhirUtils = require('./fhir-converter');

var JDSDateQueryOpMap = {
    '>': 'gt',
    '>=': 'gte',
    '<': 'lt',
    '<=': 'lte',
    get: function(op, forExclusiveDate) {
        var jdsOp = this[op];

        if (forExclusiveDate) {
            // overriding mapping for exclusive dates
            if (op === '>') {
                jdsOp = this['>='];
            } else if (op === '<=') {
                jdsOp = this['<'];
            }
        }
        return jdsOp ? jdsOp : 'eq'; // default to equal op (eq)
    }
};

// date and dateTime regex expressions (source: http://www.hl7.org/FHIR/2015May/datatypes.html#date)
var dateParamRegex = /^(>|<|>=|<=|!=)?([0-9]{4}(-(0[1-9]|1[0-2])(-(0[0-9]|[1-2][0-9]|3[0-1]))?)?)$/;
var dateTimeParamRegex = /^(>|<|>=|<=|!=)?([0-9]{4}(-(0[1-9]|1[0-2])(-(0[0-9]|[1-2][0-9]|3[0-1])(T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?)?)?)?)$/;

var YYYY_MM_DD_HH_MM_SS_Regex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[0-9]|[1-2][0-9]|3[0-1])T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?$/;
var YYYY_MM_DD_Regex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[0-9]|[1-2][0-9]|3[0-1])$/;
var YYYY_MM_Regex = /^[0-9]{4}-(0[1-9]|1[0-2])$/;
var YYYY_Regex = /^[0-9]{4}$/;

function isDate(dateStr) {
    return dateParamRegex.test(dateStr);
}

function isDateTime(dateStr) {
    return dateTimeParamRegex.test(dateStr);
}

function getDateParamOp(dateStr) {
    if (nullchecker.isNotNullish(dateStr)) {
        var matches = dateStr.match(/((>=|<=|>|<|!=)?).+/);
        return matches[1];
    }
    return null;
}

/**
 * Valid date filter values have the following pattern:
 *      {op}{date/dateTime}
 *
 * When split, the first token will be the op and the second
 * will be the iso date/dateTime.
 */
function splitDateParam(dateStr) {
    var tokens;

    if (isDate(dateStr)) {
        tokens = dateStr.match(dateParamRegex);
    } else if (isDateTime(dateStr)) {
        tokens = dateStr.match(dateTimeParamRegex);
    }
    return tokens ? tokens.slice(1, 3) : null;
}

/**
 * Checks for validity of common search params (non resource specific).
 */
function validateCommonParams(params) {
    var countRegExp = /^\d+$/;

    // validate _count
    if (params._count) {
        // _count should be an integer
        return countRegExp.test(params._count);
    }
    // TODO: This list should expand as we add support for more common FHIR search params.

    return true; // all common parameters passed validation
}

function validateDateParams(params) {
    if (nullchecker.isNotNullish(params.date)) {
        // validate date (date | dateTime)
        // params.date can be a single date parameter or an array with two dates for a range
        if (_.isArray(params.date)) {
            return isValidDateParamPair(params.date);
        } else {
            // single date param
            return isValidDateParam(params.date);
        }
    }
    return true;
}

function isValidDateParamPair(dateParams) {
    // If there is more than one date parameter then it we're doing an explicit bounded date range.
    // An explicit bounded date range expects two date parameters with operators for each bound (greater-than, less-than)
    if (dateParams.length === 2) {
        if (isValidDateParam(dateParams[0]) && isValidDateParam(dateParams[1])) {
            var operators = [getDateParamOp(dateParams[0]), getDateParamOp(dateParams[1])];
            // // operators must bound both ends of the date range (one lessThan the other greaterThan)
            var hasGreaterThan = false;
            var hasLessThan = false;
            _.forEach(operators, function(op) {
                if (/>|>=/.test(op)) {
                    hasGreaterThan = true;
                }
                if (/<|<=/.test(op)) {
                    hasLessThan = true;
                }
            });
            return hasGreaterThan && hasLessThan;
        }
    }
    return false;
}

function isValidDateParam(dateParam) {
    return isDate(dateParam) || isDateTime(dateParam);
}

function buildAndQuery(a, b) {
    return 'and(' + a + ',' + b + ')';
}

function buildOrQuery(a, b) {
    return 'or(' + a + ',' + b + ')';
}

function buildCodeAndSystemQuery(codeSystem) {
    var query;
    var codes = codeSystem.split(',');
    for (var i = 0; i < codes.length; i++) {
        var tokens = codes[i].split('|');
        if (tokens.length > 1) {
            if (i > 0) {
                query = buildOrQuery(query, buildAndQuery(buildSystemQuery(tokens[0]), buildCodeQuery(tokens[1])));
            } else {
                query = buildAndQuery(buildSystemQuery(tokens[0]), buildCodeQuery(tokens[1]));
            }
        } else {
            if (i > 0) {
                query = buildOrQuery(query, buildCodeQuery(tokens[0]));
            } else {
                query = buildCodeQuery(tokens[0]);
            }
        }
    }

    return query;
}

function buildCodeQuery(code) {
    return 'eq("codes[].code",' + code + ')';
}

function buildSystemQuery(system) {
    if (system === '') {
        return 'not(exists("codes[].system"))';
    }
    return 'eq("codes[].system",' + system + ')';
}

function buildDateQuery(dateParam, jdsProperty) {
    var dateQuery = '';

    if (_.isArray(dateParam) && dateParam.length === 2) {
        // bounded explicit date range
        dateQuery = buildDatePairQuery(dateParam[0], dateParam[1], jdsProperty);
    } else {
        // single date param
        dateQuery = buildSingleDateQuery(dateParam, jdsProperty);
    }
    return dateQuery;
}

function buildSingleDateQuery(dateParam, jdsProperty) {
    var tokens = splitDateParam(dateParam);
    var dateQuery = '';

    if (tokens && tokens.length > 1) {
        var op = tokens[0];
        var dateStr = tokens[1];

        if (nullchecker.isNullish(op) || op === '!=') {
            // Depending on granularity of date this will be an exact search or an implicit range on the missing granularity.
            // A date that specifies year, month, date but not time will search for a range within that day (from 00:00 to 00:00 of the next day [exclusive]),
            // A date that specifies year, month, but not date, will search for a range within that month (from 1st day to the first day of the next month [exclusive]),
            // and so forth.
            // Note: JDS has a granularity of minutes.
            dateQuery = buildImplicitDateRangeQuery(dateStr, jdsProperty, op === '!=');
        } else {
            // There's an operator so we are doing an explicit unbounded range.
            dateQuery = buildExplicitDateQuery(dateParam, jdsProperty);
        }
    }
    return dateQuery;
}

function buildDatePairQuery(dateParam1, dateParam2, jdsProperty) {
    return buildExplicitDateQuery(dateParam1, jdsProperty) + ',' + buildExplicitDateQuery(dateParam2, jdsProperty);
}

function buildExplicitDateQuery(dateParam, jdsProperty) {
    var tokens = splitDateParam(dateParam);
    var dateStr = tokens[1];
    var op = getDateParamOp(dateParam);
    var date;
    var isExclusiveDate;

    /**
     * If operator is <= or > and the date is partial, we need to find the end of that range.
     *
     * For Example:
     *
     * [date=<=2004-03-30] - In this case we want to search for items within that day or earlier so
     * the JDS query should be lt(jdsProperty, 200403310000).
     *
     * [date=>2004-03] - In this case we want to search for items after March 2004 so the JDS
     * query should be gte(jdsProperty, 200404010000).
     */
    if ((op === '<=' || op === '>') && !YYYY_MM_DD_HH_MM_SS_Regex.test(dateStr)) {
        var range = getDateRange(dateStr);
        date = range.exclusiveEnd;
        isExclusiveDate = true;
    } else {
        date = new Date(dateStr);
        isExclusiveDate = false;
    }
    return JDSDateQueryOpMap.get(tokens[0], isExclusiveDate) + '(' + jdsProperty + ',' + fhirUtils.convertDateToHL7V2(date) + ')';
}

/**
 * Returns a date range query that includes the missing date specificity (if any).
 *
 * A date that specifies year, month, date but not time will search for a range within that day (from 00:00 to 23:59),
 * a date that specifies year, month, but not date, will search for a range within that month (from 1st day to the last),
 * and so forth.
 *
 * Note: JDS has a granularity of minutes.
 *
 * Ex.
 * 2015-01-26T01:23:45  - Exact search
 * 2015-01-26           - Between 2015-01-26T00:00 and 2015-01-26T23:59 (inclusive)
 * 2015-01              - Between 2015-01-01T00:00 and 2015-01-31T23:59 (inclusive)
 * 2015                 - Between 2015-01-01T00:00 and 2015-12-31T23:59 (inclusive)
 */
function buildImplicitDateRangeQuery(dateStr, jdsProperty, isNegated) {
    var query = '';

    if (YYYY_MM_DD_HH_MM_SS_Regex.test(dateStr)) {
        // this is an exact match search
        query = getExactDateQuery(new Date(dateStr), jdsProperty, isNegated);
    } else {
        query = getDateRangeQuery(getDateRange(dateStr), jdsProperty, isNegated);
    }
    return query;
}

function getDateRange(dateStr) {
    var range;

    if (YYYY_MM_DD_Regex.test(dateStr)) {
        // day range
        range = _getDateRange(dateStr, 'day');
    } else if (YYYY_MM_Regex.test(dateStr)) {
        // month range
        range = _getDateRange(dateStr, 'month');
    } else if (YYYY_Regex.test(dateStr)) {
        // year range
        range = _getDateRange(dateStr, 'year');
    } else {
        range = _getDateRange(dateStr);
    }
    return range;
}

function getExactDateQuery(date, jdsProperty, isNegated) {
    var jdsOp = isNegated ? 'ne' : 'eq';
    return jdsOp + '(' + jdsProperty + ',' + fhirUtils.convertDateToHL7V2(date) + ')';
}

function getDateRangeQuery(range, jdsProperty, isNegated) {
    if (isNegated) {
        // when searching for a negated range, we search for either below OR above the date range
        return 'or(lt(' + jdsProperty + ',' + fhirUtils.convertDateToHL7V2(range.inclusiveStart) + '),gte(' + jdsProperty + ',' + fhirUtils.convertDateToHL7V2(range.exclusiveEnd) + '))';
    } else {
        // search within the range
        return 'gte(' + jdsProperty + ',' + fhirUtils.convertDateToHL7V2(range.inclusiveStart) + '),lt(' + jdsProperty + ',' + fhirUtils.convertDateToHL7V2(range.exclusiveEnd) + ')';
    }
}

/**
 * Returns a date range where the start date is inclusive and
 * the end date is exclusive.
 */
function _getDateRange(dateStr, granularity) {
    var start = new Date(dateStr);
    var end = new Date(dateStr);

    switch (granularity) {
        case 'year':
            end.setUTCFullYear(end.getUTCFullYear() + 1);
            break;
        case 'month':
            end.setUTCMonth(end.getUTCMonth() + 1);
            break;
        case 'day':
            end.setUTCDate(end.getUTCDate() + 1);
            break;
    }
    return {
        inclusiveStart: start,
        exclusiveEnd: end
    };
}

function buildSearchQueryString(queries) {
    // assemble the search query
    if (queries.length > 0) {
        return 'filter=' + queries.join(',');
    } else {
        return '';
    }
}

/**
 * Builds an array of query parts from the set of parameters that apply
 * to all resources.
 *
 * TODO: This will grow as we add support for other common parameters.
 */
function buildCommonQueryParams(params) {
    var query = [];

    // _count
    if (nullchecker.isNotNullish(params._count)) {
        query.push('limit=' + params._count);
    }
    return query;
}

module.exports.isDate = isDate;
module.exports.isDateTime = isDateTime;
module.exports.getDateParamOp = getDateParamOp;
module.exports.splitDateParam = splitDateParam;
module.exports.validateCommonParams = validateCommonParams;
module.exports.validateDateParams = validateDateParams;
module.exports.buildAndQuery = buildAndQuery;
module.exports.buildDateQuery = buildDateQuery;
module.exports.buildCodeAndSystemQuery = buildCodeAndSystemQuery;
module.exports.buildSearchQueryString = buildSearchQueryString;
module.exports.buildCommonQueryParams = buildCommonQueryParams;
