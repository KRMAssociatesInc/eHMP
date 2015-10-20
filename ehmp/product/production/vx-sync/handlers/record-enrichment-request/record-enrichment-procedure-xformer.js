'use strict';

//--------------------------------------------------------------------------------
// This is a record enrichment transformer for procedure data.
//
// @Author:  Les Westberg
//--------------------------------------------------------------------------------

var _ = require('underscore');

var recEnrichXformerUtil = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-xformer-utils');
var ncUtil = require(global.VX_UTILS + 'namecase-utils');

//--------------------------------------------------------------------------------
// This method transfroms and enriches the procedure record.
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
	log.debug('record-enrichment-procedure-xformer.transformAndEnrichRecord: Entered method.  record: %j', record);

	// Make sure we have something to work with.
	//------------------------------------------
	if (!record) {
		log.warn('record-enrichment-procedure-xformer.transformAndEnrichRecord: Job either did not exist or did not contain a record.  record: %j', record);
		return setTimeout(callback, 0, null, null);
	}

	var terminologyUtils;
	if (environment.terminologyUtils) {
		terminologyUtils = environment.terminologyUtils;
	} else {
		terminologyUtils = require(global.VX_SUBSYSTEMS + 'terminology/terminology-utils');
	}

	transformAndEnrichRecordAPI(record);
	log.debug('record-enrichment-procedure-xformer.transformAndEnrichRecord: transformed record being returned.  record: %j', record);
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

	addInMissingProvidersFields(record.providers);
	addInMissingResultsFields(record.results);
	addInMissingLinksFields(record.links);
	addInMissingModifiersFields(record.modifiers);
	addInMissingRootFields(record);
}

//------------------------------------------------------------------------------------
// Add in the missing modifier level fields.
//
// modifierList: The record modifiers being udpated.
//------------------------------------------------------------------------------------
function addInMissingModifiersFields(modifierList) {
	if (!_.isEmpty(modifierList)) {
		_.each(modifierList, function(modifier){
			modifier.summary = recEnrichXformerUtil.getSummary('Modifier', modifier);
		});
	}
}

//------------------------------------------------------------------------------------
// Add in the missing link level fields.
//
// linkList: The record links being udpated.
//------------------------------------------------------------------------------------
function addInMissingLinksFields(linkList) {
	if (!_.isEmpty(linkList)) {
		_.each(linkList, function(link){
			link.summary = recEnrichXformerUtil.getSummary('ProcedureLink', link);
		});
	}
}

//------------------------------------------------------------------------------------
// Add in the missing result level fields.
//
// resultList: The record results being udpated.
//------------------------------------------------------------------------------------
function addInMissingResultsFields(resultList) {
	if (!_.isEmpty(resultList)) {
		_.each(resultList, function(result){
			result.summary = recEnrichXformerUtil.getSummary('ProcedureResult', result);
		});
	}
}

//------------------------------------------------------------------------------------
// Add in the missing provider level fields.
//
// providerList: The record providers being udpated.
//------------------------------------------------------------------------------------
function addInMissingProvidersFields(providerList) {
	if (!_.isEmpty(providerList)) {
		_.each(providerList, function(provider){
			if (_.isString(provider.providerUid)) {
				provider.uid = provider.providerUid;
			}

			if (!_.isString(provider.providerDisplayName)) {
				provider.providerDisplayName = ncUtil.namecase(provider.providerName);
			}

			provider.summary = recEnrichXformerUtil.getSummary('ProcedureProvider', provider);
		});
	}
}


//------------------------------------------------------------------------------------
// Add in the missing root level fields.
//
// record: The record being udpated.
//------------------------------------------------------------------------------------
function addInMissingRootFields(record) {

	var firstProvider = null;
	if (!_.isEmpty(record.providers)) {
		firstProvider = record.providers[0];
	}

	// providerUid
	//------------
	if ((!_.isString(record.providerUid)) && (firstProvider) && (_.isString(firstProvider.uid))) {
		record.providerUid = firstProvider.uid;
	}

	// providerName
	//--------------
	if ((!_.isString(record.providerName)) && (firstProvider) && (_.isString(firstProvider.providerName))) {
		record.providerName = firstProvider.providerName;
	}

	// providerDisplayName
	//--------------------
	if ((!_.isString(record.providerDisplayName)) && (firstProvider) && (_.isString(firstProvider.providerName))) {
		record.providerDisplayName = ncUtil.namecase(firstProvider.providerName);
	}

	// Kind
	//-----
	if ((!_.isString(record.kind)) || (_.isEmpty(record.kind))) {
		if (record.category === 'C') {
			record.kind = 'Consult';
		} else if (record.category === 'RA') {
			record.kind = 'Imaging';
		} else {
			record.kind = 'Procedure';
		}
	}

	// Summary
	//--------
	if (_.isString(record.typeName)) {
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
	if ((record.dateTime !== null) && (record.dateTime !== undefined)) {
		record.dateTime = String(record.dateTime);
	}
	if ((record.earliestDate !== null) && (record.earliestDate !== undefined)) {
		record.earliestDate = String(record.earliestDate);
	}
	if ((record.localId !== null) && (record.localId !== undefined)) {
		record.localId = String(record.localId);
	}
	if ((record.facilityCode !== null) && (record.facilityCode !== undefined)) {
		record.facilityCode = String(record.facilityCode);
	}

	// Modifiers
	//-----------
	if (!_.isEmpty(record.modifiers)) {
		_.each(record.modifiers, function(modifier) {
			if ((modifier.code !== null) && (modifier.code !== undefined)) {
				modifier.code = String(modifier.code);
			}
		});
	}
}


module.exports = transformAndEnrichRecord;
module.exports.transformAndEnrichRecordAPI = transformAndEnrichRecordAPI;