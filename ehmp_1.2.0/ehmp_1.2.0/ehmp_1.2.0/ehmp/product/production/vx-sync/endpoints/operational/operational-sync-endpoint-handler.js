'use strict';

require('../../env-setup');
var format = require('util').format;

var _ = require('underscore');
var async = require('async');
var config = require(global.VX_ROOT + 'worker-config');
var jobUtil = require(global.VX_UTILS + 'job-utils');
//var util = require('util');

/** Example Input

{
    "sites": ["9E7A", "C877"]
}
or
{
    "sites": "9E7A,C877"
}

**/

function doLoad(log, environment, req, res) {
    log.debug('operational-sync-endpoint-handler.doLoad() : begin');

    var publishOptions = config;

    // console.log(req);

    //verify input
    var syncSites = req.param('sites');
    if (!_.isUndefined(syncSites) && _.isString(syncSites)) {
        syncSites = syncSites.split(',');
    }
    if (_.isUndefined(syncSites) || !_.isArray(syncSites) || syncSites.length === 0) {
        return res.status(400).send('No list of valid VistA sites were found');
    }
    var invalidSites = _.filter(syncSites, function(site) {
        return !(config.vistaSites[site]);
    });
    if (invalidSites.length > 0) {
        return res.status(400).send(format('Unknown VistA site %s', invalidSites.join()));
    }

    async.every(syncSites, function(site, callback) {
        var job = jobUtil.createOperationalSyncRequest(site);
        log.debug('operational-sync-endpoint-handler.doLoad() : build operational job');
        log.debug(job);

        environment.publisherRouter.publish(job, publishOptions, function(error) {
            if (error) {
                log.error('operational-sync-endpoint-handler.doLoad() : operational-sync-endpoint' + error);
            } else {
                log.debug('operational-sync-endpoint-handler.doLoad() : operational sync job accepted');
            }
            callback(!(!!error));
        });
    }, function(result) {
        if (result) {
            return res.status(201).send();
        } else {
            return res.status(400).send('Unable to send operational sync to all sites');
        }
    });
}

function initialOPDSync(log, config, environment, handlerCallback) {
    log.debug('operational-sync-endpoint-handler.initialOPDSync(): Starting intial operational data sync');
    var allVistaSites = _.keys(config.vistaSites); //['9E7A', 'C877'];
    var sitesToSubscribeOPD = [];
    async.each(allVistaSites, function(siteId, callback) {
        log.debug('operational-sync-endpoint-handler.initialOPDSync(): Checking operational sync status for site ' + siteId + ' in JDS...');
        environment.jds.getOperationalSyncStatus(siteId, function(error, response, result) {
            if (error) {
                log.error('operational-sync-endpoint-handler.initialOPDSync(): Got error from JDS: %j', error);
                callback('FailedJdsError');
            } else if (!response) {
                log.error('operational-sync-endpoint-handler.initialOPDSync(): Null response from JDS: %s', response);
                callback('FailedJdsNoResponse');
            } else if (!result) {
                log.error('operational-sync-endpoint-handler.initialOPDSync(): Null result from JDSL %j', result);
                callback('FailedJdsNoResult');
            } else if (response.statusCode !== 200 && response.statusCode !== 404){
                log.error('operational-sync-endpoint-handler.initialOPDSync(): Unexpected statusCode %s received from JDS', response.statusCode);
                callback('FailedJdsWrongStatusCode');
            } else if (response.statusCode === 200 && result.completedStamp && !result.inProgress) {
                log.debug('operational-sync-endpoint-handler.initialOPDSync(): Operational data has already been synced for site ' + siteId);
                callback();
            } else {
                log.debug('operational-sync-endpoint-handler.initialOPDSync(): Operational data has not yet been synced for site ' + siteId);
                sitesToSubscribeOPD.push(siteId);
                callback();
            }
        });
    }, function(err) {
        if (err) {
            log.error('operational-sync-endpoint-handler.initialOPDSync(): Not starting initial operational data sync because of a communication error with JDS: ' + err);
            return setTimeout(handlerCallback, 0, err);
        } else if (_.isEmpty(sitesToSubscribeOPD)) {
            log.debug('operational-sync-endpoint-handler.initialOPDSync(): Operational data has already been synced for all primary sites.');
            return setTimeout(handlerCallback, 0);
        } else {
            log.debug('operational-sync-endpoint-handler.initialOPDSync(): Beginning initial operational data sync for sites ' + sitesToSubscribeOPD.toString());

            async.every(sitesToSubscribeOPD, function(site, callback) {
                var job = jobUtil.createOperationalSyncRequest(site);
                log.debug('operational-sync-endpoint-handler.initialOPDSync() : build operational job');
                log.debug(job);

                environment.publisherRouter.publish(job, config, function(error) {
                    if (error) {
                        log.error('operational-sync-endpoint-handler.initialOPDSync() : operational-sync-endpoint' + error);
                    } else {
                        log.debug('operational-sync-endpoint-handler.initialOPDSync() : operational sync job accepted');
                    }
                    callback(!(!!error));
                });
            }, function(result) {
                if (result) {
                    log.debug('operational-sync-endpoint-handler.initialOPDSync(): initial operational sync successfully started');
                    return setTimeout(handlerCallback, 0);
                } else {
                    log.error('operational-sync-endpoint-handler.initialOPDSync(): Unable to send operational sync to all sites');
                    return setTimeout(handlerCallback, 0, 'FailedJobsNotPublished');
                }
            });

        }
    });

}

module.exports.doLoad = doLoad;
module.exports.initialOPDSync = initialOPDSync;