/*jslint node: true */
'use strict';

require('./env-setup');

var _ = require('underscore');

var Poller = require(global.VX_HANDLERS + 'vista-record-poller/vista-record-poller');
var pollerUtils = require(global.VX_UTILS + 'poller-utils');
var config = require('./worker-config');
var moment = require('moment');
var logUtil = require(global.VX_UTILS + 'log');
logUtil.initialize(config.loggers);

var healthcheckUtils = require(global.VX_UTILS + 'healthcheck-utils');

//////////////////////////////////////////////////////////////////////////////
//  EXECUTE ON STARTUP
//////////////////////////////////////////////////////////////////////////////

var logger = logUtil.get('poller-host', 'host');
var environment = pollerUtils.buildEnvironment(logger, config);

var processName = process.env.VXSYNC_LOG_SUFFIX;
var processStartTime = moment().format('YYYYMMDDHHmmss');

var options = pollerUtils.parsePollerOptions(logger);

var pollers = _.map(options.sites, function(site) {
    logger.debug('creating and starting poller %s', site);
    if(!config.vistaSites[site]) {
        console.log('Unknown Vista site %s', site);
        process.exit(1);
    }
    return new Poller(logUtil.getAsChild(site, logger), site, config, environment, options.autostart);
});

config.addChangeCallback(function() {
    var configVistaSites = _.keys(config.vistaSites);
    var newSites = _.difference(configVistaSites, options.sites);
    if (_.isArray(newSites) && newSites.length > 0) {
        logger.info('pollerHost  new vista site detected');
        _.each(newSites, function(site) {
            logger.info('pollerHost  starting poller for site ' + site);
            options.sites.push(site);
            var newPoller = new Poller(logUtil.getAsChild(site, logger), site, config, environment, true);
            newPoller.start(function(error) {
                if (error) {
                    logger.error('Failed to start poller for site: %s; error: %s.', newPoller.vistaId, error);
                } else {
                    logger.debug('Started poller for site: %s.', newPoller.vistaId);
                }
            });
            pollers.push(newPoller);
        });
    }
}, false);

process.on('SIGURG', function() {
    logger.debug('pollerHost process id ' + process.pid + ': Got SIGURG.');
    console.log('pollerHost process id ' + process.pid + ': Got SIGURG.');
    pausePollers(pollers);
    listenForShutdownReady(pollers);

    //TODO: move time to wait into configuration
    setTimeout(timeoutOnWaitingForShutdownReady, 30000, pollers).unref();
});

_.each(pollers, function(poller) {
    poller.start(function(error) {
        if (error) {
            logger.error('Failed to start poller for site: %s; error: %s.', poller.vistaId, error);
        } else {
            logger.debug('Started poller for site: %s.', poller.vistaId);
        }
    });
});

healthcheckUtils.startHeartbeat(logger, config, environment, processName, options.sites, processStartTime);

function pausePollers(pollers) {
    logger.info('pollerHost process id ' + process.pid + ': pausing pollers:' + pollers);
    console.log('pollerHost process id ' + process.pid + ': pausing pollers:' + pollers);
    _.each(pollers, function(poller) {
        poller.pause();
    });
}

function listenForShutdownReady(pollers) {
    var readyToShutdown = _.every(pollers, function(poller) {
        return poller.isReadyToShutdown();
    });

    if (!readyToShutdown) {
        logger.info('pollerHost process id ' + process.pid + ': Still waiting for pollers to finish current job.');
        console.log('pollerHost process id ' + process.pid + ': Still waiting for pollers to finish current job.');
        setTimeout(listenForShutdownReady, 1000, pollers);
    } else {
        logger.info('pollerHost process id ' + process.pid + ': Shutting down!');
        console.log('pollerHost process id ' + process.pid + ': Shutting down!');
        process.exit(0);
    }
}

//Quits process if pollers are taking too long to finish
//Displays list of pollers that will be interrupted
function timeoutOnWaitingForShutdownReady(pollers) {
    var remainingPollers = _.filter(pollers, function(poller) {
        return !poller.isReadyToShutdown();
    });

    var remainingPollerVistaIds = _.map(remainingPollers, function(poller) {
        return poller.getVistaId();
    });

    logger.error('pollerHost process id ' + process.pid + ': Timeout on waiting for pollers to finish current jobs. Interrupting pollers: %s', remainingPollerVistaIds);
    console.log('pollerHost process id ' + process.pid + ': Timeout on waiting for pollers to finish current jobs. Interrupting pollers: %s', remainingPollerVistaIds);
    process.exit(1);
}
