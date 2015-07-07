'use strict';

require('../../env-setup');

//--------------------------------------------------------------------------
// This module transforms a VPR Allergy record into a SOLR Allergy Record.
//
// @Author: Les Westberg
//--------------------------------------------------------------------------

var _ = require('underscore');
var solrXformUtil = require(global.VX_UTILS + 'solr-xform/solr-xform-utils');

//--------------------------------------------------------------------------
// Transform the VPR Allergy record into a SOLR allergy record.
//
// vprRecord: The record in VPR format.
// log: A logger to use to log messages.
//--------------------------------------------------------------------------
function transformRecord(vprRecord, log) {
    log.debug('solr-allergy-xform.transformRecord: Entered method.  vprRecord: %j', vprRecord);

    if (!_.isObject(vprRecord)) {
        return null;
    }

    var solrRecord = {};

    solrXformUtil.setCommonFields(solrRecord, vprRecord);
    setDomainSpecificFields(solrRecord, vprRecord);

    log.debug('solr-allergy-xform.transformRecord: Leaving method returning SOLR record: %j', solrRecord);
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
    solrRecord.domain = 'allergy';
    solrXformUtil.setStringFromSimple(solrRecord, 'datetime', vprRecord, 'entered');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'originator_name', vprRecord, 'originatorName');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'verifier_name', vprRecord, 'verifierName');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'mechanism', vprRecord, 'mechanism');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'type_name', vprRecord, 'typeName');
    solrXformUtil.setStringFromSimple(solrRecord, 'allergy_severity', vprRecord, 'severityName');
    solrXformUtil.setStringFromSimple(solrRecord, 'entered_by_uid', vprRecord, 'enteredByUid');
    solrXformUtil.setStringFromSimple(solrRecord, 'verified_by_uid', vprRecord, 'verifiedByUid');
    solrXformUtil.setStringFromSimple(solrRecord, 'severity_name', vprRecord, 'severityName');
    solrXformUtil.setStringFromSimple(solrRecord, 'verified', vprRecord, 'verified');
    solrXformUtil.setStringArrayFromObjectArrayField(solrRecord, 'allergy_product', vprRecord, 'products', 'name');
    solrXformUtil.setStringArrayFromObjectArrayField(solrRecord, 'allergy_reaction', vprRecord, 'reactions', 'name');
    solrXformUtil.setStringArrayFromObjectArrayField(solrRecord, 'drug_class', vprRecord, 'drugClasses', 'name');
    solrXformUtil.setStringArrayFromObjectArrayField(solrRecord, 'comment', vprRecord, 'comments', 'comment');
    solrXformUtil.setStringArrayFromObjectArrayField(solrRecord, 'observation', vprRecord, 'observations', 'severity');
}

module.exports = transformRecord;