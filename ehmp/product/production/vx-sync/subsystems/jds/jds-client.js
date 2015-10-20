'use strict';

require('../../env-setup');

var _ = require('underscore');
var format = require('util').format;
var request = require('request');
var inspect = require(global.VX_UTILS + 'inspect');
var errorUtil = require(global.VX_UTILS + 'error');
var objUtil = require(global.VX_UTILS + 'object-utils');
var uuid = require('node-uuid');
var VxSyncForeverAgent = require(global.VX_UTILS+'vxsync-forever-agent');
var async = require('async');
var sizeof = require('object-sizeof');

function JdsClient(log, metrics, config) {
    if (!(this instanceof JdsClient)) {
        return new JdsClient(log, metrics, config);
    }

    this.log = log;
    this.metrics = metrics;
    this.config = config;
}

// JdsClient.prototype.clearJdsData = function(callback) {
//     this.clearPatientIdentifiers(this.clearSyncStatus(this.clearJobStates(callback)));
// };

JdsClient.prototype.saveSyncStatus = function(metastamp, patientIdentifier, callback) {
    this.log.debug('Jds-client.saveSyncStatus()');
    this.log.debug(inspect(metastamp));
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'saveSyncStatus',
        'pid': patientIdentifier.value,
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Save Sync Status', metricsObj);
    var self = this;

    if (!patientIdentifier) {
        metricsObj.timer = 'stop';
        this.metrics.debug('JDS Save Sync Status in Error', metricsObj);
        return setTimeout(callback, 0, errorUtil.createFatal('No patientIdentifier object passed in'));
    }

    var identifierValue = patientIdentifier.value;
    if (patientIdentifier.type === 'edipi') {
        identifierValue = 'DOD;' + identifierValue;
    }

    var path = '/status/' + identifierValue;
    var metastampJobs = self._ensureMetastampSize(metastamp, self.config.maxMetastampSize || 20000);
    if (metastampJobs.length > 1) {
        self.log.warn('JdsClient.saveSyncStatus() metastamp broken into %s parts', metastampJobs.length);
    }
    async.each(metastampJobs, function(stamp, cb) {
        self.execute(path, stamp, 'POST', metricsObj, cb);
    }, function(err) {
        var response = {}; //hardcoded to account for inability to merge multiple responses
        if (!err) {
            response.statusCode = 200;
        }
        callback(err, response);
    });
};


JdsClient.prototype.getSyncStatus = function(patientIdentifier, callback) {
    this.log.debug('Jds-client.getSyncStatus()');
    this.log.debug(inspect(patientIdentifier));
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'getSyncStatus',
        'pid': patientIdentifier.value,
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Get Sync Status', metricsObj);

    var path = '/status/' + patientIdentifier.value;
    this.execute(path, null, 'GET', metricsObj, callback);
};

JdsClient.prototype.clearSyncStatus = function(callback) {
    this.log.debug('Jds-client.clearSyncStatus()');
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'clearSyncStatus',
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Clear Sync Status', metricsObj);

    var path = '/status';
    var method = 'DELETE';
    this.execute(path, null, method, metricsObj, callback);
};

JdsClient.prototype.saveJobState = function(jobState, callback) {
    this.log.debug('Jds-client.saveJobState()');
    this.log.debug(inspect(jobState));
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'saveJobState',
        'jpid': jobState.jpid,
        'jobId': jobState.jobId,
        'rootJobId': jobState.rootJobId,
        'jobType': jobState.type,
        'process': uuid.v4(),
        'timer': 'start'
    };
    if (jobState.record) {
        metricsObj.pid = jobState.record.pid;
        metricsObj.uid = jobState.record.uid;
    }
    this.metrics.debug('JDS Save Job State', metricsObj);

    var path = '/job';
    this.execute(path, jobState, 'POST', metricsObj, callback);
};

/*
variadic function:
getJobStatus(job, callback)
getJobStatus(job, [param]..., callback)
*/
JdsClient.prototype.getJobStatus = function(job, callback) {
    this.log.debug('Jds-client.getJobStatus() %j', job);
    this.log.debug(inspect(job));
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'getJobStatus',
        'jpid': job.jpid,
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Get Job Status', metricsObj);

    if (arguments.length < 2) {
        metricsObj.timer = 'stop';
        this.metrics.debug('JDS Get Job Status in Error', metricsObj);
        return setTimeout(callback, 0, 'Invalid number of arguments');
    }

    var args = _.toArray(arguments);
    callback = args.pop();
    var params = arguments[0].jpid;
    if (arguments.length > 2) {
        params += arguments[1].filter;
    }

    var path = '/job/' + params;
    this.execute(path, job, 'GET', metricsObj, callback);
};

// JdsClient.prototype.clearJobStates = function(callback) {
//     this.log.debug('Jds-client.clearJobStates()');

//     var path = '/job';
//     var method = 'DELETE';
//     this.execute(path, null, method, callback);
// };

