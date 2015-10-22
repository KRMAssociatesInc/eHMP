'use strict';

//--------------------------------------------------------------------------------
// This is a record enrichment transformer for vlerdocument data.
//
// @Author:  Sonny Kim
//--------------------------------------------------------------------------------


//--------------------------------------------------------------------------------
// This method transforms and enriches the vlerdocument record.
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
	log.debug('record-enrichment-vlerdocument-xformer.transformAndEnrichRecord: Entered method.  record: %j', record);

	// Stub for now...
	//----------------
	return callback(null, record);

}

module.exports = transformAndEnrichRecord;