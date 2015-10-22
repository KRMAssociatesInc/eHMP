'use strict';

require('./env-setup');

var format = require('util').format;
var cluster = require('cluster');
var _ = require('underscore');

var Worker = require(global.VX_JOBFRAMEWORK + 'worker');
var HandlerRegistry = require(global.VX_JOBFRAMEWORK + 'handlerRegistry');
var jobUtil = require(global.VX_UTILS + 'job-utils');
var pollerUtils = require(global.VX_UTILS + 'poller-utils');
var config = require(global.VX_ROOT + 'worker-config');
var logUtil = require(global.VX_UTILS + 'log');
var moment = require('moment');
logUtil.initialize(config.loggers);

var logger = logUtil.get('subscriberHost', 'host');
var healthcheckUtils = require(global.VX_UTILS + 'healthcheck-utils');

//////////////////////////////////////////////////////////////////////////////
//  EXECUTE ON STARTUP
//////////////////////////////////////////////////////////////////////////////

var options = pollerUtils.parseSubscriberOptions(logger, config);
var workers = [];
var startup = null;
var profile = options.profile;
var processName = process.env.VXSYNC_LOG_SUFFIX;
var processStartTime = moment().format('YYYYMMDDHHmmss');

config.addChangeCallback(function() {
    logger.info('subscriberHost  config change detected. Stopping workers');
    _.each(workers, function(worker) {
        worker.stop();
    });
    logger.info('subscriberHost  starting new workers');
    if (startup) {
        startup();
    }
}, false);

process.on('SIGURG', function() {
    logger.debug('subscriberHost process id ' + process.pid + ': Got SIGURG.');
    console.log('subscriberHost process id ' + process.pid + ': Got SIGURG.');
    pauseWorkers(workers);
    listenForShutdownReady(workers);

    //TODO: move time to wait into configuration
    setTimeout(timeoutOnWaitingForShutdownReady, 30000, workers).unref();
});

// if only one profile with only one instance, then do not use node.fork:
if (cluster.isMaster) {

    if (options.processList.length === 1) {
        startup = startSubscriberHost.bind(null, logger, config, options.port, _.first(options.processList));
        startup();
        return;
    }

    _.each(options.processList, function(profileName) {
        cluster.fork({
            vxsprofile: profileName
        });
    });
} else {
    console.log('process: %s  profile "%s"', process.pid, process.env.vxsprofile);
    startup = startSubscriberHost.bind(null, logger, config, options.port, profile);
    startup();
}

//////////////////////////////////////////////////////////////////////////////
// NOTE: this file should not be cleaned out of dead code as there is much
//       work in progress which should be completed in sprint 7.E or 7.F
// Steven Reich

function startSubscriberHost(logger, config, port, profile) {
    logger.info('starting vx-sync using profile "%s"', profile);

    var profileJobTypes = config.handlerProfiles.profileCollection[profile];

    logger.info('handling %s job types: %j', profileJobTypes.length, profileJobTypes);

    var environment = pollerUtils.buildEnvironment(logger, config);
    var handlerRegistry = registerHandlers(logger, config, environment);

    workers = startWorkers(config, handlerRegistry, environment, profileJobTypes, options.autostart);

    healthcheckUtils.startHeartbeat(logger, config, environment, processName, profile, processStartTime);
}


