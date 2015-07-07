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
// job: The record enrichment job to be processed.
// callback: This is the handler to call when the enrichment transformation is done.
//                  function(error, record)  where:
//                       Error is the error that occurred.
//                       record is the transformed and enriched record.
//--------------------------------------------------------------------------------
function transformAndEnrichRecord(log, config, environment, job, callback) {
	log.debug('record-enrichment-vlerdocument-xformer.transformAndEnrichRecord: Entered method.  job: %j', job);

	// Stub for now...
	//----------------
	return callback(null, job.record);

}

module.exports = transformAndEnrichRecord;