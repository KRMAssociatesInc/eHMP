'use strict';
var rdk = require('../../../core/rdk');
var _ = rdk.utils.underscore;
var errors = require('../common/errors');
var async = require('async');
var querystring = require('querystring');
var moment = require('moment');
var jdsFilter = require('jds-filter');
var nullchecker = rdk.utils.nullchecker;

var domainqueryMap = {
    lab: {
        index: 'laboratory',
        queryparams: function(filters) {
            var refDate = moment(filters.referenceDate).subtract(12, 'months');
            var filterList = [];
            filterList.push(['gte', 'observed', refDate.format('YYYYMMDD')]);

            var jdsQuery = {
                filter: jdsFilter.build(filterList)
            };
            return querystring.stringify(jdsQuery);
        }
    },
    rad: {
        index: 'imaging',
        queryparams: function(filters) {
            var refDate = moment(filters.referenceDate).subtract(24, 'months');
            var filterList = [];
            filterList.push(['exists', 'results[].localTitle']);
            filterList.push(['gte', 'dateTime', refDate.format('YYYYMMDD')]);
            var jdsQuery = {
                filter: jdsFilter.build(filterList)
            };
            return querystring.stringify(jdsQuery);
        }
    },
    document: {
        index: 'document',
        queryparams: function(filters) {
            //var refDate = moment(date).subtract(24, 'months');
            var filterList = [];
            //filterList.push(['gte', 'referenceDateTime', refDate.format('YYYYMMDD')]);
            if (nullchecker.isNotNullish(filters.uid)) {
                filterList.push(['in', 'uid', [filters.uid]]);
            }
            var jdsQuery = {
                filter: jdsFilter.build(filterList)
            };
            return querystring.stringify(jdsQuery);
        },
        uidList: function(results) {
            var documentUidList = [];
            if (nullchecker.isNotNullish(results.imaging) && (results.imaging.length > 0)) {
                documentUidList = _.filter(_.map(results.imaging, function(item) {
                    return item.results[0].uid;
                }), function(num) {
                    return nullchecker.isNotNullish(num);
                });
            }
            return documentUidList;
        }
    }
};



function getData(req, pid, referenceDate, callback) {

    var tasks = {
        imaging: getdomainData.bind(null, req, pid, domainqueryMap.rad, {
            referenceDate: referenceDate
        }),
        laboratory: getdomainData.bind(null, req, pid, domainqueryMap.lab, {
            referenceDate: referenceDate
        }),
        document: ['imaging', getDocuments.bind(null, req, pid, domainqueryMap.document, {
                referenceDate: referenceDate
            })]
            //document: ['imaging', getdomainData.bind(null, req, pid, domainqueryMap.document, referenceDate)]
    };

    async.auto(tasks, function(err, results) {
        return callback(err, results);
    });
}

function getDocuments(req, pid, dqMap, filters, callback, results) {
    var tasks = [];
    _.each(dqMap.uidList(results), function(uid) {
        var newfilters = _.extend(filters, {
            uid: uid
        });
        tasks.push(getdomainData.bind(null, req, pid, domainqueryMap.document, newfilters));
    });
    async.parallel(tasks, function(err, results) {
        var res = [];
        _.each(results, function(item) {
            _.each(item,function(i){
                res.push(i);
            });
        });
        return callback(err, res);
    });
}

function getdomainData(req, pid, dqMap, filters, callback) {
    var config = req.app.config;
    var jdsPath = '/vpr/' + pid + '/index/' + dqMap.index + '?' + dqMap.queryparams(filters);
    var options = _.extend({}, config.jdsServer, {
        path: jdsPath,
        method: 'GET'
    });
    var httpConfig = {
        protocol: 'http',
        logger: req.logger,
        options: options
    };
    //req.logger.debug('\n-------------------------\n[+]JDSPath:' + httpConfig.options.path + '\n---------------------------\n');
    rdk.utils.http.fetch(config, httpConfig, function(error, result) {
        req.logger.debug('callback from fetch()');
        if (error) {
            return callback(new errors.FetchError('Error fetching pid=' + pid + ' - ' + (error.message || error), error));
        } else {
            var obj = JSON.parse(result);
            if ('data' in obj) {
                return callback(null, obj.data.items);
            } else if ('error' in obj) {
                if (errors.isNotFound(obj)) {
                    return callback(new errors.NotFoundError('Object not found', obj));
                }
            }

            return callback(new Error('There was an error processing your request. The error has been logged.'));
        }
    });
}

module.exports.getData = getData;
