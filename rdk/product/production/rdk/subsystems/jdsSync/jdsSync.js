/*jslint node: true */
'use strict';

var _ = require('lodash'),
    async = require('async'),
    util = require('util'),

    httpUtil = require('../../utils/http-wrapper/http'),
    nullchecker = require('../../utils/nullchecker/nullchecker'),
    jdsUtils = require('./jdsUtils');

module.exports.getInstance = function(app, jdsSyncConfiguration) {
    return new JdsSync(app, jdsSyncConfiguration);
};

function JdsSync(app, jdsSyncConfiguration) {
    if (!(this instanceof JdsSync)) {
        return new JdsSync(app, jdsSyncConfiguration);
    }

    var patientLoadEndpoint = sync.bind(null, syncLoadResultProcessor, 'syncPatientLoad');
    var patientLoadPrioritizedEndpoint = sync.bind(null, syncLoadResultProcessor, 'syncPatientLoadPrioritized');
    var patientLoadForcedEndpoint = sync.bind(null, syncLoadResultProcessor, 'syncPatientLoadForced');
    var patientClearEndpoint = sync.bind(null, syncClearResultProcessor, 'syncPatientClear');
    var patientStatusEndpoint = sync.bind(null, syncStatusResultProcessor, 'syncPatientStatus');
    var patientDataStatusEndpoint = sync.bind(null, syncStatusResultProcessor, 'syncPatientDataStatus');
    var patientSyncStatusDetailEndpoint = sync.bind(null, syncStatusResultProcessor, 'syncPatientStatusDetail');
    var operationalStatusEndpoint = sync.bind(null, syncStatusOperationalResultProcessor, 'syncOperationalStatus');

    var patientSyncLoad = syncFetch.bind(null, syncLoadResultProcessor);
    var patientSyncLoadPrioritized = syncFetch.bind(null, syncLoadResultProcessor);
    var patientSyncLoadForced = syncFetch.bind(null, syncLoadResultProcessor);
    var patientSyncClear = syncFetch.bind(null, syncClearResultProcessor);
    var patientSyncDataStatus = syncFetch.bind(null, syncStatusResultProcessor);
    var fetchPatientSyncStatus = syncFetch_v1.bind(null, syncStatusResultProcessor);
    var fetchOperationalStatus = syncFetch.bind(null, syncStatusOperationalResultProcessor);

    var jdsSync = {};

    jdsSync.patientLoadEndpoint = patientLoadEndpoint;
    jdsSync.patientLoadPrioritizedEndpoint = patientLoadPrioritizedEndpoint;
    jdsSync.patientLoadForcedEndpoint = patientLoadForcedEndpoint;
    jdsSync.patientClearEndpoint = patientClearEndpoint;
    jdsSync.patientStatusEndpoint = patientStatusEndpoint;
    jdsSync.operationalStatusEndpoint = operationalStatusEndpoint;
    jdsSync.patientDataStatusEndpoint = patientDataStatusEndpoint;
    jdsSync.patientSyncStatusDetailEndpoint = patientSyncStatusDetailEndpoint;

    jdsSync.patientSyncLoad = patientSyncLoad;
    jdsSync.patientSyncLoadPrioritized = patientSyncLoadPrioritized;
    jdsSync.patientSyncLoadForced = patientSyncLoadForced;
    jdsSync.patientSyncClear = patientSyncClear;
    jdsSync.patientSyncDataStatus = patientSyncDataStatus;
    jdsSync.fetchPatientSyncStatus = fetchPatientSyncStatus;
    jdsSync.fetchOperationalStatus = fetchOperationalStatus;

    jdsSync.getSubsystemConfig = function(app) {
        return {
            healthcheck: {
                name: 'jdsSync',
                dependencies: ['authorization'],
                interval: 100000,
                    check: function(callback){
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

                httpUtil.fetch(jdsConfig, function(err) {
                    if(err) {
                        return callback(false);
                    }
                    callback(true);
                });
            }
            }
        };
    };

    return jdsSync;
}

