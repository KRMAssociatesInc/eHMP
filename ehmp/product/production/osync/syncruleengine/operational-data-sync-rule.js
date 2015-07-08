'use strict';

var _ = require('underscore');
var async = require('async');
var idUtil = require(global.OSYNC_UTILS + 'patient-identifier-utils');

function operationalDataSyncRule(log, config, environment, patientIdentifiers, exceptions, callback) {
    log.debug('operational-data-sync-rule.operationalDataSyncRule: Running...');

    var patientPids = idUtil.extractIdsOfTypes(patientIdentifiers, 'pid');
    log.debug('operational-data-sync-rule.operationalDataSyncRule: Got patient pids %j', patientPids);
    var patientVistaPids = _.filter(patientPids, idUtil.isVistaSitePid);
    var patientSecondaryPids = _.filter(patientPids, idUtil.isSecondarySitePid);

    var patientIcn = idUtil.extractIdsOfTypes(patientIdentifiers, 'icn');

    if(_.isEmpty(patientVistaPids)) {   //no primary sites for this patient, so this rule doesn't apply
        return setTimeout(callback, 0, null, patientIdentifiers);
    }

    var patientIdentifiersToSync = [];
    log.debug('operational-data-sync-rule.operationalDataSyncRule:  Got patient VistA pids %j', patientVistaPids);
    var patientVistaSites = [];
    var patientVistaSitesToPids = {};
    _.each(patientVistaPids, function(pid) {
        var site = idUtil.extractSiteFromPid(pid.value);
        patientVistaSitesToPids[site] = pid; //{'9E7A': '9E7A;10000', 'C877': C877;10000', etc.}
        patientVistaSites.push(site); //['9E7A', 'C877', etc.]
    });

    log.debug('operational-data-sync-rule.operationalDataSyncRule: Got patient VistA sites %j', patientVistaSites);

    log.debug('operational-data-sync-rule.operationalDataSyncRule: Verifying with JDS that operational data has been synced for %s', patientVistaSites.toString());
    async.each(patientVistaSites, function(site, asyncCallback) {
        environment.jds.getOperationalSyncStatus(site, function(error, response, result) {
            if (error) {
                log.error('operational-data-sync-rule.operationalDataSyncRule:Got error from JDS: %j', error);
                asyncCallback('FailedJdsError');
            } else if (!response) {
                log.error('operational-data-sync-rule.operationalDataSyncRule: Null response from JDS: %s', response);
                asyncCallback('FailedJdsNoResponse');
            } else if (!result) {
                log.error('operational-data-sync-rule.operationalDataSyncRule: Null result from JDS %j', result);
                asyncCallback('FailedJdsNoResult');
            } else if (response.statusCode !== 200 && response.statusCode !== 404) {
                log.error('operational-data-sync-rule.operationalDataSyncRule: Unexpeceted statusCode %s received from JDS', response.statusCode);
                asyncCallback('FailedJdsWrongStatusCode');
            } else if (response.statusCode === 200 && result.completedStamp && !result.inProgress) {
                log.debug('operational-data-sync-rule.operationalDataSyncRule: Operational data has already been synced for site ' + site);
                patientIdentifiersToSync.push(patientVistaSitesToPids[site]);
                asyncCallback();
            } else {
                log.debug('operational-data-sync-rule.operationalDataSyncRule: Operational data has not yet been synced for site ' + site);
                asyncCallback();
            }
        });
    }, function(err) {
        if (err) {
            //Error
            log.error('operational-data-sync-rule.operationalDataSyncRule: Not syncing patient because of error when verifying that operational sync is complete: %s', err);
            setTimeout(callback, 0, err, patientIdentifiersToSync);
        } else if (_.isEmpty(patientIdentifiersToSync)) {
            //Operational data not synced for the patient's sites; Reject patient sync
            log.error('operational-data-sync-rule.operationalDataSyncRule: Patient sync rejected because operational data has not been synced for any of the primary site(s) associated with this patient: %s', patientVistaSites.toString());
            setTimeout(callback, 0, null, patientIdentifiersToSync);
        } else {
            //Continue as normal
            log.debug('operational-data-sync-rule.operationalDataSyncRule: Operational data for at least one pimary site associated with this patient has been synced. Continuing...');
            patientIdentifiersToSync = patientIdentifiersToSync.concat(patientIcn); //Add icn back in
            patientIdentifiersToSync = patientIdentifiersToSync.concat(patientSecondaryPids); //Add secondary site pids back in
            log.debug('operational-data-sync-rule.operationalDataSyncRule: Patient Identifiers remaining after applying rule:', patientIdentifiersToSync.toString());
            setTimeout(callback, 0, null, patientIdentifiersToSync);
        }
    });

    //return patientIdentifiersToSync;
}

function loadRule() {
    return operationalDataSyncRule;
}

module.exports = loadRule;