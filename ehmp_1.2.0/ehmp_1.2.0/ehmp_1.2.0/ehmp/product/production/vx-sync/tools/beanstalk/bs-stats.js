'use strict';

var _ = require('underscore');

var argv = require('yargs')
	.usage('Usage: $0 --host <host> --port <port> --no-header --javascript --log-level <log-level>')
	.demand(['host', 'port'])
	.alias('h', 'host')
	.alias('p', 'port')
	.alias('j', 'javascript')
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
var javascript = argv.javascript;

if (!noHeader) {
	console.log('beanstalk stats on %s:%s', host, port);
}

adminUtils.fetchStats(logger, host, port, function(error, result) {
	if (error) {
		error = adminUtils.formatResult(error, javascript);
		if (!noHeader) {
			return console.log('Error fetching stats: %j', error);
		}

		return console.log(error);
	}

	console.log(adminUtils.formatResult(result, javascript));
});