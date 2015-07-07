'use strict';

var _ = require('underscore');

var argv = require('yargs')
	.usage('Usage: $0 --host <host> --port <port> --pause-secs <seconds> --tube [tubename,...] --no-header --javascript --log-level <log-level>')
	.demand(['host', 'port', 'pause-secs'])
	.alias('h', 'host')
	.alias('p', 'port')
	.alias('s', 'pause-secs')
	.alias('n', 'no-header')
	.argv;

var adminUtils = require('./admin-utils');

var logger = require('bunyan').createLogger({
	name: 'beanstalk-admin',
	level: argv['log-level'] || 'error'
});

var host = argv.host;
var port = argv.port;
var noHeader = _.has(argv, 'no-header');
var tubeNames = adminUtils.paramToList(argv.tube);
var pause = argv['pause-secs'];
var javascript = argv.javascript;

if (!noHeader) {
	console.log('pausing beanstalk tubes on %s:%s', host, port);
}

if (_.isEmpty(tubeNames)) {
	adminUtils.pauseAllTubes(logger, host, port, pause, function(error) {
		if (error) {
			error = adminUtils.formatResult(error, javascript);
			if (!noHeader) {
				return console.log('Error pausing tubes: %j', error);
			}

			return console.log(error);
		}

		console.log(adminUtils.formatResult({
			paused: true
		}, javascript));
	});

	return;
}

adminUtils.pauseTubes(logger, host, port, pause, tubeNames, function(error) {
	if (error) {
		error = adminUtils.formatResult(error, javascript);
		if (!noHeader) {
			return console.log('Error pausing tubes: %j', error);
		}

		return console.log(error);
	}

	console.log(adminUtils.formatResult({
		paused: true
	}, javascript));
});