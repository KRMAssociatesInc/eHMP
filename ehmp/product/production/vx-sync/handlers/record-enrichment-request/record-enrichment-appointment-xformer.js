'use strict';

//--------------------------------------------------------------------------------
// This is a record enrichment transformer for appointment data.
//
// @Author:  Les Westberg
//--------------------------------------------------------------------------------

var _ = require('underscore');
var ncUtil = require(global.VX_UTILS + 'namecase-utils');
var recEnrichXformerUtil = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-xformer-utils');


var categoryCodeToKindMap = {
    'urn:va:encounter-category:AP': 'Appointment',
    'urn:va:encounter-category:NS': 'No-Show Appointment',
    'urn:va:encounter-category:NH': 'Admission', 	// Nursing Home
    'urn:va:encounter-category:AD': 'Admission', 	// Admission
    'urn:va:encounter-category:TC': 'Visit', 		// Phone Contact
    'urn:va:encounter-category:OV': 'Visit', 		// Outpatient Visit
    'urn:va:encounter-category:CR': 'Visit', 		// Chart Review
    'urn:va:encounter-category:O': 'Visit', 		// Other
    'urn:va:encounter-category:U': 'Visit' 			// Unknown
};

//--------------------------------------------------------------------------------
// This method transfroms and enriches the appointment record.
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
	log.debug('record-enrichment-appointment-xformer.transformAndEnrichRecord: Entered method.  record: %j', record);

	// Make sure we have something to work with.
	//------------------------------------------
	if (!record) {
		log.warn('record-enrichment-appointment-xformer.transformAndEnrichRecord: Job either did not exist or did not contain a record.  record: %j', record);
		return setTimeout(callback, 0, null, null);
	}

	transformAndEnrichRecordAPI(record);
	log.debug('record-enrichment-appointment-xformer.transformAndEnrichRecord: Returning record: %j', record);

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
	if ((record.current === null) || (record.current === undefined)) {
		record.current = false;
	}

	// record.domain = 'encounter';   -- I believe this is SOLR only
	record.summary = record.stopCodeName;

	// Kind
	//------
	if ((record.categoryCode) && (categoryCodeToKindMap[record.categoryCode])) {
		record.kind = categoryCodeToKindMap[record.categoryCode];
	}
	else if (record.categoryName) {
		record.kind = record.categoryName;
	}
	else {
		record.kind = 'Unknown';
	}

	// Type Display Name
	//-------------------
	if ((!record.typeDisplayName) && (record.typeName)) {
		record.typeDisplayName = ncUtil.namecase(record.typeName);
	}

	// Location Display Name
	//-----------------------
	if ((!record.locationDisplayName) && (record.locationName)) {
		record.locationDisplayName = ncUtil.namecase(record.locationName);
	}

	// Primary Provider
	//------------------
	if (!_.isEmpty(record.providers)) {
		var primaryProvider = _.find(record.providers, function(provider) {
			return (provider.primary === true);
		});
		if (_.isObject(primaryProvider)) {
			record.primaryProvider = primaryProvider;
		}
	}

	// Providers
	//----------
	if (!_.isEmpty(record.providers)) {
		_.each(record.providers, function(provider) {
			provider.summary = recEnrichXformerUtil.getSummary('EncounterProvider', provider);
			if ((!provider.providerDisplayName) && (provider.providerName)) {
				provider.providerDisplayName = ncUtil.namecase(provider.providerName);
			}
		});
	}

	// Movements
	//-----------
	if (!_.isEmpty(record.movements)) {
		_.each(record.movements, function(movement) {
			movement.summary = recEnrichXformerUtil.getSummary('EncounterMovement', movement);
		});
	}

}

//------------------------------------------------------------------------------------
// This method fixes the data type on fields that came in with the wrong data type.
//
// record: The record that is being updated.
//------------------------------------------------------------------------------------
function fixFieldDataTypes(record) {
	if ((record.lastUpdateTime !== null) && (record.lastUpdateTime !== undefined)) {
		record.lastUpdateTime = String(record.lastUpdateTime);
	}
	if ((record.stampTime !== null) && (record.stampTime !== undefined)) {
		record.stampTime = String(record.stampTime);
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
	if ((record.typeCode !== null) && (record.typeCode !== undefined)) {
		record.typeCode = String(record.typeCode);
	}
	if ((record.checkOut !== null) && (record.checkOut !== undefined)) {
		record.checkOut = String(record.checkOut);
	}

	// movements
	//----------
	if (!_.isEmpty(record.movements)) {
		_.each(record.movements, function(movement) {
			if ((movement.dateTime !== null) && (movement.dateTime !== undefined)) {
				movement.dateTime = String(movement.dateTime);
			}
			if ((movement.localId !== null) && (movement.localId !== undefined)) {
				movement.localId = String(movement.localId);
			}
		});
	}

	// stay
	//------
	if (_.isObject(record.stay)) {
		if ((record.stay.arrivalDateTime !== null) && (record.stay.arrivalDateTime !== undefined)) {
			record.stay.arrivalDateTime = String(record.stay.arrivalDateTime);
		}
		if ((record.stay.admitDecisionDateTime !== null) && (record.stay.admitDecisionDateTime !== undefined)) {
			record.stay.admitDecisionDateTime = String(record.stay.admitDecisionDateTime);
		}
		if ((record.stay.admitOrderDateTime !== null) && (record.stay.admitOrderDateTime !== undefined)) {
			record.stay.admitOrderDateTime = String(record.stay.admitOrderDateTime);
		}
		if ((record.stay.dischargeDateTime !== null) && (record.stay.dischargeDateTime !== undefined)) {
			record.stay.dischargeDateTime = String(record.stay.dischargeDateTime);
		}
		if ((record.stay.admitCode !== null) && (record.stay.admitCode !== undefined)) {
			record.stay.admitCode = String(record.stay.admitCode);
		}
	}
}


module.exports = transformAndEnrichRecord;
module.exports.transformAndEnrichRecordAPI = transformAndEnrichRecordAPI;