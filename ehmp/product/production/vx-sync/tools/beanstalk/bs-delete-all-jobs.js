'use strict';

var _ = require('underscore');

var argv = require('yargs')
	.usage('Usage: $0 --host <host> --port <port> --tube [tubename,...] --no-header --javascript --log-level <log-level>')
	.demand(['host', 'port'])
	.alias('h', 'host')
	.alias('p', 'port')
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
var javascript = argv.javascript;

if (!noHeader) {
	console.log('deleting beanstalk jobs on %s:%s', host, port);
}

if (_.isEmpty(tubeNames)) {
	adminUtils.deleteAllJobsFromAllTubes(logger, host, port, function(error) {
		if (error) {
			error = adminUtils.formatResult(error, javascript);
			if (!noHeader) {
				return console.log('Error kicking tubes: %j', error);
			}

			return console.log(error);
		}

		console.log(adminUtils.formatResult({
			deleted: true
		}, javascript));
	});

	return;
}

adminUtils.deleteAllJobsFromTubes(logger, host, port, tubeNames, function(error) {
	if (error) {
		error = adminUtils.formatResult(error, javascript);
		if (!noHeader) {
			return console.log('Error kicking tubes: %j', error);
		}

		return console.log(error);
	}

	console.log(adminUtils.formatResult({
		deleted: true
	}, javascript));
});