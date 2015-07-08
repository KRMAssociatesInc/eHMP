'use strict';

require('../../env-setup');

//--------------------------------------------------------------------------------
// This module transforms a VPR Order record into a SOLR Order Record.
//
// @Author: Les Westberg
//---------------------------------------------------------------------------------

var _ = require('underscore');
var solrXformUtil = require(global.VX_UTILS + 'solr-xform/solr-xform-utils');

//--------------------------------------------------------------------------
// Transform the VPR Order record into a SOLR order record.
//
// vprRecord: The record in VPR format.
// log: A logger to use to log messages.
//--------------------------------------------------------------------------
function transformRecord(vprRecord, log) {
    log.debug('solr-order-xform.transformRecord: Entered method.  vprRecord: %j', vprRecord);

    if (!_.isObject(vprRecord)) {
        return null;
    }

    var solrRecord = {};

    solrXformUtil.setCommonFields(solrRecord, vprRecord);
    setDomainSpecificFields(solrRecord, vprRecord);

    log.debug('solr-order-xform.transformRecord: Leaving method returning SOLR record: %j', solrRecord);
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
    solrRecord.domain = 'order';

    // Note that "entered" cannot be passed on - it will cause SOLR to get conflicting times for datetime field.
    // so we need to remove it from the solrRecord if it was put there by the commonFields code.
    //-----------------------------------------------------------------------------------------------------------
    solrRecord.entered = undefined;

    solrXformUtil.setStringFromSimple(solrRecord, 'name', vprRecord, 'name');
    solrXformUtil.setStringFromSimple(solrRecord, 'order_name', vprRecord, 'name');
    solrXformUtil.setStringFromSimple(solrRecord, 'oi_code', vprRecord, 'oiCode');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'oi_name', vprRecord, 'oiName');
    solrXformUtil.setStringFromSimple(solrRecord, 'oi_package_ref', vprRecord, 'oiPackageRef');
    solrXformUtil.setStringFromSimple(solrRecord, 'content', vprRecord, 'content');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'start', vprRecord, 'start');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'display_group', vprRecord, 'displayGroup');
    solrXformUtil.setStringFromSimple(solrRecord, 'order_group_va', vprRecord, 'displayGroup');
    solrXformUtil.setStringFromSimple(solrRecord, 'status_name', vprRecord, 'statusName');
    solrXformUtil.setStringFromSimple(solrRecord, 'order_status_va', vprRecord, 'statusName');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'provider_display_name', vprRecord, 'providerDisplayName');
    solrXformUtil.setStringFromSimple(solrRecord, 'service', vprRecord, 'service');
    solrXformUtil.setStringFromSimple(solrRecord, 'location_uid', vprRecord, 'locationUid');
}

module.exports = transformRecord;