/*jslint node: true */
'use strict';

var _ = require('lodash');
var async = require('async');
var util = require('util');
var S = require('string');
var rdk = require('../../core/rdk');
var httpUtil = rdk.utils.http;
var nullchecker = require('../../utils/nullchecker');
var checkStatus = require('./jds-sync-check-status');
var jdsSyncConfig = require('./jds-sync-config');

module.exports.getSubsystemConfig = getSubsystemConfig;
module.exports.loadPatient = loadPatient;
module.exports.loadPatientPrioritized = loadPatientPrioritized;
module.exports.loadPatientForced = loadPatientForced;
module.exports.clearPatient = clearPatient;
module.exports.getPatientStatus = getPatientStatus;
module.exports.getPatientDataStatus = getPatientDataStatus;
module.exports.getPatientStatusDetail = getPatientStatusDetail;
module.exports.syncPatientDemographics = syncPatientDemographics;
module.exports.getOperationalStatus = getOperationalStatus;
module.exports.getPatient = getPatient;
module.exports.getPatientAllSites = getPatientAllSites;
module.exports.getJdsStatus = getJdsStatus;

function getSubsystemConfig(app) {
    return {
        healthcheck: {
            name: 'jdsSync',
            dependencies: ['authorization'],
            interval: 100000,
                check: function(callback) {
                var jdsOptions = _.extend({}, app.config.jdsServer, {
                       path: '/ping',
                      method: 'GET'
                    });
                var jdsConfig = {
                    timeoutMillis: 5000,
                    maxListeners: 10,
                    protocol: 'http',
                    options: jdsOptions
                };

            httpUtil.fetch(app.config, jdsConfig, function(err) {
                if (err) {
                    return callback(false);
                }
                callback(true);
            });
        }
        }
    };
}

function loadPatient(pid, immediate, req, callback) {
    var config = jdsSyncConfig.configureWithPidParam('loadPatient', pid, req);
    doLoad(config, pid, immediate, null, req, callback);
}

function loadPatientPrioritized(pid, prioritySite, req, callback) {
    var config = jdsSyncConfig.configureWithPidParam('loadPatient', pid, req);
    doLoad(config, pid, false, prioritySite, req, callback);
}

function loadPatientForced(pid, forcedSite, immediate, req, callback) {
    var config = jdsSyncConfig.configureWithPidParam('loadPatient', pid, req);
    jdsSyncConfig.addForcedParam(config, req, forcedSite);
    doLoad(config, pid, immediate, null, req, callback);
}

function clearPatient(pid, req, callback) {
    jdsSyncConfig.setupAudit(pid, req);
    async.waterfall([
        function(cb) {
            getPatientWithFallback(pid, req, cb);
        },
        function(patientResult, cb) {
            var usePid = getRealPid(pid, patientResult);
            if (usePid) {
                cb(null, usePid);
            } else {
                cb(404);
            }
        }
    ],
    function(err, usePid) {
        if (err) {
            return callback(err, createErrorResponse(err, 'pid '+pid+' not found.'));
        }
        var config = jdsSyncConfig.getSyncConfig('clearPatient', req);
        jdsSyncConfig.addPidParam(config, req, pid);
        httpUtil.fetch(req.app.config, config, function(err, clearResult) {
            if (nullchecker.isNullish(clearResult)) {
                req.logger.error(err);
                return callback(err);
            }
            req.logger.debug(clearResult);

            if (clearResult.status === 200) {
                waitForPatientClear(pid, usePid, req, callback);
            } else {
                callback(500, createErrorResponse(500, util.format('patient %s was not unsynced.', pid)));
            }
        }, createStandardResponse);
    });
}

function getPatientStatus(pid, req, callback) {
    var config = jdsSyncConfig.configureWithPidParam('getPatientStatus', pid, req);
    httpUtil.fetch(req.app.config, config, callback, _.partialRight(syncStatusResultProcessor, pid));
}

