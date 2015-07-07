'use strict';

require('./env-setup');

var format = require('util').format;
var cluster = require('cluster');
var _ = require('underscore');
// var express = require('express');

var Worker = require(global.VX_JOBFRAMEWORK + 'worker');
var HandlerRegistry = require(global.VX_JOBFRAMEWORK + 'handlerRegistry');
var jobUtil = require(global.VX_UTILS + 'job-utils');
var pollerUtils = require(global.VX_UTILS + 'poller-utils');
var config = require(global.VX_ROOT + 'worker-config');
var logUtil = require(global.VX_UTILS + 'log');
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
            vxsprofile: profileName
        });
    });
} else {
    console.log('process: %s  profile "%s"', process.pid, process.env.vxsprofile);
    startup = startSubscriberHost.bind(null, logger, config, options.port, process.env.vxsprofile);
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


    // This starts an endpoint to allow pause, resume, reset, etc.
    // if (options.endpoint) {
    //     pollerUtils.buildSubscriberEndpoint('subscriberHost', app, logger, workers, []);
    // }
}


function registerHandlers(logger, config, environment) {
    var jmeadowsDomains = config.jmeadows.domains;
    var hdrDomains = config.hdr.domains;
    var handlerRegistry = new HandlerRegistry(environment);

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
