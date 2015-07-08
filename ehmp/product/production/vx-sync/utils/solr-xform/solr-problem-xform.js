'use strict';

require('../../env-setup');

//--------------------------------------------------------------------------------
// This module transforms a VPR Problem record into a SOLR Problem Record.
//
// @Author: Les Westberg
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
// solrRecord: The place to put the SOLR fields.
// vprRecord: The record in VPR format.
//-------------------------------------------------------------------------
function setDomainSpecificFields(solrRecord, vprRecord) {
    solrRecord.domain = 'problem';
    solrXformUtil.setStringFromSimple(solrRecord, 'location_name', vprRecord, 'locationName');
    solrXformUtil.setStringFromSimple(solrRecord, 'service', vprRecord, 'service');
    solrXformUtil.setStringFromSimple(solrRecord, 'problem_text', vprRecord, 'problemText');
    solrXformUtil.setStringFromSimple(solrRecord, 'problem_status', vprRecord, 'statusDisplayName');
    solrXformUtil.setStringFromSimple(solrRecord, 'acuity_name', vprRecord, 'acuityName');
    solrXformUtil.setStringFromSimple(solrRecord, 'removed', vprRecord, 'removed'); //converts removed from boolean to string
    solrXformUtil.setStringArrayFromObjectArrayField(solrRecord, 'comment', vprRecord, 'comments', 'comment');
    solrXformUtil.setStringFromSimple(solrRecord, 'icd_code', vprRecord, 'icdCode');
    solrXformUtil.setStringFromSimple(solrRecord, 'icd_name', vprRecord, 'icdName');
    solrXformUtil.setStringFromSimple(solrRecord, 'icd_group', vprRecord, 'icdGroup');
    solrXformUtil.setStringFromSimple(solrRecord, 'provider_name', vprRecord, 'providerName');
    solrXformUtil.setStringFromSimple(solrRecord, 'provider_uid', vprRecord, 'providerUid');
}

module.exports = transformRecord;