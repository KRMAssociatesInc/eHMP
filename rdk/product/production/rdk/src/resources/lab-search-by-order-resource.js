'use strict';

var rdk = require('../core/rdk');
var async = require('async');
var querystring = require('querystring');
var _ = require('underscore');
var nullchecker = rdk.utils.nullchecker;
var jdsFilter = require('jds-filter');

FetchError.prototype = Error.prototype;
NotFoundError.prototype = Error.prototype;

var parameters = {
    get: {
        orderUid: {
            required: true
        },
        pid: {
            required: true
        },
        start: {
            required: false,
            regex: /\d+/
        },
        limit: {
            required: false,
            regex: /\d+/
        },
        order: {
            required: false,
            regex: /\w+ (asc|desc)/,
            description: 'Sorting order, not to be confused with orderUid'
        }
    }
};

var apiDocs = {
    spec: {
        summary: 'Get patient labs for an order',
        notes: '',
        parameters: [
            rdk.docs.commonParams.pid,
            rdk.docs.commonParams.uid('lab order', true),
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
        get: performSearch,
        parameters: parameters,
        apiDocs: apiDocs,
        healthcheck: {
                dependencies: ['patientrecord','jds','solr','jdsSync','authorization']
        },
        permissions: []
    }];
}

function performSearch(req, res, next) {
    req.logger.info('perform search for labsearchbyorder resource GET called');
    var config = req.app.config;

    var orderUid = req.param('uid');
    var pid = req.param('pid');
    var start = parseInt(req.param('start')) || 0;
    var limit = parseInt(req.param('limit')) || 0;

    req.audit.patientId = pid;
    req.audit.logCategory = 'RETRIEVE';

    if(nullchecker.isNullish(orderUid) || nullchecker.isNullish(pid)) {
        return next();
    }


    req.logger.info('Retrieve pid=%s order=%s from server %s:%s', pid, orderUid, config.jdsServer.host, config.jdsServer.port);

    var paginationData = {};
    async.waterfall(
        [
            function(callback) {
                getOrder(orderUid, pid, req, callback);
            },
            function(order, callback) {
                var labUids = getLabUidsFromOrder(order);
                paginationData.totalItems = labUids.length;
                if(limit > 0) {
                    var end = start + limit;
                    labUids = labUids.slice(start, end);
                    paginationData.startIndex = start;
                    paginationData.itemsPerPage = limit;
                    // (a/b|0) is truncating division
                    paginationData.pageIndex = (start / limit | 0);  // jshint ignore:line
                    paginationData.totalPages = (paginationData.totalItems / limit | 0) + paginationData.totalItems % limit;  // jshint ignore:line
                } else {
                    labUids = labUids.slice(start);
                }
                paginationData.currentItemCount = labUids.length;
                callback(null, labUids);
            },
            function(labUids, callback) {
                getLabs(labUids, pid, req, callback);
            }
        ],
        function(err, labs) {
            if(err instanceof FetchError) {
                req.logger.error(err.message);
                res.status(rdk.httpstatus.internal_server_error).rdkSend('There was an error processing your request. The error has been logged.');
            } else if(err instanceof NotFoundError) {
                res.status(rdk.httpstatus.not_found).rdkSend(err.error);
            } else if(err) {
                res.status(rdk.httpstatus.internal_server_error).rdkSend(err.message);
            } else {
                var response = _.extend({}, paginationData, labs);
                res.rdkSend(response);
            }
        }
    );
}

function getOrder(orderUid, pid, req, callback) {
    var order = req.query.order;

    var jdsResource = '/vpr/' + pid + '/find/order';
    var jdsQuery = {};
    if(order) {
        jdsQuery.order = order;
    }

    var filter = [['like', 'uid', orderUid]];
    jdsQuery.filter = jdsFilter.build(filter);
    var jdsQueryString = querystring.stringify(jdsQuery);

    var options = _.extend({}, req.app.config.jdsServer, {
        path: jdsResource + '?' + jdsQueryString,
        method: 'GET'
    });
    var jdsConfig = {
        protocol: 'http',
        logger: req.logger,
        options: options
    };

    rdk.utils.http.fetch(req.app.config, jdsConfig, function(error, result) {
        req.logger.debug('callback from order fetch()');
        if(error) {
            return callback(new FetchError('Error fetching pid=' + pid + ' - ' + (error.message || error), error));
        }
        var jdsResponse = JSON.parse(result);
        if('error' in jdsResponse) {
            if(isNotFound(jdsResponse)) {
                return callback(new NotFoundError('Object not found', jdsResponse));
            }
            return callback(new Error('Server error'), jdsResponse);
        }
        return callback(null, jdsResponse);
    });
}

function getLabs(labUids, pid, req, orderCallback) {
    var consolidatedLabs = [];
    async.eachSeries(labUids,
        function(uid, callback) {
            var jdsResource = '/vpr/' + pid + '/find/lab';
            var jdsQuery = querystring.stringify({
                filter: jdsFilter.build([['like', 'uid', uid]])
            });
            var jdsOptions = _.extend({}, req.app.config.jdsServer, {
                path: jdsResource + '?' + jdsQuery
            });
            var jdsConfig = {
                options: jdsOptions,
                protocol: 'http',
                logger: req.logger
            };

            rdk.utils.http.fetch(req.app.config, jdsConfig, function(error, result) {
                req.logger.debug('callback from lab=%s fetch()', uid);

                if(error) {
                    return callback(new FetchError('Error fetching lab=' + uid + ' - ' + (error.message || error), error));
                } else {
                    var jdsResponse = JSON.parse(result);
                    if('error' in jdsResponse) {
                        if(isNotFound(jdsResponse)) {
                            return callback(new NotFoundError('Object not found', jdsResponse));
                        }
                        return callback(new Error('Server error'), jdsResponse);
                    }
                    var items = (jdsResponse.data || {}).items || [];
                    _.each(items, function(item) {
                        consolidatedLabs.push(item);
                    });
                    return callback(null);
                }
            });
        },
        function(err) {
            if(err) {
                return orderCallback(err);
            }
            var labData = {
                data: {
                    items: consolidatedLabs
                }
            };
            req.logger.debug('responseObject = ' + JSON.stringify(labData, null, 2));
            return orderCallback(null, labData);
        }
    );
}

function FetchError(message, error) {
    this.name = 'FetchError';
    this.error = error;
    this.message = message;
}

function NotFoundError(message, error) {
    this.name = 'NotFoundError';
    this.error = error;
    this.message = message;
}

function getLabUidsFromOrder(jsonOrder) {
    var labs = [];
    var items = (jsonOrder.data || {}).items || [];
    _.each(items, function(item) {
        var results = item.results || [];
        _.each(results, function(result) {
            if(result.uid) {
                labs.push(result.uid);
            }
        });
    });
    return labs;
}

function isNotFound(obj) {
    return ('code' in obj.error && String(obj.error.code) === String(rdk.httpstatus.not_found));
}

module.exports.getResourceConfig = getResourceConfig;
