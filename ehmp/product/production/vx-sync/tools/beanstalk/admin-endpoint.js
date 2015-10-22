'use strict';

var _ = require('underscore');

var adminUtils = require('./admin-utils');

var argv = require('yargs')
    .usage('Usage: $0 --port <port> --beanstalk-host [host] --beanstalk-port [port] --logLevel')
    .demand(['port'])
    .alias('p', 'port')
    .argv;

var logger = require('bunyan').createLogger({
    name: 'beanstalk-admin',
    level: argv.logLevel || 'error'
});

var beanstalkHost = argv['beanstalk-host'] || '127.0.0.1';
var beanstalkPort = argv['beanstalk-port'] || 5000;

var app = require('express')();

app.get('/beanstalk/stats', stats);
app.get('/beanstalk/list-tubes', listTubes);
app.get('/beanstalk/stats-tube/:tube', statsTube);
app.get('/beanstalk/stats-tube', statsTube);
app.get('/beanstalk/pause-tube/:tube', pauseTube);
app.get('/beanstalk/pause-tube', pauseTube);
app.get('/beanstalk/kick/:tube', kick);
app.get('/beanstalk/kick', kick);
app.get('/beanstalk/delete/:tube', deleteJobs);
app.get('/beanstalk/delete', deleteJobs);


function stats(req, res) {
    var host = req.query.host || beanstalkHost;
    var port = req.query.port || beanstalkPort;
    var noZero = _.has(req.query, 'no-zero') && req.query['no-zero'] !== 'false';
    var filter = _.isEmpty(req.query.filter) ? [] : req.query.filter.split(',');

    adminUtils.fetchStats(logger, host, port, function(error, result) {
        if (error) {
            return res.status(500).send(error);
        }

        result = applyFilter(result, noZero, filter);
        res.status(200).send(result);
    });
}


function listTubes(req, res) {
    var host = req.query.host || beanstalkHost;
    var port = req.query.port || beanstalkPort;

    adminUtils.fetchTubeNames(logger, host, port, function(error, result) {
        if (error) {
            return res.status(500).send(error);
        }

        res.status(200).send(result);
    });
}

function applyFilter(data, noZero, filter) {
    var filtered = {};
    _.each(data, function(info, key) {
        filtered[key] = {};
        _.each(info, function(value, property) {
            if ((_.isEmpty(filter) || _.contains(filter, property)) && (!noZero || (!_.isNumber(value) || value > 0))) {
                filtered[key][property] = value;
            }
        });
    });

    var trimmed = {};
    _.each(filtered, function(info, key) {
        if (!_.isEmpty(info)) {
            trimmed[key] = info;
        }
    });

    return trimmed;
}

function statsTube(req, res) {
    var host = req.query.host || beanstalkHost;
    var port = req.query.port || beanstalkPort;
    var noZero = _.has(req.query, 'no-zero') && req.query['no-zero'] !== 'false';
    var filter = _.isEmpty(req.query.filter) ? [] : req.query.filter.split(',');
    var tubeName = req.params.tube;

    if (tubeName) {
        return adminUtils.fetchTubeStats(logger, host, port, tubeName, callback);
    }

    adminUtils.fetchAllTubeStats(logger, host, port, callback);

    function callback(error, result) {
        if (error) {
            return res.status(500).send(error);
        }

        result = applyFilter(result, noZero, filter);
        res.status(200).send(result);
    }
}


function pauseTube(req, res) {
    var host = req.query.host || beanstalkHost;
    var port = req.query.port || beanstalkPort;
    var pause = Number(req.query.pause);
    var tubeName = req.params.tube;

    if (!_.isNumber(pause) || pause < 1 || _.isNaN(pause)) {
        return setTimeout(callback, 0, 'parameter "pause" must be a number greater than 0');
    }

    if (tubeName) {
        return adminUtils.pauseTube(logger, host, port, pause, tubeName, callback);
    }

    adminUtils.pauseAllTubes(logger, host, port, pause, callback);

    function callback(error) {
        if (error) {
            return res.status(500).send(error);
        }

        res.status(200).send('PAUSED ' + pause + ' seconds');
    }
}

function kick(req, res) {
    var host = req.query.host || beanstalkHost;
    var port = req.query.port || beanstalkPort;
    var tubeName = req.params.tube;

    if (tubeName) {
        return adminUtils.kickTube(logger, host, port, tubeName, callback);
    }

    adminUtils.kickAllTubes(logger, host, port, callback);

    function callback(error) {
        if (error) {
            return res.status(500).send(error);
        }

        res.status(200).send('KICKED');
    }
}

function deleteJobs(req, res) {
    var host = req.query.host || beanstalkHost;
    var port = req.query.port || beanstalkPort;
    var tubeName = req.params.tube;

    if (tubeName) {
        return adminUtils.deleteAllJobsFromOneTube(logger, host, port, tubeName, callback);
    }

    adminUtils.deleteAllJobsFromAllTubes(logger, host, port, callback);

    function callback(error) {
        if (error) {
            return res.status(500).send(error);
        }

        res.status(200).send('DELETED');
    }
}

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
});

app.listen(argv.port);
console.log('sync-request endpoint listening on port %s', argv.port);