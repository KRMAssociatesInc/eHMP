'use strict';

//--------------------------------------------------------------------------------
// This is a record enrichment transformer for patient data.
//
// @Author:  Les Westberg
//--------------------------------------------------------------------------------

var _ = require('underscore');

var recEnrichXformerUtil = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-xformer-utils');
var ncUtil = require(global.VX_UTILS + 'namecase-utils');

//--------------------------------------------------------------------------------
// This method transfroms and enriches the patient record.
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
	log.debug('record-enrichment-patient-xformer.transformAndEnrichRecord: Entered method.  record: %j', record);

	// Make sure we have something to work with.
	//------------------------------------------
	if (!record) {
		log.warn('record-enrichment-patient-xformer.transformAndEnrichRecord: Job either did not exist or did not contain a record.  record: %j', record);
		return setTimeout(callback, 0, null, null);
	}

	transformAndEnrichRecordAPI(record);
	log.debug('record-enrichment-patient-xformer.transformAndEnrichRecord: transformed record being returned.  record: %j', record);
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

	addInMissingRootFields(record);
	addInMissingAliasFields(record.alias);
	addInMissingAddressFields(record.address);
	addInMissingDisabilityFields(record.disability);
	addInMissingFacilityFields(record.facility);
	addInMissingPatientRecordFlagFields(record.patientRecordFlag);
	addInMissingTelecomFields(record.telecom);
	addInMissingLanguageFields(record.language);
	addInMissingEthnicityFields(record.ethnicity);
	addInMissingRaceFields(record.race);
	addInMissingExposureFields(record.exposure);
	addInMissingContactFields(record.contact);
	addInMissingScConditionFields(record.scCondition);
	addInMissingInsuranceFields(record.insurance);

}

//-----------------------------------------------------------------------------------
// Add in the missing insurance fields that were missing that should not be.
//
// aliasList: The list of insurance objects to be updated.
//-----------------------------------------------------------------------------------
function addInMissingInsuranceFields(insuranceList) {
	if (!_.isEmpty(insuranceList)) {
		_.each(insuranceList, function(insurance){
			// EHMP code had this - but - it was not what was actually storing
			//insurance.summary = recEnrichXformerUtil.getSummary('PatientInsurance', insurance);
			var summary = '';
			if (_.isString(insurance.companyName)) {
				summary = insurance.companyName;
			}

			if (_.isString(insurance.policyType)) {
				summary += ' (' + insurance.policyType + ')';
			}

			if (!_.isEmpty(summary)) {
				insurance.summary = summary;
			} else {
				insurance.summary = undefined;
			}
		});
	}
}

//-----------------------------------------------------------------------------------
// Add in the missing scCondition fields that were missing that should not be.
//
// aliasList: The list of scCondition objects to be updated.
//-----------------------------------------------------------------------------------
function addInMissingScConditionFields(scConditionList) {
	if (!_.isEmpty(scConditionList)) {
		_.each(scConditionList, function(scCondition){
			scCondition.summary = recEnrichXformerUtil.getSummary('ServiceConnectedCondition', scCondition);
		});
	}
}

//-----------------------------------------------------------------------------------
// Add in the missing contact fields that were missing that should not be.
//
// aliasList: The list of contact objects to be updated.
//-----------------------------------------------------------------------------------
function addInMissingContactFields(contactList) {
	if (!_.isEmpty(contactList)) {
		_.each(contactList, function(contact){
			// EHMP code had this - but - it was not what was actually storing
			//contact.summary = recEnrichXformerUtil.getSummary('PatientContact', contact);
			if (_.isString(contact.name)) {
				contact.summary = contact.name;
			} else {
				contact.summary = undefined;
			}
			addInMissingAddressFields(contact.address);
			addInMissingTelecomFields(contact.telecom);
		});
	}
}

//-----------------------------------------------------------------------------------
// Add in the missing exposure fields that were missing that should not be.
//
// aliasList: The list of exposure objects to be updated.
//-----------------------------------------------------------------------------------
function addInMissingExposureFields(exposureList) {
	if (!_.isEmpty(exposureList)) {
		_.each(exposureList, function(exposure){
			exposure.summary = recEnrichXformerUtil.getSummary('PatientExposure', exposure);
		});
	}
}

