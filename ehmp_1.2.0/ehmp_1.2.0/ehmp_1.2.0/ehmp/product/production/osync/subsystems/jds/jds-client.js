'use strict';

require('../../env-setup');

var _ = require('underscore');
var format = require('util').format;
var request = require('request');
var inspect = require(global.OSYNC_UTILS + 'inspect');
var errorUtil = require(global.OSYNC_UTILS + 'error');
var objUtil = require(global.OSYNC_UTILS+'object-utils');

function JdsClient(log, config) {
    if (!(this instanceof JdsClient)) {
        return new JdsClient(log, config);
    }

    this.log = log;
    this.config = config;
}

// JdsClient.prototype.clearJdsData = function(callback) {
//     this.clearPatientIdentifiers(this.clearSyncStatus(this.clearJobStates(callback)));
// };

JdsClient.prototype.saveSyncStatus = function(metastamp, patientIdentifier, callback) {
    this.log.debug('Jds-client.saveSyncStatus()');
    this.log.debug(inspect(metastamp));

    if (!patientIdentifier) {
        return setTimeout(callback, 0, errorUtil.createFatal('No patientIdentifier object passed in'));
    }

    var identifierValue = patientIdentifier.value;
    if (patientIdentifier.type === 'edipi') {
        identifierValue = 'DOD;' + identifierValue;
    }

    var path = '/status/' + identifierValue;
    this.execute(path, metastamp, 'POST', callback);
};


JdsClient.prototype.getSyncStatus = function(patientIdentifier, callback) {
    this.log.debug('Jds-client.getSyncStatus()');
    this.log.debug(inspect(patientIdentifier));

    var path = '/status/' + patientIdentifier.value;
    this.execute(path, null, 'GET', callback);
};

JdsClient.prototype.clearSyncStatus = function(callback) {
    this.log.debug('Jds-client.clearSyncStatus()');

    var path = '/status';
    var method = 'DELETE';
    this.execute(path, null, method, callback);
};

JdsClient.prototype.saveJobState = function(jobState, callback) {
    this.log.debug('Jds-client.saveJobState()');
    this.log.debug(inspect(jobState));

    var path = '/job';
    this.execute(path, jobState, 'POST', callback);
};

/*
variadic function:
getJobStatus(job, callback)
getJobStatus(job, [param]..., callback)
*/
JdsClient.prototype.getJobStatus = function(job, callback) {
    this.log.debug('Jds-client.getJobStatus() %j', job);
    this.log.debug(inspect(job));

    if (arguments.length < 2) {
        return setTimeout(callback, 0, 'Invalid number of arguments');
    }

    var args = _.toArray(arguments);
    callback = args.pop();
    var params = arguments[0].jpid;
    if (arguments.length > 2) {
        params += arguments[1].filter;
    }

    var path = '/job/' + params;
    this.execute(path, job, 'GET', callback);
};

// JdsClient.prototype.clearJobStates = function(callback) {
//     this.log.debug('Jds-client.clearJobStates()');

//     var path = '/job';
//     var method = 'DELETE';
//     this.execute(path, null, method, callback);
// };

JdsClient.prototype.clearJobStatesByPatientIdentifier = function(patientIdentifier, callback){
    var path = '/job/' + patientIdentifier.value;
    var method = 'DELETE';
    this.execute(path, null, method, callback);
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

    var path = '/vpr/jpid/' + pid;
    this.execute(path, null, 'GET', callback);
};

JdsClient.prototype.storePatientIdentifier = function(jdsPatientIdentificationRequest, callback) {
    this.log.debug('jds-client.storePatientIdentifier() %j', jdsPatientIdentificationRequest);
    this.log.debug(jdsPatientIdentificationRequest.jpid || 'No JPID provided.');

    var path = '/vpr/jpid/';
    if (typeof jdsPatientIdentificationRequest.jpid !== 'undefined') {
        path += jdsPatientIdentificationRequest.jpid;
    }

    this.execute(path, jdsPatientIdentificationRequest, 'POST', callback);
};

JdsClient.prototype.removePatientIdentifier = function(jpid, callback) {
    this.log.debug('jds-client.removePatientIdentifier() %j', jpid);

    var path = '/vpr/jpid/' + jpid;
    this.execute(path, null, 'DELETE', callback);
};