JdsClient.prototype.clearJobStatesByPatientIdentifier = function(patientIdentifier, callback) {
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'clearJobStatesByPatientIdentifier',
        'pid': patientIdentifier.value,
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Clear Job States by PID', metricsObj);
    var path = '/job/' + patientIdentifier.value;
    var method = 'DELETE';
    this.execute(path, null, method, metricsObj, callback);
};

//----------------------------------------------------------------------------
// This method retrieves the patient Identifier list from JDS for the
// patientIdentifier in the given job.
//
// job:  The job for the patient.
// callback: The handler to call when this request is completed.
//----------------------------------------------------------------------------
JdsClient.prototype.getPatientIdentifier = function(job, callback) {
    this.log.debug('jds-client.getPatientIdentifier() %j', job);

    this.getPatientIdentifierByPid(job.patientIdentifier.value, callback);
};

//----------------------------------------------------------------------------
// This method retrieves the patient Identifier list from JDS for the given
// pid.
//
// pid:  The pid for the patient.
// callback: The handler to call when this request is completed.
//----------------------------------------------------------------------------
JdsClient.prototype.getPatientIdentifierByPid = function(pid, callback) {
    this.log.debug('jds-client.getPatientIdentifierByPid() %j', pid);
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'getPatientIdentifierByPid',
        'pid': pid,
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Get Corresponding IDs by PID', metricsObj);

    var path = '/vpr/jpid/' + pid;
    this.execute(path, null, 'GET', metricsObj, callback);
};

JdsClient.prototype.storePatientIdentifier = function(jdsPatientIdentificationRequest, callback) {
    this.log.debug('jds-client.storePatientIdentifier() %j', jdsPatientIdentificationRequest);
    this.log.debug(jdsPatientIdentificationRequest.jpid || 'No JPID provided.');
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'storePatientIdentifier',
        'jpid': jdsPatientIdentificationRequest.jpid,
        'pid': jdsPatientIdentificationRequest.patientIdentifiers,
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Store Patient Identifier', metricsObj);

    var path = '/vpr/jpid/';
    if (typeof jdsPatientIdentificationRequest.jpid !== 'undefined') {
        path += jdsPatientIdentificationRequest.jpid;
    }

    this.execute(path, jdsPatientIdentificationRequest, 'POST', metricsObj, callback);
};

JdsClient.prototype.removePatientIdentifier = function(jpid, callback) {
    this.log.debug('jds-client.removePatientIdentifier() %j', jpid);
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'removePatientIdentifier',
        'jpid': jpid,
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Remove Patient Identifier', metricsObj);

    var path = '/vpr/jpid/' + jpid;
    this.execute(path, null, 'DELETE', metricsObj, callback);
};

JdsClient.prototype.clearPatientIdentifiers = function(callback) {
    this.log.debug('jds-client.clearPatientIdentifiers()');
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'clearPatientIdentifiers',
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Clear Patient Identifiers', metricsObj);

    var path = '/vpr/jpid/clear';
    this.execute(path, null, 'DELETE', metricsObj, callback);
};

//-----------------------------------------------------------------------------------------
// Store the object in the operational data store area of the JDS.
//
// operationalData: The object that represents the operational data to be stored.
// callback: The handler to call when this request is completed.
//-----------------------------------------------------------------------------------------
JdsClient.prototype.storeOperationalData = function(operationalData, callback) {
    this.log.debug('jds-client.storeOperationalData()');
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'storeOperationalData',
        'site': operationalData.systemId,
        'uid': operationalData.uid,
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Store OPD', metricsObj);

    if (_.isEmpty(operationalData)) {
        metricsObj.timer = 'stop';
        this.metrics.debug('JDS Store OPD in Error', metricsObj);
        return setTimeout(callback, 0, errorUtil.createFatal('No record passed in'));
    }

    var path = '/data';
    this.execute(path, operationalData, 'POST', metricsObj, callback);
};

//------------------------------------------------------------------------------------------
// Retrieve pt-select data using the patient's pid.
//
// pid: The pid to use to retrieve the pt-select data.
// callback: The handler to call when this request is completed.
//-------------------------------------------------------------------------------------------
JdsClient.prototype.getOperationalDataPtSelectByPid = function(pid, callback) {
    this.log.debug('jds-client.getOperationalDataPtSelectByPid() %j', pid);
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'getOperationalDataPtSelectByPid',
        'pid': pid,
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Get PT Select by PID', metricsObj);

    if (_.isEmpty(pid)) {
        metricsObj.timer = 'stop';
        this.metrics.debug('JDS Get PT Select by PID in Error', metricsObj);
        return setTimeout(callback, 0, errorUtil.createFatal('No pid passed in'));
    }

    var path = '/data/index/pt-select-pid?range="' + pid + '"';
    this.execute(path, null, 'GET', metricsObj, callback);
};

