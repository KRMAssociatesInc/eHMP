'use strict';

var _ = require('underscore');
var now = require('performance-now');

var vistaSites = null;
var hosts = null;

var appLogger = null;

var defaultLogger = (function() {
    var wrap = function(logger) {
        return function(/*args*/) {
            var args = Array.prototype.slice.call(arguments);
            if(_.isObject(args[0])) {
                args.unshift('%j');
            }
            return logger.apply(null, args);
        };
    };
    return {
        trace: wrap(console.log),
        debug: wrap(console.log),
        info: wrap(console.info),
        warn: wrap(console.warn),
        error: wrap(console.error),
        fatal: wrap(console.fatal)
    };
})();

function initialize(app) {
    hosts = [
        { host: app.config.hmpServer.host, name: 'hmp'},
        { host: app.config.jdsServer.host, name: 'jds'},
        { host: app.config.solrServer.host, name: 'solr'},
        { host: app.config.mvi.host, name: 'mvi'}
    ];

    vistaSites = app.config.vistaSites;
    appLogger = app.logger;
    setInterval(logProcessInfo.bind(null, app), 5 * 60 * 1000);
}

function logProcessInfo(app) {
    app.logger.info({memoryUsage: process.memoryUsage()});
}

function findHostByIP(ip) {
    var foundHost = {
        host: ip,
        name: 'UNKNOWN'
    };
    _.each(hosts, function(host) {
        if (host.host === ip) {
            foundHost = host;
        }
    });
    _.each(vistaSites, function(vistaSite) {
        if (vistaSite.host === ip) {
            foundHost = {
                host: vistaSite.host,
                name: vistaSite.name
            };
        }
    });

    return foundHost;
}

function handleStart(type, config, reqLogger) {
    var logger = reqLogger || appLogger || defaultLogger;
    var metricData = {};
    metricData.type = type;
    metricData.startDate = new Date().getTime();  // accurate time stamp
    metricData.startTime = now();  // accurate time delta
    if(type === 'outgoing') {
        if (!config.options) {
            logger.info({metrics: config.options}, 'metrics: no options defined');
            metricData.host = 'UNKNOWN';
        } else {
            if (!config.options.host) {
                logger.info({metrics: config.options}, 'metrics: no host defined');
                metricData.host = 'UNKNOWN';
            } else {
                var host = findHostByIP(config.options.host);
                metricData.host = host;
            }
        }
    }
    if(type === 'incoming') {
        metricData.req = config;
    }

    return metricData;
}

function handleFinish(metricData, reqLogger) {
    if (!metricData) {
        return;
    }
    var logger = reqLogger || appLogger || defaultLogger;
    var endTime = now();
    metricData.result = 'success';
    if(metricData.type === 'outgoing') {
        if (metricData.host) {
            if (metricData.host.host) {
                var host = findHostByIP(metricData.host.host);
                metricData.hostname = host.name;
            }
        } else {
            metricData.hostname = 'UNKNOWN';
        }
        if(metricData.startTime) {
            metricData.elapsedMilliseconds = endTime - metricData.startTime;
        }
    }
    if(metricData.type === 'incoming') {
        if (metricData.req.route) {
            metricData.path = metricData.req.route.path;
        }
        if(metricData.startTime) {
            metricData.elapsedMilliseconds = endTime - metricData.startTime;
        }
        delete metricData.req;
    }
    delete metricData.startTime;  // reduce potential confusion caused by difference in startDate and startTime
    logger.info({metrics: metricData});
}

function handleError(metricData, reqLogger) {
    if (!metricData) {
        return;
    }
    var logger = reqLogger || appLogger || defaultLogger;
    var endTime = now();
    metricData.result = 'failure';
    if(metricData.type === 'outgoing') {
        if (metricData.host) {
            if (metricData.host.host) {
                var host = findHostByIP(metricData.host.host);
                metricData.hostname = host.name;
            }
        } else {
            metricData.hostname = 'UNKNOWN';
        }
        if(metricData.startTime) {
            metricData.elapsedMilliseconds = endTime - metricData.startTime;
        }
    }
    if(metricData.type === 'incoming') {
        metricData.path = metricData.req.route.path;
        delete metricData.req;
    }
    delete metricData.startTime;
    logger.info({metrics: metricData});
}

function handleOutgoingStart(config, logger) {
    return handleStart('outgoing', config, logger);
}

function handleIncomingStart(req, logger) {
    return handleStart('incoming', req, logger);
}

module.exports.handleIncomingStart = handleIncomingStart;
module.exports.handleOutgoingStart = handleOutgoingStart;
module.exports.handleError = handleError;
module.exports.handleFinish = handleFinish;
module.exports.initialize = initialize;