JdsClient.prototype.clearPatientIdentifiers = function(callback) {
    this.log.debug('jds-client.clearPatientIdentifiers()');

    var path = '/vpr/jpid/clear';
    this.execute(path, null, 'DELETE', callback);
};

//-----------------------------------------------------------------------------------------
// Store the object in the operational data store area of the JDS.
//
// operationalData: The object that represents the operational data to be stored.
// callback: The handler to call when this request is completed.
//-----------------------------------------------------------------------------------------
JdsClient.prototype.storeOperationalData = function(operationalData, callback) {
    this.log.debug('jds-client.storeOperationalData()');

    if (_.isEmpty(operationalData)) {
        return setTimeout(callback, 0, errorUtil.createFatal('No record passed in'));
    }

    var path = '/data';
    this.execute(path, operationalData, 'POST', callback);
};

//------------------------------------------------------------------------------------------
// Retrieve pt-select data using the patient's pid.
//
// pid: The pid to use to retrieve the pt-select data.
// callback: The handler to call when this request is completed.
//-------------------------------------------------------------------------------------------
JdsClient.prototype.getOperationalDataPtSelectByPid = function(pid, callback) {
    this.log.debug('jds-client.getOperationalDataPtSelectByPid() %j', pid);

    if (_.isEmpty(pid)) {
        return setTimeout(callback, 0, errorUtil.createFatal('No pid passed in'));
    }

    var path = '/data/index/pt-select-pid?range="' + pid + '"';
    this.execute(path, null, 'GET', callback);
};

//------------------------------------------------------------------------------------------
// Retrieve pt-select data using the patient's icn.
//
// icn: The icn to use to retrieve the pt-select data.
// callback: The handler to call when this request is completed.
//-------------------------------------------------------------------------------------------
JdsClient.prototype.getOperationalDataPtSelectByIcn = function(icn, callback) {
    this.log.debug('jds-client.getOperationalDataPtSelectByIcn() %j', icn);

    if (_.isEmpty(icn)) {
        return setTimeout(callback, 0, errorUtil.createFatal('No icn passed in'));
    }

    var path = '/data/index/pt-select-icn?range="' + icn + '"';
    this.execute(path, null, 'GET', callback);
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

    if (_.isEmpty(uid)) {
        return setTimeout(callback, 0, errorUtil.createFatal('No uid passed in'));
    }

    var path = '/data/' + uid;
    this.execute(path, null, 'GET', callback);
};

//-----------------------------------------------------------------------------------------
// Delete the operational data object by its UID.
//
// uid: The UID that identifies the operational data item being deleted.
// callback: The handler to call when this request is completed.
//-----------------------------------------------------------------------------------------
JdsClient.prototype.deleteOperationalDataByUid = function(uid, callback) {
    this.log.debug('jds-client.deleteOperationalDataByUid() %j', uid);

    if (_.isEmpty(uid)) {
        return setTimeout(callback, 0, errorUtil.createFatal('No uid passed in'));
    }

    var path = '/data/' + uid;
    this.execute(path, null, 'DELETE', callback);
};

//-----------------------------------------------------------------------------------------
// Store the object in the mutable operational data store area of the JDS.
//
// operationalData: The object that represents the operational data to be stored.
// callback: The handler to call when this request is completed.
//-----------------------------------------------------------------------------------------
JdsClient.prototype.storeOperationalDataMutable = function(operationalData, callback) {
    this.log.debug('jds-client.storeOperationalDataMutable()');

    if (_.isEmpty(operationalData)) {
        return setTimeout(callback, 0, errorUtil.createFatal('No record passed in'));
    }

    var path = '/odmutable/set/this';
    this.execute(path, operationalData, 'POST', callback);
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

    if (_.isEmpty(siteId)) {
        return setTimeout(callback, 0, errorUtil.createFatal('No uid passed in'));
    }

    var path = '/odmutable/get/' + siteId;
    this.execute(path, null, 'GET', callback);
};