//------------------------------------------------------------------------------------------
// Retrieve pt-select data using the patient's icn.
//
// icn: The icn to use to retrieve the pt-select data.
// callback: The handler to call when this request is completed.
//-------------------------------------------------------------------------------------------
JdsClient.prototype.getOperationalDataPtSelectByIcn = function(icn, callback) {
    this.log.debug('jds-client.getOperationalDataPtSelectByIcn() %j', icn);
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'getOperationalDataPtSelectByIcn',
        'pid': icn,
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Get PT Select by ICN', metricsObj);

    if (_.isEmpty(icn)) {
        metricsObj.timer = 'stop';
        this.metrics.debug('JDS Get PT Select by ICN in Error', metricsObj);
        return setTimeout(callback, 0, errorUtil.createFatal('No icn passed in'));
    }

    var path = '/data/index/pt-select-icn?range="' + icn + '"';
    this.execute(path, null, 'GET', metricsObj, callback);
};

//-----------------------------------------------------------------------------------------
// Retrieve the operational data object by its UID.
//
// uid: The UID that identifies the operational data item being retrieved.
// callback: The handler to call when this request is completed.
// Returns  (through call back): the Operational data item.
//-----------------------------------------------------------------------------------------
JdsClient.prototype.getOperationalDataByUid = function(uid, callback) {
    this.log.debug('jds-client.getOperationalDataByUid() %j', uid);
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'getOperationalDataByUid',
        'uid': uid,
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Get PT Select by UID', metricsObj);

    if (_.isEmpty(uid)) {
        metricsObj.timer = 'stop';
        this.metrics.debug('JDS Get PT Select by UID in Error', metricsObj);
        return setTimeout(callback, 0, errorUtil.createFatal('No uid passed in'));
    }

    var path = '/data/' + uid;
    this.execute(path, null, 'GET', metricsObj, callback);
};

//-----------------------------------------------------------------------------------------
// Delete the operational data object by its UID.
//
// uid: The UID that identifies the operational data item being deleted.
// callback: The handler to call when this request is completed.
//-----------------------------------------------------------------------------------------
JdsClient.prototype.deleteOperationalDataByUid = function(uid, callback) {
    this.log.debug('jds-client.deleteOperationalDataByUid() %j', uid);
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'deleteOperationalDataByUid',
        'uid': uid,
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Delete OPD by UID', metricsObj);

    if (_.isEmpty(uid)) {
        metricsObj.timer = 'stop';
        this.metrics.debug('JDS Delete OPD by UID in Error', metricsObj);
        return setTimeout(callback, 0, errorUtil.createFatal('No uid passed in'));
    }

    var path = '/data/' + uid;
    this.execute(path, null, 'DELETE', metricsObj, callback);
};

//-----------------------------------------------------------------------------------------
// Store the object in the mutable operational data store area of the JDS.
//
// operationalData: The object that represents the operational data to be stored.
// callback: The handler to call when this request is completed.
//-----------------------------------------------------------------------------------------
JdsClient.prototype.storeOperationalDataMutable = function(operationalData, callback) {
    this.log.debug('jds-client.storeOperationalDataMutable()');
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'storeOperationalDataMutable',
        'uid': operationalData.uid,
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Store OPD Mutable', metricsObj);

    if (_.isEmpty(operationalData)) {
        metricsObj.timer = 'stop';
        this.metrics.debug('JDS Store OPD Mutable in Error', metricsObj);
        return setTimeout(callback, 0, errorUtil.createFatal('No record passed in'));
    }

    var path = '/odmutable/set/this';
    this.execute(path, operationalData, 'POST', metricsObj, callback);
};

//-----------------------------------------------------------------------------------------
// Retrieve mutable operational data object by site id.
//
// siteId: The site id that identifies the operational data item being retrieved.
// callback: The handler to call when this request is completed.
// Returns  (through call back): the Operational data item.
//-----------------------------------------------------------------------------------------
JdsClient.prototype.getOperationalDataMutable = function(siteId, callback) {
    this.log.debug('jds-client.getOperationalDataMutable() %j', siteId);
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'getOperationalDataMutable',
        'site': siteId,
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Get OPD Mutable', metricsObj);

    if (_.isEmpty(siteId)) {
        metricsObj.timer = 'stop';
        this.metrics.debug('JDS Get OPD Mutable in Error', metricsObj);
        return setTimeout(callback, 0, errorUtil.createFatal('No uid passed in'));
    }

    var path = '/odmutable/get/' + siteId;
    this.execute(path, null, 'GET', metricsObj, callback);
};

//-----------------------------------------------------------------------------------------
// Retrieve multiple mutable operational data objects by a filter
//
// filter: A JDS filter string (required!)
// callback: The handler to call when this request is completed.
// Returns  (through call back): an array of items.
//-----------------------------------------------------------------------------------------
JdsClient.prototype.getOperationalDataMutableByFilter = function(filterString, callback) {
    this.log.debug('jds-client.getOperationalDataMutableByFilter');
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'getOperationalDataMutableByFilter',
        'filterString': filterString,
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Get All OPD Mutable', metricsObj);

    if (_.isEmpty(filterString)) {
        metricsObj.timer = 'stop';
        this.metrics.debug('JDS Get OPD Mutable By Filter in Error', metricsObj);
        return setTimeout(callback, 0, errorUtil.createFatal('No filterString passed in'));
    }

    var path = '/odmutable/get/' + filterString;

    this.execute(path, null, 'GET', metricsObj, callback);
};

