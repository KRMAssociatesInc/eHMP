/*jslint node: true */
'use strict';

var util = require('util');
var http = require('http');
var https = require('https');
var metrics = require('../../utils/metrics/metrics');
var cache = require('memory-cache');
var now = require('performance-now');
var _ = require('underscore');

var defaultLogger = {
    trace: console.log,
    debug: console.log,
    info: console.log,
    warn: console.log,
    error: console.log
};

function initializeLogger(logger) {
    defaultLogger = logger;
}

/**
 * config should have the following properties:
 * config.protocol => 'http' | 'https' (defaults to 'http' if undefined)
 * config.timeoutMillis (defaults to 120000 if undefined)
 * config.options => options object passed to http.request()
 * config.logger => a logger object with standard logging calls
 *      (trace, debug, info, warn, error, fatal - defaults to empty
 *      implementation if undefined)
 * resultProcessor => a function which processes the final result before
 *      it is returned via the callback. If undefined, no processing
 *      will occur. resultProcessor takes the response status code
 *      and the raw response.
 */
function fetch(config, callback, resultProcessor) {
    var logger = config.logger || defaultLogger;
    if(!config.logger) {
        logger.warn('DEFAULT HTTP FETCH LOGGER USED - FIX YOUR RESOURCE');
    }
    var processor = resultProcessor || function(statusCode, data) {
        return data;
    };
    var cacheKey;
    if(config.cacheTimeout) {
        cacheKey = 'http-wrapper' + JSON.stringify(config.options);
        logger.info('fetch() cache: using cached response for request %s', cacheKey);
        var cachedResponse = cache.get(cacheKey);
        if(cachedResponse) {
            return callback(null, processor(cachedResponse.statusCode, cachedResponse.body), cachedResponse.statusCode);
        }
    }
    var timeoutMillis = config.timeoutMillis || 120000;
    var maxListeners = config.maxListeners || 50;
    var protocol = config.protocol || 'http';
    var options = config.options;
    var begin = now();

    var metricData = metrics.handleOutgoingStart(config, logger);

    var requestLibrary = http;

    logger.debug('fetch() %s', createLogString(protocol, options));

    if (protocol !== 'http' && protocol !== 'https') {
        var msg = util.format('A valid protocol must be given for fetch(). Value for protocol was "%s", valid values are "http" and "https"', String(protocol));
        callback(new Error(msg));
    }

    //Pass config.protocol as https is using a secure connection
    if (protocol === 'https') {
        requestLibrary = https;
    }


    var outgoingRequest = requestLibrary.request(options, function(res) {
        var buffer = '';

        res.on('data', function(chunk) {
            buffer += chunk;
        });

        res.on('end', function(err) {
            var end = now();
            logger.debug('fetch() received from %s, took %d ms', createLogString(protocol, options), (end - begin));
            metrics.handleFinish(metricData, logger);
            if(config.cacheTimeout && !err) {
                if(res.statusCode === 200) {
                    var cachedResponse = {
                        body: buffer,
                        statusCode: res.statusCode
                    };
                    cache.put(cacheKey, cachedResponse, config.cacheTimeout);
                    logger.info('fetch() cache: caching response for duration %d ms, for request %s', config.cacheTimeout, cacheKey);
                } else {
                    logger.info('fetch() cache: not caching response because the status code was not 200 for request %s', cacheKey);
                }
            }
            callback(err, processor(res.statusCode, buffer), res.statusCode);
        });
    });

    outgoingRequest.on('socket', function(socket) {
        socket.setTimeout(timeoutMillis);
        socket.setMaxListeners(maxListeners);
        socket.on('timeout', function() {
            var end = now();
            logger.warn('timeout in fetch(): %s, took %d ms', createLogString(protocol, options), (end - begin));
            outgoingRequest.abort();
        });
    });

    outgoingRequest.on('error', function(err) {
        metrics.handleError(metricData, logger);
        var end = now();
        logger.error(err);
        logger.error('Call that failed in fetch(): %s, took %d ms', createLogString(protocol, options), (end - begin));
        callback(err);
    });

    outgoingRequest.end();
}

