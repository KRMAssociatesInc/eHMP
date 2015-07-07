'use strict';

require('../../env-setup');

var _ = require('underscore');
var async = require('async');

var config = require(global.OSYNC_ROOT + 'worker-config');

var argv = require('yargs')
	.usage('Usage: $0 --port <port> --logLevel')
	.demand(['port'])
	.alias('p', 'port')
	.argv;

var logger = require('bunyan').createLogger({
	name: 'beanstalk-admin',
	level: argv.logLevel || 'error'
});

var BeanstalkClient = require(global.OSYNC_JOBFRAMEWORK + 'beanstalk-client');



var app = require('express')();

app.get('/beanstalk/stats', stats);
app.get('/beanstalk/tube-stats', tubeStats);


function stats(req, res) {
	var host = req.query.host;
	var port = req.query.port;
	var noZero = _.has(req.query, 'no-zero') && req.query['no-zero'] !== 'false';

	var client = new BeanstalkClient(logger, host, port);
	var connect = client.connect.bind(client);
	var allStats = client.stats.bind(client);
	var end = client.end.bind(client);

	async.series({
		connect: connect,
		stats: allStats,
		end: end
	}, function(error, results) {
		if (error) {
			return res.status(500).send(error);
		}

		var stats = results.stats;
		if(noZero) {
			stats = _.reduce(stats, function(memo, value, key) {
				if(value !== 0) {
					memo[key] = value;
				}

				return memo;
			}, {});
		}
		res.send(stats);
	});

}


function tubeStats(req, res) {
	var host = req.query.host;
	var port = req.query.port;
	var noZero = _.has(req.query, 'no-zero') && req.query['no-zero'] !== 'false';
	var jobConfigs = buildJobConfigs(host, port, config.beanstalk.jobTypes);

	async.mapSeries(jobConfigs, fetchTubeStats.bind(null, noZero), function(error, results) {
		if (error) {
			return res.status(500).send(error);
		}

		res.send(results);
	});

}

function fetchTubeStats(noZero, tubeConfig, callback) {
	var client = new BeanstalkClient(logger, tubeConfig.host, tubeConfig.port);
	var connect = client.connect.bind(client);
	var end = client.end.bind(client);

	async.series({
		connect: connect,
		stats: indivStats.bind(null, client, noZero, tubeConfig),
		end: end
	}, function(error, results) {
		if(results) {
			results = results.stats;
		}

		callback(error, results);
	});
}

function indivStats(client, noZero, tubeConfig, callback) {
	client.stats_tube(tubeConfig.tubename, function(error, result) {
		var key = tubeConfig.tubename;
		var obj = {};

		if (error) {
			obj[key] = error;
			return callback(null, obj);
		}

		var statKeys = _.keys(result);

		obj[key] = _.reduce(statKeys, function(memo, statKey) {
			if(!noZero || result[statKey]) {
				memo[statKey] = result[statKey];
			}

			return memo;
		}, {});

		callback(null, obj);
	});
}


function buildJobConfigs(host, port, jobTypes) {
	var jobConfigs = _.map(jobTypes, function(jobConfig, jobType) {
		jobConfig = _.defaults({
			host: host,
			port: port
		}, jobConfig);

		return {
			host: jobConfig.host,
			port: jobConfig.port,
			tubename: jobConfig.tubename,
			jobType: jobType
		};
	});

	jobConfigs.unshift({
		host: host,
		port: port,
		tubename: 'default',
		jobType: 'default'
	});

	return jobConfigs;
}


app.listen(argv.port);
console.log('sync-request endpoint listening on port %s', argv.port);