//-----------------------------------------------------------------------------------------
// Get the number of objects in the mutable operational data store
//
// Returns  (through call back): the Operational data item.
//-----------------------------------------------------------------------------------------
JdsClient.prototype.getOperationalDataMutableCount = function(callback) {
    this.log.debug('jds-client.getOperationalDataMutableCount()');
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'getOperationalDataMutableCount',
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Get OPD Mutable Count', metricsObj);

    var path = '/odmutable/length/this';
    this.execute(path, null, 'GET', metricsObj, callback);
};

//-----------------------------------------------------------------------------------------
// Delete the mutable operational data object by the site id.
//
// siteId: The site id that identifies the site for which site specific operational data should be deleted.
// callback: The handler to call when this request is completed.
//-----------------------------------------------------------------------------------------
JdsClient.prototype.deleteOperationalDataMutable = function(siteId, callback) {
    this.log.debug('jds-client.deleteOperationalDataMutable() %j', siteId);
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'deleteOperationalDataMutable',
        'site': siteId,
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Get OPD Mutable Count', metricsObj);

    if (_.isEmpty(siteId)) {
        metricsObj.timer = 'stop';
        this.metrics.debug('JDS Get OPD Mutable Count in Error', metricsObj);
        return setTimeout(callback, 0, errorUtil.createFatal('No site id passed in'));
    }

    var path = '/odmutable/destroy/' + siteId;
    this.execute(path, null, 'DELETE', metricsObj, callback);
};

//-----------------------------------------------------------------------------------------
// Delete all mutable operational data.
//
// callback: The handler to call when this request is completed.
//-----------------------------------------------------------------------------------------
JdsClient.prototype.clearOperationalDataMutableStorage = function(callback) {
    this.log.debug('jds-client.clearOperationalDataMutableStorage()');
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'clearOperationalDataMutableStorage',
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Clear OPD Mutable Storage', metricsObj);

    var path = '/odmutable/clear/this';
    this.execute(path, null, 'DELETE', metricsObj, callback);
};

JdsClient.prototype.saveOperationalSyncStatus = function(metastamp, siteId, callback) {
    this.log.debug('JdsClient.saveOperationalSyncStatus() %j', siteId);
    this.log.debug(inspect(metastamp));
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'saveOperationalSyncStatus',
        'site': siteId,
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Save OPD Sync Status', metricsObj);
    var self = this;

    var path = '/statusod/' + siteId;
    // self.log.info('JdsClient.saveOperationalSyncStatus() %j',metastamp);
    var metastampJobs = self._ensureMetastampSize(metastamp, self.config.maxMetastampSize || 20000);
    if (metastampJobs.length > 1) {
        self.log.warn('JdsClient.saveOperationalSyncStatus() metastamp broken into %s parts', metastampJobs.length);
        // self.log.info('JdsClient.saveOperationalSyncStatus() %j',metastampJobs[0]);
    }
    async.each(metastampJobs, function(stamp, cb) {
        self.log.info('JdsClient.saveOperationalSyncStatus() %j', stamp);
        self.execute(path, stamp, 'POST', metricsObj, cb);
    }, function(err) {
        var response = {}; //hardcoded to account for inability to merge multiple responses
        if (!err) {
            response.statusCode = 200;
        }
        callback(err, response);
    });
};

JdsClient.prototype.getOperationalSyncStatus = function(siteId, callback) {
    this.log.debug('JdsClient.getOperationalSyncStatus() %j', siteId);
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'getOperationalSyncStatus',
        'site': siteId,
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Get OPD Sync Status', metricsObj);

    var path = '/statusod/' + siteId;
    this.execute(path, null, 'GET', metricsObj, callback);
};

JdsClient.prototype.deleteOperationalSyncStatus = function(siteId, callback) {
    this.log.debug('JdsClient.deleteOperationalSyncStatus() %j', siteId);
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'deleteOperationalSyncStatus',
        'site': siteId,
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Delete OPD Sync Status', metricsObj);

    var path = '/statusod/' + siteId;
    this.execute(path, null, 'DELETE', metricsObj, callback);
};

JdsClient.prototype.clearAllOperationalSyncStatus = function(callback) {
    this.log.debug('JdsClient.clearAllOperationalSyncStatus()');
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'clearAllOperationalSyncStatus',
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Clear All OPD Sync Status', metricsObj);

    var path = '/statusod/';
    this.execute(path, null, 'DELETE', metricsObj, callback);
};

