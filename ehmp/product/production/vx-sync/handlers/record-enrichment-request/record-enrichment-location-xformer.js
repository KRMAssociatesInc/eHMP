'use strict';

//--------------------------------------------------------------------------------
// This is a record enrichment transformer for operational location data.
//
// @Author:  Les Westberg
//--------------------------------------------------------------------------------

var _ = require('underscore');

var recEnrichXformerUtil = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-xformer-utils');
var ncUtil = require(global.VX_UTILS + 'namecase-utils');

var typeNameMap = {
    'C': 'Clinic',
    'M': 'Module',
    'W': 'Ward',
    'Z': 'Other Location',
    'N': 'Non-Clinic Stop',
    'F': 'File Area',
    'I': 'Imaging',
    'OR': 'Operating Room'
};

//--------------------------------------------------------------------------------
// This method transfroms and enriches the operational location record.
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
	log.debug('record-enrichment-location-xformer.transformAndEnrichRecord: Entered method.  record: %j', record);

	// Make sure we have something to work with.
	//------------------------------------------
	if (!record) {
		log.warn('record-enrichment-location-xformer.transformAndEnrichRecord: Job either did not exist or did not contain a record.  record: %j', record);
		return setTimeout(callback, 0, null, null);
	}

	transformAndEnrichRecordAPI(record);
	log.debug('record-enrichment-location-xformer.transformAndEnrichRecord: transformed record being returned.  record: %j', record);
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
	if (_.isString(record.name)) {
		record.displayName = ncUtil.namecase(record.name);
	}

	// Summary
	//--------
	record.summary = recEnrichXformerUtil.getSummary('Location', record);

	// TypeName
	//---------
	if ((record.typeName === null) || (record.typeName === undefined)  || (_.isEmpty(record.typeName))) {
		if (_.isString(record.type)) {
			record.typeName = typeNameMap[record.type];
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
	if ((record.localId !== null) && (record.localId !== undefined)) {
		record.localId = String(record.localId);
	}
	if ((record.refId !== null) && (record.refId !== undefined)) {
		record.refId = String(record.refId);
	}
	if ((record.type !== null) && (record.type !== undefined)) {
		record.type = String(record.type);
	}
	if ((record.facilityCode !== null) && (record.facilityCode !== undefined)) {
		record.facilityCode = String(record.facilityCode);
	}
}

module.exports = transformAndEnrichRecord;
module.exports.transformAndEnrichRecordAPI = transformAndEnrichRecordAPI;