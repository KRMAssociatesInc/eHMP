'use strict';

var _ = require('underscore');

function findMatches(pattern, candidates) {
    return _.filter(candidates, function(candidate) {
        return isMatch(pattern, candidate);
    });
}

function findMatch(pattern, candidates) {
    var matches = findMatches(pattern, candidates);
    if (_.isEmpty(matches)) {
        return;
    }

    return _.first(matches);
}

function isMatch(pattern, candidate) {
    if (_.isEmpty(pattern) || _.isEmpty(candidate)) {
        return false;
    }

    if(_.isString(pattern)) {
        return pattern === candidate.type;
    }

    return _.every(pattern, function(value, fieldname) {
        return value === candidate[fieldname];
    });
}

module.exports.findMatches = findMatches;
module.exports.findMatch = findMatch;
module.exports.isMatch = isMatch;