//------------------------------------------------------------------------------------------
// Retrieve patientDemographics data using the patient's pid.  Note this is demographics
// that comes from patient domain (NOT operational pt-select data)
//
// pid: The pid to use to retrieve the data.
// callback: The handler to call when this request is completed.
//-------------------------------------------------------------------------------------------
JdsClient.prototype.getPtDemographicsByPid = function(pid, callback) {
    this.log.debug('jds-client.getPtDemographicsByPid() %j', pid);
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'getPtDemographicsByPid',
        'pid': pid,
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS get PT Demographics by PID', metricsObj);

    if (_.isEmpty(pid)) {
        metricsObj.timer = 'stop';
        this.metrics.debug('JDS get PT Demographics by PID in Error', metricsObj);
        this.log.error('jds-client.getPtDemographicsByPid: No pid passed in');
        return setTimeout(callback, 0, errorUtil.createFatal('No pid passed in'));
    }

    var path = '/vpr/' + pid;
    this.execute(path, null, 'GET', metricsObj, callback);
};

//------------------------------------------------------------------------------------------
// Retrieve patientDemographics data using the patient's icn.  Note this is demographics
// that comes from patient domain (NOT operational pt-select data)
//
// icn: The icn to use to retrieve the data.
// callback: The handler to call when this request is completed.
//-------------------------------------------------------------------------------------------
JdsClient.prototype.getPtDemographicsByIcn = function(icn, callback) {
    this.log.debug('jds-client.getPtDemographicsByIcn: Entered method: icn: %s', icn);
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'getPtDemographicsByIcn',
        'pid': icn,
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS get PT Demographics by ICN', metricsObj);

    if (_.isEmpty(icn)) {
        metricsObj.timer = 'stop';
        this.metrics.debug('JDS get PT Demographics by ICN in Error', metricsObj);
        this.log.error('jds-client.getPtDemographicsByIcn: No icn passed in');
        return setTimeout(callback, 0, errorUtil.createFatal('No icn passed in'));
    }

    var path = '/vpr/' + icn;
    this.execute(path, null, 'GET', metricsObj, callback);
};

//------------------------------------------------------------------------------------------
// This method marks an item on an operational data sync status as stored.
// It is only used for integration testing.
//------------------------------------------------------------------------------------------
JdsClient.prototype._markOperationalItemAsStored = function(metadata, callback) {
    this.log.debug('jds-client._markOperationalItemAsStored()');
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'markOperationalItemAsStored',
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Get Patient Domain Data', metricsObj);

    var path = '/recordod';
    this.execute(path, metadata, 'POST', metricsObj, callback);
};

JdsClient.prototype.getPatientDomainData = function(identifier, domain, callback) {
    this.log.debug('jds-client.getPatientDomainData() %j %j', identifier, domain);
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'getPatientDomainData',
        'domain': domain,
        'pid': identifier,
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Get Patient Domain Data', metricsObj);

    var path = '/vpr/' + identifier + '/find/' + domain;
    this.execute(path, null, 'GET', metricsObj, callback);
};

JdsClient.prototype.storePatientDataFromJob = function(job, callback) {
    this.log.debug('jds-client.storePatientDataFromJob() %j', job);

    if (_.isEmpty(job.record)) {
        this.log.debug('jds-client.storePatientDataFromJob: Failed to store patient data.  job.record was empty.');
        return setTimeout(callback, 0, errorUtil.createFatal('No record passed in job'));
    }

    // var path = '/vpr/' + job.patientIdentifier.value;
    // this.execute(path, job.record, 'POST', callback);

    return this.storePatientData(job.record, callback);

};

//----------------------------------------------------------------------------------
// Store the patient data event to JDS.
//
// patientDataEvent: The patient data event to be stored.
// callback: The handler to call when the data is stored.   Signature is:
//           function(error, response) where:
//               error: Is the error that occurs.
//               response: Is the response from JDS.
//-----------------------------------------------------------------------------------
JdsClient.prototype.storePatientData = function(patientDataEvent, callback) {
    this.log.debug('jds-client.storePatientData() %j', patientDataEvent);
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'storePatientData',
        'pid': patientDataEvent.pid,
        'uid': patientDataEvent.uid,
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Store Patient Data', metricsObj);

    if (_.isEmpty(patientDataEvent)) {
        metricsObj.timer = 'stop';
        this.metrics.debug('JDS Store Patient Data in Error', metricsObj);
        this.log.debug('jds-client.storePatientData: Failed to store patient data.  patientDataEvent was empty.');
        return setTimeout(callback, 0, errorUtil.createFatal('No patient data event passed in'));
    }

    var path = '/vpr';
    this.execute(path, patientDataEvent, 'POST', metricsObj, callback);
};

JdsClient.prototype.getPatientDataByUid = function(uid, callback) {
    this.log.debug('jds-client.getPatientDataByUid() %j', uid);
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'getPatientDataByUid',
        'uid': uid,
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Get Patient Data By UID', metricsObj);

    if (_.isEmpty(uid)) {
        metricsObj.timer = 'stop';
        this.metrics.debug('JDS Get Patient Data By UID in Error', metricsObj);
        return setTimeout(callback, 0, errorUtil.createFatal('No uid passed in'));
    }

    var path = '/vpr/uid/' + uid;
    this.execute(path, null, 'GET', metricsObj, callback);
};