//-----------------------------------------------------------------------------------------
// Get the number of objects in the mutable operational data store
//
// Returns  (through call back): the Operational data item.
//-----------------------------------------------------------------------------------------
JdsClient.prototype.getOperationalDataMutableCount = function(callback) {
    this.log.debug('jds-client.getOperationalDataMutableCount()');

    var path = '/odmutable/length/this';
    this.execute(path, null, 'GET', callback);
};

//-----------------------------------------------------------------------------------------
// Delete the mutable operational data object by the site id.
//
// siteId: The site id that identifies the site for which site specific operational data should be deleted.
// callback: The handler to call when this request is completed.
//-----------------------------------------------------------------------------------------
JdsClient.prototype.deleteOperationalDataMutable = function(siteId, callback) {
    this.log.debug('jds-client.deleteOperationalDataMutable() %j', siteId);

    if (_.isEmpty(siteId)) {
        return setTimeout(callback, 0, errorUtil.createFatal('No site id passed in'));
    }

    var path = '/odmutable/destroy/' + siteId;
    this.execute(path, null, 'DELETE', callback);
};

//-----------------------------------------------------------------------------------------
// Delete all mutable operational data.
//
// callback: The handler to call when this request is completed.
//-----------------------------------------------------------------------------------------
JdsClient.prototype.clearOperationalDataMutableStorage = function(callback) {
    this.log.debug('jds-client.clearOperationalDataMutableStorage()');

    var path = '/odmutable/clear/this';
    this.execute(path, null, 'DELETE', callback);
};

JdsClient.prototype.saveOperationalSyncStatus = function(metastamp, siteId, callback) {
    this.log.debug('JdsClient.saveOperationalSyncStatus() %j', siteId);
    this.log.debug(inspect(metastamp));

    var path = '/statusod/' + siteId;
    this.execute(path, metastamp, 'POST', callback);
};

JdsClient.prototype.getOperationalSyncStatus = function(siteId, callback) {
    this.log.debug('JdsClient.getOperationalSyncStatus() %j', siteId);

    var path = '/statusod/' + siteId;
    this.execute(path, null, 'GET', callback);
};

JdsClient.prototype.deleteOperationalSyncStatus = function(siteId, callback) {
    this.log.debug('JdsClient.deleteOperationalSyncStatus() %j', siteId);

    var path = '/statusod/' + siteId;
    this.execute(path, null, 'DELETE', callback);
};

JdsClient.prototype.clearAllOperationalSyncStatus = function(callback) {
    this.log.debug('JdsClient.clearAllOperationalSyncStatus()');

    var path = '/statusod/';
    this.execute(path, null, 'DELETE', callback);
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

    if (_.isEmpty(pid)) {
        this.log.error('jds-client.getPtDemographicsByPid: No pid passed in');
        return setTimeout(callback, 0, errorUtil.createFatal('No pid passed in'));
    }

    var path = '/vpr/' + pid;
    this.execute(path, null, 'GET', callback);
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

    if (_.isEmpty(icn)) {
        this.log.error('jds-client.getPtDemographicsByIcn: No icn passed in');
        return setTimeout(callback, 0, errorUtil.createFatal('No icn passed in'));
    }

    var path = '/vpr/' + icn;
    this.execute(path, null, 'GET', callback);
};

//------------------------------------------------------------------------------------------
// This method marks an item on an operational data sync status as stored.
// It is only used for integration testing.
//------------------------------------------------------------------------------------------
JdsClient.prototype._markOperationalItemAsStored = function(metadata, callback) {
    this.log.debug('jds-client._markOperationalItemAsStored()');

    var path = '/recordod';
    this.execute(path, metadata, 'POST', callback);
};

JdsClient.prototype.getPatientDomainData = function(identifier, domain, callback) {
    this.log.debug('jds-client.getPatientDomainData() %j %j', identifier, domain);

    var path = '/vpr/' + identifier + '/find/' + domain;
    this.execute(path, null, 'GET', callback);
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

    if (_.isEmpty(patientDataEvent)) {
        this.log.debug('jds-client.storePatientData: Failed to store patient data.  patientDataEvent was empty.');
        return setTimeout(callback, 0, errorUtil.createFatal('No patient data event passed in'));
    }

    var path = '/vpr';
    this.execute(path, patientDataEvent, 'POST', callback);
};

