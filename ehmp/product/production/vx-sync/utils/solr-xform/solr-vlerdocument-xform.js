'use strict';

require('../../env-setup');

//--------------------------------------------------------------------------------
// This module transforms a VPR vlerdocument record into a SOLR vlerdocument Record.
//
// @Author: Les Westberg
//---------------------------------------------------------------------------------

var _ = require('underscore');
var solrXformUtil = require(global.VX_UTILS + 'solr-xform/solr-xform-utils');

//--------------------------------------------------------------------------
// Transform the VPR vlerdocument record into a SOLR vlerdocument record.
//
// vprRecord: The record in VPR format.
// log: A logger to use to log messages.
//--------------------------------------------------------------------------
function transformRecord(vprRecord, log) {
    log.debug('solr-vlerdocument-xform.transformRecord: Entered method.  vprRecord: %j', vprRecord);

    if (!_.isObject(vprRecord)) {
        return null;
    }

    var solrRecord = {};

    solrXformUtil.setCommonFields(solrRecord, vprRecord);
    setDomainSpecificFields(solrRecord, vprRecord);

    log.debug('solr-vlerdocument-xform.transformRecord: Leaving method returning SOLR record: %j', solrRecord);
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
    solrRecord.domain = 'vlerdocument';
    solrXformUtil.setStringFromSimple(solrRecord, 'creation_time', vprRecord, 'creationTime');
    solrXformUtil.addStringFromSimple(solrRecord, 'datetime_all', vprRecord, 'creationTime');
    solrXformUtil.setStringFromSimple(solrRecord, 'datetime', vprRecord, 'creationTime');
    solrXformUtil.setStringFromSimple(solrRecord, 'name', vprRecord, 'name');
    solrXformUtil.setStringArrayFromObjectArrayFields(solrRecord, 'section', vprRecord, 'sections', 'title', 'text', ' ');
    solrXformUtil.setStringFromSimple(solrRecord, 'document_unique_id', vprRecord, 'documentUniqueId');
    solrXformUtil.setStringFromSimple(solrRecord, 'home_community_id', vprRecord, 'homeCommunityId');
    solrXformUtil.setStringFromSimple(solrRecord, 'repository_unique_id', vprRecord, 'repositoryUniqueId');
    solrXformUtil.setStringFromSimple(solrRecord, 'source_patient_id', vprRecord, 'sourcePatientId');
}

module.exports = transformRecord;