'use strict';

require('../../env-setup');

//--------------------------------------------------------------------------------
// This module transforms a VPR Visit record into a SOLR Visit Record.
//
// @Author: Les Westberg
//---------------------------------------------------------------------------------

var _ = require('underscore');
var solrAppoinmentXform = require(global.VX_UTILS + 'solr-xform/solr-appointment-xform');

//--------------------------------------------------------------------------
// Transform the VPR Visit record into a SOLR visit record.
//
// vprRecord: The record in VPR format.
// log: A logger to use to log messages.
//--------------------------------------------------------------------------
function transformRecord(vprRecord, log) {
    log.debug('solr-visit-xform.transformRecord: Entered method.  vprRecord: %j', vprRecord);

    if (!_.isObject(vprRecord)) {
        return null;
    }

    var solrRecord = {};

    // A visit - is identical in structure to appointment.
    //----------------------------------------------------
    solrRecord = solrAppoinmentXform(vprRecord, log);

    log.debug('solr-visit-xform.transformRecord: Leaving method returning SOLR record: %j', solrRecord);
    if ((_.isObject(solrRecord)) && (!_.isEmpty(solrRecord))) {
        return solrRecord;
    } else {
        return null;
    }
}

module.exports = transformRecord;