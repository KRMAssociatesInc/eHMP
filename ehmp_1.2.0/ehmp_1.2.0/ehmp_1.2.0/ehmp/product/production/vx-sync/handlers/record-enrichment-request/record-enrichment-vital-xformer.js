'use strict';

//--------------------------------------------------------------------------------
// This is a record enrichment transformer for vital data.
//
// @Author:  Les Westberg
//--------------------------------------------------------------------------------

var _ = require('underscore');

var recEnrichXformerUtil = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-xformer-utils');
var xformerApptRecEnrichment = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-appointment-xformer');		// Encounter == appointment

//--------------------------------------------------------------------------------
// This method transfroms and enriches the vital record.
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
	log.debug('record-enrichment-vital-xformer.transformAndEnrichRecord: Entered method.  job: %j', job);

	// Make sure we have something to work with.
	//------------------------------------------
	if ((!job) || (!job.record)) {
		log.warn('record-enrichment-vital-xformer.transformAndEnrichRecord: Job either did not exist or did not contain a record.  job: %j', job);
		return setTimeout(callback, 0, null, null);
	}

	var terminologyUtils;
	if (environment.terminologyUtils) {
		terminologyUtils = environment.terminologyUtils;
	} else {
		terminologyUtils = require(global.VX_SUBSYSTEMS + 'terminology/terminology-utils');
	}

	var record = job.record;

	// If encounter exists - lets fix it up first...
	// Encounter  (Note that Encounter === Appointment data type)
	//------------------------------------------------------------
	if ((record.encounter !== null) && (record.encounter !== undefined)) {
		xformerApptRecEnrichment.transformAndEnrichRecordAPI(record.encounter);
	}

	// If organizer/encounter exists - lets fix it up next...
	// One more note about organizer.   The EHMP version contains a recurive data
	// structure where Vitals contains an organizer and organizer contains a list
	// of vitals.   It appears to be back pointers between the parent and the child
	// structures.  We do not see any examples of data showing in this way so we are
	// not going to follow the recursive path of this structure.
	//----------------------------------------------------------------------------------
	if ((record.organizer !== null) && (record.organizer !== undefined) && (record.organizer.encounter !== null) && (record.organizer.encounter !== undefined)) {
		xformerApptRecEnrichment.transformAndEnrichRecordAPI(record.organizer.encounter);
	}

	fixFieldDataTypes(record);
	addInMissingFields(record);
	addTerminologyCodeTranslations(record, log, terminologyUtils, function(error, recordWithTerminologyCodes) {
		log.debug('record-enrichment-vital-xformer.transformAndEnrichRecord: Returning error: %s recordWithTerminologyCodes: %j', error, recordWithTerminologyCodes);
		return callback(error, recordWithTerminologyCodes);
	});
}

