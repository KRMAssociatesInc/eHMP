'use strict';

var _ = require('lodash');
var jison = require('jison');
var fs = require('fs');
var bnf = fs.readFileSync(__dirname + '/jdsFilterGrammar.jison', 'utf8');
var jdsFilterParser = new jison.Parser(bnf);
var jdsFilterApplier = require('./jdsFilterApplier');

module.exports.parse = jdsFilterParser.parse.bind(jdsFilterParser);
module.exports.build = buildJdsFilterQuery;
module.exports.applyFilters = jdsFilterApplier.applyFilters;
module.exports.evaluateExpression = jdsFilterApplier.evaluateExpression;
module.exports.mStringEnsureEscaped = mStringEnsureEscaped;
module.exports.mStringUnescape = mStringUnescape;
module.exports.mArgumentToString = mArgumentToString;

/**
 * Takes jds filters represented as arrays and returns a query string value.
 * Example input:
 *  [
 *    [ 'eq', 'qualifiedName', 'LDL CHOLESTEROL (SERUM)' ],
 *    [ 'eq', 'units', 'MG/DL' ]
 *  ]
 *
 *  The same input as multiple arguments instead of an array is also acceptable.
 *
 *  The (and, or, not) grouping operators can be represented with the following example input:
 *  [
 *    [ 'or',
 *      [ 'gte', 'observed', '2012' ],
 *      [ 'eq', 'status', 'ACTIVE' ]
 *    ],
 *    [ 'eq', 'service', 'CARDIOLOGY' ]
 *  ]
 *
 *  List arguments are just arrays. Example:
 *  [
 *    [ 'in', 'siteCode', [ '500', 'DOD' ] ]
 *  ]
 *
 *
 * @param list
 * @returns {string}
 */
function buildJdsFilterQuery(list) {
    if(list.length === 0) {
        return '';
    }
    if(arguments.length > 1 || !_.isArray(list[0])) {
        list = arguments;
    }
    var groupOperators = ['and','or','not'];
    var functions = [];
    _.each(list, function(item) {
        var part;
        var operator = item[0];
        var args = item.slice(1);
        if(_.isArray(operator)) {
            part = buildJdsFilterQuery(item);
            functions.push(part);
            return;
        }
        var isGroupOperator = _.contains(groupOperators, operator);
        if(isGroupOperator) {
            part = operator + '(' + buildJdsFilterQuery(args) + ')';
        } else {
            part = operator + '(' + args.map(mArgumentToString).join(',') + ')';
        }
        functions.push(part);
    });
    return functions.join(',');
}

function mArgumentToString(arg) {
    if(!_.isArray(arg)) {
        return mStringEnsureEscaped(arg);
    }
    var parts = [];
    _.each(arg, function(argItem) {
        parts.push(mArgumentToString(argItem));
    });
    return '[' + parts.join(',') + ']';
}

function mStringEnsureEscaped(string) {
    if(string === '""') {  // empty string
        return string;
    }
    if(/^[\w\d]+$/.test(string)) {  // unquoted string
        return '"' + string + '"';
    }

    var innerString;
    if(string.length < 2) {
        innerString = string;
    } else if(string[0] === '"' && string[string.length - 1] === '"') {
        innerString = string.slice(1, -1);
    } else {
        innerString = string;
    }

    // double up any non-doubled quotes
    // (?!"). looks for non-quotes without advancing the cursor
    // "(?:"")* looks for 1 " followed by any number of ""
    // (?!") makes the above match only when there is not a quote after
    string = '"' + innerString.replace(/(^|(?!").)("(?:"")*(?!"))/g, '$1$2"') + '"';

    return string;
}

function mStringUnescape(string) {
    string = mStringEnsureEscaped(string);
    var innerString = string.slice(1, -1);
    innerString = innerString.replace(/("")/g, '"');
    return innerString;
}
