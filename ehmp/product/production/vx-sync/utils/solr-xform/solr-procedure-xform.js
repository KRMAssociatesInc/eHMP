'use strict';

require('../../env-setup');

//--------------------------------------------------------------------------------
// This module transforms a VPR Problem record into a SOLR Problem Record.
//
// @Author: Les Westberg, J.Vega
//---------------------------------------------------------------------------------

var _ = require('underscore');
var solrXformUtil = require(global.VX_UTILS + 'solr-xform/solr-xform-utils');

//--------------------------------------------------------------------------
// Transform the VPR Problem record into a SOLR problem record.
//
// vprRecord: The record in VPR format.
// log: A logger to use to log messages.
//--------------------------------------------------------------------------
function transformRecord(vprRecord, log) {
    log.debug('solr-problem-xform.transformRecord: Entered method.  vprRecord: %j', vprRecord);

    if (!_.isObject(vprRecord)) {
        return null;
    }

    var solrRecord = {};

    solrXformUtil.setCommonFields(solrRecord, vprRecord);
    setDomainSpecificFields(solrRecord, vprRecord);

    log.debug('solr-problem-xform.transformRecord: Leaving method returning SOLR record: %j', solrRecord);
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
    solrRecord.domain = 'procedure';
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'name', vprRecord, 'name');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'procedure_type', vprRecord, 'typeName');
    solrXformUtil.setStringFromSimple(solrRecord, 'procedure_date_time', vprRecord, 'dateTime');
    solrXformUtil.setStringFromSimple(solrRecord, 'encounter_uid', vprRecord, 'encounterUid');
    solrXformUtil.setStringFromSimple(solrRecord, 'imaging_type_uid', vprRecord, 'imagingTypeUid');
    solrXformUtil.setStringFromSimple(solrRecord, 'image_location', vprRecord, 'imageLocation');
    solrXformUtil.setStringFromSimple(solrRecord, 'location_uid',vprRecord, 'locationUid');
    solrXformUtil.setStringFromSimple(solrRecord, 'has_images', vprRecord, 'hasImages');
    solrXformUtil.setStringArrayFromObjectArrayField(solrRecord, 'body', vprRecord, 'results', 'report');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'place', vprRecord, 'place');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'urgency', vprRecord, 'urgency');
    solrXformUtil.setStringFromSimple(solrRecord, 'order_name', vprRecord, 'orderName');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'from_service', vprRecord, 'fromService');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'patient_class_code', vprRecord, 'patientClassCode');
    solrXformUtil.setStringFromSimple(solrRecord, 'patient_class_name', vprRecord, 'patientClassName');
    solrXformUtil.setStringFromSimple(solrRecord, 'status_name', vprRecord, 'statusName');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'last_action', vprRecord, 'lastAction');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'provisional_dx', vprRecord, 'provisionalDx');
}

module.exports = transformRecord;