JdsClient.prototype.getPatientDataByUid = function(uid, callback) {
    this.log.debug('jds-client.getPatientDataByUid() %j', uid);

    if (_.isEmpty(uid)) {
        return setTimeout(callback, 0, errorUtil.createFatal('No uid passed in'));
    }

    var path = '/vpr/uid/' + uid;
    this.execute(path, null, 'GET', callback);
};

//-----------------------------------------------------------------------------------------
// Delete the patient data object by its UID.
//
// uid: The UID that identifies the patient data item being deleted.
// callback: The handler to call when this request is completed.
//-----------------------------------------------------------------------------------------
JdsClient.prototype.deletePatientDataByUid = function(uid, callback) {
    this.log.debug('jds-client.deletePatientDataByUid() %j', uid);

    if (_.isEmpty(uid)) {
        return setTimeout(callback, 0, errorUtil.createFatal('No uid passed in'));
    }

    var path = '/vpr/uid/' + uid;
    this.execute(path, null, 'DELETE', callback);
};

//-----------------------------------------------------------------------------------------
// Delete all patient data for all identifiers tied to this pid.
//
// pid: The pid that identifies the patient.
// callback: The handler to call when this request is completed.
//-----------------------------------------------------------------------------------------
JdsClient.prototype.deletePatientByPid = function(pid, callback) {
    this.log.debug('jds-client.deletePatientByPid() %j', pid);

    if (_.isEmpty(pid)) {
        this.log.error('jds-client.deletePatientByPid() No pid passed in');
        return setTimeout(callback, 0, errorUtil.createFatal('No pid passed in'));
    }

    var path = '/vpr/' + pid;
    this.execute(path, null, 'DELETE', callback);
};


//--------------------------------------------------------------------------------------------------
// This function executes the JDS command.
//
// path: The JDS REST URL  (Without that http://<ip>:port)
// dataToPost:  If this is a put or post, then this is the data that is going to be put or posted.
// method: The type of http method (i.e. GET, PUT, POST, etc)
// callback: The call back function that should be called when the execute is completed.
//--------------------------------------------------------------------------------------------------
JdsClient.prototype.execute = function(path, dataToPost, method, callback) {
    this.log.debug(path);
    this.log.debug(inspect(dataToPost));
    if (_.isEmpty(this.config.jds)) {
        return setTimeout(callback, 0, errorUtil.createFatal('No value passed for jds configuration'));
    }

    if (method === 'POST' || method === 'PUT') {
        if (_.isEmpty(dataToPost)) {
            return setTimeout(callback, 0, errorUtil.createFatal('No dataToPost passed to store'));
        }
    } else {
        dataToPost = undefined;
    }

    var url = format('%s://%s:%s%s', this.config.jds.protocol, this.config.jds.host, this.config.jds.port, path);
    if (dataToPost) {
        var dataToPostWithoutPwd = objUtil.removeProperty(objUtil.removeProperty(dataToPost,'accessCode'),'verifyCode');
        this.log.debug('jds-client.execute(): Sending message to JDS. %s -> dataToPost: %j', url, dataToPostWithoutPwd);
    } else {
        this.log.debug('jds-client.execute(): Sending message to JDS. %s -> dataToPost: undefined or null', url);
    }

    var self = this;
    request({
        url: url,
        method: method || 'GET',
        json: dataToPost,
        timeout: this.config.jds.timeout || 60000
    }, function(error, response, body) {
        self.log.debug('jds-client.execute(): posted data to JDS %s', url);

        if (error || response.statusCode === 500) {
            self.log.error('jds-client.execute(): Unable to access JDS endpoint: %s %s', method, url);
            self.log.error('%s %j', error, body);

            return callback(errorUtil.createFatal((error || body || 'Unknown Error')), response);
        }

        var json;
        if (_.isEmpty(body)) {
            self.log.debug('jds-client.execute(): Response body is empty.  Status code:', response.statusCode);
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

        var responseWithoutPwd = objUtil.removeProperty(objUtil.removeProperty(json,'accessCode'),'verifyCode');
        self.log.debug('jds-client.execute(): JDS response is for the caller to handle', responseWithoutPwd);
        callback(null, response, json);
    });
};

module.exports = JdsClient;