function sync(resultProcessor, configName, req, res, next) {
    req.audit.patientId = req.param('pid');
    req.audit.logCategory = 'SYNC';

    var pid = req.param('pid') || req.param('dfn') || '';
    var prioritySelect = req.param('prioritySelect') || '';
    var prioritySite = req.param('prioritySite') || '';
    var forcedSite = req.param('forcedSite') || '';
    var immediate = (req.param('immediate') === 'true');
    var vxSync = _.clone(req.app.config.vxSyncServer);
    var jds = _.clone(req.app.config.jdsServer);
    req.logger.debug(configName);

    if(pid)
    {
        req.audit.patientId = pid;
    }
    else
    {
        pid = '';
    }

    //Ensure a single prioritySite is treated as an array instead of a string
    if(_.isString(prioritySite)){
        prioritySite = prioritySite.split(',');
        req.logger.debug(prioritySite);
    }

    if(_.isString(forcedSite)){
        forcedSite = forcedSite.split(',');
        req.logger.debug(forcedSite);
    }

    var config = _.clone(req.app.config.jdsSync[configName]);
    if (req.get('Authorization') !== undefined) {
        config.headers = {
            Authorization: req.get('Authorization')
        };
    }
    switch (configName) {
        case 'syncPatientLoad':
            doLoad(resultProcessor, config, pid, immediate, null, null, null, req, res, next, undefined);
            break;
        case 'syncPatientLoadPrioritized':
            doLoad(resultProcessor, config, pid, immediate, prioritySelect, prioritySite, null, req, res, next, undefined);
            break;
        case 'syncPatientLoadForced':
            doLoad(resultProcessor, config, pid, immediate, null, null, forcedSite, req, res, next, undefined);
            break;
        case 'syncPatientClear':
            doClear(resultProcessor, config, pid, req, res, next);
            break;
        case 'syncPatientDataStatus':
            getDataStatus(pid, req, res);
            break;
        case 'syncPatientStatusDetail':
            getSyncStatusDetail(pid, req, res);
            break;
        case 'syncPatientStatus':
            config.options.host = vxSync.host;
            config.options.port = vxSync.port;
            syncFetch_v1(resultProcessor, config, pid, req.logger, function(error, result) {
                if (_.isNull(result)) {
                    req.logger.error(error);
                    res.json(jdsUtils.standardErrorResponse.status, jdsUtils.standardErrorResponse.data);
                } else {
                    //req.logger.trace(result);
                    if (!_.isUndefined(result) && !_.isUndefined(result.data) && !_.isUndefined(result.status)) {
                        res.json(result.status, result.data);
                    }
                    else {
                        res.json(jdsUtils.standardErrorResponse.status, jdsUtils.standardErrorResponse.data);
                    }
                }
            });
            break;
        case 'syncOperationalStatus':
            config.options.host = jds.host;
            config.options.port = jds.port;
            // add the primary site info to the path
            // @TODO, what to do for patient without a primary site?
            if((req.session.user || {}).site) {
                req.logger.debug('adding primary site information');
                var configPath = config.options.path;
                if (configPath.indexOf('/',configPath.length-1) !== -1) {
                    config.options.path = configPath + req.session.user.site;
                }
            }
            req.logger.debug(config);
            syncFetch(resultProcessor, config, '', req.logger, function(error, result) {
                if (_.isNull(result)) {
                    req.logger.error(error);
                    res.json(jdsUtils.standardErrorResponse.status, jdsUtils.standardErrorResponse.data);
                } else {
                    req.logger.trace(result);
                    res.json(result.status, result.data);
                }
            });
            break;
    }
}

function syncFetch(resultProcessor, config, pid, logger, callback) {
    logger.info('syncFetch called');
    logger.info(config);
    var newConfig = {
        logger: logger,
        timeoutMillis: config.timeoutMillis,
        protocol: config.protocol,
        options: jdsUtils.createOptionsWithPid(config, pid || '')
    };
    httpUtil.fetch(newConfig, callback, resultProcessor);
}

