'use strict';

var _ = require('lodash');
var nullchecker = require('../../utils/nullchecker');


// Extracts and returns and array containing a list of sites belonging to a patient
// Result from sync status passed as parameter
function getVistaSites_v1(syncStatus, req) {
    var siteSyncStatusCollection;
    var sites = [];
    if (_.isUndefined(syncStatus) || _.isUndefined(syncStatus.data) || _.isUndefined(syncStatus.data.syncStatus)) {
        return sites;
    }
    var syncStatusInfo = syncStatus.data.syncStatus;
    _.each(['completedStamp', 'inProgress'], function(element){
        if (_.isUndefined(syncStatusInfo[element]) || _.isUndefined(syncStatusInfo[element].sourceMetaStamp)) {
            return;
        }
        siteSyncStatusCollection =  syncStatusInfo[element].sourceMetaStamp;
        _getSiteFromCollection(siteSyncStatusCollection, sites, req);
    });
    // check the job status array
    var jobStatus = syncStatus.data.jobStatus;
    if (_.isArray(jobStatus) && jobStatus.length >= 1) {
        _.each(jobStatus, function(element){
            var siteInfo = '';
            if (element.type) {
                var typeInfo = element.type;
                var idx = typeInfo.indexOf('-');
                if (idx > 0) { // the first char should not be -
                    siteInfo = typeInfo.substring(0,idx);
                    if (siteInfo === 'jmeadows') {
                        sites.push('DOD');
                    }
                    else if (siteInfo === 'vler') {
                        sites.push('VLER');
                    }
                    else if (siteInfo === 'cds') {
                        sites.push('CDS');
                    }
                    else if (siteInfo === 'hdr') {
                        sites.push('HDR');
                    }
                    else if (siteInfo === 'vista') {
                        sites.push(typeInfo.substring(idx+1, typeInfo.indexOf('-', idx+1)));
                    }
                }
            }
        });
    }
    return _.uniq(sites);
}

// internal function
function _getSiteFromCollection(siteSyncStatusCollection, sites, req) {
    _.each(siteSyncStatusCollection, function(value, site) {
        if (req && req.logger) {
            req.logger.debug('Got Site: ' + site);
        }
        sites.push(site);
    });
}

function getVistaSites(syncStatus, req) {
    var siteSyncStatusCollection;
    var sites = [];

    siteSyncStatusCollection = syncStatus.data.data.items[0].syncStatusByVistaSystemId;

    _.forEach(siteSyncStatusCollection, function(value, site) {
        req.logger.debug('Got Site: ' + site);
        sites.push(site);
    });
    return sites;
}

// JSON Representing Sync Status passed together with a list of sites expected
// Confirms whether all sites synced
function isSyncMarkedCompleted_v1(syncStatus, sites, req) {
    // sanity check
    if (_.isUndefined(syncStatus) || _.isUndefined(sites) || sites.length === 0) {
        return false;
    }
    // make sure every site is marked sync completed.
    var syncCompleted = _.every(sites, function(site) {
        var siteSynced = isSiteSynced_v1(syncStatus, site, req);
        if (req && req.logger) {
            req.logger.debug(site + ' sync complete: ' + siteSynced);
        }
        return siteSynced;
    });
    return syncCompleted;
}

function isSyncMarkedCompleted(syncStatus, sites, req) {
    var completeFlag = true;
    var siteSyncStatusCollection, siteSyncComplete, siteExpired;
    if (nullchecker.isNullish(syncStatus)) {
        return false;
    }
    if (sites.length > 0) {
        _.each(sites, function(site) {
            siteSyncStatusCollection = syncStatus.data.items[0].syncStatusByVistaSystemId;

            req.logger.debug('Checking sync status of site: ' + site);
            if (!_.isUndefined(siteSyncStatusCollection[site])) {
                siteSyncComplete = siteSyncStatusCollection[site].syncComplete;
                if (nullchecker.isNullish(siteSyncStatusCollection[site].expired)) {
                    siteExpired = false;
                } else {
                    siteExpired = siteSyncStatusCollection[site].expired;
                }
                req.logger.debug('syncComplete on ' + site + ' is ' + siteSyncComplete);
                req.logger.debug('expired on ' + site + ' is ' + siteExpired);
                if (siteExpired || !siteSyncComplete || nullchecker.isNullish(siteSyncComplete)) {
                    completeFlag = false;
                }
            }
        });
    }
    return completeFlag;
}

// Inspect syncStatus result to check if all patient's data is synced.
function isSyncCompleted(syncStatus) {
    if (_.isUndefined(syncStatus) ||
        _.isUndefined(syncStatus.data) ||
        _.isUndefined(syncStatus.data.syncStatus) ) {
        return false;
    }
    var syncStatusData = syncStatus.data.syncStatus;
    var jobStatusData = syncStatus.data.jobStatus;
    if (syncStatusData.inProgress) { // anything in progress
        return false;
    }
    if (_.isArray(jobStatusData) && jobStatusData.length > 0) { // job array is not empty
        return false;
    }
    if (syncStatusData.completedStamp) {
        return true;
    }
    return false;
}