//-----------------------------------------------------------------------------------------
// Delete the patient data object by its UID.
//
// uid: The UID that identifies the patient data item being deleted.
// callback: The handler to call when this request is completed.
//-----------------------------------------------------------------------------------------
JdsClient.prototype.deletePatientDataByUid = function(uid, callback) {
    this.log.debug('jds-client.deletePatientDataByUid() %j', uid);
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'deletePatientDataByUid',
        'uid': uid,
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Delete Patient Data By UID', metricsObj);

    if (_.isEmpty(uid)) {
        metricsObj.timer = 'stop';
        this.metrics.debug('JDS Delete Patient Data By UID in Error', metricsObj);
        return setTimeout(callback, 0, errorUtil.createFatal('No uid passed in'));
    }

    var path = '/vpr/uid/' + uid;
    this.execute(path, null, 'DELETE', metricsObj, callback);
};

//-----------------------------------------------------------------------------------------
// Delete all patient data for all identifiers tied to this pid.
//
// pid: The pid that identifies the patient.
// callback: The handler to call when this request is completed.
//-----------------------------------------------------------------------------------------
JdsClient.prototype.deletePatientByPid = function(pid, callback) {
    this.log.debug('jds-client.deletePatientByPid() %j', pid);
    var metricsObj = {
        'subsystem': 'JDS',
        'action': 'deletePatientByPid',
        'pid': pid,
        'process': uuid.v4(),
        'timer': 'start'
    };
    this.metrics.debug('JDS Delete Patient Data By PID', metricsObj);

    if (_.isEmpty(pid)) {
        metricsObj.timer = 'stop';
        this.metrics.debug('JDS Delete Patient Data By PID in Error', metricsObj);
        this.log.error('jds-client.deletePatientByPid() No pid passed in');
        return setTimeout(callback, 0, errorUtil.createFatal('No pid passed in'));
    }

    var path = '/vpr/' + pid;
    this.execute(path, null, 'DELETE', metricsObj, callback);
};


//--------------------------------------------------------------------------------------------------
// This function executes the JDS command.
//
// path: The JDS REST URL  (Without that http://<ip>:port)
// dataToPost:  If this is a put or post, then this is the data that is going to be put or posted.
// method: The type of http method (i.e. GET, PUT, POST, etc)
// callback: The call back function that should be called when the execute is completed.
//--------------------------------------------------------------------------------------------------
JdsClient.prototype.execute = function(path, dataToPost, method, metricsObj, callback) {
    this.log.debug(path);
    this.log.debug(inspect(dataToPost));
    metricsObj.timer = 'stop';
    if (_.isEmpty(this.config.jds)) {
        this.metrics.debug('JDS Execute in Error', metricsObj);
        return setTimeout(callback, 0, errorUtil.createFatal('No value passed for jds configuration'));
    }

    if (method === 'POST' || method === 'PUT') {
        if (_.isEmpty(dataToPost)) {
            this.metrics.debug('JDS Execute in Error', metricsObj);
            return setTimeout(callback, 0, errorUtil.createFatal('No dataToPost passed to store'));
        }
    } else {
        dataToPost = undefined;
    }

    var url = format('%s://%s:%s%s', this.config.jds.protocol, this.config.jds.host, this.config.jds.port, path);
    if (dataToPost) {
        var dataToPostWithoutPwd = objUtil.removeProperty(objUtil.removeProperty(dataToPost, 'accessCode'), 'verifyCode');
        this.log.debug('jds-client.execute(): Sending message to JDS. %s -> dataToPost: %j', url, dataToPostWithoutPwd);
    } else {
        this.log.debug('jds-client.execute(): Sending message to JDS. %s -> dataToPost: undefined or null', url);
    }

    var self = this;
    request({
        url: url,
        method: method || 'GET',
        json: dataToPost,
        timeout: this.config.jds.timeout || 60000,
        agentClass: VxSyncForeverAgent
    }, function(error, response, body) {
        self.log.debug('jds-client.execute(): posted data to JDS %s', url);

        if (error || response.statusCode === 500) {
            self.log.error('jds-client.execute(): Unable to access JDS endpoint: %s %s', method, url);
            self.log.error('%s %j', error, body);

            self.metrics.debug('JDS Execute in Error', metricsObj);
            return callback(errorUtil.createFatal((error || body || 'Unknown Error')), response);
        }

        var json;
        if (_.isEmpty(body)) {
            self.log.debug('jds-client.execute(): Response body is empty.  Status code:', response.statusCode);
            self.metrics.debug('JDS Execute complete', metricsObj);
            return callback(null, response);
        }

        try {
            json = _.isObject(body) ? body : JSON.parse(body);
        } catch (parseError) {
            self.log.debug('jds-client.execute(): Unable to parse JSON response:', body);
            self.log.debug('jds-client.execute(): Unable to parse JSON response, and response is defined.  this is actually bad');
            self.log.debug(inspect(parseError));
            self.log.debug('::' + body + '::');
            json = body;
        }

        var responseWithoutPwd = objUtil.removeProperty(objUtil.removeProperty(json, 'accessCode'), 'verifyCode');
        self.log.debug('jds-client.execute(): JDS response is for the caller to handle', responseWithoutPwd);
        self.metrics.debug('JDS Execute complete', metricsObj);
        callback(null, response, json);
    });
};

