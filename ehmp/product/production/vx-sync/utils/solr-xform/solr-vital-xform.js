'use strict';

require('../../env-setup');

//--------------------------------------------------------------------------------
// This module transforms a VPR Vital record into a SOLR Vital Record.
//
// @Author: Les Westberg
//---------------------------------------------------------------------------------

var _ = require('underscore');
var solrXformUtil = require(global.VX_UTILS + 'solr-xform/solr-xform-utils');

//--------------------------------------------------------------------------
// Transform the VPR Vital record into a SOLR vital record.
//
// vprRecord: The record in VPR format.
// log: A logger to use to log messages.
//--------------------------------------------------------------------------
function transformRecord(vprRecord, log) {
    log.debug('solr-vital-xform.transformRecord: Entered method.  vprRecord: %j', vprRecord);

    if (!_.isObject(vprRecord)) {
        return null;
    }

    var solrRecord = {};

    solrXformUtil.setCommonFields(solrRecord, vprRecord);
    setDomainSpecificFields(solrRecord, vprRecord);

    log.debug('solr-vital-xform.transformRecord: Leaving method returning SOLR record: %j', solrRecord);
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
    solrRecord.domain = 'vital';
    solrXformUtil.setStringFromSimple(solrRecord, 'body_site', vprRecord, 'bodySite');
    solrXformUtil.setStringFromSimple(solrRecord, 'document', vprRecord, 'document');
    solrXformUtil.setStringFromSimple(solrRecord, 'display_name', vprRecord, 'displayName');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'entered_by_name', vprRecord, 'enteredByName');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'entered_by_uid', vprRecord, 'enteredByUid');
    solrXformUtil.setStringFromSimple(solrRecord, 'high', vprRecord, 'high');
    solrXformUtil.setStringFromSimple(solrRecord, 'location_name', vprRecord, 'locationName');
    solrXformUtil.setStringFromSimple(solrRecord, 'location_uid', vprRecord, 'locationUid');
    solrXformUtil.setStringFromSimple(solrRecord, 'low', vprRecord, 'low');
    solrXformUtil.setStringFromSimple(solrRecord, 'method', vprRecord, 'method');
    solrXformUtil.setStringFromSimple(solrRecord, 'metric_result', vprRecord, 'metricResult');
    solrXformUtil.setStringFromSimple(solrRecord, 'metric_unit', vprRecord, 'metricUnit');
    solrXformUtil.setStringFromSimple(solrRecord, 'interpretation_code', vprRecord, 'interpretationCode');
    solrXformUtil.setStringFromSimple(solrRecord, 'interpretation_name', vprRecord, 'interpretationName');
    solrXformUtil.setStringArrayFromSimple(solrRecord,'patient_generated_data_flag',vprRecord,'patientGeneratedDataFlag');
    solrXformUtil.setStringFromSimple(solrRecord, 'qualified_name', vprRecord, 'qualifiedName');
    solrXformUtil.setStringFromSimple(solrRecord, 'result', vprRecord, 'result');
    solrXformUtil.setStringFromSimple(solrRecord, 'result_status_code', vprRecord, 'resultStatusCode');
    solrXformUtil.setStringFromSimple(solrRecord, 'result_status_name', vprRecord, 'resultStatusName');
    solrXformUtil.setStringFromSimple(solrRecord, 'vital_sign_type', vprRecord, 'typeName');
    solrXformUtil.setStringFromSimple(solrRecord, 'units', vprRecord, 'units');
}

module.exports = transformRecord;