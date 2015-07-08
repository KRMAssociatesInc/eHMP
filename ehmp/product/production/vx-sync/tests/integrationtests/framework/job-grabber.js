'use strict';

require('../../../env-setup');

var async = require('async');
var _ = require('underscore');

var BeanstalkClient = require(global.VX_JOBFRAMEWORK + 'beanstalk-client.js');


var defaultConfig = {
	host: '127.0.0.1',
	port: 5000,
	tubenames: ['vx-sync'],
	reserveTimeout: 0
};

/*
Variadic function:
grabJobsFromTubes(logger, host, port, tubenames, reserveTimeout, callback)
grabJobsFromTubes(logger, config, callback)
grabJobsFromTubes(logger, callback)

A config object should have all some or all of the following fields:
	host
	port
	tubenames
	reserveTimeout

tubenames should either be a single string (i.e. the name of a single tube),
of an array of strings (an array of tubenames).

If any fields are missing in the config object or if no configuration is passed,
then the values in defaultConfig will be used.

The callback should be of the standard "errorback" type with two parameters: error,
and result.

If the call is successful, the callback will be called with the second parameter
(result) populated an array of all of the jobs for all of the tubes that were on
beanstalk when this function was run and all of the jobs will be destroyed. If an
error occurs, the callback will be called with the error passed as the value of the
first parameter with the second parameter having the value of an array containing
any jobs grabbed before the error occurred.
*/
function grabJobsFromTubes(logger, host, port, tubenames, reserveTimeout, callback) {
	logger.debug('job-grabber.grabJobsFromTubes() %s:%s [%s]', host, port, tubenames);
	var config = {};

	if(arguments.length === 2) {
		config = {};
		callback = arguments[1];
	} else if(arguments.length === 3) {
		config = arguments[1];
		callback = arguments[2];
	} else {
		config = {};

		if(host) {
			config.host = host;
		}

		if(port) {
			config.port = port;
		}

		if(tubenames) {
			config.tubenames = tubenames;
		}

		if(reserveTimeout || reserveTimeout === 0) {
			config.reserveTimeout = reserveTimeout;
		}
	}

	config = _.defaults(config, defaultConfig);

	if (!_.isArray(config.tubenames)) {
		config.tubenames = [config.tubenames];
	}

	var gotJob;
	var jobs = [];
	var client = new BeanstalkClient(logger, config.host, config.port);

	function notEmpty() {
		return gotJob;
	}

	function grabJob(callback) {
		var job;

		gotJob = false;
		client.reserve_with_timeout(config.reserveTimeout, function(error, jobId, payload) {
			if (error && error !== 'TIMED_OUT') {
				logger.warn('job-grabber.grabJob() error trying to reserve job with timeout. ERROR: %j', error);
				return callback(error);
			}

			if (error === 'TIMED_OUT') {
				logger.info('job-grabber.grabJob() Timeout trying to reserve job');
				return callback();
			}

			job = parseJob(payload);
			logger.debug('job-grabber.grabJob() %s:%s [%s] -> %j', host, port, tubenames, job);
			jobs.push(job);
			gotJob = true;

			client.destroy(jobId, function(error) {
				if (error) {
					logger.warn('job-grabber.grabJob() error trying to destroy job: %s', jobId);
					return callback(error);
				}

				callback();
			});
		});
	}

	client.connect(function(error) {
		if (error) {
			logger.warn('job-grabber.grabJobsFromTubes() Unable to connect to beanstalk. ERROR: %j', error);
			return callback(error);
		}

		client.on('error', function(error) {
			logger.warn('error with connection. ERROR: %j', error);
			client.end();
			callback(error);
		});

		async.eachSeries(config.tubenames, client.watch.bind(client), function(error) {
			if (error) {
				logger.warn('job-grabber.grabJobsFromTubes() error trying to watch tubes: %j', config.tubenames);
				client.end();
				return callback(error);
			}

			logger.debug('job-grabber.grabJobsFromTubes() Watching tubes: %j', config.tubenames);

			async.doWhilst(grabJob, notEmpty, function(error) {
				client.end();
				callback(error || null, jobs);
			});
		});
	});
}

function parseJob(payload) {
	var job = payload.toString();

	try {
		job = JSON.parse(job);
	} catch (error) {
		// do nothing and accept default
	}

	return job;
}

module.exports = grabJobsFromTubes;