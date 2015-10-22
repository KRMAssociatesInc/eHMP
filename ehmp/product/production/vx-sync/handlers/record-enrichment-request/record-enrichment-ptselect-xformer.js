'use strict';

//--------------------------------------------------------------------------------
// This is a record enrichment transformer for pt-select data.
//
// @Author:  Les Westberg
//--------------------------------------------------------------------------------

var _ = require('underscore');

var ncUtil = require(global.VX_UTILS + 'namecase-utils');

//--------------------------------------------------------------------------------
// This method transfroms and enriches the pt-select record.
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
	log.debug('record-enrichment-ptselect-xformer.transformAndEnrichRecord: Entered method.  record: %j', record);

	// Make sure we have something to work with.
	//------------------------------------------
	if (!record) {
		log.warn('record-enrichment-ptselect-xformer.transformAndEnrichRecord: Job either did not exist or did not contain a record.  record: %j', record);
		return setTimeout(callback, 0, null, null);
	}

	transformAndEnrichRecordAPI(record);
	log.debug('record-enrichment-ptselect-xformer.transformAndEnrichRecord: transformed record being returned.  record: %j', record);
	return callback(null, record);
}

//--------------------------------------------------------------------------------
// This is an API function that can be called on the record itself.  There are
// places in VxSync where we just want to call this without the overhead of the
// environment parameters.
//
// record: The record to be transformed.  It will be transformed wihtin the object
//         that is passed.
//---------------------------------------------------------------------------------
function transformAndEnrichRecordAPI(record) {
	fixFieldDataTypes(record);
	addInMissingFields(record);
}

//--------------------------------------------------------------------------------
// This adds in the fields that were missing that should not be.
//
// record: The record that is being updated.
//---------------------------------------------------------------------------------
function addInMissingFields(record) {
	// DisplayName
	//------------
	if ((record.displayName === null) || (record.displayName === undefined)) {
		if (_.isString(record.fullName)) {
			record.displayName = ncUtil.namecase(record.fullName);
		}
	}

	// Summary
	//--------
	if (_.isString(record.displayName)) {
		record.summary = record.displayName;
	}

	// last4
	//------
	if ((record.last4 !== null) || (record.last4 !== undefined)) {
		if ((_.isString(record.ssn)) && (record.ssn.length === 9)) {
			record.last4 = record.ssn.substring(5);
		}
	}

	// last5
	//------
	if ((record.last5 !== null) || (record.last5 !== undefined)) {
		if ((_.isString(record.familyName)) && (record.familyName.length > 0)) {
			if ((_.isString(record.ssn)) && (record.ssn.length === 9)) {
				var last4 = record.ssn.substring(5);
				if ((_.isString(last4)) && (last4.length > 0)) {
					record.last5 = record.familyName.substring(0,1).toUpperCase() + last4;
				}
			}
		}
	}

}

//------------------------------------------------------------------------------------
// This method fixes the data type on fields that came in with the wrong data type.
//
// record: The record that is being updated.
//------------------------------------------------------------------------------------
function fixFieldDataTypes(record) {
	if ((record.stampTime !== null) && (record.stampTime !== undefined)) {
		record.stampTime = String(record.stampTime);
	}
	if ((record.birthDate !== null) && (record.birthDate !== undefined)) {
		record.birthDate = String(record.birthDate);
	}
	if ((record.deceased !== null) && (record.deceased !== undefined)) {
		record.deceased = String(record.deceased);
	}
	if ((record.localId !== null) && (record.localId !== undefined)) {
		record.localId = String(record.localId);
	}
	if ((record.ssn !== null) && (record.ssn !== undefined)) {
		record.ssn = String(record.ssn);
	}
	if ((record.last4 !== null) && (record.last4 !== undefined)) {
		record.last4 = String(record.last4);
	}
	if ((record.last5 !== null) && (record.last5 !== undefined)) {
		record.last5 = String(record.last5);
	}
}

module.exports = transformAndEnrichRecord;
module.exports.transformAndEnrichRecordAPI = transformAndEnrichRecordAPI;