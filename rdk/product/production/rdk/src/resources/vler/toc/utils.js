'use strict';
var rdk = require('../../../core/rdk');
var _ = rdk.utils.underscore;
var nullchecker = rdk.utils.nullchecker;
var async = require('async');
var errors = require('../common/errors');

function getFromJds(req, jdsPath, callback) {
    var config = req.app.config;
    var pid = req.query.pid;

    var options = _.extend({}, config.jdsServer, {
        path: jdsPath,
        method: 'GET'
    });
    var httpConfig = {
        protocol: 'http',
        logger: req.logger,
        options: options
    };

    rdk.utils.http.fetch(config, httpConfig, function(error, result) {
        req.logger.debug('callback from fetch()');
        if (error) {
            return callback(new errors.FetchError('Error fetching pid=' + pid + ' - ' + (error.message || error), error));
        } else {
            var obj = JSON.parse(result);
            if ('data' in obj) {
                return callback(null, obj);
            } else if ('error' in obj) {
                if (errors.isNotFound(obj)) {
                    return callback(new errors.NotFoundError('Object not found', obj));
                }
            }

            return callback(new Error('There was an error processing your request. The error has been logged.'));
        }
    });
}
module.exports.getFromJds = getFromJds;

function getDataFromCollection(collection, req, pid, refDate, callback, previousResults) {
    var jdsPath = '/vpr/' + pid + '/find/' + collection.name;
    var jdsFilterList = [];

    if (nullchecker.isNotNullish(collection.filter)) {
        jdsFilterList = collection.filter(refDate, previousResults);
        if (nullchecker.isNotNullish(jdsFilterList) && !(jdsFilterList instanceof Array)) {
            jdsFilterList = [jdsFilterList];
        }
    }
    var taskArr = _.map(jdsFilterList, function(jdsFilter) {
        return getFromJds.bind(null, req, jdsPath + '?' + jdsFilter);
    });

    async.parallel(taskArr,
        function(err, results) {
            if (!err) {
                callback(null, buildResult(results, collection.domain || collection.name, collection.transformResult));
            } else {
                callback(err);
            }
        }
    );
}
module.exports.getDataFromCollection = getDataFromCollection;

function getData(collections, req, pid, refferenceDate, callback) {
    var tasks = {};
    for (var i in collections) {
        if (collections[i]) {
            if (nullchecker.isNotNullish(collections[i].dependsOn) && collections[i].dependsOn.length > 0) {
                tasks[i] = collections[i].dependsOn.slice(0);
                tasks[i].push(getDataFromCollection.bind(null, collections[i], req, pid, refferenceDate));
            } else {
                tasks[i] = getDataFromCollection.bind(null, collections[i], req, pid, refferenceDate);
            }
        }
    }

    async.auto(tasks,
        function(err, results) {
            if (!err) {
                var finalResult = {};
                _.each(results, function(result) {
                    for (var collection in result) {
                        if (nullchecker.isNotNullish(result[collection])) {
                            finalResult[collection] = (finalResult[collection] || []).concat(result[collection]);
                        }
                    }
                });
                callback(null, finalResult);
            } else {
                callback(err);
            }
        }
    );
}
module.exports.getData = getData;

function buildResult(results, collectionName, transformResult) {
    var res = {};
    if (results instanceof Array) {
        _.each(results, function(result) {
            var resData = transformResult ? transformResult(result.data.items) : result.data.items;
            res[collectionName] = (res[collectionName] || []).concat(resData);
        });
    } else {
        res[collectionName] = transformResult ? transformResult(results.data.items) : results.data.items;
    }

    return res;
}
module.exports.buildResult = buildResult;
