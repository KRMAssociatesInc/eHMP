/*jslint node: true */
'use strict';

var _ = require('lodash');
var async = require('async');
var S = require('string');
var httpUtil = require('../../utils/http-wrapper/http');
var nullchecker = require('../../utils/nullchecker/nullchecker');

// Check to see if given pid is an icn or dfn
function isIcn(pid) {
    if (nullchecker.isNotNullish(pid) && S(pid).contains(';')) {
        return false;
    }

    if (nullchecker.isNotNullish(pid)) {
        return true;
    } else {
        return false;
    }
}

// extract VistA Site information from pid
function getSiteFromPid(pid) {
    if (nullchecker.isNotNullish(pid) && S(pid).contains(';')) {
        return pid.split(';')[0];
    }
    else {
        return undefined;
    }
}
// JSON received back from getPatientFromPid() passed to validate if PID is Valid
function isValidPid(patient) {
    if (_.isUndefined(patient)) {
        return false;
    }

    if (patient.data && patient.data.data) {
        if (patient.data.data.totalItems <= 0) {
            return false;
        }
    } else {
        return false;
    }

    return true;
}

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
            if (jobData.type.indexOf(cSite) >=0) {
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

// For a given sync status and PID this checks to see if all domains were actually saved in the JDS
// Returns json: {synced: true|false }
function domainsTotalsAccurate(pid, syncStatus, req, callback) {
    var countList;
    var domainList;
    var resultList = [];
    var processedList = [];
    // Get the domains count from JDS first
    async.series({
        dmcount: function(cb) {
            jdsDomainTotals(pid, req, cb);
        }
    }, function(error, result) {
        if (error) {
            req.logger.error(error);
            return callback(null, {
                synced: false
            });
        }
        return callback(null, {
            synced: true
        });
        countList = result.dmcount.data.items;
        domainList = syncStatus.data.items[0].syncStatusByVistaSystemId;
        _.forEach(domainList, function(list) {
            _.forEach(list.domainExpectedTotals, function(value, key) {
                resultList[key] = (_.isUndefined(resultList[key])) ? value.total : resultList[key] + value.total;
            });
        });

        //        req.logger.debug('Got list of expected and actual domain counts:');
        //        req.logger.debug(countList);
        //        req.logger.debug(resultList);

        // Process results
        _.forEach(countList, function(it) {
            // If actual is less than expected then not all are stored in JDS
            if (it.count < resultList[it.topic]) {
                processedList.push(false);
            } else {
                processedList.push(true);
            }
        });
        if (_.contains(processedList, false) || processedList.length === 0) {
            return callback(null, {
                synced: false
            });
        } else {
            return callback(null, {
                synced: true
            });
        }
    });
}

function jdsDomainTotals(pid, req, callback) {
    var config = _.clone(req.app.config.jdsSync.jdsStatusFind),
        jds = _.clone(req.app.config.jdsServer);

    config.options.host = jds.host;
    config.options.port = jds.port;

    req.logger.debug('Getting Status for PID: ' + pid);

    config = createConfig(config, '', req.logger);

    config.options.path = config.options.path.replace('{pid}', pid, 'gi');

    httpUtil.fetch(config, function(error, resp) {
        if (!_.isNull(resp)) {
            callback(null, JSON.parse(resp.data.data.message));
        } else {
            callback(error, null);
        }
    }, createJsonStandardResponse);
}

// Gets patient details back from JDS
function getPatientFromPid(pid, req, callback) {
    var jds = _.clone(req.app.config.jdsServer),
        config;

    if (isIcn(pid)) {
        config = _.clone(req.app.config.jdsSync.patientSelectIcn);
    } else {
        config = _.clone(req.app.config.jdsSync.patientSelectPid);
    }
    config.options.host = jds.host;
    config.options.port = jds.port;
    config = createConfig(config, pid, req.logger);
    httpUtil.fetch(config, function(error, resp) {

        // If there is a 'data' block but no 'items' then
        // try getFullPatientFromPid
        if (resp && resp.data && resp.data.data && resp.data.data.totalItems <= 0) {
            getFullPatientFromPid(pid, req, callback);
        } else {
            if (_.isUndefined(error)) {
                callback(null, resp);
            } else {
                callback(error, resp);
            }
        }
    }, patientSelectResultProcessor);
}

// Gets primary and secondary site patient details back from JDS
function getFullPatientFromPid(pid, req, callback) {
    var jds = _.clone(req.app.config.jdsServer);
    var config = _.clone(req.app.config.jdsSync.patientSelectPidAllSites);
    console.dir(config);
    config.options.host = jds.host;
    config.options.port = jds.port;
    config.options.path = config.options.path; // + "/" + pid;

    config = createConfig(config, pid, req.logger);
    httpUtil.fetch(config, function(error, resp) {
        if (_.isUndefined(error)) {
            callback(null, resp);
        } else {
            callback(error, resp);
        }
    }, patientSelectResultProcessor);
}

function createJsonErrorResponse(status, data) {
    return {
        status: status,
        data: {
            error: {
                code: status,
                message: data
            }
        }
    };
}

function createJsonStandardResponse(status, data) {
    return {
        status: status,
        data: {
            data: {
                code: status,
                message: data
            }
        }
    };
}

var standardErrorResponse = {
    status: 500,
    data: {
        error: {
            code: 500,
            message: 'There was an error processing your request. The error has been logged.'
        }
    }
};

var noSiteResponse = {
    status: 404,
    data: {
        error: {
            code: 404,
            message: 'This patient\'s record is not yet accessible. Please try again in a few minutes. If it is still not accessible, please contact your HIMS representative and have the patient loaded into your local VistA.'
        }
    }
};

function patientSelectResultProcessor(status, data) {
    // GET: operations data status  202:ACCEPTED(status), 200:OK(status)
    if (status === 200 || status === 202) {
        return {
            status: status,
            data: JSON.parse(data)
        };
    }

    return standardErrorResponse;
}

function createConfig(config, pid, logger) {
    return {
        logger: logger,
        timeoutMillis: config.timeoutMillis,
        maxListeners: config.maxListeners,
        protocol: config.protocol,
        options: createOptionsWithPid(config, pid || '')
    };
}

function createConfigWithPidParam(config, pid, logger) {
    return {
        logger: logger,
        timeoutMillis: config.timeoutMillis,
        maxListeners: config.maxListeners,
        protocol: config.protocol,
        options: createParamWithPid(config, pid || '')
    };
}

function createParamWithPid(config, pid) {
    var options = _.clone(config.options);
    var fullPath = options.path;

    if (pid.length > 0) {
        var paraName = isIcn(pid) ? 'icn' : 'pid';
        fullPath += '?' + paraName + '=' + pid;
    }

    options.path = fullPath;

    if (config.headers) {
        options.headers = config.headers;
    }

    return options;
}

function createOptionsWithPid(config, pid) {
    var options = _.clone(config.options);
    var fullPath = options.path;

    if (pid.length > 0) {
        if (!S(options.path).endsWith('/') && !S(options.path).endsWith(':') && !S(options.path).endsWith('=')) {
            fullPath += '/';
        }

        if (S(options.path).endsWith(':')) {
            pid = pid.replace(/;/g, ':');
        }
        fullPath += pid;
    }

    options.path = fullPath;

    if (config.headers) {
        options.headers = config.headers;
    }

    return options;
}

function getOsyncActiveUserList(req, callback) {
    var users_list_screen_id = 'osyncusers';
    var options = _.extend({}, req.app.config.jdsServer, {
        method: 'GET',
        path: '/user/get/' + users_list_screen_id
    });
    var config = {
        options: options,
        protocol: 'http',
        timeoutMillis: 120000
    };
    httpUtil.fetch(config, callback);
}

function setOsyncActiveUserList(req, details, callback) {
    var options = _.extend({}, req.app.config.jdsServer, {
        method: 'POST',
        path: '/user/set/this'
    });
    var config = {
        options: options,
        protocol: 'http',
        timeoutMillis: 120000
    };
    console.dir(config);
    console.log("SR");
    console.dir(details);
    httpUtil.post(details, config, callback);
}


module.exports.isIcn = isIcn;
module.exports.getSiteFromPid = getSiteFromPid;
module.exports.isValidPid = isValidPid;
module.exports.getPatientFromPid = getPatientFromPid;
module.exports.getFullPatientFromPid = getFullPatientFromPid;
module.exports.domainsTotalsAccurate = domainsTotalsAccurate;
module.exports.getVistaSites = getVistaSites_v1;
module.exports.isSyncMarkedCompleted = isSyncMarkedCompleted_v1;
module.exports.isSyncCompleted = isSyncCompleted;
module.exports.getSiteSyncDataStatus = getSiteSyncDataStatus;
module.exports.hasSyncStatusErrorForSite = hasSyncStatusErrorForSite;
module.exports.isSiteSynced = isSiteSynced_v1;
module.exports.jdsDomainTotals = jdsDomainTotals;
module.exports.createJsonStandardResponse = createJsonStandardResponse;
module.exports.createJsonErrorResponse = createJsonErrorResponse;
module.exports.createConfig = createConfig;
module.exports.createConfigWithPidParam = createConfigWithPidParam;
module.exports.createOptionsWithPid = createOptionsWithPid;
module.exports.createParamWithPid = createParamWithPid;
module.exports.standardErrorResponse = standardErrorResponse;
module.exports.noSiteResponse = noSiteResponse;
module.exports.getOsyncActiveUserList = getOsyncActiveUserList;
module.exports.setOsyncActiveUserList = setOsyncActiveUserList;