//--------------------------------------------------------------------------------
// This adds in the fields that were missing that should not be.
//
// record: The record that is being updated.
//---------------------------------------------------------------------------------
function addInMissingFields(record) {

	// Kind
	//------
	record.kind = 'Vital Sign';

	// Summary
	//--------
	var summary = '';
	if (_.isString(record.typeName)) {
		summary = record.typeName;
	}
	if (_.isString(record.result)) {
		summary += ' ' + record.result;
	}
	if (_.isString(record.interpretationCode)) {
		summary += ' ' + record.interpretationCode;
	}
	if (_.isString(record.units)) {
		summary += ' ' + record.units;
	}
	record.summary = summary;

	// Qualified Name
	//---------------
	record.qualifiedName = record.typeName;

	// Patient Generated Data Flag
	//----------------------------
	record.patientGeneratedDataFlag = false;
	if (_.isString(record.locationCode)) {
		record.patientGeneratedDataFlag = (record.locationCode === 'PGD');
	}

	// Organizer
	//-----------
	if ((record.organizer !== null) && (record.organizer !== undefined)) {
		record.organizer.kind = 'Vital Sign Organizer';

		record.organizer.summary = recEnrichXformerUtil.getSummary('VitalSignOrganizer', record.organizer);
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
	if ((record.observed !== null) && (record.observed !== undefined)) {
		record.observed = String(record.observed);
	}
	if ((record.resulted !== null) && (record.resulted !== undefined)) {
		record.resulted = String(record.resulted);
	}
	if ((record.localId !== null) && (record.localId !== undefined)) {
		record.localId = String(record.localId);
	}
	if ((record.facilityCode !== null) && (record.facilityCode !== undefined)) {
		record.facilityCode = String(record.facilityCode);
	}
	if ((record.result !== null) && (record.result !== undefined)) {
		record.result = String(record.result);
	}
	if ((record.units !== null) && (record.units !== undefined)) {
		record.units = String(record.units);
	}
	if ((record.metricResult !== null) && (record.metricResult !== undefined)) {
		record.metricResult = String(record.metricResult);
	}
	if ((record.metricUnits !== null) && (record.metricUnits !== undefined)) {
		record.metricUnits = String(record.metricUnits);
	}
	if ((record.low !== null) && (record.low !== undefined)) {
		record.low = String(record.low);
	}
	if ((record.high !== null) && (record.high !== undefined)) {
		record.high = String(record.high);
	}

	// Organizer
	//----------
	if ((record.organizer !== null) && (record.organizer !== undefined)) {
		var organizer = record.organizer;
		if ((organizer.observed !== null) && (organizer.observed !== undefined)) {
			organizer.observed = String(organizer.observed);
		}
		if ((organizer.resulted !== null) && (organizer.resulted !== undefined)) {
			organizer.resulted = String(organizer.resulted);
		}
		if ((organizer.localId !== null) && (organizer.localId !== undefined)) {
			organizer.localId = String(organizer.localId);
		}
		if ((organizer.facilityCode !== null) && (organizer.facilityCode !== undefined)) {
			organizer.facilityCode = String(organizer.facilityCode);
		}
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
	log.debug('record-enrichment-vital-xformer.addTerminologyCodeTranslations: Entered method: record: %j', record);

	if (recEnrichXformerUtil.recordContainsCode(terminologyUtils.CODE_SYSTEMS.CODE_SYSTEM_LOINC, record)) {
		log.debug('record-enrichment-vital-xformer.addTerminologyCodeTranslations: Record already contains this terminology code: CodeSystem: %s; record: %j', terminologyUtils.CODE_SYSTEMS.CODE_SYSTEM_LOINC, record);
		return callback(null, record);
	}

	var mappingType;
	var sourceCode;
	var doMapping = false;

	if (isVaVitals(record)) {
		mappingType = 'VitalsVuidToLoinc';
		sourceCode = getVitalsVuid(record);
		log.debug('record-enrichment-vital-xformer.addTerminologyCodeTranslations: Vitals Event is a VA vitals.  vuid: %s', sourceCode);
		doMapping = true;
	} else if (isDodVitals(record)) {
		mappingType = 'VitalsDODNcidToLoinc';
		sourceCode = getVitalsDodNcid(record, terminologyUtils);
		log.debug('record-enrichment-vital-xformer.addTerminologyCodeTranslations: Vitals Event is a DOD vitals.  chcsIen: %s', sourceCode);
		doMapping = true;
	} else {
		log.debug('record-enrichment-vital-xformer.addTerminologyCodeTranslations: Vitals Event is NOT a VA or DOD vitals  No terminology lookup will be done.');
	}

	if (doMapping) {
		terminologyUtils.getJlvMappedCode(mappingType, sourceCode, function(error, jlvMappedCode) {
			log.debug('record-enrichment-vital-xformer.addTerminologyCodeTranslations: Returned from getJlvMappedCode() error: %s; jlvMappedCode: %j', error, jlvMappedCode);

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
// Returns true if this is a DoD vitals.  False if it is not.
//
// record: The vitals data event.
// returns: True if this is a DoD vitals.
//------------------------------------------------------------------------------------------
function isDodVitals(record) {
	return ((_.isString(record.uid)) && (record.uid.indexOf(':DOD:') >= 0));
}


//---------------------------------------------------------------------------------------
// Get the vitals DoD NCID from the record if it exists.
//
// record: The vitals data event.
// terminologyUtils: The utility to use for accessing terminologies.
// returns: The vitals DOD NCID if it exists in the record.
//---------------------------------------------------------------------------------------
function getVitalsDodNcid(record, terminologyUtils) {
	if (_.isEmpty(record.codes)) {
		return null;
	}

	var vitalsDodNcidCode = _.find(record.codes, function(code) {
		return ((code.system === terminologyUtils.CODE_SYSTEMS.SYSTEM_DOD_NCID) &&
			(code.code));
	});

	if (vitalsDodNcidCode) {
		return vitalsDodNcidCode.code;
	} else {
		return null;
	}
}


//---------------------------------------------------------------------------------------
// Get the vitals VUID from the record if it exists.
//
// record: The vitals data event.
// returns: The vitals VUID if it exists in the record.
//---------------------------------------------------------------------------------------
function getVitalsVuid(record) {
	if (_.isString(record.typeCode)) {
		return recEnrichXformerUtil.stripUrnFromVuid(record.typeCode);
	}
	return null;
}

//------------------------------------------------------------------------------------------
// Returns true if this is a VA vitals.  False if it is not.
//
// record: The vitals data event.
// returns: True if this is a VA vitals.
//------------------------------------------------------------------------------------------
function isVaVitals(record) {
	return (!isDodVitals(record));
}


module.exports = transformAndEnrichRecord;