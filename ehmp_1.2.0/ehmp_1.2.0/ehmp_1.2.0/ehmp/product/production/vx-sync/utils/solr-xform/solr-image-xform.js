'use strict';

require('../../env-setup');

//--------------------------------------------------------------------------------
// This module transforms a VPR image record into a SOLR image Record.
//
// @Author: Les Westberg, J.Vega
//---------------------------------------------------------------------------------

var _ = require('underscore');
var solrXformUtil = require(global.VX_UTILS + 'solr-xform/solr-xform-utils');
var procedureXform = require('./solr-procedure-xform');

//--------------------------------------------------------------------------
// Transform the VPR image record into a SOLR image record.
//
// vprRecord: The record in VPR format.
// log: A logger to use to log messages.
//--------------------------------------------------------------------------
function transformRecord(vprRecord, log) {
    log.debug('solr-image-xform.transformRecord: Entered method.  vprRecord: %j', vprRecord);

    if (!_.isObject(vprRecord)) {
        return null;
    }

    //Same SOLR transformation as Procedure domain
    return procedureXform(vprRecord, log);

    // var solrRecord = {};

    // solrXformUtil.setCommonFields(solrRecord, vprRecord);
    // setDomainSpecificFields(solrRecord, vprRecord);

    // log.debug('solr-image-xform.transformRecord: Leaving method returning SOLR record: %j', solrRecord);
    // if ((_.isObject(solrRecord)) && (!_.isEmpty(solrRecord))) {
    //     return solrRecord;
    // } else {
    //     return null;
    // }
}

//-------------------------------------------------------------------------
// Transform the fields specific to this domain.
//
// solrRecored: The place to put the SOLR fields.
// vprRecord: The record in VPR format.
//-------------------------------------------------------------------------
function setDomainSpecificFields(solrRecord, vprRecord) {
}

module.exports = transformRecord;