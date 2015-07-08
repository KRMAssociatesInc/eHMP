/*jslint node: true */
'use strict';

require('./env-setup');

var _ = require('underscore');
var express = require('express');

var TriggerPoller = require(global.VX_HANDLERS + 'appointment-trigger-poller/appointment-trigger-poller');
var pollerUtils = require(global.VX_UTILS + 'poller-utils');
var config = require('./worker-config');
var logUtil = require(global.VX_UTILS + 'log');
logUtil.initialize(config.loggers);


//////////////////////////////////////////////////////////////////////////////
//  EXECUTE ON STARTUP
//////////////////////////////////////////////////////////////////////////////

var logger = logUtil.get('trigger-poller-host', 'host');
var environment = pollerUtils.buildEnvironment(logger, config);
var options = pollerUtils.parsePollerOptions(logger, 8790);

var pollers = _.map(options.sites, function(site) {
    logger.debug('creating and starting poller %s', site);
    return new TriggerPoller(logUtil.getAsChild(site, logger), site, config, environment, options.autostart);
});

_.each(pollers, function(poller) {
    poller.start(function(error) {
        if (error) {
            logger.error('Failed to start trigger-poller for site: %s; error: %s.', poller.vistaId, error);
        } else {
            logger.debug('Started trigger-poller for site: %s.', poller.vistaId);
        }
    });
});

config.addChangeCallback(function() {
    var configVistaSites = _.keys(config.vistaSites);
    var newSites = _.difference(configVistaSites, options.sites);
    if(_.isArray(newSites) && newSites.length > 0) {
        logger.info('triggerPollerHost  config file has new vista sites');
        _.each(newSites, function(site) {
            logger.info('triggerPollerHost  adding poller for site ' + site);
            options.sites.push(site);
            var newPoller = new TriggerPoller(logUtil.getAsChild(site, logger), site, config, environment, true);
            newPoller.start(function(error) {
                if (error) {
                    logger.error('Failed to start poller for site: %s; error: %s.', newPoller.vistaId, error);
                } else {
                    logger.debug('Started poller for site: %s.', newPoller.vistaId);
                }
            });
        });
    }
}, false);

//////////////////////////////////////////////////////////////////////////////
// This starts an endpoint to allow pause, resume, reset, etc.
if (options.endpoint) {
    var app = express();
    pollerUtils.buildPollerEndpoint('triggerPollerHost', app, logger, pollers, ['pause', 'resume']);

    app.listen(options.port);
    logger.info('triggerPollerHost endpoint listening on port %s', options.port);
}

