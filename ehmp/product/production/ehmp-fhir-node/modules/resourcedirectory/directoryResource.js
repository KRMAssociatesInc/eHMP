var os = require('os');
var _ = require('underscore');

var logger = require('bunyan').createLogger({
	name: 'server'
});

module.exports = function(resourceRegistry) {
	logger.info('initializing the resource for directory service, resourceRegistry=' + resourceRegistry);

	return function(req, res, next) {
		var baseUrl = req.protocol + '://' + req.get('Host');

		req.app.logger.info('does this logger work?');

		res.send(resourceRegistry.getDirectory(baseUrl));
	};
};
