'use strict';

require('../../env-setup');

//--------------------------------------------------------------------------------
// This module transforms a VPR Med record into a SOLR Med Record.
//
// @Author: Les Westberg
//---------------------------------------------------------------------------------

var _ = require('underscore');
var solrXformUtil = require(global.VX_UTILS + 'solr-xform/solr-xform-utils');

//--------------------------------------------------------------------------
// Transform the VPR Med record into a SOLR med record.
//
// vprRecord: The record in VPR format.
// log: A logger to use to log messages.
//--------------------------------------------------------------------------
function transformRecord(vprRecord, log) {
    log.debug('solr-med-xform.transformRecord: Entered method.  vprRecord: %j', vprRecord);

    if (!_.isObject(vprRecord)) {
        return null;
    }

    var solrRecord = {};

    solrXformUtil.setCommonFields(solrRecord, vprRecord);
    setDomainSpecificFields(solrRecord, vprRecord);

    log.debug('solr-med-xform.transformRecord: Leaving method returning SOLR record: %j', solrRecord);
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
    solrRecord.domain = 'med';
    solrXformUtil.setStringFromSimple(solrRecord, 'med_sig', vprRecord, 'sig');
    solrXformUtil.setStringFromSimple(solrRecord, 'med_pt_instruct', vprRecord, 'patientInstruction');
    solrXformUtil.setStringFromSimple(solrRecord, 'va_type', vprRecord, 'vaType');
    solrXformUtil.setStringFromSimple(solrRecord, 'type', vprRecord, 'type');
    solrXformUtil.setStringFromSimple(solrRecord, 'name', vprRecord, 'name');
    solrXformUtil.setStringArrayFromObjectArrayField(solrRecord, 'med_ingredient_code', vprRecord, 'products', 'ingredientCode');
    solrXformUtil.setStringArrayFromObjectArrayField(solrRecord, 'med_ingredient_code_name', vprRecord, 'products', 'ingredientCodeName');
    solrXformUtil.setStringArrayFromObjectArrayField(solrRecord, 'med_ingredient_name', vprRecord, 'products', 'ingredientName');
    solrXformUtil.setStringArrayFromObjectArrayField(solrRecord, 'med_ingredient_rxn_code', vprRecord, 'products', 'ingredientRXNCode');
    solrXformUtil.setStringArrayFromObjectArrayField(solrRecord, 'med_drug_class_code', vprRecord, 'products', 'drugClassCode');
    solrXformUtil.setStringArrayFromObjectArrayField(solrRecord, 'med_drug_class_name', vprRecord, 'products', 'drugClassName');
    solrXformUtil.setStringArrayFromObjectArrayField(solrRecord, 'med_supplied_code', vprRecord, 'products', 'suppliedCode');
    solrXformUtil.setStringArrayFromObjectArrayField(solrRecord, 'med_supplied_name', vprRecord, 'products', 'suppliedName');
    solrXformUtil.setStringArrayFromObjectArrayField(solrRecord, 'med_provider', vprRecord, 'orders', 'providerName');
    solrXformUtil.setStringFromSimple(solrRecord, 'last_filled', vprRecord, 'lastFilled');
    solrXformUtil.setStringFromSimple(solrRecord, 'last_admin', vprRecord, 'lastAdmin');
    solrXformUtil.setStringArrayFromObjectArrayArrayField(solrRecord, 'administration_comment', vprRecord, 'administrations', 'comments', 'text');
    solrXformUtil.setStringArrayFromObjectArrayField(solrRecord, 'prn_reason', vprRecord, 'administrations', 'prnReason');
    solrXformUtil.setStringArrayFromObjectArrayField(solrRecord, 'med_indication_code', vprRecord, 'indications', 'code');
    solrXformUtil.setStringArrayFromObjectArrayField(solrRecord, 'med_indication_narrative', vprRecord, 'indications', 'narrative');
    solrXformUtil.setStringFromSimple(solrRecord, 'qualified_name', vprRecord, 'qualifiedName');
    solrXformUtil.setStringFromSimple(solrRecord, 'supply', vprRecord, 'supply');
    solrXformUtil.setSimpleFromSimple(solrRecord, 'rxncodes', vprRecord, 'rxncodes');
    solrXformUtil.setStringFromSimple(solrRecord, 'units', vprRecord, 'units');
}

module.exports = transformRecord;