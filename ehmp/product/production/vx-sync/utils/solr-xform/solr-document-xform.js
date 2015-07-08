'use strict';

require('../../env-setup');

//--------------------------------------------------------------------------------
// This module transforms a VPR Document record into a SOLR Document Record.
//
// @Author: Les Westberg
//---------------------------------------------------------------------------------

var _ = require('underscore');
var solrXformUtil = require(global.VX_UTILS + 'solr-xform/solr-xform-utils');

//--------------------------------------------------------------------------
// Transform the VPR Document record into a SOLR document record.
//
// vprRecord: The record in VPR format.
// log: A logger to use to log messages.
//--------------------------------------------------------------------------
function transformRecord(vprRecord, log) {
    log.debug('solr-document-xform.transformRecord: Entered method.  vprRecord: %j', vprRecord);

    if (!_.isObject(vprRecord)) {
        return null;
    }

    var solrRecord = {};

    solrXformUtil.setCommonFields(solrRecord, vprRecord);

    try {
        setDomainSpecificFields(solrRecord, vprRecord);
    } catch (e) {
        log.error('solr-document-xform.transformRecord: Exception thrown during setDomainSpecificFields: ' + e);
    }

    log.debug('solr-document-xform.transformRecord: Leaving method returning SOLR record: %j', solrRecord);
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
    solrRecord.domain = 'document';

    //Missing from documents!
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'document_def_uid_vuid', vprRecord, 'documentDefUidVuid');

    solrXformUtil.setStringFromSimple(solrRecord, 'is_interdisciplinary', vprRecord, 'isInterdisciplinary');
    solrXformUtil.setStringFromSimple(solrRecord, 'interdisciplinary_type', vprRecord, 'interdisciplinaryType');
    solrXformUtil.setStringArrayFromObjectArrayField(solrRecord, 'body', vprRecord, 'text', 'content');
    solrXformUtil.setStringFromSimple(solrRecord, 'author_uid', vprRecord, 'authorUid');
    solrXformUtil.setStringFromSimple(solrRecord, 'author_display_name', vprRecord, 'authorDisplayName');
    solrXformUtil.setStringFromSimple(solrRecord, 'signer_uid', vprRecord, 'signerUid');
    solrXformUtil.setStringFromSimple(solrRecord, 'signer_display_name', vprRecord, 'signerDisplayName');

    solrXformUtil.setStringFromSimple(solrRecord, 'signed_date_time', vprRecord, 'signedDateTime');
    solrXformUtil.setStringFromSimple(solrRecord, 'cosigned_date_time', vprRecord, 'cosignedDateTime');

    solrXformUtil.setStringFromSimple(solrRecord, 'cosigner_uid', vprRecord, 'cosignerUid');
    solrXformUtil.setStringFromSimple(solrRecord, 'cosigner_display_name', vprRecord, 'cosignerDisplayName');
    solrXformUtil.setStringFromSimple(solrRecord, 'attending_uid', vprRecord, 'attendingUid');
    solrXformUtil.setStringFromSimple(solrRecord, 'attending_display_name', vprRecord, 'attendingDisplayName');

    solrXformUtil.setStringFromSimple(solrRecord, 'document_type', vprRecord, 'documentTypeName');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'document_type_code', vprRecord, 'documentTypeCode');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'document_type_name', vprRecord, 'documentTypeName');
    solrXformUtil.setStringFromSimple(solrRecord, 'document_class', vprRecord, 'documentClass');
    solrXformUtil.setStringFromSimple(solrRecord, 'document_status', vprRecord, 'status');

    //national title???

    //Manually add document_entered (comes from 'entered', not 'documentEntered')
    //TODO: fix this in solrXformUtil
    solrXformUtil.setStringFromSimple(solrRecord, 'document_entered', vprRecord, 'entered');
    //Erase 'entered' because it will conflict with reference_date_time when SOLR tries to add the 'datetime' field
    delete solrRecord.entered;
    //The 'entered' value would have already been added to datetime_all

    solrXformUtil.setStringFromSimple(solrRecord, 'local_title', vprRecord, 'localTitle');
    solrXformUtil.setStringArrayFromSimple(solrRecord, 'urgency', vprRecord, 'urgency');
    solrXformUtil.setStringFromSimple(solrRecord, 'subject', vprRecord, 'subject');
    solrXformUtil.setStringFromSimple(solrRecord, 'document_def_uid', vprRecord, 'documentDefUid');
}

module.exports = transformRecord;