function syncFetch_v1(resultProcessor, config, pid, logger, callback) {
    logger.info('syncFetch_v1 called');
    logger.info(config);
    var newConfig = {
        logger: logger,
        timeoutMillis: config.timeoutMillis,
        protocol: config.protocol,
        options: jdsUtils.createParamWithPid(config, pid || '')
    };
    httpUtil.fetch(newConfig, callback, resultProcessor);
}

function doLoad(processor, config, pid, immediate, prioritySelect, prioritySite, forcedSite, req, resp, next, interceptor) {
    req.logger.info('doLoad is called');
    var authHeader, syncStatus, patient, sites, syncComp = false,
        toLoop = true;
    var settings = _.clone(req.app.config.jdsSync.settings);
    var startTime = process.hrtime();
    var totalTime = 0, currentTime = 0;

    // First get the current status and see if a load is necessary
    async.series({
        verify: function (cb) {
            getHmpHeader(req, cb);
        },
        currentStatus: function(cb){
            getSyncStatus(pid, req, cb);
        },
        currentPatient: function(cb){
            jdsUtils.getPatientFromPid(pid, req, cb);
        }
    }, function(currerr, currres){
        authHeader = currres.verify;
        syncStatus = currres.currentStatus;
        patient = currres.currentPatient;

        if(_.isNull(syncStatus) || _.isNull(patient)){
            req.logger.error(currerr);
            if (interceptor === undefined) {
                return resp.json(500, jdsUtils.standardErrorResponse);
            }
            else {
                return interceptor(500, jdsUtils.standardErrorResponse);
            }
        }

        //req.logger.trace(syncStatus);
        //req.logger.trace(patient);

        if(!jdsUtils.isValidPid(patient)){
            req.logger.info('%s NOT a valid patient - aborting!', patient);
            if (interceptor === undefined) {
                resp.json(404, jdsUtils.noSiteResponse);
            }
            else{
                return interceptor(404, jdsUtils.noSiteResponse);
            }
            return false;
        }

        if(!jdsUtils.isIcn(pid) && !nullchecker.isNullish(patient.data.data.items[0].icn)){
            req.logger.debug('Found an ICN for this patient.');
            pid = patient.data.data.items[0].icn;
            req.logger.debug('Now using ICN: ' + pid + 'instead of given pid.');
        }

        if((syncStatus && syncStatus.status === 404) || !syncComp){
            async.series({
                load: function(cb){
                    ehmpLoad(pid, prioritySelect, prioritySite, forcedSite, req, config, authHeader, cb);
                }
            }, function(loaderr, loadres){

                if(_.isNull(loadres)){
                    req.logger.error(loaderr);
                    if (interceptor === undefined) {
                        return resp.json(500, jdsUtils.standardErrorResponse);
                    }
                    else {
                        return interceptor(500, jdsUtils.standardErrorResponse);
                    }
                }

                req.logger.debug('return immediately: '+ immediate);
                if(immediate){
                    req.logger.debug('Sending response immediately after starting sync (not wating for sync complete)');
                    async.series({
                        status: function(cb){
                            getSyncStatus(pid, req, cb);
                        }
                    }, function(err, immediateResult) {
                        syncStatus = immediateResult.status;
                        if(_.isNull(syncStatus)){
                            req.logger.error(err);
                            if(interceptor === undefined){
                                return resp.json(500, jdsUtils.standardErrorResponse);
                            }
                            else{
                                return interceptor(500, jdsUtils.standardErrorResponse);
                            }
                        }
                        if(interceptor === undefined){
                            resp.json(201, syncStatus.data);
                        }
                        else {
                            interceptor(err, syncStatus.data);
                        }
                    });
                }

                req.logger.trace(loadres.load);

                // Wait for the sync to happen and re-issue load if necessary
                async.doWhilst(
                    function (nxt) {//Action
                        async.series({
                            patient: function (cb) {
                                jdsUtils.getPatientFromPid(pid, req, cb);
                            },
                            status: function (cb) {
                                getSyncStatus(pid, req, cb);
                            }
                        }, function (err, syncResult) {
                            syncStatus = syncResult.status;
                            patient = syncResult.patient;

                            if(_.isNull(syncStatus) || _.isNull(patient)){
                                req.logger.error(err);
                                if (interceptor === undefined) {
                                    return resp.json(500, jdsUtils.standardErrorResponse);
                                }
                                else {
                                    return interceptor(500, jdsUtils.standardErrorResponse);
                                }
                            }

                            req.logger.trace(_.keys(syncStatus));
                            // req.logger.trace(patient);

                            if(!jdsUtils.isValidPid(patient)){
                                req.logger.debug('%s NOT a valid patient - aborting!', patient);
                                if (interceptor === undefined) {
                                    resp.json(404, syncStatus);
                                }
                                else{
                                    return interceptor(404, syncStatus);
                                }
                                return false;
                            }

                            if(!_.isUndefined(syncStatus) && !_.isUndefined(syncStatus.status) && syncStatus.status !== 404 && toLoop) {
                                if(prioritySite === null) {
                                    req.logger.debug('calling jdsUtils.getVistaSites');
                                    sites = jdsUtils.getVistaSites(syncStatus, req);
                                }
                                else if (!_.isUndefined(jdsUtils.getSiteFromPid(pid))){
                                    sites = [jdsUtils.getSiteFromPid(pid)];
                                }
                                else {
                                    sites = prioritySite;
                                }
                                req.logger.debug('Checking sync status for the following sites: '+sites);
                                syncComp = jdsUtils.isSyncMarkedCompleted(syncStatus, sites, req);
                                //@TODO comment out for now, not sure we need to re-send the sync request again?
/*                                if(needToSync(syncStatus, pid, sites, req)){
                                    async.series({
                                        load: function(cb){
                                            ehmpLoad(pid, prioritySelect, prioritySite, req,
                                                config, authHeader, cb);
                                        }
                                    }, function(syncerr, syncres){
                                        req.logger.debug('Re-issued Sync');
                                        req.logger.debug(syncres.load);
                                    });
                                }*/

                                req.logger.debug('Status Marked Complete Status: '+syncComp);
                                if (!syncComp) { // check to make sure all sites are sync completed
                                    syncComp = jdsUtils.isSyncCompleted(syncStatus);
                                    if (syncComp) {
                                        req.logger.debug('sync completed!');
                                        req.logger.debug(syncStatus);
                                    }
                                }
                                if (syncComp) {
                                    toLoop = false;
                                    req.logger.debug('Sync Complete');
                                }
                                else {
                                    toLoop = true;
                                    req.logger.debug('Sync NOT Complete');
                                }
                            }
                        });

                        // Check to see if sync is taking too long, if so return error response & give up
                        currentTime = process.hrtime(startTime);
                        totalTime = (currentTime[0]*1e9+currentTime[1])/1e6; // calculate how long since load started in milliseconds

                        req.logger.debug(pid+' sync time taken so far: '+totalTime);
                        if(totalTime > settings.timeoutMillis){
                            req.logger.error(pid+' is taking too long to sync. Waited (milliseconds): '+totalTime+' before giving up and return error 500');
                            if (interceptor === undefined) {
                                return resp.json(500, jdsUtils.standardErrorResponse);
                            }
                            else {
                                return interceptor(500, jdsUtils.standardErrorResponse);
                            }
                        }

                        // Delay between each loop
                        setTimeout(nxt, settings.waitMillis);
                    },
                    function () { // Loop test
                        return toLoop === true;
                    },
                    function (err) { // Finished
                        req.logger.debug('checking sync data');
                        if(_.isUndefined(syncStatus.error)) {
                            req.logger.trace('no error in syncStatus');
                            if (interceptor === undefined) {
                                resp.json(201, syncStatus.data);
                            }
                            else {
                                //interceptor(err, syncStatus.data);
                                req.logger.debug('route to interceptor');
                                interceptor(err, syncStatus);
                            }
                        }
                        else{
                            if (interceptor === undefined) {
                                resp.json(syncStatus.error.code, syncStatus);
                            }
                            else {
                                interceptor(syncStatus.error.code, syncStatus);
                            }
                        }
                    }
                );
            });
        }
        else{
            if (interceptor === undefined) {
                resp.json(201, syncStatus);
            }
            else {
                interceptor(null, syncStatus);
            }
        }
    });
}

