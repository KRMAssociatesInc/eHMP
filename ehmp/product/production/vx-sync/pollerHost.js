/*jslint node: true */
'use strict';

require('./env-setup');

var _ = require('underscore');
var express = require('express');

var Poller = require(global.VX_HANDLERS + 'vista-record-poller/vista-record-poller');
var pollerUtils = require(global.VX_UTILS + 'poller-utils');
var config = require('./worker-config');
var logUtil = require(global.VX_UTILS + 'log');
logUtil.initialize(config.loggers);


//////////////////////////////////////////////////////////////////////////////
//  EXECUTE ON STARTUP
//////////////////////////////////////////////////////////////////////////////

var logger = logUtil.get('poller-host', 'host');
var environment = pollerUtils.buildEnvironment(logger, config);
var options = pollerUtils.parsePollerOptions(logger, 8780);
options.sites = _.keys(config.vistaSites);

var pollers = _.map(options.sites, function(site) {
    logger.debug('creating and starting poller %s', site);
    return new Poller(logUtil.getAsChild(site, logger), site, config, environment, options.autostart);
});

config.addChangeCallback(function() {
    var configVistaSites = _.keys(config.vistaSites);
    var newSites = _.difference(configVistaSites, options.sites);
    if(_.isArray(newSites) && newSites.length > 0) {
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

_.each(pollers, function(poller) {
    poller.start(function(error) {
        if (error) {
            logger.error('Failed to start poller for site: %s; error: %s.', poller.vistaId, error);
        } else {
            logger.debug('Started poller for site: %s.', poller.vistaId);
        }
    });
});

// This starts an endpoint to allow pause, resume, reset, etc.
if (options.endpoint) {
    var app = express();
    pollerUtils.buildPollerEndpoint('pollerHost', app, logger, pollers, ['pause', 'resume', 'reset']);

    app.listen(options.port);
    logger.info('pollerHost endpoint listening on port %s', options.port);
}