//-----------------------------------------------------------------------------------
// Add in the missing race fields that were missing that should not be.
//
// aliasList: The list of race objects to be updated.
//-----------------------------------------------------------------------------------
function addInMissingRaceFields(raceList) {
	if (!_.isEmpty(raceList)) {
		_.each(raceList, function(race){
			race.summary = recEnrichXformerUtil.getSummary('PatientRace', race);
		});
	}
}

//-----------------------------------------------------------------------------------
// Add in the missing ethnicity fields that were missing that should not be.
//
// aliasList: The list of ethnicity objects to be updated.
//-----------------------------------------------------------------------------------
function addInMissingEthnicityFields(ethnicityList) {
	if (!_.isEmpty(ethnicityList)) {
		_.each(ethnicityList, function(ethnicity){
			ethnicity.summary = recEnrichXformerUtil.getSummary('PatientEthnicity', ethnicity);
		});
	}
}

//-----------------------------------------------------------------------------------
// Add in the missing language fields that were missing that should not be.
//
// aliasList: The list of language objects to be updated.
//-----------------------------------------------------------------------------------
function addInMissingLanguageFields(languageList) {
	if (!_.isEmpty(languageList)) {
		_.each(languageList, function(language){
			language.summary = recEnrichXformerUtil.getSummary('PatientLanguage', language);
		});
	}
}


//-----------------------------------------------------------------------------------
// Add in the missing telecom fields that were missing that should not be.
//
// aliasList: The list of telecom objects to be updated.
//-----------------------------------------------------------------------------------
function addInMissingTelecomFields(telecomList) {
	if (!_.isEmpty(telecomList)) {
		_.each(telecomList, function(telecom){
			telecom.summary = recEnrichXformerUtil.getSummary('Telecom', telecom);
		});
	}
}


//-----------------------------------------------------------------------------------
// Add in the missing patientRecordFlag fields that were missing that should not be.
//
// aliasList: The list of patientRecordFlag objects to be updated.
//-----------------------------------------------------------------------------------
function addInMissingPatientRecordFlagFields(patientRecordFlagList) {
	if (!_.isEmpty(patientRecordFlagList)) {
		_.each(patientRecordFlagList, function(patientRecordFlag){
			patientRecordFlag.summary = recEnrichXformerUtil.getSummary('PatientRecordFlag', patientRecordFlag);
		});
	}
}


//-----------------------------------------------------------------------------------
// Add in the missing facility fields that were missing that should not be.
//
// aliasList: The list of facility objects to be updated.
//-----------------------------------------------------------------------------------
function addInMissingFacilityFields(facilityList) {
	if (!_.isEmpty(facilityList)) {
		_.each(facilityList, function(facility){
			// EHMP code had this - but - it was not what was actually storing
			// facility.summary = recEnrichXformerUtil.getSummary('PatientFacility', facility);
			if (_.isString(facility.name)) {
				facility.summary = facility.name;
			} else {
				facility.summary = undefined;
			}

			// homeSite
			//---------
			if ((facility.homeSite === null) || (facility.homeSite === undefined)) {
				facility.homeSite = false;
			}
		});
	}
}

//-----------------------------------------------------------------------------------
// Add in the missing disability fields that were missing that should not be.
//
// aliasList: The list of disability objects to be updated.
//-----------------------------------------------------------------------------------
function addInMissingDisabilityFields(disabilityList) {
	if (!_.isEmpty(disabilityList)) {
		_.each(disabilityList, function(disability){
			disability.summary = recEnrichXformerUtil.getSummary('PatientDisability', disability);
		});
	}
}

//-----------------------------------------------------------------------------------
// Add in the missing address fields that were missing that should not be.
//
// aliasList: The list of address objects to be updated.
//-----------------------------------------------------------------------------------
function addInMissingAddressFields(addressList) {
	if (!_.isEmpty(addressList)) {
		_.each(addressList, function(address){
			address.summary = recEnrichXformerUtil.getSummary('Address', address);
		});
	}
}

//-----------------------------------------------------------------------------------
// Add in the missing alias fields that were missing that should not be.
//
// aliasList: The list of alias objects to be updated.
//-----------------------------------------------------------------------------------
function addInMissingAliasFields(aliasList) {
	if (!_.isEmpty(aliasList)) {
		_.each(aliasList, function(alias){
			alias.summary = recEnrichXformerUtil.getSummary('Alias', alias);
		});
	}
}