JdsClient.prototype._validateMetastampSize = function(metastamp, maxSize) {
    var size = sizeof(metastamp);
    if (size > maxSize) {
        return false;
    } else {
        return true;
    }
};

/**
Takes a metastamp and splits it by data source. This is a first attempt
to break down a metastamp into a size that can be processed by JDS.
**/
JdsClient.prototype._splitMetastampBySource = function(metastamp) {
    var metastampShell;
    var sources = metastamp.sourceMetaStamp;
    var metastampBySource = [];
    if (_.keys(sources).length <= 1) { //This metastamp only has one source already
        return [metastamp];
    }
    metastamp.sourceMetaStamp = {};
    metastampShell = JSON.parse(JSON.stringify(metastamp));
    _.each(sources, function(value, key) {
        var siteStamp = JSON.parse(JSON.stringify(metastampShell));
        siteStamp.sourceMetaStamp[key] = value;
        metastampBySource.push(siteStamp);
    });
    return metastampBySource;
};

/**
Breaks up a metastamp by domain in hopes that single domains will be small enough
to store in JDS. It assumes that only one source exists in this metastamp.
**/
JdsClient.prototype._splitMetastampByDomain = function(metastamp) {
    var metastampShell;
    var source = _.keys(metastamp.sourceMetaStamp)[0];
    var domains = metastamp.sourceMetaStamp[source].domainMetaStamp;
    var metastampByDomain = [];
    if (_.keys(domains).length <= 1) { //this metastamp only has one domain already
        return [metastamp];
    }
    metastamp.sourceMetaStamp[source].domainMetaStamp = {};
    metastampShell = JSON.parse(JSON.stringify(metastamp));
    _.each(domains, function(value, key) {
        var domainStamp = JSON.parse(JSON.stringify(metastampShell));
        domainStamp.sourceMetaStamp[source].domainMetaStamp[key] = value;
        metastampByDomain.push(domainStamp);
    });
    return metastampByDomain;
};

/**
Breaks up a metastamp domain into appropriate sized metastamps that can be stored in JDS.
This assumes that the metastamp has already been broken up by site and domain such that
this metastamp only has one source with one domain.
**/
JdsClient.prototype._splitMetastampDomain = function(metastamp, maxSize) {
    var metastampSize = sizeof(metastamp);
    var source = _.keys(metastamp.sourceMetaStamp)[0];
    var domain = _.keys(metastamp.sourceMetaStamp[source].domainMetaStamp)[0];
    var eventListName;
    if (metastamp.sourceMetaStamp[source].domainMetaStamp[domain].eventMetaStamp) {
        eventListName = 'eventMetaStamp';
    } else {
        eventListName = 'itemMetaStamp';
    }
    var uids = metastamp.sourceMetaStamp[source].domainMetaStamp[domain][eventListName];
    metastamp.sourceMetaStamp[source].domainMetaStamp[domain][eventListName] = {};
    var metastampShell = JSON.parse(JSON.stringify(metastamp));
    var numberOfEvents = _.size(uids);
    var divisor = maxSize * numberOfEvents;
    var quotient = divisor / metastampSize;
    var eventsPerStamp = Math.floor(quotient);
    if (eventsPerStamp < 1) {
        eventsPerStamp = 1;
    }
    var metastampByEvent = [];
    var index = 0;
    _.each(uids, function(value, key) {
        var metastampIndex = Math.floor(index / eventsPerStamp);
        if (!metastampByEvent[metastampIndex]) {
            metastampByEvent[metastampIndex] = JSON.parse(JSON.stringify(metastampShell));
        }
        metastampByEvent[metastampIndex].sourceMetaStamp[source].domainMetaStamp[domain][eventListName][key] = value;
        index++;
    });
    return metastampByEvent;
};

/**
Ensures that a metastamp isn't so large that JDS cannot store it in memory.
**/
JdsClient.prototype._ensureMetastampSize = function(metastamp, size) {
    var self = this;
    if (self._validateMetastampSize(metastamp, size)) {
        return [metastamp];
    }
    var metastampJobs = [];
    var sourceJobs = self._splitMetastampBySource(metastamp);
    _.each(sourceJobs, function(sourceMetastamp) {
        if (self._validateMetastampSize(sourceMetastamp, size)) {
            metastampJobs.push(sourceMetastamp);
        } else {
            var domainJobs = self._splitMetastampByDomain(sourceMetastamp);
            _.each(domainJobs, function(domainMetastamp) {
                if (self._validateMetastampSize(domainMetastamp, size)) {
                    metastampJobs.push(domainMetastamp);
                } else {
                    var eventJobs = self._splitMetastampDomain(domainMetastamp, size);
                    metastampJobs = metastampJobs.concat(eventJobs);
                }
            });
        }
    });
    return metastampJobs;
};


