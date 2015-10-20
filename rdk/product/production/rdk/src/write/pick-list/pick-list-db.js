'use strict';
var  _ = require('lodash');
var async = require('async');
var Datastore = require('nedb');
var nullUtil = require('../core/null-utils');
var pickListConfig = require('./config/pickListConfig').pickListConfig;

var pickListRoot = './';
var loading = [];

var db = new Datastore();
var refreshInProgress = null;
module.exports.refreshInProgress = refreshInProgress;

var REFRESH_STATE_NOT_LOADED = 'notLoaded';
var REFRESH_STATE_NORMAL = 'normal';
var REFRESH_STATE_STALE = 'stale';

/**
 * Retrieves the data from the database.  If an error occurs, and error will be returned.  Otherwise you will receive
 * a result which contains status and possibly data.<br/>
 * If the status is REFRESH_STATE_NOT_LOADED, data will be null.<br/>
 * If the status is REFRESH_STATE_NORMAL, data will contain the data retrieved from the database.<br/>
 * If the status is REFRESH_STATE_STALE, data will contain the data retrieved from the database - it is the responsibility
 * of the caller to refresh the data asynchronously at this point.<br/>
 *
 * @param dataNeedsRefreshAfterMinutes How many minutes old is cached data still acceptable?
 * @param query The pick-list name, site, and any other parameters.
 * @param callback The function to call when done.
 */
function retrieveDataFromDB(dataNeedsRefreshAfterMinutes, query, callback) {
    var dateCurrent = new Date();
    var refreshIntervalInMilliseconds = 1000 * 60 * dataNeedsRefreshAfterMinutes;
    db.find(query, function(err, res) {
        if (err) {
            return callback(err);
        }
        else {
            var result = {
                data: null,
                status: REFRESH_STATE_NOT_LOADED
            };
            if (nullUtil.isNullish(res)) {
                return callback(null, {});
            }
            else if (res.length < 1) {
                return callback(null, result);
            }
            else {
                if (nullUtil.isNullish(res[0]) || nullUtil.isNullish(res[0].data)) {
                    return callback(null, {});
                }

                var dateCreated  = new Date(res[0].timeStamp);
                result.data = res[0].data;
                //result.pickList = res[0].pickList;
                //result.site = res[0].site;
                //result.timeStamp = res[0].timeStamp;
                if ((dateCurrent.getTime() - dateCreated.getTime()) < refreshIntervalInMilliseconds) {
                    result.status = REFRESH_STATE_NORMAL;
                }
                else {
                    result.status = REFRESH_STATE_STALE;
                }

                return callback(null, result);
            }
        }
    });
}

/**
 * Method to store pick-list data in the database.
 *
 * @param params The pick-list name, site, and any other parameters.
 * @param timeStamp The timestamp to record with the data.
 * @param data The pick-list data.
 * @param callback The function to call when done.
 */
function updateDatabase(params, timeStamp, data, callback) {
    db.remove(params, {multi:true}, function(err/*, numberDeleted*/) {
        if (err) {
            return callback(err);
        }

        _.set(params, 'timeStamp', timeStamp);
        _.set(params, 'data', data);
        db.insert(params, function(err, result) {
            if (err) {
                return callback(err);
            }

            callback(null, result.data);
        });
    });
}

/**
 * Generic method to load a pick-list into the in-memory database.
 *
 * @param logger The logger.
 * @param siteConfig The configuration for calling RPCs.
 * @param params The pick-list name, site, and any other parameters.
 * @param modulePath The path of the file with the pick-list's fetch function.
 * @param callback The function to call when done.
 */
function loadPickList(logger, siteConfig, params, modulePath, callback) {
    require(pickListRoot + modulePath).fetch(logger, siteConfig, function(err, result) {
        if (err) {
            logger.error(err);
            return callback(err);
        }
        if (!result) {
            return callback(null, params.site + ':' + params.pickList + ' contained no data');
        }

        updateDatabase(params, new Date(), result, callback);
    }, params);
}

/**
 * Populates the loading variable so it isn't populated again and then removes it after calling loadPickList.
 */
module.exports.initialLoadPickList = function(logger, siteConfig, params, modulePath, callback) {
    loading.push(params.pickList);

    loadPickList(logger, siteConfig, params, modulePath, function(error, result) {
        loading.splice(loading.indexOf(params.pickList), 1); //Remove this entry from our list of things being loaded.

        if (error) {
            logger.error(error);
            return callback(error);
        }

        return callback(null, result);
    });
};

