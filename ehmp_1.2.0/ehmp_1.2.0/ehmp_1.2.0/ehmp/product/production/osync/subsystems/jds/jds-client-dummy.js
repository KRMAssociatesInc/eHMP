'use strict';

//-----------------------------------------------------------------------------------
// This is a dummy class for JdsClient that can be used for unit test purposes.
//
// Author: Les Westberg
//-----------------------------------------------------------------------------------

require('../../env-setup');
var _ = require('underscore');


function JdsClient(setLog, setConfig) {
    if (!(this instanceof JdsClient)) { return new JdsClient(setLog, setConfig); }
    this.log = setLog;
    //this.log = require('bunyan').createLogger({name: 'jds-client-dummy', level: 'debug'});
    this.config = setConfig.jds;
    this.error = [null];
    this.response = [''];
    this.result = [undefined];
    this.responseIndex = 0;
}

//-----------------------------------------------------------------------------------
// This will set up the data that will be sent to the callback on on completion of a
// method call.  Allows checking of handler code.
//-----------------------------------------------------------------------------------
JdsClient.prototype._setResponseData = function(error, response, result) {
    this.responseIndex = 0;

    if (_.isArray(error)) {
        this.error = error;
    }
    else {
        this.error = [error];
    }

    if (_.isArray(response)) {

        this.log.debug('jds-client-dummy_setResponseData: response %j is an array.', response);
        this.response = response;
        this.log.debug('response: %j', this.response);
    }
    else {
        this.log.debug('jds-client-dummy_setResponseData: response %j is not array.', response);
        this.response = [response];
        this.log.debug('new response is: %j', this.response);
    }

    if (_.isArray(result)) {
        this.result = result;
    }
    else {
        this.result = [result];
    }
};

// JdsClient.prototype.clearJdsData = function(callback) {
//     if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex)) {
//         this.responseIndex++;
//         callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1]);
//     }
//     else {
//         this.responseIndex++;
//         callback(this.error[0], this.response[0]);
//     }
// };

JdsClient.prototype.saveSyncStatus = function(metastamp, patientIdentifier, callback) {
    if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex)) {
        this.responseIndex++;
        this.log.debug('jds-client-dummy.saveSyncStatus: (from array) responseIndex: %s; error: %s, response: %j', this.responseIndex-1, this.error[this.responseIndex-1], this.response[this.responseIndex-1]);
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        this.log.debug('jds-client-dummy.saveSyncStatus: (from [0]) responseIndex: %s; error: %s, response: %j', this.responseIndex-1, this.error[0], this.response[0]);
        callback(this.error[0], this.response[0]);
    }
};

JdsClient.prototype.getSyncStatus = function(patientIdentifier, callback) {
    if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex) && (this.result.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1], this.result[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0], this.result[0]);
    }
};

JdsClient.prototype.clearSyncStatus = function(callback) {
    if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0]);
    }
};

JdsClient.prototype.saveJobState = function(jobState, callback) {
    if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0]);
    }
};

JdsClient.prototype.getJobStatus = function(job, callback) {
    if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex) && (this.result.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1], this.result[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0], this.result[0]);
    }
};

JdsClient.prototype.clearJobStatesByPatientIdentifier = function(patientIdentifier, callback) {
    if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0]);
    }
};

JdsClient.prototype.getPatientIdentifier = function(job, callback) {
    if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex) && (this.result.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1], this.result[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0], this.result[0]);
    }
};

JdsClient.prototype.getPatientIdentifierByPid = function(pid, callback) {
    if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex) && (this.result.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1], this.result[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0], this.result[0]);
    }
};

JdsClient.prototype.storePatientIdentifier = function(jdsPatientIdentificationRequest, callback) {
    if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0]);
    }
};

JdsClient.prototype.clearPatientIdentifiers = function(callback) {
    if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0]);
    }
};

//-----------------------------------------------------------------------------------------
// Store the object in the operational data store area of the JDS.
//
// _options: Environment data
// operationalData: The object that represents the operational data to be stored.
// callback: The handler to call when this request is completed.
//-----------------------------------------------------------------------------------------
JdsClient.prototype.storeOperationalData = function(operationalData, callback) {
    if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0]);
    }
};

//------------------------------------------------------------------------------------------
// Retrieve pt-select data using the patient's pid.
//
// pid: The pid to use to retrieve the pt-select data.
// callback: The handler to call when this request is completed.
//-------------------------------------------------------------------------------------------
JdsClient.prototype.getOperationalDataPtSelectByPid = function(pid, callback) {
    if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex) && (this.result.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1], this.result[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0], this.result[0]);
    }
};

//------------------------------------------------------------------------------------------
// Retrieve pt-select data using the patient's icn.
//
// icn: The icn to use to retrieve the pt-select data.
// callback: The handler to call when this request is completed.
//-------------------------------------------------------------------------------------------
JdsClient.prototype.getOperationalDataPtSelectByIcn = function(icn, callback) {
    if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex) && (this.result.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1], this.result[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0], this.result[0]);
    }
};

//-----------------------------------------------------------------------------------------
// Retrieve the operational data object by its UID.
//
// _options: Environment data
// uid: The UID that identifies the operational data item being retrieved.
// callback: The handler to call when this request is completed.
// Returns  (through call back): the Operational data item.
//-----------------------------------------------------------------------------------------
JdsClient.prototype.getOperationalDataByUid = function(uid, callback) {
    if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex) && (this.result.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1], this.result[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0], this.result[0]);
    }
};

