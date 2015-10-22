'use strict';

//--------------------------------------------------------------------------------
// This is a record enrichment transformer for pov data.
//
// @Author:  Les Westberg
//--------------------------------------------------------------------------------

var recEnrichXformerUtil = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-xformer-utils');

//--------------------------------------------------------------------------------
// This method transfroms and enriches the pov record.
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
    log.debug('record-enrichment-pov-xformer.transformAndEnrichRecord: Entered method.  record: %j', record);

    // Make sure we have something to work with.
    //------------------------------------------
    if (!record) {
        log.warn('record-enrichment-pov-xformer.transformAndEnrichRecord: Job either did not exist or did not contain a record.  record: %j', record);
        return setTimeout(callback, 0, null, null);
    }

    fixFieldDataTypes(record);
    addMissingFields(record);

    log.debug('record-enrichment-pov-xformer.transformAndEnrichRecord: Transformation complete. record: %j', record);
    return callback(null, record);

}

function fixFieldDataTypes(record) {
    if (record.entered) {
        record.entered = String(record.entered);
    }
    if (record.facilityCode) {
        record.facilityCode = String(record.facilityCode);
    }
    if (record.localId) {
        record.localId = String(record.localId);
    }
    if (record.lastUpdateTime) {
        record.lastUpdateTime = String(record.lastUpdateTime);
    }
    if (record.stampTime) {
        record.stampTime = String(record.stampTime);
    }
}

function addMissingFields(record) {
    record.summary = recEnrichXformerUtil.getSummary('PurposeOfVisit', record);
}

module.exports = transformAndEnrichRecord;