module.exports.refresh = function refresh(app, forcedRefresh, callback) {
    app.logger.info('Initializing pick list in-memory database');
    if (refreshInProgress !== null && refreshInProgress) {
        callback(null, 'Refresh in progress');
        return;
    }
    else {
        if (refreshInProgress === null || !refreshInProgress) {
            refreshInProgress = true;
        }
        //var config = app.config;
        var sites = app.config.vistaSites;
        var siteNames = [], siteConfigs=[];
        if (!_.isNull(sites)) {
            for (var key in sites) {
                if (sites.hasOwnProperty(key) && typeof sites[key] === 'object') {
                    siteNames.push(key);
                    siteConfigs.push(sites[key]);
                }
            }
        }
        var processedData = [];
        _.each(siteNames, function(site, i) {
            var siteConfig = app.config.vistaSites[site];
            async.series(_.map(app.config.pickListConfig, function(value/*, index, collection*/) {
                return function(callback) {
                    loadPickList(app.logger, siteConfig, site, value, callback);
                };
            }), function (err, results) {
                if (err) {
                    refreshInProgress = false;
                    callback(err);
                }
                else {
                    processedData.push(results);
                    if (i === (siteNames.length - 1)) {
                        refreshInProgress = false;
                        callback(null, processedData);
                    }
                }
            });
        });
    }
};

/**
 * Converts a string into a properly escaped regular expression.
 */
function escapeRegExp(string){
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Removes all of the records whose filters.fieldToCheckAgainst don't contain the string filters.stringToSearchFor
 *
 * @param data The data to filter out records that don't match.
 * @param filters filters out the data by comparing filters.fieldToCheckAgainst to see if that matches what is contained
 * in filters.stringToSearchFor.  It does this with a case insensitive search and adds it if the match is found anywhere
 * in that string.
 */
function filterResults(data, filters) {
    if (nullUtil.isNullish(filters)) {
        return data;
    }
    if (nullUtil.isNullish(filters.fieldToCheckAgainst) || _.isEmpty(filters.fieldToCheckAgainst)) {
        return data;
    }
    if (nullUtil.isNullish(filters.stringToSearchFor) || _.isEmpty(filters.stringToSearchFor)) {
        return data;
    }

    var reg = new RegExp(escapeRegExp(filters.stringToSearchFor), 'i');
    var retValue = _.filter(data, function(n) {
        if (nullUtil.isNullish(n)) {
            return false;
        }
        else if (nullUtil.isNullish(n[filters.fieldToCheckAgainst])) {
            return false;
        }
        else if (n[filters.fieldToCheckAgainst].match(reg)) {
            return true;
        }
        else {
            return false;
        }
    });

    return retValue;
}

/**
 * Retrieves a pick-list after refreshing it if needed.
 *
 * @param logger The logger.
 * @param siteConfig The configuration for calling RPCs.
 * @param params The pick-list name, site, and any other parameters.
 * @param modulePath The path of the file with the pick-list's fetch function.
 * @param dataNeedsRefreshAfterMinutes How many minutes old is cached data still acceptable? (Use 0 to force a cache refresh.)
 * @param callback The function to call when done.
 */
module.exports.retrievePickList = function retrievePickList(logger, siteConfig, params, filters, modulePath, dataNeedsRefreshAfterMinutes, callback) {
    retrieveDataFromDB(dataNeedsRefreshAfterMinutes, params, function(err, res) {
        if (err) {
            return callback(err);
        }

        if (res.status === REFRESH_STATE_NOT_LOADED) {
            var i = _.indexOf(_.pluck(pickListConfig, 'name'), params.pickList);

            //If we have not loaded this large pick list into memory yet, it could be the first time they requested it
            //in which case we will notify them it's loading.  Otherwise they are calling again before it's been loaded.
            //If that's the case, we shouldn't load it again but just inform them that it's still being retrieved.
            if (_.has(pickListConfig[i], 'largePickListRetry')) {
                if (_.includes(loading, params.pickList)) {
                    return callback('Pick list (' + params.pickList + ') is still being retrieved.  See Retry-After seconds (in the header) for the length of time to wait.', null, 202, {'Retry-After' : pickListConfig[i].largePickListRetry});
                }
                else {
                    loading.push(params.pickList);
                    callback('Pick list (' + params.pickList + ') is now loading.  See Retry-After seconds (in the header) for the length of time to wait.', null, 202, {'Retry-After': pickListConfig[i].largePickListRetry});
                }
            }

            loadPickList(logger, siteConfig, params, modulePath, function(error, result) {
                if (error) {
                    logger.error(error);
                }

                //If we were a large pick-list, we notified the user that it would take some time to load this pick-list.
                //We don't want to make multiple callbacks to that user after telling them that.
                var allowCallback = true;
                if (_.includes(loading, params.pickList)) {
                    allowCallback = false;
                    loading.splice(loading.indexOf(params.pickList), 1); //Remove this entry from our list of things being loaded.
                }

                if (error && allowCallback) {
                    return callback(error);
                }

                if (allowCallback) {
                    var retValue = filterResults(result, filters);
                    return callback(null, retValue);
                }
            });
        } else {
            var retValue = filterResults(res.data, filters);
            callback(null, retValue);

            if (res.status === REFRESH_STATE_STALE) {
                loadPickList(logger, siteConfig, params, modulePath, function(error/*, result*/) {
                    if (error) {
                        logger.error(error);
                    }
                });
            }
        }
    });
};

module.exports._loadPickList = loadPickList;
module.exports._updateDatabase = updateDatabase;
module.exports._database = db;