JdsClient.prototype.addErrorRecord = function(errorRecord, callback) {
    this.log.debug('jds-client.addErrorRecord() %j', errorRecord);
    var metricsObj = {
        subsystem: 'JDS',
        action: 'addErrorRecord',
        process: uuid.v4(),
        timer: 'start'
    };
    this.metrics.debug('JDS addErrorRecord %j', metricsObj);
    this.execute('/error/set/this', errorRecord, 'POST', metricsObj, function(error, result) {
        if (error) {
            return callback(error, result);
        }

        callback();
    });
};

JdsClient.prototype.findErrorRecordById = function(id, callback) {
    this.log.debug('jds-client.findErrorRecordById(%s)', id);
    var metricsObj = {
        subsystem: 'JDS',
        action: 'findErrorRecordById',
        id: id,
        process: uuid.v4(),
        timer: 'start'
    };
    this.metrics.debug('JDS findErrorRecordById %j', metricsObj);
    this.execute('/error/get/' + id, null, 'GET', metricsObj, function(error, result) {
        if (error) {
            return callback(error, result);
        }

        if (result.statusCode !== 200) {
            return callback('Error finding record by id ' + id, result);
        }

        var records = result.body;
        try {
            records = JSON.parse(result.body);
            if (records.items) {
                records = records.items;
            }
        } catch (e) {
            // use default
        }

        callback(null, records);
    });
};

JdsClient.prototype.findErrorRecordsByFilter = function(filter, callback) {
    this.log.debug('jds-client.findErrorRecordsByFilter() %s', filter);
    var metricsObj = {
        subsystem: 'JDS',
        action: 'findErrorRecordsByFilter',
        filter: filter,
        process: uuid.v4(),
        timer: 'start'
    };
    this.metrics.debug('JDS findErrorRecordsByFilter %j', metricsObj);
    this.execute('/error/get?filter=' + filter, null, 'GET', metricsObj, function(error, result) {
        if (error) {
            return callback(error, result);
        }

        if (result.statusCode !== 200) {
            return callback('Error finding records', result);
        }

        var records = result.body;
        try {
            records = JSON.parse(result.body);
            if (records.items) {
                records = records.items;
            }
        } catch (e) {
            // use default
        }

        callback(null, records);
    });
};

JdsClient.prototype.getErrorRecordCount = function(callback) {
    this.log.debug('jds-client.getErrorRecordCount()');
    var metricsObj = {
        subsystem: 'JDS',
        action: 'getErrorRecordCount',
        process: uuid.v4(),
        timer: 'start'
    };
    this.metrics.debug('JDS getErrorRecordCount %j', metricsObj);
    this.execute('/error/length/this', null, 'GET', metricsObj, function(error, result) {
        if (error) {
            return callback(error, result);
        }

        if (!result || !result.body) {
            return callback('No result returned for error count');
        }

        var bodyVal = result.body;
        try {
            bodyVal = JSON.parse(result.body);
            if (!_.has(bodyVal, 'length')) {
                return callback('Invalid result returned for error count', bodyVal);
            }
        } catch (e) {
            return callback('Invalid result returned for error count', bodyVal);
        }

        return callback(null, bodyVal.length);
    });
};

JdsClient.prototype.deleteErrorRecordById = function(id, callback) {
    this.log.debug('jds-client.deleteErrorRecordById(%s)', id);
    var metricsObj = {
        subsystem: 'JDS',
        action: 'deleteErrorRecordById',
        id: id,
        process: uuid.v4(),
        timer: 'start'
    };
    this.metrics.debug('JDS deleteErrorRecordById %j', metricsObj);
    this.execute('/error/destroy/' + id, null, 'DELETE', metricsObj, function(error, result) {
        if (error) {
            return callback(error, result);
        }

        if (result.statusCode !== 200) {
            return callback('Error deleting record: ' + id, result);
        }

        callback();
    });
};

JdsClient.prototype.deleteAllErrorRecords = function(callback) {
    this.log.debug('jds-client.deleteAllErrorRecords()');
    var metricsObj = {
        subsystem: 'JDS',
        action: 'deleteAllErrorRecords',
        process: uuid.v4(),
        timer: 'start'
    };
    this.metrics.debug('JDS deleteAllErrorRecords %j', metricsObj);
    this.execute('/error/clear/this', null, 'DELETE', metricsObj, function(error, result) {
        if (error) {
            return callback(error, result);
        }

        if (result.statusCode !== 200) {
            return callback('Error deleting all records', result);
        }

        callback();
    });
};

module.exports = JdsClient;