//------------------------------------------------------------------------------------
// Add in the missing root level fields.
//
// record: The record being udpated.
//------------------------------------------------------------------------------------
function addInMissingRootFields(record) {
	// Root level fields
	//------------------
	if ((homeFacility !== undefined) && (homeFacility !== null)) {
		record.homeFacility = undefined;			//  Default if we do not fill it in...
	}
	if (!_.isEmpty(record.facility)) {
		var homeFacility = _.find(record.facility, function(facility) {
			return ((_.isBoolean(facility.homeSite)) && (facility.homeSite));
		});
		if (homeFacility) {
			record.homeFacility = homeFacility;
		}
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

	// DisplayName
	//------------
	if ((record.displayName === null) || (record.displayName === undefined)) {
		if (_.isString(record.fullName)) {
			record.displayName = ncUtil.namecase(record.fullName);
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
	if ((record.lastUpdated !== null) && (record.lastUpdated !== undefined)) {
		record.lastUpdated = String(record.lastUpdated);
	}
	if ((record.localId !== null) && (record.localId !== undefined)) {
		record.localId = String(record.localId);
	}
	if ((record.lrdfn !== null) && (record.lrdfn !== undefined)) {
		record.lrdfn = String(record.lrdfn);
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
	if ((record.scPercent !== null) && (record.scPercent !== undefined)) {
		record.scPercent = String(record.scPercent);
	}
	if ((record.serviceConnectedPercent !== null) && (record.serviceConnectedPercent !== undefined)) {
		record.serviceConnectedPercent = String(record.serviceConnectedPercent);
	}

	// Address
	//--------
	if (!_.isEmpty(record.address)) {
		_.each(record.address, function(address) {
			if ((address.zip !== null) && (address.zip !== undefined)) {
				address.zip = String(address.zip);
			}
			if ((address.start !== null) && (address.start !== undefined)) {
				address.start = String(address.start);
			}
			if ((address.end !== null) && (address.end !== undefined)) {
				address.end = String(address.end);
			}
		});
	}

	// Facility
	//---------
	if (!_.isEmpty(record.facility)) {
		_.each(record.facility, function(facility) {
			if ((facility.code !== null) && (facility.code !== undefined)) {
				facility.code = String(facility.code);
			}
			if ((facility.systemId !== null) && (facility.systemId !== undefined)) {
				facility.systemId = String(facility.systemId);
			}
			if ((facility.localPatientId !== null) && (facility.localPatientId !== undefined)) {
				facility.localPatientId = String(facility.localPatientId);
			}
			if ((facility.earliestDate !== null) && (facility.earliestDate !== undefined)) {
				facility.earliestDate = String(facility.earliestDate);
			}
			if ((facility.latestDate !== null) && (facility.latestDate !== undefined)) {
				facility.latestDate = String(facility.latestDate);
			}
		});
	}

	// patientRecordFlag
	//------------------
	if (!_.isEmpty(record.address)) {
		_.each(record.patientRecordFlag, function(patientRecordFlag) {
			// Note this appears to be what VistA is sending.  - But the old class was looking for nextReviewDate.
			//----------------------------------------------------------------------------------------------------
			if ((patientRecordFlag.nextReviewDT !== null) && (patientRecordFlag.nextReviewDT !== undefined)) {
				patientRecordFlag.nextReviewDT = String(patientRecordFlag.nextReviewDT);
			}

			// Not in the original class - but we are now getting this time stamp.  So fix it to string.
			//------------------------------------------------------------------------------------------
			if ((patientRecordFlag.assignTS !== null) && (patientRecordFlag.assignTS !== undefined)) {
				patientRecordFlag.assignTS = String(patientRecordFlag.assignTS);
			}
		});
	}

	// Telecom
	//--------
	if (!_.isEmpty(record.telecom)) {
		_.each(record.telecom, function(telecom) {
			if ((telecom.use !== null) && (telecom.use !== undefined)) {
				telecom.use = String(telecom.use);
			}
			if ((telecom.value !== null) && (telecom.value !== undefined)) {
				telecom.value = String(telecom.value);
			}
		});
	}

	// Language
	//----------
	if (!_.isEmpty(record.language)) {
		_.each(record.language, function(language) {
			if ((language.code !== null) && (language.code !== undefined)) {
				language.code = String(language.code);
			}
			if ((language.vuid !== null) && (language.vuid !== undefined)) {
				language.vuid = String(language.vuid);
			}
		});
	}

	// Ethnicity
	//----------
	if (!_.isEmpty(record.ethnicity)) {
		_.each(record.ethnicity, function(ethnicity) {
			if ((ethnicity.code !== null) && (ethnicity.code !== undefined)) {
				ethnicity.code = String(ethnicity.code);
			}
			if ((ethnicity.vuid !== null) && (ethnicity.vuid !== undefined)) {
				ethnicity.vuid = String(ethnicity.vuid);
			}
		});
	}

	// Race
	//----------
	if (!_.isEmpty(record.race)) {
		_.each(record.race, function(race) {
			if ((race.code !== null) && (race.code !== undefined)) {
				race.code = String(race.code);
			}
			if ((race.vuid !== null) && (race.vuid !== undefined)) {
				race.vuid = String(race.vuid);
			}
		});
		}

	// Exposure
	//----------
	if (!_.isEmpty(record.exposure)) {
		_.each(record.exposure, function(exposure) {
			if ((exposure.code !== null) && (exposure.code !== undefined)) {
				exposure.code = String(exposure.code);
			}
			if ((exposure.vuid !== null) && (exposure.vuid !== undefined)) {
				exposure.vuid = String(exposure.vuid);
			}
		});
	}

	// Contact
	//----------
	if (!_.isEmpty(record.contact)) {
		_.each(record.contact, function(contact) {
			if ((contact.typeCode !== null) && (contact.typeCode !== undefined)) {
				contact.typeCode = String(contact.typeCode);
			}
			if ((contact.typeName !== null) && (contact.typeName !== undefined)) {
				contact.typeName = String(contact.typeName);
			}

			// contact address
			//----------------
			if (!_.isEmpty(contact.address)) {
				_.each(contact.address, function(address) {
					if ((address.zip !== null) && (address.zip !== undefined)) {
						address.zip = String(address.zip);
					}
					if ((address.start !== null) && (address.start !== undefined)) {
						address.start = String(address.start);
					}
					if ((address.end !== null) && (address.end !== undefined)) {
						address.end = String(address.end);
					}
				});
			}

			// contact telecom
			//----------------
			if (!_.isEmpty(contact.telecom)) {
				_.each(contact.telecom, function(telecom) {
					if ((telecom.use !== null) && (telecom.use !== undefined)) {
						telecom.use = String(telecom.use);
					}
					if ((telecom.value !== null) && (telecom.value !== undefined)) {
						telecom.value = String(telecom.value);
					}
				});
			}

		});
	}

	// Service Connected Condition
	//-----------------------------
	if (!_.isEmpty(record.scCondition)) {
		_.each(record.scCondition, function(scCondition) {
			if ((scCondition.scPercent !== null) && (scCondition.scPercent !== undefined)) {
				scCondition.scPercent = String(scCondition.scPercent);
			}
		});
	}

	// insurance
	//----------
	if (!_.isEmpty(record.insurance)) {
		_.each(record.insurance, function(insurance) {
			if ((insurance.effectiveDate !== null) && (insurance.effectiveDate !== undefined)) {
				insurance.effectiveDate = String(insurance.effectiveDate);
			}
			if ((insurance.expirationDate !== null) && (insurance.expirationDate !== undefined)) {
				insurance.expirationDate = String(insurance.expirationDate);
			}
			if ((insurance.groupNumber !== null) && (insurance.groupNumber !== undefined)) {
				insurance.groupNumber = String(insurance.groupNumber);
			}
			if ((insurance.id !== null) && (insurance.id !== undefined)) {
				insurance.id = String(insurance.id);
			}
			if ((insurance.policyHolder !== null) && (insurance.policyHolder !== undefined)) {
				insurance.policyHolder = String(insurance.policyHolder);
			}
			if ((insurance.policyType !== null) && (insurance.policyType !== undefined)) {
				insurance.policyType = String(insurance.policyType);
			}
		});
	}
}

module.exports = transformAndEnrichRecord;
module.exports.transformAndEnrichRecordAPI = transformAndEnrichRecordAPI;