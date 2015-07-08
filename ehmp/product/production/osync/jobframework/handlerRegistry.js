'use strict';

var _ = require('underscore');

var config = require(global.OSYNC_ROOT + 'worker-config');
var logUtil = require(global.OSYNC_UTILS + 'log');
logUtil.initialize(config.loggers);
var logger = logUtil.get('HandlerRegistry', 'host');

function HandlerRegistry() {
    this.handlers = {};
}

HandlerRegistry.prototype.get = function(job) {
    return _.has(job, 'type') && job.type ? this.handlers[job.type] : undefined;
};

/*
 Variadic Method:
 function(vistaId, log, config, environment, jobType, handler)
 function(log, config, environment, jobType, handler)
 */
HandlerRegistry.prototype.register = function(log, config, environment, jobType, handler) {
    this.handlers[jobType] = handler.bind(null, logUtil.get(jobType, log), config, environment);
};

module.exports = HandlerRegistry;