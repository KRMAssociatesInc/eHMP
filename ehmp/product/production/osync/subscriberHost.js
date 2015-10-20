'use strict';

require('./env-setup');

var format = require('util').format;
var cluster = require('cluster');
var _ = require('underscore');
// var express = require('express');

var Worker = require(global.OSYNC_JOBFRAMEWORK + 'worker');
var HandlerRegistry = require(global.OSYNC_JOBFRAMEWORK + 'handlerRegistry');
var jobUtil = require(global.OSYNC_UTILS + 'job-utils');
var pollerUtils = require(global.OSYNC_UTILS + 'poller-utils');
var config = require(global.OSYNC_ROOT + 'worker-config');
var logUtil = require(global.OSYNC_UTILS + 'log');
logUtil.initialize(config.loggers);

var logger = logUtil.get('subscriberHost', 'host');

//////////////////////////////////////////////////////////////////////////////
//  EXECUTE ON STARTUP
//////////////////////////////////////////////////////////////////////////////

var options = pollerUtils.parseSubscriberOptions(logger, config, 8770);
var workers = [];
var startup = null;

config.addChangeCallback(function(){
    logger.info('subscriberHost  config change detected. Stopping workers');
    _.each(workers, function(worker){
        worker.stop();
    });
    logger.info('subscriberHost  starting new workers');
    if(startup) {
        startup();
    }
}, false);

// var app = express();

// if only one profile with only one instance, then do not use node.fork:
if (cluster.isMaster) {
    // if (options.endpoint) {
    //     app.listen(options.port);
    //     logger.info('subscriberEndpoint() endpoint listening on port %s', options.port);
    // }

    if (options.processList.length === 1) {
        startup = startSubscriberHost.bind(null,logger, config, options.port, _.first(options.processList));
        startup();
        return;
    }

    _.each(options.processList, function(profileName) {
        cluster.fork({
            osyncprofile: profileName
        });
    });
} else {
    startup = startSubscriberHost.bind(null, logger, config, options.port, process.env.osyncprofile);
    startup();
}


//////////////////////////////////////////////////////////////////////////////
// NOTE: this file should not be cleaned out of dead code as there is much
//       work in progress which should be completed in sprint 7.E or 7.F
// Steven Reich

function startSubscriberHost(logger, config, port, profile) {
    logger.info('starting o-sync using profile "%s"', profile);

    var profileJobTypes = config.handlerProfiles.profileCollection[profile];

    logger.info('handling %s job types: %j', profileJobTypes.length, profileJobTypes);

    var environment = pollerUtils.buildEnvironment(logger, config);
    var handlerRegistry = registerHandlers(logger, config, environment);

    workers = startWorkers(config, handlerRegistry, environment, profileJobTypes, options.autostart);


    // This starts an endpoint to allow pause, resume, reset, etc.
    // if (options.endpoint) {
    //     pollerUtils.buildSubscriberEndpoint('subscriberHost', app, logger, workers, []);
    // }
}


function registerHandlers(logger, config, environment) {
    var handlerRegistry = new HandlerRegistry(environment);

    handlerRegistry.register(logger, config, environment, jobUtil.opportunisticSyncRequestType(), require(global.OSYNC_HANDLERS + 'opportunistic-sync-request/opportunistic-sync-request'));
    handlerRegistry.register(logger, config, environment, jobUtil.activeUserRequestType(), require(global.OSYNC_HANDLERS + 'active-user/active-user'));
    handlerRegistry.register(logger, config, environment, jobUtil.admissionRequestType(), require(global.OSYNC_HANDLERS + 'admission-request/admission-request'));
    handlerRegistry.register(logger, config, environment, jobUtil.appointmentRequestType(), require(global.OSYNC_HANDLERS + 'appointment-request/appointment-request'));
    handlerRegistry.register(logger, config, environment, jobUtil.storeJobStatusRequestType(), require(global.OSYNC_HANDLERS + 'store-job-status/store-job-status'));
    handlerRegistry.register(logger, config, environment, jobUtil.syncRequestType(), require(global.OSYNC_HANDLERS + 'sync/sync'));
    handlerRegistry.register(logger, config, environment, jobUtil.validationRequestType(), require(global.OSYNC_HANDLERS + 'validation-request/validation-request'));
    handlerRegistry.register(logger, config, environment, jobUtil.patientListRequestType(), require(global.OSYNC_HANDLERS + 'patientlist-request/patientlist-request'));

    return handlerRegistry;
}


function startWorkers(config, handlerRegistry, environment, profileJobTypes, autostart) {
    // first 'normalize' the beanstalk connection properties
    // based on a key of address, port, and tubename

    var connectionMap = {};
    _.each(profileJobTypes, function(jobType) {
        if(!_.isUndefined(config.beanstalk.jobTypes[jobType]) && !_.isUndefined(config.beanstalk.jobTypes[jobType].host)) {
            var connectInfo = config.beanstalk.jobTypes[jobType];
            var beanstalkString = format('%s:%s/%s', connectInfo.host, connectInfo.port, connectInfo.tubename);
            connectionMap[beanstalkString] = connectInfo;
        } else {
            logger.warn('subscriberHost.startWorkers no beanstalk config found for job type %s', jobType);
        }
    });

    var workers = _.map(connectionMap, function(beanstalkJobTypeConfig, beanstalkString) {
        logger.debug('subscriberHost.startWorkers(): creating worker %s', beanstalkString);
        return new Worker(logUtil.get('worker'), beanstalkJobTypeConfig, handlerRegistry, environment.jobStatusUpdater, autostart);
    });

    _.each(workers, function(worker) {
        worker.start(function(err) {
            logger.info('Start worker %s:%s/%s', worker.beanstalkJobTypeConfig.host, worker.beanstalkJobTypeConfig.worker, this.beanstalkJobTypeConfig.tubename);
            if (err) {
                logger.error(err);
            }
        });
    });

    return workers;
}
