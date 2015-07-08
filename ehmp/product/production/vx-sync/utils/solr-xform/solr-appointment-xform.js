'use strict';

require('../../env-setup');

//--------------------------------------------------------------------------------
// This module transforms a VPR Appointment record into a SOLR Appointment Record.
//
// @Author: Les Westberg
//---------------------------------------------------------------------------------

var _ = require('underscore');
var solrXformUtil = require(global.VX_UTILS + 'solr-xform/solr-xform-utils');

//--------------------------------------------------------------------------
// Transform the VPR Appointment record into a SOLR appointment record.
//
// vprRecord: The record in VPR format.
// log: A logger to use to log messages.
//--------------------------------------------------------------------------
function transformRecord(vprRecord, log) {
    log.debug('solr-appointment-xform.transformRecord: Entered method.  vprRecord: %j', vprRecord);

    if (!_.isObject(vprRecord)) {
        return null;
    }

    var solrRecord = {};

    solrXformUtil.setCommonFields(solrRecord, vprRecord);
    setDomainSpecificFields(solrRecord, vprRecord);

    log.debug('solr-appointment-xform.transformRecord: Leaving method returning SOLR record: %j', solrRecord);
    if ((_.isObject(solrRecord)) && (!_.isEmpty(solrRecord))) {
        return solrRecord;
    } else {
        return null;
    }
}

//-------------------------------------------------------------------------
// Transform the fields specific to this domain.
//
// solrRecored: The place to put the SOLR fields.
// vprRecord: The record in VPR format.
//-------------------------------------------------------------------------
function setDomainSpecificFields(solrRecord, vprRecord) {
    solrRecord.domain = 'encounter';

    // solrXformUtil.setStringFromSimple(solrRecord, 'datetime', vprRecord, 'dateTime');
    // solrXformUtil.setStringFromSimple(solrRecord, 'date_time', vprRecord, 'dateTime');
    solrXformUtil.setStringFromSimple(solrRecord, 'visit_date_time', vprRecord, 'dateTime');
    solrXformUtil.addStringFromSimple(solrRecord, 'datetime_all', vprRecord, 'dateTime');

    solrXformUtil.setSimpleFromSimple(solrRecord, 'current', vprRecord, 'current');
    solrXformUtil.setStringFromSimple(solrRecord, 'type_code', vprRecord, 'typeCode');
    solrXformUtil.setStringFromSimple(solrRecord, 'service', vprRecord, 'service');
    solrXformUtil.setStringFromSimple(solrRecord, 'stop_code', vprRecord, 'stopCode');
    solrXformUtil.setStringFromSimple(solrRecord, 'stop_code_name', vprRecord, 'stopCodeName');
    solrXformUtil.setStringFromSimple(solrRecord, 'stop_code_uid', vprRecord, 'stopCodeUid');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'appointment_status', vprRecord, 'appointmentStatus');
    solrXformUtil.setStringFromSimple(solrRecord, 'location_uid', vprRecord, 'locationUid');
    solrXformUtil.setStringFromSimple(solrRecord, 'location_name', vprRecord, 'locationName');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'short_location_name', vprRecord, 'shortLocationName');
    solrXformUtil.setStringFromSimple(solrRecord, 'location_display_name', vprRecord, 'locationDisplayName');
    solrXformUtil.setSimpleFromSimple(solrRecord, 'location_oos', vprRecord, 'locationOos');
    solrXformUtil.setStringFromSimple(solrRecord, 'room_bed', vprRecord, 'roomBed');
    solrXformUtil.setStringFromSimple(solrRecord, 'patient_class_name', vprRecord, 'patientClassName');
    solrXformUtil.setStringFromSimple(solrRecord, 'patient_class', vprRecord, 'patientClassName');
    solrXformUtil.setStringFromSimple(solrRecord, 'encounter_type', vprRecord, 'typeDisplayName');
    solrXformUtil.setStringFromSimple(solrRecord, 'encounter_category', vprRecord, 'categoryName');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'check_out', vprRecord, 'checkOut');
    solrXformUtil.setStringFromPrimaryProviders(solrRecord, 'primary_provider_name', vprRecord, 'providers', 'providerName');
    solrXformUtil.setStringFromSimple(solrRecord, 'reason', vprRecord, 'reason');
    solrXformUtil.setStringFromSimple(solrRecord, 'reason_name', vprRecord, 'reasonName');
    solrXformUtil.setStringFromSimple(solrRecord, 'disposition_code', vprRecord, 'dispositionCode');
    solrXformUtil.setStringFromSimple(solrRecord, 'disposition_name', vprRecord, 'dispositionName');
    solrXformUtil.setStringFromSimple(solrRecord, 'referrer_name', vprRecord, 'referrerName');
 }

module.exports = transformRecord;