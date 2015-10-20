'use strict';

/**
 * ReferralRequest - FHIR DSTU2 mapping.
 *
 * source: http://www.hl7.org/FHIR/2015May/referralrequest.html
 */

var rdk = require('../../core/rdk');
var nullchecker = rdk.utils.nullchecker;
var _ = rdk.utils.underscore;
var helpers = require('../common/utils/helpers.js');
var fhirResource = require('../common/entities/fhir-resource');
var fhirUtils = require('../common/utils/fhir-converter');
var constants = require('../common/utils/constants');

var jdsToFHIRStatusMap = {
    ACTIVE: 'active',
    CANCELLED: 'cancelled',
    EXPIRED: 'cancelled',
    COMPLETE: 'completed',
    SCHEDULED: 'requested',
    get: function(jdsStatus) {
        var fhirStatus = this[jdsStatus];
        return nullchecker.isNotNullish(fhirStatus) ? fhirStatus : 'draft' /*default status*/ ;
    }
};

function convertToFhir(result, req) {
    var link = [new fhirResource.Link(req.protocol + '://' + req.headers.host + req.originalUrl, 'self')];
    var entry = [];
    var items = result.data.items;
    _.forEach(items, function(item) {
        entry.push(new fhirResource.Entry(convertToReferralRequest(item, req)));
    });
    return new fhirResource.Bundle2(link, entry, result.data.totalItems);
}

function convertToReferralRequest(jdsItem, req) {
    var pid = req.query['subject.identifier'];

    var fhirItem = new fhirResource.ReferralRequest(helpers.generateUUID(), jdsToFHIRStatusMap.get(jdsItem.statusName));
    fhirItem.identifier = new fhirResource.Identifier(jdsItem.uid, constants.referralRequest.REFERRAL_REQUEST_UID_IDENTIFIER_SYSTEM);
    if (nullchecker.isNotNullish(jdsItem.consultProcedure)) {
        fhirItem.type = new fhirResource.CodeableConcept(jdsItem.consultProcedure);
    }
    if (nullchecker.isNotNullish(jdsItem.service)) {
        fhirItem.specialty = new fhirResource.CodeableConcept(jdsItem.service);
    }
    if (nullchecker.isNotNullish(jdsItem.urgency)) {
        fhirItem.priority = new fhirResource.CodeableConcept(jdsItem.urgency);
    }
    fhirItem.patient = new fhirResource.ReferenceResource('Patient/' + pid);
    fhirItem.requester = new fhirResource.ReferenceResource('Provider/' + jdsItem.providerUid);

    setRecipients(fhirItem, jdsItem);

    if (nullchecker.isNotNullish(jdsItem.dateTime)) {
        fhirItem.dateSent = fhirUtils.convertToFhirDateTime(jdsItem.dateTime);
    }
    if (nullchecker.isNotNullish(jdsItem.reason)) {
        fhirItem.reason = new fhirResource.CodeableConcept(jdsItem.reason);
    }
    if (nullchecker.isNotNullish(jdsItem.service)) {
        fhirItem.serviceRequested = new fhirResource.CodeableConcept(jdsItem.service);
    }
    fhirItem.extension = createExtensions(jdsItem);
    return fhirItem;
}

function setRecipients(fhirItem, jdsItem) {
    var recipients = [];
    _.forEach(jdsItem.activity, function(activity) {
        if (nullchecker.isNotNullish(activity.responsible)) {
            recipients.push(new fhirResource.ReferenceResource(undefined, activity.responsible));
        }
    });
    if (recipients.length > 0) {
        fhirItem.recipient = recipients;
    }
}

function createExtension(propertyName, valueX, x) {
    x = x || 'String'; // default value type 'String'
    if (nullchecker.isNotNullish(valueX)) {
        return new fhirResource.Extension(
            constants.referralRequest.REFERRAL_REQUEST_EXTENSION_URL_PREFIX + propertyName,
            valueX, x);
    } else {
        return null;
    }
}

function createExtensions(jdsItem) {
    var extensions = [];

    _.forEach(jdsItem.activity, function(a, index) {
        var prefix = 'activity[' + index + '].';
        extensions.push(createExtension(prefix + 'comment', a.comment));
        extensions.push(createExtension(prefix + 'dateTime', a.dateTime));
        extensions.push(createExtension(prefix + 'device', a.device));
        extensions.push(createExtension(prefix + 'entered', a.entered));
        extensions.push(createExtension(prefix + 'enteredBy', a.enteredBy));
        extensions.push(createExtension(prefix + 'forwardedFrom', a.forwardedFrom));
        extensions.push(createExtension(prefix + 'name', a.name));
        extensions.push(createExtension(prefix + 'responsible', a.responsible));
        extensions.push(createExtension(prefix + 'resultUid', a.resultUid));
    });

    _.forEach(jdsItem.results, function(r, index) {
        var prefix = 'results[' + index + '].';
        extensions.push(createExtension(prefix + 'localTitle', r.localTitle));
        extensions.push(createExtension(prefix + 'summary', r.summary));
        extensions.push(createExtension(prefix + 'uid', r.uid));
    });

    extensions.push(createExtension('facilityCode', jdsItem.facilityCode, 'Integer'));
    extensions.push(createExtension('facilityName', jdsItem.facilityName));
    extensions.push(createExtension('kind', jdsItem.kind));
    extensions.push(createExtension('lastUpdateTime', jdsItem.lastUpdateTime));
    extensions.push(createExtension('localId', jdsItem.localId));
    extensions.push(createExtension('stampTime', jdsItem.stampTime));
    extensions.push(createExtension('summary', jdsItem.summary));
    extensions.push(createExtension('attention', jdsItem.attention));
    extensions.push(createExtension('category', jdsItem.category));
    extensions.push(createExtension('clinicalProcedure', jdsItem.clinicalProcedure));
    extensions.push(createExtension('fromService', jdsItem.fromService));
    extensions.push(createExtension('interpretation', jdsItem.interpretation));
    extensions.push(createExtension('lastAction', jdsItem.lastAction));
    extensions.push(createExtension('orderName', jdsItem.orderName));
    extensions.push(createExtension('orderUid', jdsItem.orderUid));
    extensions.push(createExtension('patientClassCode', jdsItem.patientClassCode));
    extensions.push(createExtension('patientClassName', jdsItem.patientClassName));
    extensions.push(createExtension('place', jdsItem.place));
    extensions.push(createExtension('providerDisplayName', jdsItem.providerDisplayName));
    extensions.push(createExtension('providerName', jdsItem.providerName));
    extensions.push(createExtension('provisionalDx', jdsItem.provisionalDx));
    extensions.push(createExtension('typeName', jdsItem.typeName));

    return _.compact(extensions); // get rid of all null entries
}

module.exports.convertToFhir = convertToFhir;
module.exports.convertToReferralRequest = convertToReferralRequest;
