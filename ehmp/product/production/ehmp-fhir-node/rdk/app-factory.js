var _ = require('underscore');
var nullchecker = require('../modules/nullchecker');

module.exports = function() {

	// var util = require('util');

	var express = require('express');
	var app = express();

	logger = require('bunyan').createLogger({
		name: 'RDK'
	});
	app.logger = logger;

	// todo: add configuration option for cors on/off
	var cors = require('cors');
	app.use(cors());

	//todo: enable morgan
	// log the request to stdout
	// var morgan = require('morgan')('dev');

	//TODO: this can be overriden by the parent app
	app.authentication = function(req, res, next) {
		// var auth = require('./authorization/auth');
		req.logger.info('authorization invoked');
		next();
	};

	//TODO: this can be overriden by the parent app
	app.pep = function(req, res, next) {
		req.logger.info('pep invoked');
		next();
	};

	//TODO: this can be overriden by the parent app
	app.metrics = function(req, res, next) {
		req.logger.info('metrics invoked');
		next();
	};

	//TODO: this can be overriden by the parent app
	app.audit = function(req, res, next) {
		req.logger.info('audit invoked');
		next();
	};


	//todo: how can i make this private?
	var ResourceRegistry = require('../modules/resourceDirectory/resourceRegistry');
	var registry = new ResourceRegistry();
	app.register = function(parentResourceName, mountpoint, resourceConfig) {
		logger.info('registering [mountpoint=%s][parentResourceName=%s]', mountpoint, parentResourceName);

		_.each(resourceConfig, function(configItem) {
			//todo: handle if parts contain/don't contain slashes
			logger.info('registering [mountpoint=%s][parentResourceName=%s][name=%s][path=%s]', mountpoint, parentResourceName, configItem.name, configItem.path);

			var qualifiedResourceName = parentResourceName;
			if (!nullchecker.isNullish(configItem.name)) parentResourceName = parentResourceName + "." + configItem.name;

			var fullPath = mountpoint;
			if (!nullchecker.isNullish(configItem.path)) fullPath = fullPath + configItem.path;

			logger.info('registering [qualifiedResourceName=%s][path=%s]', qualifiedResourceName, fullPath);

			//todo: add conditional logic here for disabling audit, metrics, etc
			app.use(function(req, res, next) {
				req.logger = require('bunyan').createLogger({
					name: 'req-logger'
				});
				next();
			});
			app.use(fullPath, app.audit);
			app.use(fullPath, app.metrics);
			app.use(fullPath, app.authentication);
			app.use(fullPath, app.pep);

			// app.get(mountpoint, function(req, res, next) {
			// 	var pid = req.param('pid') || '';
			// 	var domain = req.param('domain') || '';
			// 	req.url = util.format('%s/%s/%s', mountpoint, pid, domain);
			// 	logger.info(req.url);
			// 	next('route');
			// });

			if (configItem.get) {
				app.get(fullPath, configItem.get);
			}
			if (configItem.post) {
				app.get(fullPath, configItem.post);
			}
			if (configItem.put) {
				app.get(fullPath, configItem.put);
			}
			if (configItem.delete) {
				app.get(fullPath, configItem.delete);
			}

			//todo: validate name
			var registryItem = {};
			registryItem.title = qualifiedResourceName;
			registryItem.href = fullPath;
			registry.register(registryItem);
		});
	};

	var directoryResourceModule = require('../modules/resourcedirectory/directoryResource');
	var directoryResource = new directoryResourceModule(registry);
	app.register('resource-directory', '/resourcedirectory', [{
		get: directoryResource
	}]);

	return app;

};
