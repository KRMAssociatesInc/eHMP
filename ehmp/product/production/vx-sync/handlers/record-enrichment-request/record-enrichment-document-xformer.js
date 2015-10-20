'use strict';

//--------------------------------------------------------------------------------
// This is a record enrichment transformer for document data.
//
// @Author:  Les Westberg
//--------------------------------------------------------------------------------

var _ = require('underscore');
var recEnrichXformerUtil = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-xformer-utils');
var ncUtil = require(global.VX_UTILS + 'namecase-utils');

//--------------------------------------------------------------------------------
// This method transfroms and enriches the document record.
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
	log.debug('record-enrichment-document-xformer.transformAndEnrichRecord: Entered method.  record: %j', record);

	// Make sure we have something to work with.
	//------------------------------------------
	if (!record) {
		log.warn('record-enrichment-document-xformer.transformAndEnrichRecord: Job either did not exist or did not contain a record.  record: %j', record);
		return setTimeout(callback, 0, null, null);
	}

	var terminologyUtils;
	if (environment.terminologyUtils) {
		terminologyUtils = environment.terminologyUtils;
	} else {
		terminologyUtils = require(global.VX_SUBSYSTEMS + 'terminology/terminology-utils');
	}

	fixFieldDataTypes(record);			// Since we are going to be copying objects around - lets fix the types before we copy them.
	addInMissingFields(record);
	addTerminologyCodeTranslations(record, log, terminologyUtils, function(error, recordWithTerminologyCodes) {
		log.debug('record-enrichment-document-xformer.transformAndEnrichRecord: Returning error: %s recordWithTerminologyCodes: %j', error, recordWithTerminologyCodes);
		return callback(error, recordWithTerminologyCodes);
	});
}

//------------------------------------------------------------------------------------------------
// This function adds in any of the items in the record.text that are missing.
//
// record: The record that is being updated.
//------------------------------------------------------------------------------------------------
function addInMissingTextFields(record) {
	var authorClinician = null;
	var cosignerClinician = null;
	var signerClinician = null;
	var attendingClinician = null;

	// Fix any fields in the text objects that need to be fixed.
	//----------------------------------------------------------
	if (!_.isEmpty(record.text)) {
		_.each(record.text, function(textItem) {
			// Clinician Information  - This needs to be done first - the Info will be used to fill in the info below...
			//----------------------------------------------------------------------------------------------------------
			if (!_.isEmpty(textItem.clinicians)) {
				_.each(textItem.clinicians, function(clinician) {
					if ((!clinician.displayName) && (clinician.name)) {
						clinician.displayName = ncUtil.namecase(clinician.name);
					}
					clinician.summary = recEnrichXformerUtil.getSummary('DocumentClinician', clinician);
				});
			}

			// Set up all the document text attributes
			//----------------------------------------
			textItem.summary = recEnrichXformerUtil.getSummary('DocumentText', textItem);

			// Author
			//-------
			authorClinician = null;
			authorClinician = getClinicianForRoleFromClinicians(textItem.clinicians, recEnrichXformerUtil.CLINICIAN_ROLE.AUTHOR_DICTATOR);
			if (authorClinician) {
				if (authorClinician.uid) {
					textItem.authorUid = authorClinician.uid;
				}
				if (authorClinician.name) {
					textItem.author = authorClinician.name;
				}
				if (authorClinician.displayName) {
					textItem.authorDisplayName = authorClinician.displayName;
				}
			}

			// CoSigner
			//---------
			cosignerClinician = null;
			cosignerClinician = getClinicianForRoleFromClinicians(textItem.clinicians, recEnrichXformerUtil.CLINICIAN_ROLE.COSIGNER);
			if (cosignerClinician) {
				if (cosignerClinician.uid) {
					textItem.cosignerUid = cosignerClinician.uid;
				}
				if (cosignerClinician.name) {
					textItem.cosigner = cosignerClinician.name;
				}
				if (cosignerClinician.displayName) {
					textItem.cosignerDisplayName = cosignerClinician.displayName;
				}
			}

			// Signer
			//---------
			signerClinician = null;
			signerClinician = getClinicianForRoleFromClinicians(textItem.clinicians, recEnrichXformerUtil.CLINICIAN_ROLE.SIGNER);
			if (signerClinician) {
				if (signerClinician.uid) {
					textItem.signerUid = signerClinician.uid;
				}
				if (signerClinician.name) {
					textItem.signer = signerClinician.name;
				}
				if (signerClinician.displayName) {
					textItem.signerDisplayName = signerClinician.displayName;
				}
			}

			// Attending
			//----------
			attendingClinician = null;
			attendingClinician = getClinicianForRoleFromClinicians(textItem.clinicians, recEnrichXformerUtil.CLINICIAN_ROLE.ATTENDING_PHYSICIAN);
			if (attendingClinician) {
				if (attendingClinician.uid) {
					textItem.attendingUid = attendingClinician.uid;
				}
				if (attendingClinician.name) {
					textItem.attending = attendingClinician.name;
				}
				if (attendingClinician.displayName) {
					textItem.attendingDisplayName = attendingClinician.displayName;
				}
			}
		});
	}
}

