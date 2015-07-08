'use strict';

require('../../env-setup');

//--------------------------------------------------------------------------------
// This module transforms a VPR Consult record into a SOLR Consult Record.
//
// @Author: Les Westberg
//---------------------------------------------------------------------------------

var _ = require('underscore');
var solrXformUtil = require(global.VX_UTILS + 'solr-xform/solr-xform-utils');

//--------------------------------------------------------------------------
// Transform the VPR Consult record into a SOLR immunization record.
//
// vprRecord: The record in VPR format.
// log: A logger to use to log messages.
//--------------------------------------------------------------------------
function transformRecord(vprRecord, log) {
    log.debug('solr-immunization-xform.transformRecord: Entered method.  vprRecord: %j', vprRecord);

    if (!_.isObject(vprRecord)) {
        return null;
    }

    var solrRecord = {};
    solrXformUtil.setCommonFields(solrRecord, vprRecord);
    setDomainSpecificFields(solrRecord, vprRecord);

    log.debug('solr-immunization-xform.transformRecord: Leaving method returning SOLR record: %j', solrRecord);
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
    solrRecord.domain = 'immunization';
    solrXformUtil.setStringArrayFromObjectArrayField(solrRecord, 'comment', vprRecord, 'comments', 'comment');
    solrXformUtil.setStringFromSimple(solrRecord, 'immunization_name', vprRecord, 'name');
    solrXformUtil.setStringFromSimple(solrRecord, 'cpt_code', vprRecord, 'cptCode');
    solrXformUtil.setStringFromSimple(solrRecord, 'cpt_name', vprRecord, 'cptName');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'performer_uid', vprRecord, 'performerUid');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'performer_name', vprRecord, 'performerName');
    solrXformUtil.setStringFromSimple(solrRecord, 'location_uid', vprRecord, 'locationUid');
    solrXformUtil.setStringFromSimple(solrRecord, 'location_name', vprRecord, 'locationName');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'encounter_uid', vprRecord, 'encounterUid');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'encounter_name', vprRecord, 'encounterName');
    solrXformUtil.setStringFromSimple(solrRecord, 'verified', vprRecord, 'verified');
}

module.exports = transformRecord;