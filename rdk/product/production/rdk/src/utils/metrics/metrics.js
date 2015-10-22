'use strict';

var _ = require('lodash');
var dd = require('drilldown');
var MetricsData = require('./metrics-data');

/*
    Used to record performance metrics for all http(s) incoming and outgoing calls.
    Metrics should be initialized during nodejs instance start up.  Functions are used to wrap app.config because config
    may be reloaded (see app-factory.reloadConfig).
 */
module.exports = {
    initialize: function(app) {
        serviceHosts = [
            {
                host: function () {
                    return dd(app)('config')('hmpServer')('host').val;
                }, name: 'hmp'
            },
            {
                host: function () {
                    return dd(app)('config')('jdsServer')('host').val;
                }, name: 'jds'
            },
            {
                host: function () {
                    return dd(app)('config')('solrServer')('host').val;
                }, name: 'solr'
            },
            {
                host: function () {
                    return dd(app)('config')('mvi')('host').val;
                }, name: 'mvi'
            },
            {
                host: function () {
                    return dd(app)('config')('jbpm')('host').val;
                }, name: 'jbpm'
            }
        ];

        vistaSites = app.config.vistaSites;


        appLogger = app.logger;

        if (this.memoryUsageTimerId !== 0) {
            clearInterval(this.memoryUsageTimerId);
        }
        this.memoryUsageTimerId = setInterval(logProcessInfo.bind(null, app), 5 * 60 * 1000);
    },

    //id used to clear timer in tests only
    memoryUsageTimerId : 0,

    handleFinish: function(metricData, reqLogger) {
        if (isInvalidMetricData(metricData)) {
            return;
        }
        metricData.successfulOperation();
        handleCompleted(metricData, reqLogger);
    },

    handleError : function(metricData, reqLogger) {
        if (isInvalidMetricData(metricData)) {
            return;
        }
        metricData.failedOperation();
        handleCompleted(metricData, reqLogger);
    },

    handleOutgoingStart: function(config, logger) {
        return handleStart('outgoing', config, logger);
    },

    handleIncomingStart : function(req, logger) {
        return handleStart('incoming', req, logger);
    }
};
var vistaSites = null;
var serviceHosts = null;
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

function logProcessInfo(app) {
    app.logger.info({memoryUsage: process.memoryUsage()});
}

function handleStart(type, config, reqLogger) {
    var logger = reqLogger || appLogger || defaultLogger;
    var metricData = new MetricsData(type, config);

    if(metricData.isType('outgoing')) {
        if (!config.options) {
            logger.info({metrics: config}, 'metrics: no options defined');
        } else if (!config.options.host) {
            logger.info({metrics: config.options}, 'metrics: no host defined');
        } else {
            var hostName = findHostNameByIP(config.options.host);
            metricData.addHost(config.options.host, hostName);
        }
    }

    return metricData;
}

//Could possible use less code using _.flatten and concat function but not really any easier to understand.
function findHostNameByIP(ip) {
    var findHostPredicate = function(host) {
        return _.result(host, 'host') === ip;
    };

    var hostName = _.result(_.find(serviceHosts, findHostPredicate), 'name');

    if (_.isUndefined(hostName)) {
        hostName = _.result(_.find(vistaSites, findHostPredicate), 'name');
    }

    if (_.isUndefined(hostName)) {
        hostName = 'UNKNOWN';
    }

    return hostName;
}

function isInvalidMetricData(metricData) {
    return !metricData ||  !(metricData instanceof MetricsData);
}

function handleCompleted(metricData, reqLogger) {
    var logger = reqLogger || appLogger || defaultLogger;

    metricData.calcElapsedTime();

    logger.info({metrics: metricData});
}