function doClear(processor, config, pid, req, resp){
    var usePid = pid,
        authHeader,
        syncStatus,
        toLoop = true;
    var settings = _.clone(req.app.config.jdsSync.settings);

    async.series({
        verify: function (cb) {
            getHmpHeader(req, cb);
        },
        patient: function(cb){
            jdsUtils.getPatientFromPid(pid, req, cb);
        }
    }, function(err, res1){
        authHeader = res1.verify;

        if(_.isNull(res1.patient)){
            req.logger.error(err);
            return resp.json(500, jdsUtils.standardErrorResponse);
        }

        if(jdsUtils.isValidPid(res1.patient)){
            if(jdsUtils.isIcn(pid)){
                usePid = res1.patient.data.data.items[0].pid;
            }
        }
        else{
            var message = pid+' is not a valid pid for JdsConfiguration{host=10.2.2.110, port=9080}';
            resp.send(404, message);
            return false;
        }

        async.series({
            clear: function(cb){
                ehmpClear(usePid, req, config, authHeader, cb);
            }
        }, function(err, clearResult){
            if(_.isNull(clearResult.clear)){
                req.logger.error(err);
                return resp.json(500, jdsUtils.standardErrorResponse);
            }
            req.logger.debug(clearResult.clear);

            if(clearResult.clear.status === 200){
                async.doWhilst(
                    function (nxt) {//Action
                        async.series({
                            status: function (cb) {
                                getSyncStatus(usePid, req, cb);
                            },
                            patient: function(cb){
                                jdsUtils.getPatientFromPid(usePid, req, cb);
                            }
                        }, function (err, currentResult) {
                            if(_.isNull(currentResult.status) || _.isNull(currentResult.patient)){
                                req.logger.error(err);
                                return resp.json(500, jdsUtils.standardErrorResponse);
                            }
                            req.logger.debug(currentResult.status);
                            req.logger.debug(currentResult.patient);
                            syncStatus = currentResult.status.data;
                            if(currentResult.status.status === 404 && currentResult.patient.status === 200){
                                toLoop = false;
                            }
                        });

                        setTimeout(nxt, settings.waitMillis);
                    },
                    function () { // Loop test
                        return toLoop === true;
                    },
                    function () { // Finished
                        resp.json(200, jdsUtils.createJsonStandardResponse(200,  'pid '+pid+' unsynced.'));
                    }
                );
            }
            else{
                resp.json(500, jdsUtils.createJsonErrorResponse(500, util.format('patient %s was not unsynced.', pid)));
            }
        });
    });
}