function getPatientDataStatus(pid, req, callback) {
    getPatientStatus(pid, req, function(syncError, syncResult) {
        if (!_.isUndefined(syncResult.error) && syncResult.error.code === 404) {
            return callback(syncResult.error.code, syncResult);
        } else if (!_.isUndefined((syncResult.data || {}).error) && syncResult.data.error.code === 404) {
            return callback(syncResult.data.error.code, syncResult.data);
        } else if (nullchecker.isNotNullish(syncError)) {
            return callback(500, createErrorResponse());
        }

        if (syncResult.status === 200) {
            var status = {};

            var vistaSites = [];
            _.each(req.app.config.vistaSites, function(val, name) {
                vistaSites.push(name);
            });

            var sites = checkStatus.getVistaSites(syncResult, req);
            if (sites.length > 0) {
                _.each(sites, function(site) {
                    req.logger.debug(site);
                    if (_.contains(vistaSites, site)) {
                        status.VISTA = status.VISTA || {};
                        status.VISTA[site] = checkStatus.getSiteSyncDataStatus(syncResult, site, req);
                        req.logger.debug(status);
                    } else {
                        status[site] = checkStatus.getSiteSyncDataStatus(syncResult, site, req, req);
                        req.logger.debug(status);
                    }
                });
            }
            status.allSites = checkStatus.isSyncCompleted(syncResult);
            callback(undefined, {status: 200, data: status});
        }
    });
}

function getPatientStatusDetail(pid, req, callback) {
    var config = jdsSyncConfig.configureWithPidInPath('getPatientStatusDetail', pid, req);
    jdsSyncConfig.addParam('detailed', 'true', config);
    httpUtil.fetch(req.app.config, config, callback, _.partialRight(syncStatusResultProcessor, pid));
}

function syncPatientDemographics(payload, req, callback) {
    var pid;
    if (payload.pid.length) {
        pid = payload.pid[0];
    } else if (payload.icn) {
        pid = payload.icn;
    } else if (payload.edipi) {
        pid = payload.edipi;
    }
    var config = jdsSyncConfig.configure('syncPatientDemographics', pid, req);
    httpUtil.post(payload, req.app.config, config, callback);
}

function getOperationalStatus(site, req, callback) {
    var config = jdsSyncConfig.configure('getOperationalStatus', undefined, req);
    jdsSyncConfig.addSiteToPath(config, req, site);
    httpUtil.fetch(req.app.config, config, callback, syncStatusOperationalResultProcessor);
}

function getPatient(pidOrIcn, req, callback) {
    var configName = isIcn(pidOrIcn) ? 'getPatientByIcn' : 'getPatientByPid';
    var config = jdsSyncConfig.configureWithPidInPath(configName, pidOrIcn, req);
    httpUtil.fetch(req.app.config, config, callback, syncStatusOperationalResultProcessor);
}

function getPatientAllSites(pid, req, callback) {
    var config = jdsSyncConfig.configureWithPidInPath('getPatientByPidAllSites', pid, req);
    httpUtil.fetch(req.app.config, config, callback, syncStatusOperationalResultProcessor);
}

function getJdsStatus(pid, req, callback) {
    var config = jdsSyncConfig.configure('getJdsStatus', pid, req);
    jdsSyncConfig.replacePidInPath(config, req, pid);
    httpUtil.fetch(req.app.config, config, callback, _.partialRight(syncStatusResultProcessor, pid));
}

// Internal functions:

function doLoad(config, pid, immediate, prioritySite, req, callback) {
    getPatientAndStatus(pid, req, function(err, result) {
        var syncStatus = result.status;
        if (_.isArray(syncStatus) && syncStatus.length > 0) {
            syncStatus = syncStatus[0];
        }
        var usePid = getRealPid(pid, result.patient);
        if (nullchecker.isNullish(syncStatus) || nullchecker.isNullish(usePid)) {
            req.logger.error('Failed to get pid from patient.');
            return callback(err || 404, createErrorResponse(404, noSiteMessage));
        }

        httpUtil.fetch(req.app.config, config, function(loaderr, loadres) {
            if (nullchecker.isNullish(loadres)) {
                req.logger.error(loaderr);
                return callback(500, createErrorResponse());
            }

            req.logger.debug('return immediately? '+ immediate);
            if (immediate) {
                req.logger.debug('Sending response immediately after starting sync (not wating for sync complete)');
                return getPatientStatus(pid, req, function(err, syncStatus) {
                    if (nullchecker.isNullish(syncStatus)) {
                        req.logger.error(err);
                        return callback(500, createErrorResponse());
                    }
                    syncStatus.status = 201;
                    return callback(err, syncStatus);
                });
            }

            req.logger.trace(loadres.load);

            waitForPatientLoad(pid, usePid, prioritySite, req, callback);
        }, createStandardResponse);
    });
}

function waitForPatientLoad(pid, usePid, prioritySite, req, callback) {
    var syncStatus,
        toLoop = true,
        startTime = process.hrtime();
    async.doWhilst(
        function (nxt) {//Action
            getPatientAndStatus(pid, req, function (err, syncResult) {
                syncStatus = syncResult.status;
                if (_.isArray(syncStatus) && syncStatus.length > 0) {
                    syncStatus = syncStatus[0];
                }
                var patient = syncResult.patient;

                if (nullchecker.isNullish(syncStatus) || nullchecker.isNullish(patient)) {
                    toLoop = exitDoWhilst(err, req, nxt, callback);
                    return;
                }

                req.logger.trace(_.keys(syncStatus));

                if (!containsPid(patient)) {
                    req.logger.debug('%s NOT a valid patient - aborting!', patient);
                    toLoop = exitDoWhilst(404, req, nxt, callback);
                    return;
                }

                toLoop = !isSyncComplete(syncStatus, prioritySite, usePid, req);

                breakOrContinue(toLoop, startTime, pid, req, nxt, callback);
            });
        },
        function () { // Loop test
            return toLoop === true;
        },
        function (err) { // Finished
            req.logger.debug('checking sync data');
            if (_.isUndefined(syncStatus.error)) {
                req.logger.trace('no error in syncStatus');
                syncStatus.status = 201;
                callback(err, syncStatus);
            } else {
                callback(syncStatus.error.code, syncStatus);
            }
        }
    );
}

function isSyncComplete(syncStatus, prioritySite, pid, req) {
    if (!_.isUndefined(syncStatus) && !_.isUndefined(syncStatus.status) && syncStatus.status !== 404) {
        var sites;
        if (prioritySite === null) {
            req.logger.debug('calling checkStatus.getVistaSites');
            sites = checkStatus.getVistaSites(syncStatus, req);
        } else if (!_.isUndefined(getSiteFromPid(pid))) {
            sites = [getSiteFromPid(pid)];
        } else {
            sites = prioritySite;
        }
        req.logger.debug('Checking sync status for the following sites: '+sites);

        var syncComp = checkStatus.isSyncMarkedCompleted(syncStatus, sites, req);

        if (!syncComp) { // check to make sure all sites are sync completed
            syncComp = checkStatus.isSyncCompleted(syncStatus);
        }
        if (syncComp) {
            req.logger.debug('Sync Complete');
            return true;
        } else {
            req.logger.debug('Sync NOT Complete');
            return false;
        }
    }
}

function getSiteFromPid(pid) {
    if (nullchecker.isNotNullish(pid) && S(pid).contains(';')) {
        return pid.split(';')[0];
    }
    return undefined;
}

function exitDoWhilst(err, req, nxt, callback) {
    req.logger.error(err);
    if (err === 404) {
        callback(404, createErrorResponse(404, noSiteMessage));
    } else {
        callback(500, createErrorResponse());
    }
    nxt(err);
    return false;
}