// JSON Representing Sync Status passed together with a single site expected
// Confirms whether this sites sync is complete
function isSiteSynced_v1(syncStatus, site, req) {
    // some sanity check
    if (_.isUndefined(syncStatus) ||
        _.isUndefined(syncStatus.data) ||
        _.isUndefined(syncStatus.data.syncStatus) ||
        _.isUndefined(site)) {
        if (req && req.logger) {
            req.logger.debug('either syncStatus or site is undefined');
        }
        return false;
    }
    var syncStatusData = syncStatus.data.syncStatus;
    // if syncStatus does not have completedStamp attribute, just return false.
    if (_.isUndefined(syncStatusData.completedStamp) ||
        _.isUndefined(syncStatusData.completedStamp.sourceMetaStamp) ||
        _.isUndefined(syncStatusData.completedStamp.sourceMetaStamp[site])) {
        if (req && req.logger) {
            req.logger.debug('either completeStamp or sourceMetaStamp or sourceMetaStamp.site is undefined');
        }
        return false;
    }
    var siteInfo = syncStatusData.completedStamp.sourceMetaStamp[site];
    if (_.isUndefined(siteInfo)) {
        if (req && req.logger) {
            req.logger.debug('site is undefined');
        }
        return false;
    }
    return siteInfo.syncCompleted;
}

function getSiteSyncDataStatus(syncStatus, site, req) {
    var dataStatusRet = {};
    if (_.isUndefined(syncStatus) ||
        _.isUndefined(syncStatus.data) ||
        _.isUndefined(syncStatus.data.syncStatus) ||
        _.isUndefined(site)) {
        return dataStatusRet;
    }
    var syncStatusData = syncStatus.data.syncStatus;
    req.logger.debug(syncStatusData);
    if (_.isUndefined(syncStatusData.completedStamp) ||
        _.isUndefined(syncStatusData.completedStamp.sourceMetaStamp) ||
        _.isUndefined(syncStatusData.completedStamp.sourceMetaStamp[site])) {
        dataStatusRet.isSyncCompleted = false;
        // check to see if there is any error related to job status
        dataStatusRet.hasError = hasSyncStatusErrorForSite(syncStatus, site);
    }
    else {
        var siteInfo = syncStatusData.completedStamp.sourceMetaStamp[site];
        dataStatusRet.isSyncCompleted = siteInfo.syncCompleted;
        if (dataStatusRet.isSyncCompleted) {
            dataStatusRet.completedStamp = siteInfo.stampTime;
        }
    }
    return dataStatusRet;
}

function hasSyncStatusErrorForSite(syncStatus, site) {
    if (_.isUndefined(syncStatus) ||
        _.isUndefined(syncStatus.data) ||
        _.isUndefined(syncStatus.data.jobStatus) ||
        _.isUndefined(site)) {
        return false;
    }
    var jobStatus = syncStatus.data.jobStatus;
    if (!_.isArray(jobStatus) || jobStatus.length === 0) {
        return false;
    }
    var cSite = site.toLowerCase();
    if (cSite === 'dod') {
        cSite = 'jmeadows';
    }
    for(var idx=0, len=jobStatus.length; idx < len; idx++){
        var jobData = jobStatus[idx];
        if (jobData && jobData.error) {
            if (jobData.type === 'enterprise-sync-request') {// return true if having a problem with sync
                return true;
            }
            if (jobData.type.indexOf(cSite) >=0 || jobData.type.indexOf(site) >=0) {
                return true;
            }
        }
    }
    return false;
}

function isSiteSynced(syncStatus, site) {
    var siteSyncStatusCollection, synced, expired;
    siteSyncStatusCollection = syncStatus.data.items[0].syncStatusByVistaSystemId[site];

    if (nullchecker.isNullish(syncStatus) ||
        _.isUndefined(siteSyncStatusCollection) ||
        (!_.isUndefined(siteSyncStatusCollection.errorMessage) &&
            nullchecker.isNotNullish(siteSyncStatusCollection.errorMessage))) {
        return false;
    }
    synced = siteSyncStatusCollection.syncComplete;

    if (nullchecker.isNullish(siteSyncStatusCollection.expired)) {
        expired = false;
    } else {
        expired = siteSyncStatusCollection.expired;
    }
    if (expired || !synced || nullchecker.isNullish(synced)) {
        return false;
    } else {
        return true;
    }
}


module.exports.getVistaSites = getVistaSites_v1;
module.exports.isSyncMarkedCompleted = isSyncMarkedCompleted_v1;
module.exports.isSyncCompleted = isSyncCompleted;
module.exports.getSiteSyncDataStatus = getSiteSyncDataStatus;

// Exports for unit testing

module.exports._hasSyncStatusErrorForSite = hasSyncStatusErrorForSite;
module.exports._isSiteSynced = isSiteSynced_v1;
