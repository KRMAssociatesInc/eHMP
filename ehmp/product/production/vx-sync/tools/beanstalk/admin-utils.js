'use strict';

require('../../env-setup');

var inspect = require('util').inspect;
var async = require('async');
var _ = require('underscore');

var BeanstalkClient = require(global.VX_JOBFRAMEWORK + 'beanstalk-client');

function fetchTubeNames(logger, host, port, callback) {
    logger.debug('fetchTubeNames(): %s:%s', host, port);
    executeCommand(logger, host, port, 'list_tubes', function(error, results) {
        if (error) {
            return callback(error);
        }

        if (_.isArray(results)) {
            results.sort();
        }

        callback(null, results);
    });
}

function fetchStats(logger, host, port, callback) {
    logger.debug('fetchStats(): %s:%s', host, port);
    executeCommand(logger, host, port, 'stats', function(error, stats) {
        if (stats) {
            stats = {
                stats: stats
            };
        }

        callback(error, stats);
    });
}

function fetchCollectedTubeStats(logger, host, port, tubeNames, callback) {
    logger.debug('fetchCollectedTubeStats(): %s:%s -> %s', host, port, tubeNames);
    if (!_.isArray(tubeNames)) {
        tubeNames = [tubeNames];
    }

    async.mapSeries(tubeNames, fetchTubeStats.bind(null, logger, host, port), function(error, results) {
        if (error) {
            return callback(error);
        }

        var resultObj = _.reduce(results, function(memo, result) {
            return _.defaults(memo, result);
        }, {});

        callback(null, resultObj);
    });
}

function fetchTubeStats(logger, host, port, tubeName, callback) {
    logger.debug('fetchAllTubeStats(): %s:%s -> %s', host, port, tubeName);
    var stats = {};
    stats[tubeName] = {};
    executeCommand(logger, host, port, 'stats_tube', tubeName, function(error, result) {
        if (error) {
            if (error !== 'NOT_FOUND') {
                return callback(error);
            }

            return callback(null, stats);
        }

        stats[tubeName] = result;
        callback(null, stats);
    });
}

function fetchAllTubeStats(logger, host, port, callback) {
    logger.debug('fetchAllTubeStats(): %s:%s', host, port);
    fetchTubeNames(logger, host, port, function(error, result) {
        if (error) {
            return callback(error);
        }

        fetchCollectedTubeStats(logger, host, port, result, function(error, result) {
            if (error) {
                return callback(error);
            }

            callback(null, result);
        });
    });
}

function pauseTube(logger, host, port, pauseSecs, tubeName, callback) {
    logger.debug('pauseTube(): %s:%s -> %s seconds on tube %s', host, port, pauseSecs, tubeName);
    executeCommand(logger, host, port, 'pause_tube', tubeName, pauseSecs, callback);
}

function pauseTubes(logger, host, port, pauseSecs, tubeNames, callback) {
    logger.debug('pauseTubes(): %s:%s -> %s seconds on tubes %s', host, port, pauseSecs, tubeNames);
    tubeNames = _.isEmpty(tubeNames) ? [] : tubeNames;

    if(!_.isArray(tubeNames)) {
        tubeNames = [tubeNames];
    }

    async.eachSeries(tubeNames, pauseTube.bind(null, logger, host, port, pauseSecs), function(error) {
        if (error && error !== 'NOT_FOUND') {
            return callback(error);
        }

        callback(null);
    });
}

function pauseAllTubes(logger, host, port, pauseSecs, callback) {
    logger.debug('pauseAllTubes(): %s:%s -> %s seconds', host, port, pauseSecs);
    fetchTubeNames(logger, host, port, function(error, tubeNames) {
        if (error) {
            return callback(error);
        }

        pauseTubes(logger, host, port, pauseSecs, tubeNames, callback);
    });
}