function ehmpLoad(pid, prioritySelect, prioritySite, forcedSite, req, config, verify, callback){
    var hmp = _.clone(req.app.config.vxSyncServer);
    config = jdsUtils.createConfig(config, '', req.logger);

    config.options.headers = {
        //Authorization: verify,
        Accept: 'application/json'
    };

    if(jdsUtils.isIcn(pid)){
        config.options.path = config.options.path+'?icn='+pid;
    }
    else{
        config.options.path = config.options.path+'?pid='+pid;
    }

    config.options.host = hmp.host;
    config.options.port = hmp.port;

    if(prioritySelect !== null){
        req.logger.debug('Syncing with priority...'+ prioritySelect);
        // config.options.path += '&prioritySelect='+ prioritySelect;
        // if(prioritySite !== null){
        //     //Add list of sites to request path
        //     _.each(prioritySite, function(site) {
        //         config.options.path += '&prioritySite=' + site;
        //     });
        // }
    }
    else{
        req.logger.debug('NOT syncing with priority...... ');
    }

    if(forcedSite) {
        if (_.isArray(forcedSite) && forcedSite.length > 0) {
            config.options.path += '&forcedSync=' + JSON.stringify(forcedSite);
        }
        else if (forcedSite === 'true') {
            config.options.path += '&forcedSync=true';
        }
    }

    httpUtil.fetch(config, function(error, resp){
        if(_.isNull(resp)){
            req.logger.error(error);
            callback(error, null);
        }
        else{
            callback(null, resp);
        }
    }, jdsUtils.createJsonStandardResponse);
}

