'use strict';

require('../../env-setup');

//--------------------------------------------------------------------------------
// This module transforms a VPR Lab record into a SOLR Lab Record.
//
// @Author: Les Westberg
//---------------------------------------------------------------------------------

var _ = require('underscore');
var solrXformUtil = require(global.VX_UTILS + 'solr-xform/solr-xform-utils');

//--------------------------------------------------------------------------
// Transform the VPR Lab record into a SOLR lab record.
//
// vprRecord: The record in VPR format.
// log: A logger to use to log messages.
//--------------------------------------------------------------------------
function transformRecord(vprRecord, log) {
    log.debug('solr-lab-xform.transformRecord: Entered method.  vprRecord: %j', vprRecord);

    if (!_.isObject(vprRecord)) {
        return null;
    }

    var solrRecord = {};

    solrXformUtil.setCommonFields(solrRecord, vprRecord);
    setDomainSpecificFields(solrRecord, vprRecord);

    log.debug('solr-lab-xform.transformRecord: Leaving method returning SOLR record: %j', solrRecord);
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
    solrRecord.domain = 'result';
    // solrXformUtil.setStringFromSimple(solrRecord, 'datetime', vprRecord, 'resulted');   // Should be picked up auto by SOLR
    solrXformUtil.setStringFromSimple(solrRecord, 'group_name', vprRecord, 'groupName');
    solrXformUtil.setStringFromSimple(solrRecord, 'group_uid', vprRecord, 'groupUid');
    solrXformUtil.setStringFromSimple(solrRecord, 'specimen', vprRecord, 'specimen');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'comment', vprRecord, 'comment');
    solrXformUtil.setStringFromSimple(solrRecord, 'type_code', vprRecord, 'typeCode');
    solrXformUtil.setStringFromSimple(solrRecord, 'display_name', vprRecord, 'displayName');
    solrXformUtil.setStringFromSimple(solrRecord, 'result', vprRecord, 'result');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'result_number', vprRecord, 'resultNumber');
    solrXformUtil.setStringFromSimple(solrRecord, 'units', vprRecord, 'units');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'interpretation_code', vprRecord, 'interpretationCode');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'interpretation', vprRecord, 'interpretationName');
    solrXformUtil.setStringFromSimple(solrRecord, 'low', vprRecord, 'low');
    solrXformUtil.setStringFromSimple(solrRecord, 'high', vprRecord, 'high');
    solrXformUtil.setStringFromSimple(solrRecord, 'method', vprRecord, 'method');
    solrXformUtil.setStringFromSimple(solrRecord, 'body_site', vprRecord, 'bodySite');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'micro', vprRecord, 'micro');
    solrXformUtil.setStringFromSimple(solrRecord, 'qualified_name', vprRecord, 'qualifiedName');
    solrXformUtil.setStringFromSimple(solrRecord, 'lab_result_type', vprRecord, 'typeName');
    // solrXformUtil.setStringFromSimple(solrRecord, 'result_type', vprRecord, 'typeName');  // Should be picked up auto by SOLR
    solrXformUtil.setStringFromValue(solrRecord, 'qualified_name_units', getQualifiedNameUnits(vprRecord));
    solrXformUtil.setSimpleFromSimple(solrRecord, 'lnccodes', vprRecord, 'lnccodes');
    solrXformUtil.setStringFromSimple(solrRecord, 'status_name', vprRecord, 'statusName');
    solrXformUtil.setStringFromSimple(solrRecord, 'status_code', vprRecord, 'statusCode');
    solrXformUtil.setStringFromSimple(solrRecord, 'result_status_name', vprRecord, 'resultStatusName');
    solrXformUtil.setStringFromSimple(solrRecord, 'result_status_code', vprRecord, 'resultStatusCode');
    solrXformUtil.setStringFromSimple(solrRecord, 'category_code', vprRecord, 'categoryCode');
    solrXformUtil.setStringFromSimple(solrRecord, 'category_name', vprRecord, 'categoryName');
    solrXformUtil.setStringFromSimple(solrRecord, 'order_id', vprRecord, 'orderId');
    solrXformUtil.setStringFromSimple(solrRecord, 'lab_order_id', vprRecord, 'labOrderId');
    solrXformUtil.setStringFromSimple(solrRecord, 'encounter_uid', vprRecord, 'encounterUid');
}

//----------------------------------------------------------------------------
// Created the formatted qualifiedNameUnits field from the data in the record.
//
// vprRecord: The record in VPR format.
//----------------------------------------------------------------------------
function getQualifiedNameUnits(vprRecord) {
    var qualifiedNameUnits = '';

    if (_.isString(vprRecord.qualifiedName)) {
        qualifiedNameUnits = vprRecord.qualifiedName;
    }

    if (_.isString(vprRecord.units)) {
        if (qualifiedNameUnits !== '') {
            qualifiedNameUnits += ' ';
        }
        qualifiedNameUnits += vprRecord.units;
    }

    if (qualifiedNameUnits !== '') {
        return qualifiedNameUnits;
    }
    else {
        return null;
    }
}

module.exports = transformRecord;