function kickTube(logger, host, port, tubeName, callback) {
    logger.debug('kickTube(): %s:%s -> %s', host, port, tubeName);
    fetchTubeStats(logger, host, port, tubeName, function(error, stats) {
        if (error) {
            return callback(error);
        }

        var count = stats[tubeName]['current-jobs-buried'] + stats[tubeName]['current-jobs-delayed'];
        if (count < 1) {
            return callback();
        }

        var client = new BeanstalkClient(logger, host, port);
        var connect = client.connect.bind(client);
        var use = buildCommand(logger, client, 'use', [tubeName]);
        var kick = buildCommand(logger, client, 'kick', [count]);

        async.series({
            connect: connect,
            use: use,
            kick: kick
        }, function(error) {
            client.end();
            callback(error);
        });
    });
}

function kickTubes(logger, host, port, tubeNames, callback) {
    logger.debug('kickTubes(): %s:%s -> %s', host, port, tubeNames);
    tubeNames = _.isEmpty(tubeNames) ? [] : tubeNames;

    if (!_.isArray(tubeNames)) {
        tubeNames = [tubeNames];
    }

    async.eachSeries(tubeNames, kickTube.bind(null, logger, host, port), function(error) {
        if (error && error !== 'NOT_FOUND') {
            return callback(error);
        }

        callback();
    });
}

function kickAllTubes(logger, host, port, callback) {
    logger.debug('kickTube(): %s:%s', host, port);
    fetchTubeNames(logger, host, port, function(error, tubeNames) {
        if (error) {
            return callback(error);
        }

        kickTubes(logger, host, port, tubeNames, callback);
    });
}

/*
Variadic Function:
exec(logger, host, port, commandName, callback)
exec(logger, host, port, commandName, params, callback)
exec(logger, host, port, commandName, params, ..., callback)
exec(logger, host, port, commandName, [params], callback)
*/
function executeCommand(logger, host, port, commandName, params, callback) {
    logger.debug('executeCommand(): %s:%s -> %s(%s)', host, port, commandName, params);
    var args = _.toArray(arguments);
    logger = args.shift();
    host = args.shift();
    port = args.shift();
    commandName = args.shift();
    callback = args.pop();
    params = _.flatten(args);

    var client = new BeanstalkClient(logger, host, port);
    var connect = client.connect.bind(client);
    var command = buildCommand(logger, client, commandName, params);

    async.series({
        connect: connect,
        command: command,
    }, function(error, results) {
        client.end();
        callback(error, results.command);
    });
}

function buildCommand(logger, client, commandName, paramsAry) {
    logger.debug('buildCommand(): %s(%s)', commandName, paramsAry);
    return function(callback) {
        logger.debug('buildCommand()->%s(%s)', commandName, paramsAry);
        var params = paramsAry.concat(callback);
        client[commandName].apply(client, params);
    };
}

function paramToList(param) {
    if (_.isUndefined(param) || _.isNull(param)) {
        return [];
    }

    if (!_.isArray(param)) {
        param = [param];
    }

    param = _.map(param, function(val) {
        return val.split(',');
    });

    param = _.flatten(param);

    param = _.map(param, function(val) {
        return String(val).trim();
    });

    return _.filter(param, function(val) {
        return val.length > 0;
    });
}

function formatResult(result, javascript) {
    if (javascript) {
        return inspect(result, {
            depth: null
        });
    }

    return JSON.stringify(result, null, 4);
}

module.exports.fetchStats = fetchStats;

module.exports.fetchTubeNames = fetchTubeNames;

module.exports.fetchTubeStats = fetchTubeStats;
module.exports.fetchAllTubeStats = fetchAllTubeStats;
module.exports.fetchCollectedTubeStats = fetchCollectedTubeStats;

module.exports.pauseTube = pauseTube;
module.exports.pauseTubes = pauseTubes;
module.exports.pauseAllTubes = pauseAllTubes;

module.exports.kickTube = kickTube;
module.exports.kickTubes = kickTubes;
module.exports.kickAllTubes = kickAllTubes;

module.exports.paramToList = paramToList;
module.exports.formatResult = formatResult;

module.exports._executeCommand = executeCommand;