//------------------------------------------------------------------------------------------------
// This function adds in the items in the record.clinicians field.  It gets these by copying the
// clinicians from each record.text entry.
//
// record: The record that is being updated.
//------------------------------------------------------------------------------------------------
function addInClinicians(record) {
	record.clinicians = [];
	if (!_.isEmpty(record.text)) {
		_.each(record.text, function(textItem) {
			if ((textItem.uid === record.uid) && (!_.isEmpty(textItem.clinicians))) {
				record.clinicians = record.clinicians.concat(textItem.clinicians);
			}
		});
	}
}

//--------------------------------------------------------------------------------
// This adds in the fields that were missing that should not be.
//
// record: The record that is being updated.
//---------------------------------------------------------------------------------
function addInMissingFields(record) {

	addInMissingTextFields(record);

	// isInterdisciplinary
	//-------------------
	if (record.localTitle) {
		if (record.localTitle.toLowerCase().indexOf('interdisciplinary') >= 0) {
			record.isInterdisciplinary = 'true';
		} else {
			record.isInterdisciplinary = 'false';
		}
	}

	// interdisciplinaryType
	//-----------------------
	if (record.isInterdisciplinary === 'true') {
		if (record.parentUid) {
			record.interdisciplinaryType = 'child';
		} else {
			record.interdisciplinaryType = 'parent';
		}
	}

	// Author
	//-------
	var authorClinician = getClinicianForRoleFromText(record.text, recEnrichXformerUtil.CLINICIAN_ROLE.AUTHOR_DICTATOR);
	if (authorClinician) {
		if ((!record.author) && (authorClinician.name)) {
			record.author = authorClinician.name;
		}
		if ((!record.authorUid) && (authorClinician.uid)) {
			record.authorUid = authorClinician.uid;
		}
		if ((!record.authorDisplayName) && (authorClinician.displayName)) {
			record.authorDisplayName = authorClinician.displayName;
		}
	}

	// Signer
	//-------
	var signerClinician = getClinicianForRoleFromText(record.text, recEnrichXformerUtil.CLINICIAN_ROLE.SIGNER);
	if (signerClinician) {
		if ((!record.signer) && (signerClinician.name)) {
			record.signer = signerClinician.name;
		}
		if ((!record.signerUid) && (signerClinician.uid)) {
			record.signerUid = signerClinician.uid;
		}
		if ((!record.signerDisplayName) && (signerClinician.displayName)) {
			record.signerDisplayName = signerClinician.displayName;
		}
		if ((!record.signedDateTime) && (signerClinician.signedDateTime)) {
			record.signedDateTime = signerClinician.signedDateTime;
		}
	}

	// CoSigner
	//-------
	var cosignerClinician = getClinicianForRoleFromText(record.text, recEnrichXformerUtil.CLINICIAN_ROLE.COSIGNER);
	if (cosignerClinician) {
		if ((!record.cosigner) && (cosignerClinician.name)) {
			record.cosigner = cosignerClinician.name;
		}
		if ((!record.cosignerUid) && (cosignerClinician.uid)) {
			record.cosignerUid = cosignerClinician.uid;
		}
		if ((!record.cosignerDisplayName) && (cosignerClinician.displayName)) {
			record.cosignerDisplayName = cosignerClinician.displayName;
		}
		if ((!record.cosignedDateTime) && (cosignerClinician.signedDateTime)) {
			record.cosignedDateTime = cosignerClinician.signedDateTime;
		}
	}

	// Attending
	//-----------
	var attendingClinician = getClinicianForRoleFromText(record.text, recEnrichXformerUtil.CLINICIAN_ROLE.ATTENDING_PHYSICIAN);
	if (attendingClinician) {
		if ((!record.attending) && (attendingClinician.name)) {
			record.attending = attendingClinician.name;
		}
		if ((!record.attendingUid) && (attendingClinician.uid)) {
			record.attendingUid = attendingClinician.uid;
		}
		if ((!record.attendingDisplayName) && (attendingClinician.displayName)) {
			record.attendingDisplayName = attendingClinician.displayName;
		}
	}

	// Summary
	//--------
	if (record.localTitle) {
		record.summary = record.localTitle;
	}

	// Kind
	//------
	if (record.documentTypeName) {
		record.kind = record.documentTypeName;
	}

	// Status Display Name
	//---------------------
	if ((!record.statusDisplayName) && (record.status)) {
		record.statusDisplayName = ncUtil.namecase(record.status);
	}

	// Clinicians
	// Pull all clinicians in each text of the text array and place them also at the
	// document level.
	//-------------------------------------------------------------------------------
	addInClinicians(record);

	if (!record.codes) {
		record.codes = [];
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
	if ((record.cosignedDateTime !== null) && (record.cosignedDateTime !== undefined)) {
		record.cosignedDateTime = String(record.cosignedDateTime);
	}
	if ((record.signedDateTime !== null) && (record.signedDateTime !== undefined)) {
		record.signedDateTime = String(record.signedDateTime);
	}
	if ((record.entered !== null) && (record.entered !== undefined)) {
		record.entered = String(record.entered);
	}
	if ((record.referenceDateTime !== null) && (record.referenceDateTime !== undefined)) {
		record.referenceDateTime = String(record.referenceDateTime);
	}
	if ((record.localId !== null) && (record.localId !== undefined)) {
		record.localId = String(record.localId);
	}
	if ((record.facilityCode !== null) && (record.facilityCode !== undefined)) {
		record.facilityCode = String(record.facilityCode);
	}

	// Fix items in DocumentText
	//--------------------------
	if (!_.isEmpty(record.text)) {
		_.each(record.text, function(textItem) {
			if ((textItem.dateTime !== null) && (textItem.dateTime !== undefined)) {
				textItem.dateTime = String(textItem.dateTime);
			}

			if ((textItem.enteredDateTime !== null) && (textItem.enteredDateTime !== undefined)) {
				textItem.enteredDateTime = String(textItem.enteredDateTime);
			}

			// Need to fix the times in the clinicians too...
			//------------------------------------------------
			if (!_.isEmpty(textItem.clinicians)) {
				_.each(textItem.clinicians, function(clinician) {
					if ((clinician.signedDateTime !== null) && (clinician.signedDateTime !== undefined)) {
						clinician.signedDateTime = String(clinician.signedDateTime);
					}
				});
			}
		});
	}

	// Current assumption - childDocs is not used.  If it is, then we need to make sure all of the times, etc in childDocs is fixed up.
	//---------------------------------------------------------------------------------------------------------------------------------
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
	log.debug('record-enrichment-document-xformer.addTerminologyCodeTranslations: Entered method: record: %j', record);

	if (recEnrichXformerUtil.recordContainsCode(terminologyUtils.CODE_SYSTEMS.CODE_SYSTEM_LOINC, record)) {
		log.debug('record-enrichment-document-xformer.addTerminologyCodeTranslations: Record already contains this terminology code: CodeSystem: %s; record: %j', terminologyUtils.CODE_SYSTEMS.CODE_SYSTEM_LOINC, record);
		return callback(null, record);
	}

	var mappingType;
	var sourceCode;

	if (isVaResult(record)) {
		mappingType = 'NotesVuidToLoinc';
		sourceCode = getDocumentVuid(record);
		log.debug('record-enrichment-document-xformer.addTerminologyCodeTranslations: Event is a VA document.  vuid: %s; mappingType: %s', sourceCode, mappingType);

		terminologyUtils.getJlvMappedCodeList(mappingType, sourceCode, function(error, jlvMappedCodeList) {
			log.debug('record-enrichment-document-xformer.addTerminologyCodeTranslations: Returned from getJlvMappedCodeList() error: %s; jlvMappedCodeList: %j', error, jlvMappedCodeList);

			if (!_.isEmpty(jlvMappedCodeList)) {
				var jdsCodeList = _.map(jlvMappedCodeList, function(jlvMappedCode) {
					return recEnrichXformerUtil.convertMappedCodeToJdsCode(jlvMappedCode);
				});
				if (!_.isEmpty(jdsCodeList)) {
					jdsCodeList = _.filter(jdsCodeList, function(jdsCode) {
						if (jdsCode) {
							return true;
						}
						return false;
					});
				}

				if (!_.isEmpty(jdsCodeList)) {
					record.codes = record.codes.concat(jdsCodeList);
				}
			}

			return callback(error, record);
		});
	} else if (isDodResult(record, terminologyUtils)) {
		mappingType = 'NotesDodNcidToLoinc';
		sourceCode = getNoteDodNcid(record, terminologyUtils);
		log.debug('record-enrichment-document-xformer.addTerminologyCodeTranslations: Event is a DOD document.  noteDodNcid: %s; mappingType: %s', sourceCode, mappingType);
		terminologyUtils.getJlvMappedCode(mappingType, sourceCode, function(error, jlvMappedCode) {
			log.debug('record-enrichment-document-xformer.addTerminologyCodeTranslations: Returned from getJlvMappedCode() error: %s; jlvMappedCode: %j', error, jlvMappedCode);

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
		log.debug('record-enrichment-document-xformer.addTerminologyCodeTranslations: Event is NOT a VA or DOD document  No terminology lookup will be done.');
		return callback(null, record);
	}
}

//------------------------------------------------------------------------------------------
// Returns true if this is a DoD document.  False if it is not.
//
// record: The data event.
// returns: True if this is a DoD document.
//------------------------------------------------------------------------------------------
function isDodResult(record, terminologyUtils) {
	if((record.uid) && (record.uid.indexOf(':DOD:') >= 0) && getNoteDodNcid(record, terminologyUtils)) {
		return true;
	}
	return false;
}


//---------------------------------------------------------------------------------------
// Get the note DOD NCID from the record if it exists.
//
// record: The data event.
// terminologyUtils: The utility to use for accessing terminologies.
// returns: The note DOD NCID if it exists in the record.
//---------------------------------------------------------------------------------------
function getNoteDodNcid(record, terminologyUtils) {
	if (_.isEmpty(record.codes)) {
		return null;
	}

	var noteDodNcidCode = _.find(record.codes, function(code) {
		if ((code.system === terminologyUtils.CODE_SYSTEMS.SYSTEM_DOD_NCID) &&
			(code.code)) {
			return true;
		} else {
			return false;
		}
	});

	if (noteDodNcidCode) {
		return noteDodNcidCode.code;
	} else {
		return null;
	}
}


//---------------------------------------------------------------------------------------
// Get the document VUID from the record if it exists.
//
// record: The data event.
// returns: The document VUID if it exists in the record.
//---------------------------------------------------------------------------------------
function getDocumentVuid(record) {
	if ((record.nationalTitle) && (record.nationalTitle.vuid)) {
		return recEnrichXformerUtil.stripUrnFromVuid(record.nationalTitle.vuid);
	}
	return null;
}

//------------------------------------------------------------------------------------------
// Returns true if this is a VA document.  False if it is not.
//
// record: The data event.
// returns: True if this is a VA document.
//------------------------------------------------------------------------------------------
function isVaResult(record) {
    return !!getDocumentVuid(record);
	//return (!isDodResult(record));
}

//------------------------------------------------------------------------------------------
// Find the first place in the text array where there is a clinician with the given role
// and return that clinician.
//
// record: The record to look in.
// role: The role to look for.
// returns: The first clinician found that matches the role we want.
//------------------------------------------------------------------------------------------
function getClinicianForRoleFromText(text, role) {
	if (_.isEmpty(text)) {
		return null;
	}

	var textWithFoundRole = _.find(text, function(textItem) {
		if (getClinicianForRoleFromClinicians(textItem.clinicians, role)) {
			return true;
		}
		return false;
	});

	var clinician = null;
	if (textWithFoundRole) {
		clinician = getClinicianForRoleFromClinicians(textWithFoundRole.clinicians, role);
	}
	return clinician;
}

//-------------------------------------------------------------------------------------------
// This function returns the first clinician found in the array that is for the specified
// role.
//
// clinicians: The array of clinician.
// role: The role we are looking for.
// returns: The first clinician record found that has a role matching the one we want.
//-------------------------------------------------------------------------------------------
function getClinicianForRoleFromClinicians(clinicians, role) {
	if (_.isEmpty(clinicians)) {
		return null;
	}

	var clinician = _.findWhere(clinicians, {
		role: role
	});
	return clinician;
}


module.exports = transformAndEnrichRecord;