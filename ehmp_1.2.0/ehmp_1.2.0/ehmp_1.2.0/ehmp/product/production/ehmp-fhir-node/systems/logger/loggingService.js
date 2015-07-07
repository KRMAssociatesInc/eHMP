var bunyan = require('bunyan');
var _ = require('underscore');

// get configuration
function Logger() {
	var loggers = {};
	var root = bunyan.createLogger({
		name: 'root',
		level: 'info'
	});

	loggers['root'] = root;

	// load other loggers from config file

	return {
		get: function(name) {
			if (loggers[name] == null) {
				return root.error('Log "%s" does not exist', name);
			}

			return loggers[name];
		},

		getNameList: function() {
			return _.map(loggers, function(value, key) {
				return key;
			});
		},

		create: function(config) {
			loggers[config.name] = bunyan.createLogger(config);
		}
	}
}

exports.LogService = Logger();


var logSvc = Logger();
console.log(logSvc.getNameList());
logSvc.get('root').error('test');