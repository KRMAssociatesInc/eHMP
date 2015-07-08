'use strict';

require('../../env-setup');

//--------------------------------------------------------------------------------
// This module transforms a VPR Pov record into a SOLR Pov Record.
//
// @Author: Les Westberg, J.Vega
//---------------------------------------------------------------------------------

var _ = require('underscore');
var solrXformUtil = require(global.VX_UTILS + 'solr-xform/solr-xform-utils');

//--------------------------------------------------------------------------
// Transform the VPR Pov record into a SOLR pov record.
//
// vprRecord: The record in VPR format.
// log: A logger to use to log messages.
//--------------------------------------------------------------------------
function transformRecord(vprRecord, log) {
    log.debug('solr-pov-xform.transformRecord: Entered method.  vprRecord: %j', vprRecord);

    if (!_.isObject(vprRecord)) {
        return null;
    }

    var solrRecord = {};

    solrXformUtil.setCommonFields(solrRecord, vprRecord);
    setDomainSpecificFields(solrRecord, vprRecord);

    log.debug('solr-pov-xform.transformRecord: Leaving method returning SOLR record: %j', solrRecord);
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
    solrRecord.domain = 'pov';
    solrXformUtil.setStringFromSimple(solrRecord, 'icd_code', vprRecord, 'icdCode');
    solrXformUtil.setStringFromSimple(solrRecord, 'type', vprRecord, 'type');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'name', vprRecord, 'name');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'local_id', vprRecord, 'localId');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'encounter_uid', vprRecord, 'encounterUid');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'encounter_name', vprRecord, 'encounterName');
    solrXformUtil.setStringFromSimple(solrRecord, 'location_name', vprRecord, 'locationName');
    solrXformUtil.setStringFromSimple(solrRecord, 'location_uid', vprRecord, 'locationUid');
}

module.exports = transformRecord;