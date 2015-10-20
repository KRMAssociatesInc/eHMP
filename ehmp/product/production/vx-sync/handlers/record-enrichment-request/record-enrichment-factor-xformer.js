'use strict';

var _ = require('underscore');
var ncUtil = require(global.VX_UTILS + 'namecase-utils');

//--------------------------------------------------------------------------------
// This is a record enrichment transformer for factor data.
//
// @Author:  Les Westberg
//--------------------------------------------------------------------------------


//--------------------------------------------------------------------------------
// This method transfroms and enriches the factor record.
//
// log: The logger to send log messages to.
// config: The configuration information
// environment: The environment handles and context.
// record: The record enrichment object to be processed.
// callback: This is the handler to call when the enrichment transformation is done.
//                  function(error, record)  where:
//                       Error is the error that occurred.
//                       record is the transformed and enriched record.
//--------------------------------------------------------------------------------
function transformAndEnrichRecord(log, config, environment, record, callback) {
	log.debug('record-enrichment-factor-xformer.transformAndEnrichRecord: Entered method.  record: %j', record);

    // Make sure we have something to work with.
    //------------------------------------------
    if (!record) {
        log.warn('record-enrichment-factor-xformer.transformAndEnrichRecord: Job either did not exist or did not contain a record.  record: %j', record);
        return setTimeout(callback, 0, null, null);
    }

    addInMissingFields(record);
    fixFieldDataTypes(record);
    return callback(null, record);

}

function addInMissingFields(record) {

    // record.locationDisplayName
    //----------------
    if(record.locationName !== undefined && record.locationName !== null) {
        record.locationDisplayName = ncUtil.namecase(record.locationName);
    }
}

function fixFieldDataTypes(record) {

    if ((record.entered !== null) && (record.entered !== undefined) && (!_.isString(record.entered))) {
        record.entered = String(record.entered);
    }
    if ((record.localId !== null) && (record.localId !== undefined) && (!_.isString(record.localId))) {
        record.localId = String(record.localId);
    }
    if ((record.facilityCode !== null) && (record.facilityCode !== undefined) && (!_.isString(record.facilityCode))) {
        record.facilityCode = String(record.facilityCode);
    }
    if ((record.lastUpdateTime !== null) && (record.lastUpdateTime !== undefined) && (!_.isString(record.lastUpdateTime))) {
        record.lastUpdateTime = String(record.lastUpdateTime);
    }
    if ((record.stampTime !== null) && (record.stampTime !== undefined) && (!_.isString(record.stampTime))) {
        record.stampTime = String(record.stampTime);
    }
}

module.exports = transformAndEnrichRecord;