'use strict';

//--------------------------------------------------------------------------------
// This is a record enrichment transformer for allergy data.
//
// @Author:  Les Westberg
//--------------------------------------------------------------------------------

var _ = require('underscore');

var recEnrichXformerUtil = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-xformer-utils');

//--------------------------------------------------------------------------------
// This method transfroms and enriches the allergy record.
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
	log.debug('record-enrichment-allergy-xformer.transformAndEnrichRecord: Entered method.  record: %j', record);

	// Make sure we have something to work with.
	//------------------------------------------
	if (!record) {
		log.warn('record-enrichment-allergy-xformer.transformAndEnrichRecord: Job either did not exist or did not contain a record.  record: %j', record);
		return setTimeout(callback, 0, null, null);
	}

	var terminologyUtils = environment.terminologyUtils;

	fixFieldDataTypes(record);
	addInMissingFields(record);
	addTerminologyCodeTranslations(record, log, terminologyUtils, function(error, recordWithTerminologyCodes) {
		log.debug('record-enrichment-allergy-xformer.transformAndEnrichRecord: Returning error: %s recordWithTerminologyCodes: %j', error, recordWithTerminologyCodes);
		return callback(error, recordWithTerminologyCodes);
	});
}

//--------------------------------------------------------------------------------
// This adds in the fields that were missing that should not be.
//
// record: The record that is being updated.
//---------------------------------------------------------------------------------
function addInMissingFields(record) {

	record.kind = 'Allergy/Adverse Reaction';

	// product.summary
	//----------------
	if (!_.isEmpty(record.products)) {
		_.each(record.products, function(product) {
			product.summary = recEnrichXformerUtil.getSummary('AllergyProduct', product);
		});
	}

	// reaction.summary
	//-----------------
	if (!_.isEmpty(record.reactions)) {
		_.each(record.reactions, function(reaction) {
			reaction.summary = recEnrichXformerUtil.getSummary('AllergyReaction', reaction);
		});
	}

	// drugClass.summary
	//------------------
	if (!_.isEmpty(record.drugClasses)) {
		_.each(record.drugClasses, function(drugClass) {
			drugClass.summary = recEnrichXformerUtil.getSummary('AllergyDrugClass', drugClass);
		});
	}

	// comments
	//-----------
	if (!_.isEmpty(record.comments)) {
		_.each(record.comments, function(comment) {
			comment.summary = recEnrichXformerUtil.getSummary('AllergyComment', comment);
		});
	}

	// observations
	//--------------
	if (!_.isEmpty(record.observations)) {
		_.each(record.observations, function(observation) {
			observation.summary = recEnrichXformerUtil.getSummary('AllergyObservation', observation);
		});
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
	if ((record.entered !== null) && (record.entered !== undefined)) {
		record.entered = String(record.entered);
	}
	if ((record.verified !== null) && (record.verified !== undefined)) {
		record.verified = String(record.verified);
	}
	if ((record.localId !== null) && (record.localId !== undefined)) {
		record.localId = String(record.localId);
	}
	if ((record.facilityCode !== null) && (record.facilityCode !== undefined)) {
		record.facilityCode = String(record.facilityCode);
	}

	// Comments
	//-----------------
	if (!_.isEmpty(record.comments)) {
		_.each(record.comments, function(comment) {
			if ((comment.entered !== null) && (comment.entered !== undefined)) {
				comment.entered = String(comment.entered);
			}
		});
	}

	// Observations
	//-------------
	if (!_.isEmpty(record.observations)) {
		_.each(record.observations, function(observation) {
			if ((observation.date !== null) && (observation.date !== undefined)) {
				observation.date = String(observation.date);
			}
		});
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
	log.debug('record-enrichment-allergy-xformer.addTerminologyCodeTranslations: Entered method: record: %j', record);

	if (recEnrichXformerUtil.recordContainsCode(terminologyUtils.CODE_SYSTEMS.CODE_SYSTEM_UMLS_CUI, record)) {
		log.debug('record-enrichment-allergy-xformer.addTerminologyCodeTranslations: Record already contains this terminology code: CodeSystem: %s; record: %j', terminologyUtils.CODE_SYSTEMS.CODE_SYSTEM_UMLS_CU, record);
		return callback(null, record);
	}

	var mappingType;
	var sourceCode;
	var doMapping = false;

	if (isVaAllergy(record)) {
		mappingType = 'AllergyVUIDtoUMLSCui';
		sourceCode = getAllergyVuid(record);
		log.debug('record-enrichment-allergy-xformer.addTerminologyCodeTranslations: Allergy Event is a VA allergy.  vuid: %s', sourceCode);
		doMapping = true;
	} else if (isDodAllergy(record, terminologyUtils)) {
		mappingType = 'AllergyCHCSIenToUMLSCui';
		sourceCode = getAllergyChcsIen(record, terminologyUtils);
		log.debug('record-enrichment-allergy-xformer.addTerminologyCodeTranslations: Allergy Event is a DOD allergy.  chcsIen: %s', sourceCode);
		doMapping = true;
	} else {
		log.debug('record-enrichment-allergy-xformer.addTerminologyCodeTranslations: Allergy Event is NOT a VA or DOD allergy  No terminology lookup will be done.');
	}

	if (doMapping) {
		terminologyUtils.getJlvMappedCode(mappingType, sourceCode, function(error, jlvMappedCode) {
			log.debug('record-enrichment-allergy-xformer.addTerminologyCodeTranslations: Returned from getJlvMappedCode() error: %s; jlvMappedCode: %j', error, jlvMappedCode);

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

//------------------------------------------------------------------------------------------
// Returns true if this is a DoD allergy.  False if it is not.
//
// record: The allergy data event.
// terminologyUtils: The utility to use for accessing terminologies.
// returns: True if this is a DoD allergy.
//------------------------------------------------------------------------------------------
function isDodAllergy(record, terminologyUtils) {
	if (getAllergyChcsIen(record, terminologyUtils)) {
		return true;
	}

	return false;
}


//---------------------------------------------------------------------------------------
// Get the allergy CHCS IEN from the record if it exists.
//
// record: The allergy data event.
// terminologyUtils: The utility to use for accessing terminologies.
// returns: The allergy CHCS IEN if it exists in the record.
//---------------------------------------------------------------------------------------
function getAllergyChcsIen(record, terminologyUtils) {
	if (_.isEmpty(record.codes)) {
		return null;
	}

	var chcsIenCode = _.find(record.codes, function(code) {
		if ((code.system === terminologyUtils.CODE_SYSTEMS.SYSTEM_DOD_ALLERGY_IEN) &&
			(code.code)) {
			return true;
		} else {
			return false;
		}
	});

	if (chcsIenCode) {
		return chcsIenCode.code;
	} else {
		return null;
	}
}


//---------------------------------------------------------------------------------------
// Get the allergy VUID from the record if it exists.
//
// record: The allergy data event.
// returns: The allergy VUID if it exists in the record.
//---------------------------------------------------------------------------------------
function getAllergyVuid(record) {
	var productWithVuid = _.find(record.products, function(product) {
		if ((product.vuid !== null) && (product.vuid !== undefined)) {
			return true;
		} else {
			return false;
		}
	});

	if (productWithVuid) {
		return recEnrichXformerUtil.stripUrnFromVuid(productWithVuid.vuid);
	} else {
		return null;
	}
}

//------------------------------------------------------------------------------------------
// Returns true if this is a VA allergy.  False if it is not.
//
// record: The allergy data event.
// returns: True if this is a VA allergy.
//------------------------------------------------------------------------------------------
function isVaAllergy(record) {
	if (getAllergyVuid(record)) {
		return true;
	}

	return false;
}


module.exports = transformAndEnrichRecord;