'use strict';

var format = require('util').format;
var uuid = require('node-uuid');
var _ = require('lodash');
var jobUtil = {};

function createOpportunisticSyncRequest(rootJob) {
    return create(opportunisticSyncRequestType(), rootJob);
}

function createActiveUserRequest(log, config, environment, handlerCallback, rootJob) {
    return create(activeUserRequestType(), rootJob);
}

function createAdmissionRequest(log, config, environment, handlerCallback, rootJob) {
    return create(admissionRequestType(), rootJob);
}

function createAppointmentRequest(log, config, environment, handlerCallback, rootJob) {
    return create(appointmentRequestType(), rootJob);
}

function createStoreJobStatus(log, config, environment, handlerCallback, rootJob) {
    return create(storeJobStatusRequestType(), rootJob);
}

function createSync(log, config, environment, handlerCallback, rootJob) {
    return create(syncRequestType(), rootJob);
}

function createValidationRequest(log, config, environment, handlerCallback, rootJob) {
    return create(validationRequestType(), rootJob);
}

function createPatientListRequest(log, config, environment, handlerCallback, rootJob) {
    return create(patientListRequestType(), rootJob);
}

function opportunisticSyncRequestType() {
    return 'opportunistic-sync-request';
}

function activeUserRequestType() {
    return 'active-user';
}

function admissionRequestType() {
    return 'admission-request';
}

function appointmentRequestType() {
    return 'appointment-request';
}

function storeJobStatusRequestType() {
    return 'store-job-status';
}

function syncRequestType() {
    return 'sync';
}

function validationRequestType() {
    return 'validation-request';
}

function patientListRequestType() {
    return 'patientlist-request';
}

function create(type, meta, result) {
    var job = {
        type: type
    };

    if (_.isUndefined(meta)) {
        meta = {};
    }

    if (!_.isUndefined(meta.jpid)) {
        job.jpid = meta.jpid;
    } else {
        job.jpid = uuid.v4();
    }

    if (!_.isUndefined(meta.rootJobId)) {
        job.rootJobId = meta.rootJobId;
    }

    if (!_.isUndefined(meta.forceSync)) {
        job.forceSync = meta.forceSync;
    }

    if (!_.isUndefined(meta.jobId)) {
        job.jobId = meta.jobId;
    }

    if (!_.isUndefined(meta.source)) {
        job.source = meta.source;
    }

    if (!_.isUndefined(meta.patients)) {
        job.patients = meta.patients;
    }

    if (!_.isUndefined(meta.users)) {
        job.users = meta.users;
    }

    if (!_.isUndefined(meta.siteId)) {
        job.siteId = meta.siteId;
    }

    return job;
}

function isValid(type, job) {

    if (_.isEmpty(type) || _.isEmpty(job)) {
        return false;
    }

    // log.debug('job-utils.isValid: Job was valid.');

    if (missingOrBlank(job, 'type') ) {
        return false;
    }

    if (!_.has(fields, type)) {
        return false;
    }

    var validFields = allFieldsValid(job, fields[type]);

    return validFields;
}

function missingOrBlank(object, field) {
    return _.isUndefined(object) || _.isNull(object) || _.isUndefined(object[field]) || _.isNull(object[field]) || object[field] === '';
}

function allFieldsValid(object, requiredFields) {
    return _.every(requiredFields, function(name) {
        return !missingOrBlank(object, name);
    });
}

var fields = {};
fields[opportunisticSyncRequestType()] = [];
fields[activeUserRequestType()] = [];
fields[admissionRequestType()] = [];
fields[appointmentRequestType()] = [];
fields[storeJobStatusRequestType()] = [];
fields[syncRequestType()] = [];
fields[validationRequestType()] = [];
fields[patientListRequestType()] = [];

module.exports = jobUtil;
jobUtil.create = create;
jobUtil.isValid = isValid;
jobUtil._missingOrBlank = missingOrBlank;
jobUtil._allFieldsValid = allFieldsValid;
jobUtil.createOpportunisticSyncRequest = createOpportunisticSyncRequest;
jobUtil.createActiveUserRequest = createActiveUserRequest;
jobUtil.createAdmissionRequest = createAdmissionRequest;
jobUtil.createAppointmentRequest = createAppointmentRequest;
jobUtil.createStoreJobStatus = createStoreJobStatus;
jobUtil.createSync = createSync;
jobUtil.createValidationRequest = createValidationRequest;
jobUtil.createPatientListRequest = createPatientListRequest;

jobUtil.opportunisticSyncRequestType = opportunisticSyncRequestType;
jobUtil.activeUserRequestType = activeUserRequestType;
jobUtil.admissionRequestType = admissionRequestType;
jobUtil.appointmentRequestType = appointmentRequestType;
jobUtil.storeJobStatusRequestType = storeJobStatusRequestType;
jobUtil.syncRequestType = syncRequestType;
jobUtil.validationRequestType = validationRequestType;
jobUtil.patientListRequestType = patientListRequestType;