'use strict';

require('../../env-setup');

//--------------------------------------------------------------------------------
// This module transforms a VPR Factor record into a SOLR Factor Record.
//
// @Author: Les Westberg
//---------------------------------------------------------------------------------

var _ = require('underscore');
var solrXformUtil = require(global.VX_UTILS + 'solr-xform/solr-xform-utils');

//--------------------------------------------------------------------------
// Transform the VPR Factor record into a SOLR factor record.
//
// vprRecord: The record in VPR format.
// log: A logger to use to log messages.
//--------------------------------------------------------------------------
function transformRecord(vprRecord, log) {
    log.debug('solr-factor-xform.transformRecord: Entered method.  vprRecord: %j', vprRecord);

    if (!_.isObject(vprRecord)) {
        return null;
    }

    var solrRecord = {};

    solrXformUtil.setCommonFields(solrRecord, vprRecord);
    setDomainSpecificFields(solrRecord, vprRecord);

    log.debug('solr-factor-xform.transformRecord: Leaving method returning SOLR record: %j', solrRecord);
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
    solrRecord.domain='factor';
    solrXformUtil.setStringFromSimple(solrRecord, 'health_factor_name', vprRecord, 'name');
    solrXformUtil.setStringFromSimple(solrRecord, 'health_factor_date_time', vprRecord, 'entered');
    delete solrRecord.entered; //Will conflict with health_factor_date_time when SOLR copies values into datetime
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'encounter_name', vprRecord, 'encounterName');
    solrXformUtil.setStringFromSimple(solrRecord, 'location_name', vprRecord, 'locationName');
    solrXformUtil.setStringFromSimple(solrRecord, 'location_display_name', vprRecord, 'locationDisplayName');
    solrXformUtil.setStringFromSimple(solrRecord, 'category_name', vprRecord, 'categoryName');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'display', vprRecord, 'display');
}

module.exports = transformRecord;