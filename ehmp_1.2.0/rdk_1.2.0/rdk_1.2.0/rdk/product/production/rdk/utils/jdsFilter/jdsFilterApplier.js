'use strict';

var jdsFilter = require('./jdsFilter');
var _ = require('lodash');

module.exports.applyFilters = applyFilters;
module.exports.evaluateExpression = evaluateExpression;

/**
 * JS implementation of JDS's filtering
 * @param {Array} filters jdsFilter.parse() compliant filter object
 * @param {Array} items The list of items to filter through
 * @returns {Array} The list of items that satisfy the filter
 */
function applyFilters(filters, items) {
    if(!_.isArray(items)) {
        return new Error('bad arguments');
    }
    return _.filter(items, function(item) {
        return evaluateExpression(filters, item);
    });
}

/**
 * Check whether an object matches a filter.
 * @param {Array} clause jdsFilter.parse() compliant filter object
 * @param {Object|Array} item The item or list of items to filter
 * @returns {boolean} whether the filter matches the item
 */
function evaluateExpression(clause, item) {
    if(!_.isArray(clause)) {
        var type = Object.prototype.toString.call(clause);
        return new Error(
            'Bad filter structure. Expected [object Array] but got ' + type);
    }
    var isImpliedAndExpression = _.isArray(clause[0]);
    if(isImpliedAndExpression) {
        clause.unshift('and');
    }
    var operator = clause[0];
    if(_.has(groupOperatorHandlers, operator)) {
        var clauses = clause.slice(1);
        return groupOperatorHandlers[operator](clauses, item);
    }

    var args = clause.slice(1);
    args = _.map(args, function(arg) {
        if(!_.isArray(arg)) {
            return jdsFilter.mStringUnescape(jdsFilter.mStringEnsureEscaped(arg));
        }
        return _.map(arg, function(listElement) {
            return jdsFilter.mStringUnescape(jdsFilter.mStringEnsureEscaped(listElement));
        });
    });
    var path = args.shift();
    var dataAtPath = getValuesAtObjectPath(path, item);
    if(_.has(mainOperatorHandlers, operator)) {
        if(operator === 'exists' && args[0] === 'false') {
            // negated exists needs special handling
            return true;
        }
        return _.some(dataAtPath, function(dataItem) {
            return mainOperatorHandlers[operator].apply(null, [dataItem].concat(args));
        });
    }
}

function evaluateAndExpression(clauses, item) {
    return _.every(clauses, function(clause) {
        return evaluateExpression(clause, item);
    });
}

function evaluateOrExpression(clauses, item) {
    return _.some(clauses, function(clause) {
        return evaluateExpression(clause, item);
    });
}

function evaluateNotExpression(clauses, item) {
    return !evaluateOrExpression(clauses, item);
}

var groupOperatorHandlers = {
    and: evaluateAndExpression,
    or: evaluateOrExpression,
    not: evaluateNotExpression
};

var mainOperatorHandlers = {
    'eq': function(dataValue, clauseValue) {
        return String(clauseValue) === String(dataValue);
    },
    'in': function(dataValue, clauseValue) {
        return _.contains(clauseValue, dataValue);
    },
    'ne': function(dataValue, clauseValue) {
        return String(clauseValue) !== String(dataValue);
    },
    'exists': function(dataValue, clauseValue) {
        // This negation code is currently unused but kept in
        // as a consumer may expect it to be here in the future
        var negate = String(clauseValue) === 'false';
        var exists = !_.isUndefined(dataValue);
        if(negate) {
            return !exists;
        }
        return exists;
    },
    'nin': function(dataValue, clauseValue) {
        return !_.contains(clauseValue, dataValue);
    },

    // M has different ways to compare strings and numbers.
    // JS does both with one operator, and with the same behavior.
    // Cast some comparison values to String to ensure date filtering works
    'gt': function(dataValue, clauseValue) {
        return String(dataValue) > String(clauseValue);
    },
    'lt': function(dataValue, clauseValue) {
        return String(dataValue) < String(clauseValue);
    },
    'gte': function(dataValue, clauseValue) {
        return String(dataValue) >= String(clauseValue);
    },
    'lte': function(dataValue, clauseValue) {
        return String(dataValue) <= String(clauseValue);
    },
    'between': function(dataValue, clauseValueLow, clauseValueHigh) {
        return (
        String(clauseValueLow) < String(dataValue) &&
        String(dataValue) < String(clauseValueHigh)
        );
    },
    'like': function(dataValue, clauseValue) {
        var regex = createRegExpFromJdsLikePattern(clauseValue);
        return regex.test(dataValue);
    },
    'ilike': function(dataValue, clauseValue) {
        var regex = createRegExpFromJdsLikePattern(clauseValue, 'i');
        return regex.test(dataValue);
    }
};