//-----------------------------------------------------------------------------------------
// Delete the operational data object by its UID.
//
// _options: Environment data
// uid: The UID that identifies the operational data item being deleted.
// callback: The handler to call when this request is completed.
//-----------------------------------------------------------------------------------------
JdsClient.prototype.deleteOperationalDataByUid = function(uid, callback) {
    if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0]);
    }
};

JdsClient.prototype.storeOperationalDataMutable = function(siteId, callback) {
    if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0]);
    }
};

JdsClient.prototype.getOperationalDataMutable = function(siteId, callback){
    if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex) && (this.result.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1], this.result[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0], this.result[0]);
    }
};

JdsClient.prototype.getOperationalDataMutableCount = function(callback){
    if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex) && (this.result.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1], this.result[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0], this.result[0]);
    }
};

JdsClient.prototype.deleteOperationalDataMutable = function(siteId, callback){
    if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0]);
    }
};

JdsClient.prototype.saveOperationalSyncStatus = function(metastamp, siteId, callback){
    if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0]);
    }
};
JdsClient.prototype.getOperationalSyncStatus = function(siteId, callback){
    if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex) && (this.result.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1], this.result[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0], this.result[0]);
    }
};
JdsClient.prototype.deleteOperationalSyncStatus = function(siteId, callback){
 if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0]);
    }
};
JdsClient.prototype.clearAllOperationalSyncStatus = function(callback){
     if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0]);
    }
};

JdsClient.prototype.clearOperationalDataMutableStorage = function(callback){
    if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0]);
    }
};

//------------------------------------------------------------------------------------------
// Retrieve patientDemographics data using the patient's pid.  Note this is demographics
// that comes from patient domain (NOT operational pt-select data)
//
// pid: The pid to use to retrieve the data.
// callback: The handler to call when this request is completed.
//-------------------------------------------------------------------------------------------
JdsClient.prototype.getPtDemographicsByPid = function(pid, callback) {
    if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex) && (this.result.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1], this.result[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0], this.result[0]);
    }
};

//------------------------------------------------------------------------------------------
// Retrieve patientDemographics data using the patient's icn.  Note this is demographics
// that comes from patient domain (NOT operational pt-select data)
//
// icn: The icn to use to retrieve the data.
// callback: The handler to call when this request is completed.
//-------------------------------------------------------------------------------------------
JdsClient.prototype.getPtDemographicsByIcn = function(icn, callback) {
    if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex) && (this.result.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1], this.result[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0], this.result[0]);
    }
};

JdsClient.prototype.storePatientDataFromJob = function(job, callback) {
    if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0]);
    }
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
    if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0]);
    }
};


//-----------------------------------------------------------------------------------------
// Delete the patient data object by its UID.
//
// _self: Environment data
// uid: The UID that identifies the operational data item being deleted.
// callback: The handler to call when this request is completed.
//-----------------------------------------------------------------------------------------
JdsClient.prototype.deletePatientDataByUid = function(uid, callback) {
 if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0]);
    }
};

//-----------------------------------------------------------------------------------------
// Delete all patient data for all identifiers tied to this pid.
//
// _self: Environment data
// pid: The pid that identifies the patient.
// callback: The handler to call when this request is completed.
//-----------------------------------------------------------------------------------------
JdsClient.prototype.deletePatientByPid = function(pid, callback) {
 if ((this.error.length >= this.responseIndex) && (this.response.length >= this.responseIndex)) {
        this.responseIndex++;
        callback(this.error[this.responseIndex-1], this.response[this.responseIndex-1]);
    }
    else {
        this.responseIndex++;
        callback(this.error[0], this.response[0]);
    }
};



module.exports = JdsClient;
// JdsClient._tests = {
//     '_setResponseData': JdsClient.prototype._setResponseData,
//     'clearJdsData': JdsClient.prototype.clearJdsData,
//     'saveSyncStatus': JdsClient.prototype.saveSyncStatus,
//     'getSyncStatus': JdsClient.prototype.getSyncStatus,
//     'clearSyncStatus': JdsClient.prototype.clearSyncStatus,
//     'saveJobState': JdsClient.prototype.saveJobState,
//     'getJobStatus': JdsClient.prototype.getJobStatus,
//     'clearJobStates': JdsClient.prototype.clearJobStates,
//     'getPatientIdentifier': JdsClient.prototype.getPatientIdentifier,
//     'getPatientIdentifierByPid': JdsClient.prototype.getPatientIdentifierByPid,
//     'storePatientIdentifier': JdsClient.prototype.storePatientIdentifier,
//     'clearPatientIdentifiers': JdsClient.prototype.clearPatientIdentifiers,
//     'storeOperationalData': JdsClient.prototype.storeOperationalData,
//     'getOperationalDataPtSelectByPid': JdsClient.prototype.getOperationalDataPtSelectByPid,
//     'getOperationalDataPtSelectByIcn': JdsClient.prototype.getOperationalDataPtSelectByIcn,
//     'getOperationalDataByUid' : JdsClient.prototype.getOperationalDataByUid,
//     'deleteOperationalDataByUid' : JdsClient.prototype.deleteOperationalDataByUid,
//     'getPtDemographicsByPid': JdsClient.prototype.getPtDemographicsByPid,
//     'getPtDemographicsByIcn': JdsClient.prototype.getPtDemographicsByIcn,
//     'storePatientDataFromJob': JdsClient.prototype.storePatientDataFromJob,
//     'storePatientData': JdsClient.prototype.storePatientData,
//     'deletePatientDataByUid': JdsClient.prototype.deletePatientDataByUid,
//     'deletePatientByPid': JdsClient.prototype.deletePatientByPid
// };