/**
 * content => JS object to be sent to resource, content will not be modified after the call
 * config should have the following properties: (config will not be modified after the call)
 * config.protocol => 'http' | 'https' (defaults to 'http' if undefined)
 * config.timeoutMillis (defaults to 120000 if undefined)
 * config.options => options object passed to http.request()
 *      NOTE: headers for Content Type and Length will be set
 * config.options.host or hostname => IP or DNS name of the server
 * config.options.port => port of the service, defaults to protocol standard
 *      where http => 80 and https => 443
 * config.options.method => HTTP verb. Defaults to POST if not specified
 * config.options.path => path on the server of the resource
 * config.options.headers => key/value pairs of HTTP headers
 * config.logger => a logger object with standard logging calls
 *      (trace, debug, info, warn, error, fatal - defaults to empty
 *      implementation if undefined)
 * resultProcessor => a function which processes the final result before
 *      it is returned via the callback. If undefined, no processing
 *      will occur. resultProcessor takes the response error
 *      and the raw response. One or both may be non-null.
 * NOTE we may wish to use request or superagent for this functionality in the future
 */
function postJSONObject(content, config, callback, resultProcessor) {
    var logger = config.logger || defaultLogger;
    var timeoutMillis = config.timeoutMillis || 120000;
    var maxListeners = config.maxListeners || 50;
    var protocol = config.protocol || 'http';
    var options = _.clone(config.options);
    var processor = resultProcessor || function(statusCode, data) {
        return data;
    };
    var requestLibrary = http;
    var begin = now();
    var postContent = content;

    //enforce POST if no method specified
    if (!options.method) {
        options.method = 'POST';
    }

    logger.debug('fetch() %s', createLogString(protocol, options));
    if (protocol !== 'http' && protocol !== 'https') {
        var msg = util.format('A valid protocol must be given for postJSONObject(). Value for protocol was "%s", valid values are "http" and "https"', String(protocol));
        callback(new Error(msg));
    }

    //Pass config.protocol as https is using a secure connection
    if (protocol === 'https') {
        requestLibrary = https;
    }

    //stringify POST contents
    if ((typeof content) === 'object') {
        postContent = JSON.stringify(content);
    }

    //assign Content headers
    if (content) {
        if (!options.headers) {
            options.headers = {};
        }

        if (!options.headers['Content-Type']) {
            options.headers['Content-Type'] = 'application/json';
        }

        if (!options.headers['Content-Length']) {
            options.headers['Content-Length'] = (Buffer.byteLength(postContent)).toString();
        }
    }


    var req = requestLibrary.request(options, function(res) {
        var buffer = '';
        res.setEncoding('utf8');

        res.on('data', function(chunk) {
            buffer += chunk;
        });

        res.on('end', function(err) {
            var end = now();
            if (buffer.indexOf('error') > -1 && buffer.indexOf('errorFlag') < -1) {
                var bufferObj;
                try {
                    bufferObj = JSON.parse(buffer);
                } catch(error) {
                    logger.error('Unparsable JSON');
                    return callback(error, processor(res.statusCode, buffer));
                }
                var jdsError = _.isEqual(_.keys(bufferObj.error), ['code', 'errors', 'message', 'request']);
                if (jdsError) {
                    _.each(bufferObj.error.errors, function(error) {
                        logger.error('JDS error: [%d] %s', error.reason, error.message);
                    });
                }
            }
            logger.debug('postJSONObject() received from %s, took %d ms', createLogString(protocol, options), (end - begin));
            callback(err, processor(res.statusCode, buffer));
        });
    });

    req.on('socket', function(socket) {
        socket.setTimeout(timeoutMillis);
        socket.setMaxListeners(maxListeners);
        socket.on('timeout', function() {
            var end = now();
            logger.warn('timeout in postJSONObject(): %s, took %d ms', createLogString(protocol, options), (end - begin));
            req.abort();
        });
    });

    req.on('error', function(err) {
        var end = now();
        logger.error(err);
        logger.error('Call that failed in postJSONObject(): %s, took $d ms', createLogString(protocol, options), (end - begin));
        callback(err, null);
    });

    req.write(postContent);
    req.end();
}

function createLogString(protocol, options) {
    return util.format('%s %s://%s:%s%s', options.method, protocol, options.host || options.hostname, options.port, options.path);
}

module.exports.fetch = fetch;
// Deprecated - please use post instaed of postJSONObject
module.exports.postJSONObject = postJSONObject;
module.exports.post = postJSONObject;
module.exports.initializeLogger = initializeLogger;
