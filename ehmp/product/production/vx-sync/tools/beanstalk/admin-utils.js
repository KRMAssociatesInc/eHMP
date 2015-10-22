'use strict';

require('../../env-setup');

var inspect = require('util').inspect;
var async = require('async');
var _ = require('underscore');

var BeanstalkClient = require(global.VX_JOBFRAMEWORK + 'beanstalk-client');

function execute(client, command, callback) {
    async.series({
        connect: client.connect.bind(client),
        command: command,
    }, function(error, results) {
        client.end();
        callback(error, results.command);
    });
}

function deleteAllJobsFromAllTubes(logger, host, port, callback) {
    logger.debug('deleteAllJobsFromAllTubes(): %s:%s', host, port);

    fetchTubeNames(logger, host, port, function(error, tubeNames) {
        if (error) {
            return callback(error);
        }

        logger.debug('deleteAllJobsFromAllTubes() got tubes %s', tubeNames);
        deleteAllJobsFromTubes(logger, host, port, tubeNames, function(error) {
            callback(error);
        });
    });
}

function deleteAllJobsFromTubes(logger, host, port, tubeNames, callback) {
    logger.debug('deleteAllJobsFromTubes(): %s:%s for tubes %s', host, port, tubeNames);

    async.eachSeries(tubeNames, deleteAllJobsFromOneTube.bind(null, logger, host, port), function(error) {
        callback(error);
    });
}

function deleteAllJobsFromOneTube(logger, host, port, tubeName, callback) {
    logger.debug('deleteAllJobsFromOneTube(%s): %s:%s', tubeName, host, port);

    var client = new BeanstalkClient(logger, host, port);
    client.connect(function(error) {
        if (error) {
            client.end();
            return callback(error);
        }

        client.use(tubeName, function(error) {
            if (error) {
                client.end();
                return callback(error);
            }

            var peekFunctions = [
                'peek_ready',
                'peek_delayed',
                'peek_buried'
            ];

            async.eachSeries(peekFunctions, deleteUntilEmpty, function(error) {
                client.end();
                callback(error);
            });
        });
    });

    function deleteUntilEmpty(peekFunction, callback) {
        logger.debug('deleteAllJobsFromOneTube() execute %s() against tube %s on %s:%s', peekFunction, tubeName, host, port);
        client[peekFunction](function(error, jobId) {
            if (error && error !== 'NOT_FOUND') {
                return callback(error);
            }

            if (error === 'NOT_FOUND') {
                return callback();
            }

            if (jobId) {
                return client.destroy(jobId, function(error) {
                    logger.debug('delete job: %s', jobId);
                    if (error && error !== 'NOT_FOUND') {
                        return callback(error);
                    }

                    deleteUntilEmpty(peekFunction, callback);
                });
            }

            callback();
        });
    }
}


function fetchTubeNames(logger, host, port, callback) {
    logger.debug('fetchTubeNames(): %s:%s', host, port);

    var client = new BeanstalkClient(logger, host, port);
    var command = buildCommand(logger, client, 'list_tubes', []);

    execute(client, command, callback);
}

function fetchStats(logger, host, port, callback) {
    logger.debug('fetchStats(): %s:%s', host, port);

    var client = new BeanstalkClient(logger, host, port);
    var command = buildCommand(logger, client, 'stats', []);

    execute(client, command, function(error, stats) {
        if (stats) {
            stats = {
                stats: stats
            };
        }

        callback(error, stats);
    });
}

function fetchTubeStats(logger, host, port, tubeName, callback) {
    logger.debug('fetchTubeStats(): %s:%s -> %s', host, port, tubeName);

    var client = new BeanstalkClient(logger, host, port);
    var stats = {};
    stats[tubeName] = {};
    var command = buildCommand(logger, client, 'stats_tube', [tubeName]);

    execute(client, command, function(error, result) {
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

function pauseTube(logger, host, port, pauseSecs, tubeName, callback) {
    logger.debug('pauseTube(): %s:%s -> %s seconds on tube %s', host, port, pauseSecs, tubeName);

    var client = new BeanstalkClient(logger, host, port);
    var command = buildCommand(logger, client, 'pause_tube', [tubeName, pauseSecs]);

    execute(client, command, callback);
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

function fetchCollectedTubeStats(logger, host, port, tubeNames, callback) {
    logger.debug('fetchCollectedTubeStats(): %s:%s -> %s', host, port, tubeNames);
    if (!_.isArray(tubeNames)) {
        tubeNames = [tubeNames];
    }

    var client = new BeanstalkClient(logger, host, port);
    var commandList = _.map(tubeNames, function(tubeName) {
        return function executeTubeCommand(callback) {
            var command = buildCommand(logger, client, 'stats_tube', [tubeName]);
            var stats = {};
            stats[tubeName] = {};
            execute(client, command, function(error, result) {
                if (error) {
                    if (error !== 'NOT_FOUND') {
                        return callback(error);
                    }

                    return callback(null, stats);
                }

                stats[tubeName] = result;
                callback(null, stats);
            });
        };
    });

    async.series(commandList, function(error, results) {
        if (error) {
            return callback(error);
        }

        var resultObj = _.reduce(results, function(memo, result) {
            return _.defaults(memo, result);
        }, {});

        callback(null, resultObj);
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

////////////////////////////////////////////////////////////////////////////////////////////////////

function pauseTubes(logger, host, port, pauseSecs, tubeNames, callback) {
    logger.debug('pauseTubes(): %s:%s -> %s seconds on tubes %s', host, port, pauseSecs, tubeNames);

    tubeNames = _.isEmpty(tubeNames) ? [] : tubeNames;

    if (!_.isArray(tubeNames)) {
        tubeNames = [tubeNames];
    }

    // var client = new BeanstalkClient(logger, host, port);
    // var command = buildCommand(logger, client, 'pause_tube', [tubeName, pauseSecs]);

    // execute(client, command, callback);

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

module.exports.deleteAllJobsFromAllTubes = deleteAllJobsFromAllTubes;
module.exports.deleteAllJobsFromTubes = deleteAllJobsFromTubes;
module.exports.deleteAllJobsFromOneTube = deleteAllJobsFromOneTube;

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