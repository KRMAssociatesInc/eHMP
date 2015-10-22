'use strict';

var _ = require('underscore');
var rdk = require('../core/rdk');
var nullchecker = rdk.utils.nullchecker;
var S = require('string');

var fromUri = function(uri) {
    var builder = {};
    var pathParts = [];
    var queryParts = [];

    builder.query = function(key, value) {
        var queryPart = {};
        queryPart.key = key;
        queryPart.value = value;
        queryParts.push(queryPart);
        return builder;
    };

    builder.path = function(pathPart) {
        if (nullchecker.isNotNullish(pathPart)) {
            pathParts.push(pathPart);
        }
        return builder;
    };

    builder.build = function() {
        if (pathParts.length < 1) {
            return '';
        }

        var path = buildPath(pathParts);
        var query = buildQuery(queryParts);

        path = handleTrailingSlashesWithQuery(path, query);
        var builtUri = path.concat(query);

        return builtUri;
    };

    builder.toString = function() {
        return this.build();
    };


    if (nullchecker.isNullish(uri)) {
        uri = '';
    }

    var uriParts = splitUriAndQuery(uri);
    pathParts.push(uriParts.uri.toString());
    _.each(uriParts.query, function(queryPart) {
        builder.query(queryPart);
    });

    return builder;
};

var buildPath = function(pathParts) {
    var pathbuffer = '';
    _.each(pathParts, function(pathPart) {
        if (pathbuffer) {
            var left = ensureTrailingSlash(pathbuffer);
            var right = ensureDoesNotHavePrecedingSlash(pathPart);
            pathbuffer = left.concat(right);
        } else {
            // first time through, just add first pathPart
            pathbuffer = pathPart;
        }

    });
    return pathbuffer;
};

var buildQuery = function(queryParts) {
    var queryBuffer = '';
    _.each(queryParts, function(queryPart) {
        if (nullchecker.isNotNullish(queryPart.key)) {
            queryBuffer = appendQueryParamSeperator(queryBuffer);
            queryBuffer = queryBuffer.concat(queryPart.key);
            if (nullchecker.isNotNullish(queryPart.value)) {
                queryBuffer = queryBuffer.concat('=').concat(queryPart.value);
            }
        }
    });
    return queryBuffer;
};

var handleTrailingSlashesWithQuery = function(path, query) {
    if (query) {
        //if there is a query string, then don't leave the trailing slash on
        // do not want: site.com/?k=v
        // instead want: site.com?k=v
        path = S(path).chompRight('/').toString();
    }
    return path;
};

var ensureTrailingSlash = function(path) {
    if (path) {
        return S(path).ensureRight('/').toString();
    } else {
        return path;
    }
};
var ensureDoesNotHavePrecedingSlash = function(path) {
    return S(path).chompLeft('/').toString();
};

var appendQueryParamSeperator = function(query) {
    if (query) {
        query = query.concat('&');
    } else {
        query = query.concat('?');
    }
    return query;
};

var splitUriAndQuery = function(value) {
    var result = {};
    result.uri = '';
    result.query = [];
    var parts = value.split('?');

    _.each(parts, function(value, index) {
        if (index === 0) {
            result.uri = value;
        } else {
            result.query.push(value);
        }
    });

    return result;
};

module.exports.fromUri = fromUri;