function breakOrContinue(toLoop, startTime, pid, req, nxt, callback) {
    if (!toLoop) {
        nxt();
        return;
    }

    var settings = req.app.config.jdsSync.settings;
    var currentTime = process.hrtime(startTime);
    var totalTime = (currentTime[0]*1e9+currentTime[1])/1e6; // calculate how long since load started in milliseconds

    req.logger.debug(pid+' sync time taken so far: '+totalTime);
    if (totalTime > settings.timeoutMillis) {
        req.logger.error(pid+' is taking too long to sync. Waited (milliseconds): '+totalTime+' before giving up and return error 500');
        return exitDoWhilst(500, req, nxt, callback);
    }

    setTimeout(nxt, settings.waitMillis);
}

function getPatientWithFallback(pid, req, callback) {
    getPatient(pid, req, function(error, resp) {
        // If there is a 'data' block but no 'items' then
        // try getPatientAllSites
        if (resp && resp.data && resp.data.data && resp.data.data.totalItems <= 0) {
            getPatientAllSites(pid, req, function(error, resp){
                if (error && error.code === 'ECONNRESET') {
                    //JDS is not ready, issue 404
                    callback(404, createErrorResponse(404, noSiteMessage));
                } else {
                    callback(error, resp);
                }
            });
        } else {
            callback(error, resp);
        }
    });
}

function getPatientAndStatus(pid, req, callback) {
    async.series({
        patient: function(cb) {
            getPatientWithFallback(pid, req, cb);
        },
        status: function (cb) {
            getPatientStatus(pid, req, cb);
        }
    }, callback);
}

function isIcn(pid) {
    return nullchecker.isNotNullish(pid) && !S(pid).contains(';');
}

function containsPid(patient) {
    return patient && patient.data && patient.data.data && patient.data.data.totalItems > 0;
}

function getRealPid(pid, patientResult) {
    if (containsPid(patientResult)) {
        if (isIcn(pid)) {
            return patientResult.data.data.items[0].pid;
        } else {
            return pid;
        }
    }
}

function waitForPatientClear(pid, usePid, req, callback) {
    var toLoop = true,
        startTime = process.hrtime();
    async.doWhilst(
        function (nxt) {//Action
            getPatientAndStatus(pid, req, function (err, currentResult) {
                if (nullchecker.isNullish(currentResult.status) || nullchecker.isNullish(currentResult.patient)) {
                    toLoop = exitDoWhilst(err, req, nxt, callback);
                } else {
                    req.logger.debug(currentResult.status);
                    req.logger.debug(currentResult.patient);
                    if (_.isArray(currentResult.status) && currentResult.status.length > 0) {
                        currentResult.status = currentResult.status[0];
                    }
                    if (currentResult.status.status === 404 && currentResult.patient.status === 200) {
                        toLoop = false;
                    }
                }
            });

            breakOrContinue(toLoop, startTime, pid, req, nxt, callback);
        },
        function () { // Loop test
            return toLoop === true;
        },
        function () { // Finished
            callback(null, createStandardResponse(200, 'pid '+pid+' unsynced.'));
        }
    );
}

function syncStatusResultProcessor(status, data, pid) {
    // GET: status  404:NOT_FOUND('pid ' + pid + ' is unsynced.'), 200:OK(sync status), 500:INTERNAL_SERVER_ERROR
    if (status === 404) {
        return createErrorResponse(404, util.format('pid %s is unsynced', pid));
    }

    if (status === 200) {
        return {
            status: 200,
            data: JSON.parse(data)
        };
    }

    return createErrorResponse();
}

function syncStatusOperationalResultProcessor(status, data) {
    // GET: operations data status  202:ACCEPTED(status), 200:OK(status)
    if (status === 200 || status === 202) {
        return {
            status: status,
            data: JSON.parse(data)
        };
    }

    return createErrorResponse();
}

function createErrorResponse(status, data) {
    status = status || 500;
    return {
        status: status,
        data: {
            error: {
                code: status,
                message: data || 'There was an error processing your request. The error has been logged.'
            }
        }
    };
}

function createStandardResponse(status, data) {
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

var noSiteMessage = 'This patient\'s record is not yet accessible. Please try again in a few minutes. If it is still not accessible, please contact your HIMS representative and have the patient loaded into your local VistA.';