function registerHandlers(logger, config, environment) {
    var jmeadowsDomains = config.jmeadows.domains;
    var hdrDomains = config.hdr.domains;
    var handlerRegistry = new HandlerRegistry(environment);

    handlerRegistry.register(logger, config, environment, jobUtil.errorRequestType(), require(global.VX_HANDLERS + 'error-request/error-request-handler'));

    handlerRegistry.register(logger, config, environment, jobUtil.enterpriseSyncRequestType(), require(global.VX_HANDLERS + 'enterprise-sync-request/enterprise-sync-request-handler'));
    handlerRegistry.register(logger, config, environment, jobUtil.vistaOperationalSubscribeRequestType(), require(global.VX_HANDLERS + 'operational-data-subscription/operational-data-subscription-handler'));

    _.each(config.vistaSites, function(site, vistaId) {
        handlerRegistry.register(vistaId, logger, config, environment, jobUtil.vistaSubscribeRequestType(vistaId), require(global.VX_HANDLERS + 'vista-subscribe-request/vista-subscribe-request-handler'));
    });

    handlerRegistry.register(logger, config, environment, jobUtil.hdrSyncRequestType(), require(global.VX_HANDLERS + 'hdr-sync-request/hdr-sync-request-handler'));
    handlerRegistry.register(logger, config, environment, jobUtil.vlerSyncRequestType(), require(global.VX_HANDLERS + 'vler-sync-request/vler-sync-request-handler'));
    handlerRegistry.register(logger, config, environment, jobUtil.pgdSyncRequestType(), require(global.VX_HANDLERS + 'pgd-sync-request/pgd-sync-request-handler'));
    handlerRegistry.register(logger, config, environment, jobUtil.jmeadowsSyncRequestType(), require(global.VX_HANDLERS + 'jmeadows-sync-request/jmeadows-sync-request-handler'));

    handlerRegistry.register(logger, config, environment, jobUtil.hdrXformVprType(), require(global.VX_HANDLERS + 'hdr-to-vpr-xform/hdr-to-vpr-xform-handler'));
    handlerRegistry.register(logger, config, environment, jobUtil.vlerXformVprType(), require(global.VX_HANDLERS + 'vler-to-vpr-xform/vler-to-vpr-xform-handler'));
    handlerRegistry.register(logger, config, environment, jobUtil.pgdXformVprType(), require(global.VX_HANDLERS + 'pgd-to-vpr-xform/pgd-to-vpr-xform-handler'));

    _.each(jmeadowsDomains, function(domain) {
        handlerRegistry.register(logger, config, environment, jobUtil.jmeadowsDomainSyncRequestType(domain), require(global.VX_HANDLERS + 'jmeadows-sync-domain-request/jmeadows-sync-domain-request-handler'));
        handlerRegistry.register(logger, config, environment, jobUtil.jmeadowsDomainXformVprType(domain), require(global.VX_HANDLERS + 'jmeadows-xform-domain-vpr/jmeadows-xform-domain-vpr-handler'));
    });

    _.each(hdrDomains, function(domain) {
        handlerRegistry.register(logger, config, environment, jobUtil.hdrDomainSyncRequestType(domain), require(global.VX_HANDLERS + 'hdr-sync-domain-request/hdr-sync-domain-request-handler'));
        handlerRegistry.register(logger, config, environment, jobUtil.hdrDomainXformVprType(domain), require(global.VX_HANDLERS + 'hdr-xform-domain-vpr/hdr-xform-domain-vpr-handler'));
    });

    handlerRegistry.register(logger, config, environment, jobUtil.jmeadowsRtfDocumentTransformType(), require(global.VX_HANDLERS + 'jmeadows-document/jmeadows-rtf-document-transform-handler'));
    handlerRegistry.register(logger, config, environment, jobUtil.jmeadowsDocRetrievalType(), require(global.VX_HANDLERS + 'jmeadows-document/jmeadows-rtf-request-handler'));

    handlerRegistry.register(logger, config, environment, jobUtil.jmeadowsCdaDocumentConversionType(), require(global.VX_HANDLERS + 'jmeadows-document/jmeadows-cda-document-conversion-handler'));

    handlerRegistry.register(logger, config, environment, jobUtil.recordEnrichmentType(), require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-request-handler'));

    handlerRegistry.register(logger, config, environment, jobUtil.vistaPrioritizationRequestType(), require(global.VX_HANDLERS + 'vista-prioritization-request/vista-prioritization-request-handler'));

    handlerRegistry.register(logger, config, environment, jobUtil.operationalDataStoreType(), require(global.VX_HANDLERS + 'operational-data-store-request/operational-data-store-request-handler'));

    handlerRegistry.register(logger, config, environment, jobUtil.storeRecordType(), require(global.VX_HANDLERS + 'store-record-request/store-record-request-handler'));
    handlerRegistry.register(logger, config, environment, jobUtil.publishVxDataChangeType(), require(global.VX_HANDLERS + 'publish-vx-data-change-request/publish-vx-data-change-request-handler'));

    return handlerRegistry;
}


function startWorkers(config, handlerRegistry, environment, profileJobTypes, autostart) {
    // first 'normalize' the beanstalk connection properties
    // based on a key of address, port, and tubename

    var connectionMap = {};
    _.each(profileJobTypes, function(jobType) {
        if (!_.isUndefined(config.beanstalk.jobTypes[jobType]) && !_.isUndefined(config.beanstalk.jobTypes[jobType].host)) {
            var connectInfo = config.beanstalk.jobTypes[jobType];
            var beanstalkString = format('%s:%s/%s', connectInfo.host, connectInfo.port, connectInfo.tubename);
            connectionMap[beanstalkString] = connectInfo;
        } else {
            logger.warn('subscriberHost.startWorkers no beanstalk config found for job type %s', jobType);
        }
    });

    var workers = _.map(connectionMap, function(beanstalkJobTypeConfig, beanstalkString) {
        logger.debug('subscriberHost.startWorkers(): creating worker %s', beanstalkString);
        return new Worker(logUtil.get('worker'), beanstalkJobTypeConfig, environment.metrics, handlerRegistry, environment.jobStatusUpdater, environment.errorPublisher, autostart);
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

function pauseWorkers(workers) {
    logger.info('subscriberHost process id ' + process.pid + ': pausing workers.');
    console.log('subscriberHost process id ' + process.pid + ': pausing workers.');
    _.each(workers, function(worker) {
        worker.pause();
    });
}

function listenForShutdownReady(workers) {
    var readyToShutdown = _.every(workers, function(worker) {
        return worker.isReadyToShutdown();
    });

    var remainingWorkers = getListOfWorkersNotReadyForShutdown(workers);

    if (!readyToShutdown) {
        logger.info('subscriberHost process id ' + process.pid + ': Still waiting for workers to finish current job. Remaining workers: %s', remainingWorkers);
        console.log('subscriberHost process id ' + process.pid + ': Still waiting for workers to finish current job. Remaining workers: %s', remainingWorkers);
        setTimeout(listenForShutdownReady, 1000, workers);
    } else {
        logger.info('subscriberHost process id ' + process.pid + ': Shutting down!');
        console.log('subscriberHost process id ' + process.pid + ': Shutting down!');
        process.exit(0);
    }
}

function getListOfWorkersNotReadyForShutdown(workers) {
    var remainingWorkers = _.filter(workers, function(worker) {
        return !worker.isReadyToShutdown();
    });

    var remainingWorkerNames = _.map(remainingWorkers, function(worker) {
        return worker.getTubeName();
    });

    return remainingWorkerNames;
}

//Quits process if workers are taking too long to finish
//Displays list of workers that will be interrupted
function timeoutOnWaitingForShutdownReady(workers) {
    var remainingWorkers = _.filter(workers, function(worker) {
        return !worker.isReadyToShutdown();
    });

    var remainingWorkerNames = _.map(remainingWorkers, function(worker) {
        return worker.getTubeName();
    });

    logger.error('subscriberHost process id ' + process.pid + ': Timeout on waiting for workers to finish current jobs. Interrupting workers: %s', remainingWorkerNames);
    console.log('subscriberHost process id ' + process.pid + ': Timeout on waiting for workers to finish current jobs. Interrupting workers: %s', remainingWorkerNames);
    process.exit(1);
}
