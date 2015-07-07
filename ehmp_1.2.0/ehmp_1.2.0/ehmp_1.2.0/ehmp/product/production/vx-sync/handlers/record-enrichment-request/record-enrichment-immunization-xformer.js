'use strict';

//--------------------------------------------------------------------------------
// This is a record enrichment transformer for immunization data.
//
// @Author:  Les Westberg
//--------------------------------------------------------------------------------

var _ = require('underscore');
var recEnrichXformerUtil = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-xformer-utils');
var ncUtil = require(global.VX_UTILS + 'namecase-utils');

//--------------------------------------------------------------------------------
// This method transfroms and enriches the immunization record.
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
	log.debug('record-enrichment-immunization-xformer.transformAndEnrichRecord: Entered method.  job: %j', job);

	// Make sure we have something to work with.
	//------------------------------------------
	if ((!job) || (!job.record)) {
		log.warn('record-enrichment-immunization-xformer.transformAndEnrichRecord: Job either did not exist or did not contain a record.  job: %j', job);
		return setTimeout(callback, 0, null, null);
	}

	var terminologyUtils;
	if (environment.terminologyUtils) {
		terminologyUtils = environment.terminologyUtils;
	} else {
		terminologyUtils = require(global.VX_SUBSYSTEMS + 'terminology/terminology-utils');
	}

	var record = job.record;

	fixFieldDataTypes(record);			// Since we are going to be copying objects around - lets fix the types before we copy them.
	addInMissingFields(record);
	addTerminologyCodeTranslations(record, log, terminologyUtils, function(error, recordWithTerminologyCodes) {
		log.debug('record-enrichment-immunzation-xformer.transformAndEnrichRecord: Returning error: %s recordWithTerminologyCodes: %j', error, recordWithTerminologyCodes);
		return callback(error, recordWithTerminologyCodes);
	});
}

//--------------------------------------------------------------------------------
// This adds in the fields that were missing that should not be.
//
// record: The record that is being updated.
//---------------------------------------------------------------------------------
function addInMissingFields(record) {
	// Summary
	//--------
	if (record.name) {
		record.summary = record.name;
	}

	// Kind
	//------
	record.kind = 'Immunization';

	// Codes
	//-------
	if (!record.codes) {
		record.codes = [];
	}

	// Performer
	//----------
	if (record.performer) {
		//Performer DisplayName
		//---------------------
		if ((!record.performer.displayName) && (record.performer.name)) {
			record.performer.displayName = ncUtil.namecase(record.performer.name);
		}

		// Performer Summary
		//------------------
		record.performer.summary = recEnrichXformerUtil.getSummary('Clinician', record.performer);
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
	if ((record.administeredDateTime !== null) && (record.administeredDateTime !== undefined)) {
		record.administeredDateTime = String(record.administeredDateTime);
	}
	if ((record.localId !== null) && (record.localId !== undefined)) {
		record.localId = String(record.localId);
	}
	if ((record.facilityCode !== null) && (record.facilityCode !== undefined)) {
		record.facilityCode = String(record.facilityCode);
	}
}

//------------------------------------------------------------------------------------
// This method does any terminology mapping lookups and inserts the codes it receives
// into the record.
//
// record: The record that is being updated.
// log: The logger to use for log messages.
// terminologyUtils: The utility to use for accessing terminologies.
// callback: The handler to call when the record has been updated with terminology
//           content.  Signature:
//           function(error, recordWithTerminologyCodes) where:
//               error: Is the error if one occurs
//               recordWithTerminologyCodes: Is the record with the terminology codes
//                                           added.
//------------------------------------------------------------------------------------
function addTerminologyCodeTranslations(record, log, terminologyUtils, callback) {
	log.debug('record-enrichment-immunization-xformer.addTerminologyCodeTranslations: Entered method: record: %j', record);

	if (recEnrichXformerUtil.recordContainsCode(terminologyUtils.CODE_SYSTEMS.CODE_SYSTEM_CVX, record)) {
		log.debug('record-enrichment-immunization-xformer.addTerminologyCodeTranslations: Record already contains this terminology code: CodeSystem: %s; record: %j', terminologyUtils.CODE_SYSTEMS.CODE_SYSTEM_CVX, record);
		return callback(null, record);
	}

	var mappingType;
	var sourceCode;
	var doMapping = false;

	if (isVAImmunization(record)) {
		mappingType = 'ImmunizationCptToCvx';
		sourceCode = getImmunizationCptCode(record);
		log.debug('record-enrichment-immunization-xformer.addTerminologyCodeTranslations: Immunization Event is a VA event.  vuid: %s', sourceCode);
		doMapping = true;
	} else {
		log.debug('record-enrichment-immunization-xformer.addTerminologyCodeTranslations: Immunization Event is NOT a VA event  No terminology lookup will be done.');
	}

	if (doMapping) {
		terminologyUtils.getJlvMappedCode(mappingType, sourceCode, function(error, jlvMappedCode) {
			log.debug('record-enrichment-immunization-xformer.addTerminologyCodeTranslations: Returned from getJlvMappedCode() error: %s; jlvMappedCode: %j', error, jlvMappedCode);

			if (jlvMappedCode) {
				var jdsCode = recEnrichXformerUtil.convertMappedCodeToJdsCode(jlvMappedCode);
				if (jdsCode) {
					if (_.isEmpty(record.codes)) {
						record.codes = [jdsCode];
					} else {
						record.codes = record.codes.concat(jdsCode);
					}
				}
			}

			return callback(error, record);
		});
	} else {
		return callback(null, record);
	}
}

//---------------------------------------------------------------------------------------
// Get the immunization CPR code from the record if it exists.
//
// record: The data event.
// returns: The immunization CPR code if it exists in the record.
//---------------------------------------------------------------------------------------
function getImmunizationCptCode(record) {
	if (record.cptCode) {
		return stripUrnFromCpt(record.cptCode);
	}
	return null;
}

//-----------------------------------------------------------------------------------
// This routine strips off the prefix of a cpt urn if it exists.
//
// cptUrn: The urn for the CPT
// returns: The vuid without the urn wrapper.
//-----------------------------------------------------------------------------------
function stripUrnFromCpt (cptUrn) {
	var returnValue = cptUrn;

	if ((cptUrn) && (cptUrn.indexOf('urn:cpt:') === 0)) {
		returnValue = cptUrn.substring('urn:cpt:'.length);
	}

	return returnValue;
}

//------------------------------------------------------------------------------------------
// Returns true if this is a VA immunization.  False if it is not.
//
// record: The data event.
// returns: True if this is a VA immunization.
//------------------------------------------------------------------------------------------
function isVAImmunization(record) {
	if (record.cptCode) {
		return true;
	}

	return false;
}

module.exports = transformAndEnrichRecord;