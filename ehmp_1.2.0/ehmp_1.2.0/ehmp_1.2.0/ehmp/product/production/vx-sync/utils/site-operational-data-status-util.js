'use strict';
var _ = require('underscore');
var async = require('async');


// this is singleton to determine the Operational Data Sync status for primary sites.
// JDS is the only entity with the accurate answer so there is a need to query JDS for this.
// To minimize the number of this "expensive" call, the idea is to query once for every CDS sync request
// For every CDS domain sync request a read of the OD sync states suffices : isSync function...
// For very CDS sync requests, clears the old possibly stale states and rerun the query function.
var OperationalDataSyncBroker = (function() {
    var instance;

    var createInstance = function() {
        var _sitesODSyncStatus = [];
        var _log = null;
        var _config = null;
        var _environment = null;

        // at initialize time, pass in the criteria used to determine the OD sync states
        var initialize = function(log, config, environment, criteria){
            _log = log;
            _config = config;
            _environment = environment;
            var vistaSites = _.isArray(_config.vistaSites) ? _config.vistaSites : _.keys(_config.vistaSites);
            _log.debug('OperationalDataSyncBroker.Initialize with vistaSites: %j', vistaSites);

            determineStateOfODSync(criteria);

        };

        // reset the last set of results
        var clear = function() {
            _log.debug('OperationalDataSyncBroker.clear');
            _sitesODSyncStatus = [];
        };

        // default function to determine the OD Sync states using JDS
        var callJDS = function (log, vistaSites, ODSyncedSites, jds) {
            log.debug('OperationalDataSyncBroker.callJDS:  %j', vistaSites);

            async.each(vistaSites, function (site, asyncCallback) {
                log.debug('lets go sister for site: ' + site);
                jds.getOperationalSyncStatus(site, function (error, response, result) {
                    if (error) {
                        log.error('OperationalDataSyncBroker.callJDS: Got error from JDS: %j', error);
                        asyncCallback('FailedJdsError');
                    } else if (!response) {
                        log.error('OperationalDataSyncBroker.callJDS: Null response from JDS: %s', response);
                        asyncCallback('FailedJdsNoResponse');
                    } else if (!result) {
                        log.error('OperationalDataSyncBroker.callJDS: Null result from JDS %j', result);
                        asyncCallback('FailedJdsNoResult');
                    } else if (response.statusCode !== 200 && response.statusCode !== 404) {
                        log.error('OperationalDataSyncBroker.callJDS: Unexpeceted statusCode %s received from JDS', response.statusCode);
                        asyncCallback('FailedJdsWrongStatusCode');
                    } else if (response.statusCode === 200 && result.completedStamp && !result.inProgress) {
                        log.debug('OperationalDataSyncBroker.callJDS: Operational 200 and completed, data has already been synced for site ' + site);
                        ODSyncedSites.push(site);
                        asyncCallback();
                    } else {
                        log.debug('OperationalDataSyncBroker.callJDS: Operational data has already been synced for site ' + site);
                        ODSyncedSites.push(site);
                        asyncCallback();
                    }
                });
            }, function (err) {
                if (err) {
                    log.error('OperationalDataSyncBroker.callJDS: Error when verifying that operational sync is complete: %s', err);
                } else {
                    log.debug('OperationalDataSyncBroker.callJDS OD sync is complete for %s', ODSyncedSites);
                }
            });

        };

        var _determineStateOfODSync = function(log, vistaSites, sitesODSyncStatus, jds, jdsFunctionToCall) {
            log.debug('OperationalDataSyncBroker.determineStateOfODSync: Verifying with JDS that operational data has been synced for %s', vistaSites.toString());
            jdsFunctionToCall(log, vistaSites, sitesODSyncStatus, jds);
        };


        // the purpose of determining the OD sync state of primary sites
        // criteria parameter is the function to call to determine the OD sync states
        // mainly for the ease of testing
        //
        // by default the class function of callJDS, defined above, is used.
        var determineStateOfODSync = function (criteria) {
            clear();

            var vistaSites = _.isArray(_config.vistaSites) ? _config.vistaSites : _.keys(_config.vistaSites);
            _log.debug('OperationalDataSyncBroker.determineStateOfODSync with vistaSites: %j', vistaSites);

            if (typeof criteria == 'undefined') {
                criteria = callJDS;
            }
            //var criteria = criteria || callJDS;

            _log.debug('OperationalDataSyncBroker.determineStateOfODSync criteria function: %j', criteria);
            _determineStateOfODSync(_log, vistaSites, _sitesODSyncStatus, _environment.jds, criteria);
        };

        // is the Operational Data synced for this site
        var isSynced = function (log, site) {
            log.error('OperationalDataSyncBroker.isSynced: for site %s and sites are %j: ', site, _sitesODSyncStatus);
            if (! _.isArray(_sitesODSyncStatus)) {
                log.error('OperationalDataSyncBroker.isSynced: Internal error: _sitesODSyncStatus is not an array');
                return false;
            }

            var retVal = _sitesODSyncStatus.length > 0 && _sitesODSyncStatus.indexOf(site) >= 0;
            log.error('OperationalDataSyncBroker.isSynced: for site %s and sync is: ', site, retVal);

            return retVal;
        };

        return {
            initialize: initialize,
            isSynced : isSynced
        };
    };

    return {
        getInstance: function(){

            if(!instance){
                instance = createInstance();
            }

            return instance;
        }
    };
})();

module.exports = OperationalDataSyncBroker;






