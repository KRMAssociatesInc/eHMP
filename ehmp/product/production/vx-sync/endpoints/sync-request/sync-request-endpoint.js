'use strict';

require('../../env-setup');

var _ = require('underscore');
var async = require('async');

var moment = require('moment');
var inspect = require('util').inspect;
var format = require('util').format;

var idUtil = require(global.VX_UTILS + 'patient-identifier-utils');
var fsUtil = require(global.VX_UTILS + 'fs-utils');
var nullUtil = require(global.VX_UTILS + 'null-utils');
var PatientIdentifierAPI = require(global.VX_UTILS + 'middleware/patient-identifier-middleware');
var JobAPI = require(global.VX_UTILS + 'middleware/job-middleware');
var jobUtil = require(global.VX_UTILS + 'job-utils');
var docUtil = require(global.VX_UTILS + 'doc-utils');


var healthcheckUtil = require(global.VX_UTILS + 'healthcheck-utils');

function registerSyncAPI(log, config, environment, app) {
    var jobFactory = function (req) {
        var forcedSync = [];
        if (req && _.isFunction(req.param)) {
            forcedSync = req.param('forcedSync');
        }
        if (forcedSync !== true) {
            try {
                forcedSync = JSON.parse(forcedSync);
            } catch (e) {
                forcedSync = [];
            }
        }
        return jobUtil.createEnterpriseSyncRequest(req.patientIdentifier, req.jpid, forcedSync, req.body.demographics);
    };
    var jobMiddleware = new JobAPI(log, config, environment);
    var idMiddleware = new PatientIdentifierAPI(log, config, environment.jds);
    var solrClient = environment.solr;

    var jdsClient = environment.jds,
        vistaConnector = environment.vistaClient,
        router = environment.publisherRouter;

    var doLoadMethods = [
        idMiddleware.validatePatientIdentifier.bind(idMiddleware),
        idMiddleware.getJPID,
        idMiddleware.createJPID,
        jobMiddleware.buildJob.bind(jobMiddleware, jobFactory),
        logSyncMetrics,
        jobMiddleware.getJobHistory,
        jobMiddleware.jobVerification.bind(jobMiddleware, ['completed', 'error']),
        jobMiddleware.publishJob.bind(jobMiddleware, router),
        function(req, res, next) {
            res.status(202).json(res.job);
            next();
        }
    ];
    var doDemoLoadMethods = [
        validateDemoParams,
        idMiddleware.getJPID,
        idMiddleware.createJPID,
        jobMiddleware.buildJob.bind(jobMiddleware, jobFactory),
        logSyncMetrics,
        jobMiddleware.getJobHistory,
        jobMiddleware.jobVerification.bind(jobMiddleware, ['completed', 'error']),
        jobMiddleware.publishJob.bind(jobMiddleware, router),
        function(req, res, next) {
            res.status(202).json(res.job);
            next();
        }
    ];

    var getStatusMethods = [
        idMiddleware.validatePatientIdentifier,
        idMiddleware.getJPID,
        getStatusJob,
        jobMiddleware.getJobHistory,
        jobMiddleware.getSyncStatus,
        getHealthStatus,
        returnSyncStatus
    ];

    app.get('/sync/status', getStatusMethods);

    app.post('/sync/load', doLoadMethods);
    app.get('/sync/doLoad', doLoadMethods);

    app.post('/sync/clearPatient', [
        idMiddleware.validatePatientIdentifier,
        idMiddleware.getJPID,
        unsyncPatient
    ]);
    app.get('/sync/doClearPatient', [
        idMiddleware.validatePatientIdentifier,
        idMiddleware.getJPID,
        unsyncPatient
    ]);
    app.post('/sync/demographicSync', doDemoLoadMethods);
    app.get('/sync/doDemographicSync', doDemoLoadMethods);

    function logSyncMetrics(req, res, next) {
        var metricsObj = {
            'pid':req.patientIdentifier.value,
            'jpid':req.jpid,
            'action': 'patient sync',
            // 'jobId': req.job.jobId,
            // 'rootJobId': req.job.jobId
        };
        environment.metrics.warn('Patient Sync started', metricsObj);
        return next();
    }

    function validateDemoParams(req, res, next) {
        /*{
            'pid': ["","",""],
            'edipi': "",
            'icn': "",
            'demographics': {
                "displayName": "",
                "familyName": "",
                "fullName": "",
                "givenNames": "",
                "genderName": "Male",
                "genderCode": "M",
                "ssn": "",
                "dob": ""
            }
        }*/
        //validate icn
        if(!nullUtil.isNullish(req.body, 'icn')) {
            var isValid = idUtil.isIdFormatValid(['icn', 'pid'], req.body.icn);
            if(!isValid) {
                return res.status(400).send('The patient icn was not in a valid format');
            }
        } else {
            return res.status(400).send('ICN must be provided');
        }
        //vaidate demographics
        if(!nullUtil.isNullish(req.body.demographics)) {
            if(nullUtil.isNullish(req.body.demographics,'displayName')) {
                log.warn('No display name found in demographic record');
            }
            if(nullUtil.isNullish(req.body.demographics,'familyName')) {
                log.warn('No family name found in demographic record');
            }
            if(nullUtil.isNullish(req.body.demographics,'fullName')) {
                log.warn('No full name found in demographic record');
            }
            if(nullUtil.isNullish(req.body.demographics,'givenNames')) {
                log.warn('No given names found in demographic record');
            }
            if(nullUtil.isNullish(req.body.demographics,'genderName')) {
                log.warn('No gender name found in demographic record');
            }
            if(nullUtil.isNullish(req.body.demographics,'genderCode')) {
                log.warn('No genderCode found in demographic record');
            }
            if(nullUtil.isNullish(req.body.demographics,'ssn')) {
                log.warn('No ssn found in demographic record');
            }
            if(nullUtil.isNullish(req.body.demographics,'birthdate')) {
                if(!nullUtil.isNullish(req.body.demographics,'dob')) {
                    req.body.demographics.birthdate = req.body.demographics.dob;
                } else {
                    log.warn('No birthdate found in demographic record');
                }
            }

            if (nullUtil.isNullish(req.body.demographics, 'address')) {
                log.warn('No address found in demographic record');
            }

            if (nullUtil.isNullish(req.body.demographics, 'telecom')) {
                log.warn('No telecom found in demographic record');
            }

            req.body.demographics.icn = req.body.icn;
        }
        req.body.demographics = _.pick(req.body.demographics, 'icn','displayName','fullname','givenNames','familyName','genderCode','genderName','birthdate','ssn','address','telecom');
        req.patientIdentifier = {value: req.body.icn, type: 'icn'};
        next();
    }

    function unsyncPatient(req, res) {
        var asyncMethod = (!_.isUndefined(req.param('force'))?async.parallel:async.series);
        if (!_.isUndefined(req.identifiers) && !_.isUndefined(req.identifiers.length)) {
            asyncMethod({
                'clearDocuments': function(callback) {
                    async.map(req.identifiers, function(identifier, docCallback) {
                        var dirName = docUtil.getPatientTopDirAbsPath(identifier, config);
                        fsUtil.deleteAllFiles(dirName);
                        docCallback();
                    }, callback);
                },
                'clearSolr': function(callback) {
                    async.map(req.identifiers, function(identifier, solrCallback) {
                        log.debug('UNSYNC - pid:'+identifier);
                        solrClient.deleteByQuery('pid:'+identifier, solrCallback);
                    }, callback);
                },
                'unsubscribeVistaSites': function(callback) {
                    async.map(req.identifiers, function(identifier, vistaCallback) {
                        if (idUtil.isPid(identifier)) {
                            if (!_.isUndefined(config.vistaSites[idUtil.extractSiteFromPid(identifier)])) {
                                vistaConnector.unsubscribe(identifier, function(error, response) {
                                    if (error || response !== 'success') {
                                        vistaCallback(error);
                                    } else {
                                        vistaCallback();
                                    }
                                });
                            } else {
                                vistaCallback();
                            }
                        } else {
                            vistaCallback();
                        }
                    }, function(error) {
                        callback(error);
                    });
                },
                'removePatientFromJds': function(callback) {
                    jdsClient.removePatientIdentifier(req.jpid, function(error, response) {
                        if (!error && response.statusCode === 200) {
                            callback();
                        } else {
                            callback(response.body);
                        }
                    });
                }
            }, function(error) {
                if (error) {
                    res.status(500).json(error);
                } else {
                    res.status(202).json({
                        'success': true
                    });
                }
            });
        } else {
            res.status(404).send('Patient not found');
        }
    }

    /**
     * Configure request to retrieve job states
     */
    function getStatusJob(req, res, next) {
        log.debug('sync-request-endpoint.getStatus() : Enter');
        if (req.jpid === false) {
            return res.status(404).send('Patient identifier not found [' + req.patientIdentifier.value + ']');
        }
        res.job = {
            'jpid': req.jpid
        };
        res.filter = {
            'filter': '?filter=ne(status,\"completed\")'
        };

        next();
    }

    /**
     * Assemble sync status response from sync status and job status
     */
    function returnSyncStatus(req, res, next) {
        var syncStateJSON = {
            'jpid': res.job.jpid
        };
        syncStateJSON.syncStatus = removeProp(res.syncStatus, 'eventMetaStamp');
        if (typeof res.jobStates !== 'undefined') {
            syncStateJSON.jobStatus = res.jobStates;
        } else {
            syncStateJSON.jobStatus = JSON.parse('[]');
        }
        if (config.healthcheck && config.healthcheck.heartbeatEnabled) {
            if (typeof res.healthStatus !== 'undefined') {
                syncStateJSON.healthStatus = res.healthStatus;
            } else {
                syncStateJSON.healthStatus = JSON.parse('[]');
            }
        }

        var pollerJobs = _.filter(syncStateJSON.jobStatus, function(jobState) {
            return jobState.type.indexOf('poller') && (Date.now()-jobState.timestamp)>120000;
        });
        if (_.isEmpty(pollerJobs) || req.param('vistaStatus')) {
            res.json(syncStateJSON);
            return next();
        }

        // get subscription status
        // var vistaClient = new VistaClient(log, {}, config);
        var vistaPids = _.filter(req.identifiers, function(identifier) {
            return !_.isEmpty(config.vistaSites[identifier.split(';')[0]]);
        });
        async.map(vistaPids, vistaConnector.status.bind(vistaConnector), function(error, response) {
            var vistaIds = _.pluck(response, 'siteId');
            syncStateJSON.vistaSubscriptionStatus = _.object(vistaIds, response);
            res.json(syncStateJSON);
            next();
        });

        res.json(syncStateJSON);
        next();
    }

    function removeProp(obj, propName) {

        for (var p in obj) {

            if (obj.hasOwnProperty(p)) {

                if (p === propName) {
                    delete obj[p];

                } else if (typeof obj[p] === 'object') {
                    removeProp(obj[p], propName);
                }
            }
        }
        return obj;
    }

    function getHealthStatus(req, res, next){
        log.debug('sync-request-endpoint.getHealthStatus()');
        if(!config.healthcheck || !config.healthcheck.heartbeatEnabled){
            log.debug('sync-request-endpoint.getHealthStatus(): healthcheck is disabled in configiuration. Skipping getHealthStatus...');
            next();
        }

        var currentTime = moment();

        healthcheckUtil.retrieveStaleHeartbeats(log, config, environment, currentTime, function(error, response){
            if(error){
                log.error('sync-request-endpoint.getHealthStatus(): Received error from healthcheckUtil.retrieveStaleHeartbeats(): %s', error);
                var errorTemplate = 'Error received from JDS when retrieving health status messages. Error: %s';
                res.status(500).send(format(errorTemplate, inspect(error)));
            } else {
                log.debug('sync-request-endpoint.getHealthStatus(): Adding healthStatus to response: %s', response);
                res.healthStatus = response;
            }
            next();
        });
    }
}

module.exports = registerSyncAPI;