function ehmpClear(pid, req, config, verify, callback){
    var hmp = _.clone(req.app.config.vxSyncServer);
    var newconfig = jdsUtils.createConfig(config, '', req.logger);

    newconfig.options.headers = {
        Authorization: verify,
        Accept: 'application/json'
    };

    newconfig.options.host = hmp.host;
    newconfig.options.port = hmp.port;
    if (jdsUtils.isIcn(pid)){
        newconfig.options.path = newconfig.options.path+'?icn='+pid;
    }
    else{
        newconfig.options.path = newconfig.options.path+'?pid='+pid;
    }

    httpUtil.fetch(newconfig, function(error, resp){
        if(_.isNull(resp)){
            req.logger.error(error);
            callback(error, null);
        }
        else{
            callback(null, resp);
        }
    }, jdsUtils.createJsonStandardResponse);
}

function getDataStatus(pid, req, res){
    var vista = _.clone(req.app.config.vistaSites);
    var status = {};

    async.series({
        syncStatus: function(cb) {
            getSyncStatus(pid, req, cb);
        }
    }, function(syncError, syncResult) {
        if(_.isNull(syncResult.syncStatus)){
            return res.json(500, jdsUtils.standardErrorResponse);
        }

        if(!_.isUndefined(syncResult.syncStatus.error) && syncResult.syncStatus.error.code === 404){
            return res.json(syncResult.syncStatus.error.code, syncResult.syncStatus);
        }

        if(!_.isUndefined((syncResult.syncStatus.data || {}).error) && (syncResult.syncStatus.data || {}).error.code === 404){
            return res.status(syncResult.syncStatus.status).json(syncResult.syncStatus.data);
        }

        if(syncResult.syncStatus.status === 200) {
            var sites = jdsUtils.getVistaSites(syncResult.syncStatus, req);
            var vistaSites = [];

            _.each(vista, function(val, name){
                vistaSites.push(name);
            });
            if (sites.length > 0) {
                _.each(sites, function(site) {
                    req.logger.debug(site);
                    if (_.contains(vistaSites, site)) {
                        status.VISTA = status.VISTA || {};
                        status.VISTA[site] = jdsUtils.getSiteSyncDataStatus(syncResult.syncStatus, site, req);
                        req.logger.debug(status);
                    }
                    else {
                        status[site] = jdsUtils.getSiteSyncDataStatus(syncResult.syncStatus, site, req, req);
                        req.logger.debug(status);
                    }
                });
            }
            status.allSites = jdsUtils.isSyncCompleted(syncResult.syncStatus);
            res.json(200, status);
        }

    });
}

function needToSync(syncstatus, pid, sites, req){
    var found = false, missing = false, expectedStatus;
    if (nullchecker.isNullish(syncstatus)){
        return false;
    }
    else
    {
        if (sites.length > 0){
            _.each(syncstatus.data.items, function(el){
                if (_.indexOf(sites, el.pid)){
                    // Verify expected sites are complete
                    _.each(_.values(el.syncStatusByVistaSystemId), function(val){
                        expectedStatus = val.syncComplete;
                        req.logger.debug('needToSync - Expected: '+expectedStatus);
                        if (!nullchecker.isNullish(expectedStatus) && expectedStatus){
                            found = true;
                        }
                        else if(nullchecker.isNullish(expectedStatus)){
                            missing = true;
                        }
                    });
                }
            });

        }

        return (found && missing);
    }
}


function getHmpHeader(req, cb){
    //return cb(null,'');
    var hmp = _.clone(req.app.config.hmpServer),
        token = hmp.accessCode+':'+hmp.verifyCode;

    token = new Buffer(token).toString('base64');
    token = 'Basic '+token;

    cb(null, token);
}