function createRegExpFromJdsLikePattern(jdsLikePattern, caseInsensitive) {
    var regexEscapedJdsLikePattern = escapeRegExp(jdsLikePattern);
    regexEscapedJdsLikePattern = regexEscapedJdsLikePattern.replace(/%/g, '.*');
    var flag = caseInsensitive ? 'i' : '';
    var regex = new RegExp(regexEscapedJdsLikePattern, flag);
    return regex;
}

function createRegExpFromMPattern(mPattern, flags) {
    /*
     Accidentally wrote this unused function before
     noticing that JDS's like filter doesn't use M patterns.
     It will likely be useful in the future so I'm leaving it in.
     */
    // TODO support alternation

    var mPatternTokenizer = /(?:(\d*)(\.?)(\d*))((?:[AULNPCE]|"[^"]*")+)/g;
    // mPatternTokenizer matches:
    // (countFrom) (.) (countTo) (characterCodeTokens)
    var regexString = '';
    var match;
    while((match = mPatternTokenizer.exec(mPattern)) !== null) {
        if(match.index === mPatternTokenizer.lastIndex) {
            // not currently needed but leaving this in for safety if the regex changes
            mPatternTokenizer.lastIndex++;
        }
        var countExpression = createRegexQuantifierFromRange(match[1], match[2], match[3]);
        var tokenGroup = createRegexTokenGroupFromMPatternCodes(match[4]);
        var regexGroupWithCount = tokenGroup + countExpression;
        regexString += regexGroupWithCount;
    }
    var regex = new RegExp(regexString, flags);
    return regex;
}

function createRegexTokenGroupFromMPatternCodes(mPatternCodes) {
    var tokenGroupHasLiteral = mPatternCodes.indexOf('"') !== -1;
    var tokenGroup;
    if(tokenGroupHasLiteral) {
        tokenGroup = createRegexTokenGroupWithMPatternLiterals(mPatternCodes);
    } else {
        var patternCodeSet = createSet(mPatternCodes);
        tokenGroup = mPatternCodeSetToRegexCharacterSet(patternCodeSet);
    }
    return tokenGroup;
}

/**
 * @param {Array|String} members
 * @returns {Object} The set where the keys are members and the values are all true
 */
function createSet(members) {
    var set = _.reduce(members, function(accumulator, key) {
        accumulator[key] = true;
        return accumulator;
    }, {});
    return set;
}

/**
 * @param count Exact or minimum count
 * @param isRange Makes values of count or maxCount a bound limit
 * @param maxCount Maximum count
 * @returns {string}
 */
function createRegexQuantifierFromRange(count, isRange, maxCount) {
    count = count || 0;
    var countExpression = '';
    if(isRange) {
        countExpression += '{' + count + ',';
        if(maxCount) {
            countExpression += maxCount;
        }
        countExpression += '}';
    } else {
        countExpression = '{' + count + '}';
    }
    countExpression = simplifyRegexQuantifier(countExpression);
    return countExpression;
}

/**
 * If possible, simplify ranges to *, _, ?, or no range
 */
function simplifyRegexQuantifier(countExpression) {
    if(countExpression === '{0,}') {
        return '*';
    }
    if(countExpression === '{1,}') {
        return '+';
    }
    if(countExpression === '{0,1}') {
        return '?';
    }
    if(countExpression === '{1}') {
        return '';
    }
    return countExpression;
}

function createRegexTokenGroupWithMPatternLiterals(characterCodeTokens) {
    var mLiteralTokenizer = /([AULNPCE]|"[^"]*")/g;
    var tokenGroupOptions = [];
    var tokenMatch;
    var mPatternCodeSet = {};
    while((tokenMatch = mLiteralTokenizer.exec(characterCodeTokens)) !== null) {
        if(tokenMatch.index === mLiteralTokenizer.lastIndex) {
            mLiteralTokenizer.lastIndex++;
        }
        var token = tokenMatch[1];
        if(token.charAt(0) !== '"') {
            mPatternCodeSet[token] = true;
            continue;
        }
        var literalValue = token.substring(1, token.length - 1);
        var regexEscapedLiteralValue = escapeRegExp(literalValue);
        tokenGroupOptions.push(regexEscapedLiteralValue);
    }
    if(_.size(mPatternCodeSet)) {
        var regexMetacharacters = mPatternCodeSetToRegexCharacterSet(mPatternCodeSet);
        tokenGroupOptions.push(regexMetacharacters);
    }
    var tokenGroup = '(?:' + tokenGroupOptions.join('|') + ')';
    return tokenGroup;
}

/**
 * @param patternCodeSet An object where the keys are members of the set
 * @returns {string}
 */
function mPatternCodeSetToRegexCharacterSet(patternCodeSet) {
    var mPatternCodeRegexEquivalents = {
        // http://mumps.sourceforge.net/docs.html#PATTERN
        A: 'A-Za-z',
        C: '\\x00-\\x1F',
        E: '\\x00-\\xFF',
        L: 'a-z',
        N: '\\d',
        P: ' !"#$%&\'()*+,-./:;<=>?@[\\\\\\]^_`{|}~',
        U: 'A-Z'
    };
    if(patternCodeSet.E) {
        patternCodeSet = {  // E encompasses all the other codes
            E: true
        };
    }
    if(patternCodeSet.A) {
        // A encompasses L and U
        patternCodeSet = _.omit(patternCodeSet, ['L', 'U']);
    }
    var characterRanges = _.map(patternCodeSet, function(_, key) {
        return mPatternCodeRegexEquivalents[key];
    });
    var characterSet = '[' + characterRanges.join('') + ']';
    return characterSet;
}

function escapeRegExp(string) {
    // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Drill down into a path of objects.
 * Look at arrays of objects by appending [] to the array name.
 * Example path: books[].author
 * Example object:
 *  {books: [{title: 'foo', author: 'joe'}, {title: 'bar', author: 'jane'}]}
 * Example response: ['joe', 'jane']
 * @param {String} path
 * @param {Array|Object} objects
 * @returns {Array} The value of all elements at the path of the object
 */
function getValuesAtObjectPath(path, objects) {
    var extractNextSelector = path.match(/^([^.]*)(?:\.(.*))?$/);
    var selector = extractNextSelector[1];
    var tailPath = extractNextSelector[2];
    var isArraySelector = /\[\]$/.test(selector);
    if(isArraySelector) {
        selector = selector.slice(0, -2);
    }
    if(!_.isArray(objects)) {
        objects = [objects];
    }
    var heap = [];
    _.each(objects, function(object) {
        if(!_.has(object, selector)) {
            return;
        }
        if(isArraySelector) {
            if(tailPath) {
                Array.prototype.push.apply(heap, getValuesAtObjectPath(tailPath, object[selector]));
            } else {
                Array.prototype.push.apply(heap, object[selector]);
            }
        } else {
            if(tailPath) {
                heap.push(getValuesAtObjectPath(tailPath, object[selector]));
            } else {
                heap.push(object[selector]);
            }
        }
    });
    return heap;
}
