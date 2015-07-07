'use strict';

var _ = require('underscore');

var logUtil = require(global.VX_UTILS + 'log');

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
HandlerRegistry.prototype.register = function(vistaId, log, config, environment, jobType, handler) {
    if(arguments.length === 5) {
        log = arguments[0];
        config = arguments[1];
        environment = arguments[2];
        jobType = arguments[3];
        handler = arguments[4];

        this.handlers[jobType] = handler.bind(null, logUtil.get(jobType, log), config, environment);

        return;
    }

    this.handlers[jobType] = handler.bind(null, vistaId, logUtil.get(jobType, log), config, environment);
};

module.exports = HandlerRegistry;