function getSyncStatus(pid, req, callback){
    var vxSync = _.clone(req.app.config.vxSyncServer),
        config = _.clone(req.app.config.jdsSync.syncPatientStatus);

    config.options.host = vxSync.host;
    config.options.port = vxSync.port;
    config = jdsUtils.createConfigWithPidParam(config, pid, req.logger);

    req.logger.info(config.options.path);

    httpUtil.fetch(config, function(error, resp){
        if(_.isNull(resp)){
            req.logger.error(error);
            callback(error, null);
        }
        else{
            callback(null, resp);
        }
    }, _.partialRight(syncStatusResultProcessor, pid));
}

/**
 * Get the detailed patient sync status from JDS endpoint.
*/
function getSyncStatusDetail(pid, req, res){
    var jdsSync = _.clone(req.app.config.jdsServer),
        config = _.clone(req.app.config.jdsSync.syncPatientStatusDetail);

    config.options.host = jdsSync.host;
    config.options.port = jdsSync.port;
    config = jdsUtils.createConfig(config, pid, req.logger);
    config.options.path += '?detailed=true';

    httpUtil.fetch(config, function(error, resp){
        if(_.isNull(resp)){
            req.logger.error(error);
            res.json(jdsUtils.standardErrorResponse.status, jdsUtils.standardErrorResponse.data);
        }
        else if (resp.status && resp.data) {
            res.status(resp.status).json(resp.data);
        }
        else {
            res.json(jdsUtils.standardErrorResponse.status, jdsUtils.standardErrorResponse.data);
        }
    }, _.partialRight(syncStatusResultProcessor,pid));
}

function syncStatusResultProcessor(status, data, pid) {
    // GET: status  404:NOT_FOUND('pid ' + pid + ' is unsynced.'), 200:OK(sync status), 500:INTERNAL_SERVER_ERROR
    if (status === 404) {
        return jdsUtils.createJsonErrorResponse(404, util.format('pid %s is unsynced', pid));
    }

    if (status === 200) {
        return {
            status: 200,
            data: JSON.parse(data)
        };
    }

    return jdsUtils.standardErrorResponse;
}

function syncLoadResultProcessor(status, data) {

    // PUT: subscribe  404:NOT_FOUND(Stacktrace), 500:INTERNAL_SERVER_ERROR(Stacktrace), 201:CREATED(sync result)
    if (status === 404) {
        return jdsUtils.createJsonErrorResponse(404, util.format('patient was not found'));
    }

    if (status === 201) {
        return {
            status: 201,
            data: JSON.parse(data)
        };
    }

    return jdsUtils.standardErrorResponse;
}

function syncClearResultProcessor(status, data, pid) {
    // DELETE: unsubscribe  404:NOT_FOUND(Stacktrace), 500:INTERNAL_SERVER_ERROR(Stacktrace), 200:OK('pid ' + pid + ' unsynced.')
    if (status === 404) {
        return jdsUtils.createJsonErrorResponse(404, util.format('patient %s was not found', pid));
    }

    if (status === 200) {
        return jdsUtils.createJsonStandardResponse(200, util.format('pid %s unsynced.', pid));
    }

    return jdsUtils.standardErrorResponse;
}

function syncStatusOperationalResultProcessor(status, data) {
    // GET: operations data status  202:ACCEPTED(status), 200:OK(status)
    if (status === 200 || status === 202) {
        return {
            status: status,
            data: JSON.parse(data)
        };
    }

    return jdsUtils.standardErrorResponse;
}

module.exports._sync = sync;
module.exports._doLoad = doLoad;
module.exports._syncFetch = syncFetch;
module.exports._getSyncStatus = getSyncStatus;
module.exports._syncStatusResultProcessor = syncStatusResultProcessor;

// Exports for Unit Test
module.exports._getHmpHeader = getHmpHeader;
module.exports._getSyncStatus = getSyncStatus;
module.exports._getDataStatus = getDataStatus;
module.exports._ehmpClear = ehmpClear;
module.exports._ehmpLoad = ehmpLoad;
