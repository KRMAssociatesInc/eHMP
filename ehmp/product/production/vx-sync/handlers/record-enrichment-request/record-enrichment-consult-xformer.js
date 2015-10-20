'use strict';

//--------------------------------------------------------------------------------
// This is a record enrichment transformer for consult data.
//
// @Author:  Les Westberg
//--------------------------------------------------------------------------------

var _ = require('underscore');
var recEnrichXformerUtil = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-xformer-utils');
var ncUtil = require(global.VX_UTILS + 'namecase-utils');

//--------------------------------------------------------------------------------
// This method transfroms and enriches the consult record.
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
	log.debug('record-enrichment-consult-xformer.transformAndEnrichRecord: Entered method.  record: %j', record);

	// Make sure we have something to work with.
	//------------------------------------------
	if (!record) {
		log.warn('record-enrichment-consult-xformer.transformAndEnrichRecord: Job either did not exist or did not contain a record.  record: %j', record);
		return setTimeout(callback, 0, null, null);
	}

	addInMissingFields(record);
	fixFieldDataTypes(record);

	log.debug('record-enrichment-consult-xformer.transformAndEnrichRecord: Returning record: %j', record);

	return callback(null, record);
}

//--------------------------------------------------------------------------------
// This adds in the fields that were missing that should not be.
//
// record: The record that is being updated.
//---------------------------------------------------------------------------------
function addInMissingFields(record) {

	// Providers
	//----------
	if (!_.isEmpty(record.providers)) {
		_.each(record.providers, function(provider) {
			if (provider.providerUid) {
				provider.uid = provider.providerUid;
			}
			if ((!provider.providerDisplayName) && (provider.providerName)) {
				provider.providerDisplayName = ncUtil.namecase(provider.providerName);
			}
			provider.summary = recEnrichXformerUtil.getSummary('ProcedureProvider', provider);
		});
	}

	// Provider UID
	//-------------
	var provider = null;
	if (!record.providerUid) {
		if (!_.isEmpty(record.providers)) {
			provider = _.first(record.providers);
			if ((provider) && (provider.uid)) {
				record.providerUid = provider.uid;
			}
		}
	}

	// Provider Name
	//--------------
	provider = null;
	if (!record.providerName) {
		if (!_.isEmpty(record.providers)) {
			provider = _.first(record.providers);
			if ((provider) && (provider.providerName)) {
				record.providerName = provider.providerName;
			}
		}
	}

	// Provider Display Name
	//----------------------
	if ((!record.providerDisplayName) && (record.providerName)) {
		record.providerDisplayName = ncUtil.namecase(record.providerName);
	}

	// Results
	//---------
	if (!_.isEmpty(record.results)) {
		_.each(record.results, function(result) {
			result.summary = recEnrichXformerUtil.getSummary('ProcedureResult', result);
		});
	}

	// Modifiers
	//----------
	if (!_.isEmpty(record.modifiers)) {
		_.each(record.modifiers, function(modifier) {
			modifier.summary = recEnrichXformerUtil.getSummary('Modifier', modifier);
		});
	}

	// Kind
	//------
	if (!record.kind) {
		if (record.category === 'C') {
			record.kind = 'Consult';
		}
		else if (record.category === 'RA') {
			record.kind = 'Imaging';
		}
		else {
			record.kind = 'Procedure';
		}
	}

	// Summary
	//--------
	if (record.typeName) {
		record.summary = record.typeName;
	} else {
		record.summary = '';
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
	if ((record.lastUpdateTime !== null) && (record.lastUpdateTime !== undefined)) {
		record.lastUpdateTime = String(record.lastUpdateTime);
	}
	if ((record.earliestDate !== null) && (record.earliestDate !== undefined)) {
		record.earliestDate = String(record.earliestDate);
	}
	if ((record.dateTime !== null) && (record.dateTime !== undefined)) {
		record.dateTime = String(record.dateTime);
	}
	if ((record.localId !== null) && (record.localId !== undefined)) {
		record.localId = String(record.localId);
	}
	if ((record.facilityCode !== null) && (record.facilityCode !== undefined)) {
		record.facilityCode = String(record.facilityCode);
	}
}

module.exports = transformAndEnrichRecord;