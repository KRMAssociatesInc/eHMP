'use strict';

//--------------------------------------------------------------------------------
// This is a record enrichment transformer for med data.
//
// @Author:  Les Westberg
//--------------------------------------------------------------------------------

var _ = require('underscore');
var recEnrichXformerUtil = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-xformer-utils');
var PointInTime = require(global.VX_UTILS + 'PointInTime');
var async = require('async');
var mapUtil = require(global.VX_UTILS + 'map-utils');

var CONSTANTS = {
	SCT_MED_TYPE_GENERAL: 'urn:sct:105903003',
	VA_MED_TYPE_INFUSION: 'V',
	SCT_MED_ROLE_BASE: 'urn:sct:418297009',
	SCT_MED_STATUS_TO_TEXT: {
		'urn:sct:55561003': 'active',
		'urn:sct:73425007': 'not active',
		'urn:sct:392521001': 'historical',
		'urn:sct:421139008': 'hold'
	}
};

//--------------------------------------------------------------------------------
// This method transfroms and enriches the med record.
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
	log.debug('record-enrichment-med-xformer.transformAndEnrichRecord: Entered method.  record: %j', record);

	// Make sure we have something to work with.
	//------------------------------------------
	if (!record) {
		log.warn('record-enrichment-med-xformer.transformAndEnrichRecord: Job either did not exist or did not contain a record.  record: %j', record);
		return setTimeout(callback, 0, null, null);
	}

	var terminologyUtils = environment.terminologyUtils;
    if(environment.terminologyUtils === undefined) {
        return callback('No terminology utility provided');
    }

	fixFieldDataTypes(record);
	addInMissingFields(record, log, terminologyUtils, function(error, recordWithMissingFields) {
		if (error) {
			log.error('record-enrichment-med-xformer.transformAndEnrichRecord: Error when returning from addInMissingFields.  error: %s recordWithMissingFields: %j', error, recordWithMissingFields);
			// Do not want to leave on this error - keep going and see if we can add other record enrichment stuff.
		}

		if (!recordWithMissingFields) {
			recordWithMissingFields = record;
		}
		addInRxnCodesTerminology(recordWithMissingFields, log, terminologyUtils, function(error, recordWithRxnCodes) {
			log.debug('record-enrichment-med-xformer.transformAndEnrichRecord: Returning from addinRxnCodesTerminology.  error: %s recordWithRxnCodes: %j', error, recordWithRxnCodes);
			if (error) {
				log.error('record-enrichment-med-xformer.transformAndEnrichRecord: Error occurred while retrieving rxnCodes terminology information.  error: %s; recordWithRxnCodes: %j', error, recordWithRxnCodes);
			}

			if (!recordWithRxnCodes) {
				recordWithRxnCodes = record;
			}
			addTerminologyCodeTranslations(recordWithRxnCodes, log, terminologyUtils, function(error, recordWithTerminologyCodes) {
				log.debug('record-enrichment-med-xformer.transformAndEnrichRecord: Returning error: %s recordWithTerminologyCodes: %j', error, recordWithTerminologyCodes);
				return callback(error, recordWithTerminologyCodes);
			});
		});
	});
}

//--------------------------------------------------------------------------------
// This adds in the fields that were missing that should not be.
//
// record: The record that is being updated.
// log: The logger to use for log messages.
// terminologyUtils: The utility to use for accessing terminologies.
// callback: The handler to call when the record has been updated with terminology
//           content.  Signature:
//           function(error, recordWithRxnCodes) where:
//               error: Is the error if one occurs
//               recordWithAddedFields: Is the record with the fields added in
//---------------------------------------------------------------------------------
function addInMissingFields(record, log, terminologyUtils, callback) {
	log.debug('record-enrichment-med-xformer.addInMissingFields: Entered method.  record: %j', record);

	addInMissingProductsFields(record, log, terminologyUtils, function(error, recordWithProductUpdates) {
		if (error) {
			log.error('record-enrichment-med-xformer.addInMissingFields: Error when returning from addInMissingProductsFields.  error: %s recordWithProductUpdates: %j', error, recordWithProductUpdates);
			// Do not want to leave on this error - keep going and see if we can add other record enrichment stuff.
		}

		if (!recordWithProductUpdates) {
			recordWithProductUpdates = record;
		}

		addInMissingAdministrationsFields(recordWithProductUpdates);
		addInMissingDosagesFields(recordWithProductUpdates);
		addInMissingFillsFields(recordWithProductUpdates);
		addInMissingIndicationsFields(recordWithProductUpdates);
		addInMissingOrdersFields(recordWithProductUpdates);
		addInMissingRootLevelFields(recordWithProductUpdates);
		return callback(null, recordWithProductUpdates);
	});

}

//--------------------------------------------------------------------------------
// This adds in the fields that were missing in the products array.
//
// record: The record that is being updated.
// log: The logger to use for log messages.
// terminologyUtils: The utility to use for accessing terminologies.
// callback: The handler to call when the record has been updated with terminology
//           content.  Signature:
//           function(error, recordWithRxnCodes) where:
//               error: Is the error if one occurs
//               recordWithProductUpdates: Is the record with the product updates
//                                         added in.
//---------------------------------------------------------------------------------
function addInMissingProductsFields(record, log, terminologyUtils, callback) {
	if (_.isEmpty(record.products)) {
		return (callback(null, record));
	}

	var addInProductFieldTaskList = _.map(record.products, function(product) {
		return addInMissingProductFields.bind(null, product, log, terminologyUtils);
	});

	async.series(addInProductFieldTaskList, function(error, result) {
		log.debug('record-enrichment-med-xformer.addInMissingProductsFields: Returning from async.series.  error: %s result: %j', error, result);

		if (error) {
			log.error('record-enrichment-med-xformer.addInMissingProductsFields: Error when returning from async.series.  error: %s record: %j', error, record);
			// Do not want to leave on this error - keep going and see if we can add other record enrichment stuff.
		}

		return callback(null, record);
	});
}

//--------------------------------------------------------------------------------
// This adds in the fields that were missing in a product object.
//
// product: The product that is being updated.
// log: The logger to use for log messages.
// terminologyUtils: The utility to use for accessing terminologies.
// callback: The handler to call when the record has been updated with terminology
//           content.  Signature:
//           function(error, recordWithRxnCodes) where:
//               error: Is the error if one occurs
//               recordWithProductUpdates: Is the record with the product updates
//                                         added in.
//---------------------------------------------------------------------------------
function addInMissingProductFields(product, log, terminologyUtils, callback) {
	// Summary
	//--------
	product.summary = recEnrichXformerUtil.getSummary('MedicationProduct', product);

	if ((!_.isString(product.ingredientRXNCode)) && (_.isString(product.ingredientCode))) {
		var vuid = 'urn:vandf:' + recEnrichXformerUtil.stripUrnFromVuid(product.ingredientCode);
		terminologyUtils.getVADrugConcept(vuid, function(error, concept) {
			log.debug('record-enrichment-med-xformer.addInMissingProductFields: Returning from calling getVADrugConcept. vuid: %s  error: %s concept: %j', vuid, error, concept);

			if (error) {
				log.error('record-enrichment-med-xformer.addInMissingProductsFields: Error when returning from calling getVADrugConcept. vuid: %s  error: %s concept: %j', vuid, error, concept);
			}

			if (!concept) {
				return callback(null);
			}

			terminologyUtils.getVAConceptMappingTo(concept, 'rxn', function(error, rxnConcept) {		// Do not know why it uses rxn instead of rxnorm - that was in the original VA code.
				log.debug('record-enrichment-med-xformer.addInMissingProductFields: Returning from calling getVAConceptMappingTo. concept: %j; targetSourceSystem: rxn  error: %s rxnConcept: %j', concept, error, rxnConcept);

				if (error) {
					log.error('record-enrichment-med-xformer.addInMissingProductsFields: Error when returning from calling getVAConceptMappingTo. concept: %j; targetSourceSystem: rxn  error: %s concept: %j', concept, error, rxnConcept);
				}

				if (!rxnConcept) {
					return callback(null);
				}

				product.ingredientRXNCode = rxnConcept.urn;
				return callback(null);
			});
		});
	} else {
		return callback(null);
	}
}

//--------------------------------------------------------------------------------
// This adds in the fields that were missing in the orders array.
//
// record: The record that is being updated.
//---------------------------------------------------------------------------------
function addInMissingOrdersFields(record) {
	if (_.isEmpty(record.orders)) {
		return;
	}

	_.each(record.orders, function(order) {
		// Summary
		//--------
		order.summary = recEnrichXformerUtil.getSummary('MedicationOrder', order);
	});
}

//--------------------------------------------------------------------------------
// This adds in the fields that were missing in the indications array.
//
// record: The record that is being updated.
//---------------------------------------------------------------------------------
function addInMissingIndicationsFields(record) {
	if (_.isEmpty(record.indications)) {
		return;
	}

	_.each(record.indications, function(indication) {
		// Summary
		//--------
		indication.summary = recEnrichXformerUtil.getSummary('MedicationIndication', indication);
	});
}

//--------------------------------------------------------------------------------
// This adds in the fields that were missing in the fills array.
//
// record: The record that is being updated.
//---------------------------------------------------------------------------------
function addInMissingFillsFields(record) {
	if (_.isEmpty(record.fills)) {
		return;
	}

	_.each(record.fills, function(fill) {
		// Summary
		//--------
		fill.summary = recEnrichXformerUtil.getSummary('MedicationFill', fill);
	});
}

//--------------------------------------------------------------------------------
// This adds in the fields that were missing in the dosages array.
//
// record: The record that is being updated.
//---------------------------------------------------------------------------------
function addInMissingDosagesFields(record) {
	if (_.isEmpty(record.dosages)) {
		return;
	}

	_.each(record.dosages, function(dosage) {
		// Summary
		//--------
		dosage.summary = recEnrichXformerUtil.getSummary('MedicationDose', dosage);

		// startDateString
		//----------------
		if ((_.isString(dosage.start)) && (_.isString(dosage.stop))) {
			dosage.startDateString = undefined;
		} else if ((dosage.med) && (dosage.med.medType === CONSTANTS.SCT_MED_TYPE_GENERAL)) {
			dosage.startDateString = undefined;
		} else {
			dosage.startDateString = (_.isFinite(dosage.relativeStart) ? buildDoseOutputTimeString(dosage.relativeStart) : undefined);
		}

		// stopDateString
		//----------------
		if ((_.isString(dosage.start)) && (_.isString(dosage.stop))) {
			dosage.startDateString = undefined;	
		} else if ((dosage.med) && (dosage.med.medType === CONSTANTS.SCT_MED_TYPE_GENERAL)) {
			dosage.stopDateString = undefined;
		} else {
			dosage.stopDateString = (_.isFinite(dosage.relativeStop) ? buildDoseOutputTimeString(dosage.relativeStop) : undefined);
		}

	});
}

//-------------------------------------------------------------------------------------
// This formats a string with dosage information and returns it.
//
// totalMinutes: Minutes to be represented.
// return: The output string associated with that total number of minutes.
//-------------------------------------------------------------------------------------
function buildDoseOutputTimeString(totalMinutes) {
	var days = Math.floor(totalMinutes / 1440);
	var hours = Math.floor((totalMinutes - (days * 1440)) / 60);
	var minutes = Math.floor(totalMinutes - (days * 1440) - (hours * 60));

	var result = '';
	if (days > 0) {
		result += ' ' + days + (days > 1 ? ' days' : ' day');
	}
	if (hours > 0) {
		result += ' ' + hours + (hours > 1 ? ' hours' : ' hour');
	}
	if (minutes > 0) {
		result += ' ' + minutes + (minutes > 1 ? ' minutes' : ' minute');
	}

	return (result.length > 0 ? 'Start +' + result : 'Start');
}


//--------------------------------------------------------------------------------
// This adds in the fields that were missing in the administrations array.
//
// record: The record that is being updated.
//---------------------------------------------------------------------------------
function addInMissingAdministrationsFields(record) {
	if (_.isEmpty(record.administrations)) {
		return;
	}

	_.each(record.administrations, function(administration) {
		// Summary
		//--------
		administration.summary = recEnrichXformerUtil.getSummary('MedicationAdministration', administration);

		// Given
		//------
		administration.given = ((administration.status === 'GIVEN') || (administration.status === 'INFUSING') || (administration.status === 'STOPPED'));
	});
}

//--------------------------------------------------------------------------------
// This adds in the fields that were missing at the root level that should not be.
//
// record: The record that is being updated.
//---------------------------------------------------------------------------------
function addInMissingRootLevelFields(record) {
	// Supply
	//-------
	if ((record.supply === null) || (record.supply === undefined) || (record.supply === 'false')) {
		record.supply = false;
	} else if (record.supply === 'true') {
		record.supply = true;
	}

	// IMO
	//-----
	if ((record.IMO === null) || (record.IMO === undefined) || (record.IMO === 'false')) {
		record.IMO = false;
	} else if (record.IMO === 'true') {
		record.IMO = true;
	}

	// overallStart
	//-------------
	if ((!record.overallStart) && (!_.isEmpty(record.orders)) && (_.isString(record.orders[0].ordered))) {
		record.overallStart = record.orders[0].ordered;
	}

	// overallStop
	//------------
	if ((!record.overallStop) && (record.stopped)) {
		record.overallStop = record.stopped;
	} else if ((record.stopped) && (record.overallStop) && ((new PointInTime(record.stopped)).before(record.overallStop))) {
		record.overallStop = record.stopped;
	} else if ((!record.overallStop) && (!_.isEmpty(record.orders)) && (_.isString(record.orders[0].ordered))) {
		record.overallStop = record.orders[0].ordered;
	}

	// Products
	//------------
	if ((_.isNull(record.products)) || (_.isUndefined(record.products))) {
		record.products = [];
	}

	// Dosages
	//------------
	if ((_.isNull(record.dosages)) || (_.isUndefined(record.dosages))) {
		record.dosages = [];
	}

	// Administrations
	//-----------------
	if ((_.isNull(record.administrations)) || (_.isUndefined(record.administrations))) {
		record.administrations = [];
	}

	// lastAdmin
	//----------
	if (!_.isEmpty(record.administrations)) {
		var lastAdminAdministration = _.find(record.administrations, function(administration) {
			if ((administration.status === 'GIVEN') || (administration.status === 'INFUSING')) {
				return true;
			}
			return false;
		});
		if ((lastAdminAdministration) && (lastAdminAdministration.dateTime)) {
			record.lastAdmin = lastAdminAdministration.dateTime;
		}
	}

	// Fills
	//-----------------
	if ((_.isNull(record.fills)) || (_.isUndefined(record.fills))) {
		record.fills = [];
	}

	// Units
	//------
	record.units = undefined;
	if (!_.isEmpty(record.dosages)) {
		if ((record.dosages.length === 1) && (record.dosages[0].units)) {
			record.units = record.dosages[0].units;
		} else if (record.dosages.length > 1) {
			// Need to make sure that the units in all the dosages are the same.  If so
			// set it.  If not, then we leave the root level one not set.
			//---------------------------------------------------------------------------
			var unitsList = _.map(record.dosages, function(dosage) {
				return dosage.units;
			});
			unitsList = _.uniq(unitsList);
			if (unitsList.length === 1) {
				record.units = unitsList[0];
			}
		}
	}

	// Summary
	//---------
	record.summary = getSummary(record);

	// Set Kind  (Note - that it is required that supply and IMO are set before setting this)
	//---------------------------------------------------------------------------------------
	addInKindField(record);

	// Codes
	//-------
	if (_.isEmpty(record.codes)) {
		record.codes = [];
	}
}

//------------------------------------------------------------------------------------
// This method figures out the text of the summary line and returns it.
//
// record: The record that contains the product information.
// returns: The summary field.
//------------------------------------------------------------------------------------
function getSummary(record) {
	var summary = productsDisplayLine(record);
	if (_.isString(record.vaStatus)) {
		summary += (' (' + record.vaStatus + ')\n');
	} else {
		if (_.isString(record.medStatus)) {
			summary += '(' + CONSTANTS.SCT_MED_STATUS_TO_TEXT[record.medStatus] + ')\n';
		}
	}

	if (_.isString(record.sig)) {
		if (summary.length > 0) {
			summary += ' ';
		}
		summary += record.sig;
	}

	if ((CONSTANTS.VA_MED_TYPE_INFUSION === record.vaType) && (!_.isEmpty(record.dosages))) {
		var dose = record.dosages[0];
		if (_.isString(dose.ivRate)) {
			summary += dose.ivRate + ' ';
		}
		if (_.isString(dose.duration)) {
			summary += dose.duration + ' ';
		}
		if (_.isString(dose.scheduleName)) {
			summary += dose.scheduleName + ' ';
		}
		if (_.isString(dose.restriction)) {
			summary += 'for a total of ' + dose.restriction;
		}
	}

	return summary;
}

//------------------------------------------------------------------------------------
// This method builds a display line for the product information and returns it.
//
// record: The record that contains the product information.
// returns: The product information display line.
//------------------------------------------------------------------------------------
function productsDisplayLine(record) {
	var displayLine = '';
	if (record.medType !== CONSTANTS.SCT_MED_TYPE_GENERAL) {
		if (!_.isEmpty(record.products)) {
			_.each(record.products, function(product) {
				if (displayLine.length > 0) {
					displayLine += ', ';
				}
				if (_.isString(product.suppliedName)) {
					displayLine += product.suppliedName;
				}
			});
		}
	} else {
		// Inpatient meds excluding infusions
		//------------------------------------
		if ((_.isString(record.vaType)) && (record.vaType !== CONSTANTS.VA_MED_TYPE_INFUSION)) {
			if (!_.isEmpty(record.products)) {
				var ingredientList = mapUtil.filteredMap(record.products, function(product) {
					return product.ingredientName;
				}, [null, undefined]);

				if (!_.isEmpty(ingredientList)) {
					ingredientList = _.uniq(ingredientList);

					_.each(ingredientList, function(ingredient) {
						if (displayLine.length > 0) {
							displayLine += ', ';
						}
						displayLine += ingredient;
					});
				}
			}
		} else {
			// Infusions
			//----------
			var a = '';
			var b = '';
			if (!_.isEmpty(record.products)) {
				_.each(record.products, function(product) {
					if (_.isString(product.suppliedName)) {
						if (product.ingredientRole === CONSTANTS.SCT_MED_ROLE_BASE) {
							b += (b.length > 0 ? ', ' : '') + product.suppliedName;
						} else {
							a += (a.length > 0 ? ', ' : '') + product.suppliedName;
						}
					}
				});

				displayLine += a + ' in ' + b;
			}
		}
	}

	if ((displayLine === '') && (_.isString(record.qualifiedName))) {
		return (record.qualifiedName);
	} else {
		return (displayLine);
	}

}

//------------------------------------------------------------------------------------
// This method figures out what the kind attribute should be set to based on the
// information in the record and the sets it.  If there is one there - it will
// overwrite it.
//
// record: The record that is being updated.
//------------------------------------------------------------------------------------
function addInKindField(record) {
	var medicationKind = {
		I: 'Medication, Inpatient',
		O: 'Medication, Outpatient',
		N: 'Medication, Non-VA',
		V: 'Medication, Infusion',
		IMO: 'Medication, Clinic Order',
		SUPPLY: 'Medication, Supply',
		UNKNOWN: 'Medication'
	};

	if (record.supply) {
		record.kind = medicationKind.SUPPLY;
	} else if (record.IMO) {
		record.kind = medicationKind.IMO;
	} else if (record.vaType) {
		record.kind = medicationKind[record.vaType];
	} else {
		record.kind = medicationKind.UNKNOWN;
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
	if ((record.overallStart !== null) && (record.overallStart !== undefined)) {
		record.overallStart = String(record.overallStart);
	}
	if ((record.overallStop !== null) && (record.overallStop !== undefined)) {
		record.overallStop = String(record.overallStop);
	}
	if ((record.stopped !== null) && (record.stopped !== undefined)) {
		record.stopped = String(record.stopped);
	}
	if ((record.lastFilled !== null) && (record.lastFilled !== undefined)) {
		record.lastFilled = String(record.lastFilled);
	}
	if ((record.localId !== null) && (record.localId !== undefined)) {
		record.localId = String(record.localId);
	}
	if ((record.facilityCode !== null) && (record.facilityCode !== undefined)) {
		record.facilityCode = String(record.facilityCode);
	}


	if (!_.isEmpty(record.administrations)) {
		_.each(record.administrations, function(administration) {
			if ((administration.dateTime !== null) && (administration.dateTime !== undefined)) {
				administration.dateTime = String(administration.dateTime);
			}
		});
	}

	if (!_.isEmpty(record.dosages)) {
		_.each(record.dosages, function(dosage) {
			if ((dosage.start !== null) && (dosage.start !== undefined)) {
				dosage.start = String(dosage.start);
			}
			if ((dosage.stop !== null) && (dosage.stop !== undefined)) {
				dosage.stop = String(dosage.stop);
			}
			if ((dosage.dose !== null) && (dosage.dose !== undefined)) {
				dosage.dose = String(dosage.dose);
			}
			if ((dosage.amount !== null) && (dosage.amount !== undefined)) {
				dosage.amount = String(dosage.amount);
			}
			if ((dosage.ivRate !== null) && (dosage.ivRate !== undefined)) {
				dosage.ivRate = String(dosage.ivRate);
			}
			if ((dosage.duration !== null) && (dosage.duration !== undefined)) {
				dosage.duration = String(dosage.duration);
			}
			if ((dosage.routeCode !== null) && (dosage.routeCode !== undefined)) {
				dosage.routeCode = String(dosage.routeCode);
			}
			if ((dosage.timingExpression !== null) && (dosage.timingExpression !== undefined)) {
				dosage.timingExpression = String(dosage.timingExpression);
			}
			if ((dosage.restriction !== null) && (dosage.restriction !== undefined)) {
				dosage.restriction = String(dosage.restriction);
			}
			if ((dosage.relatedOrder !== null) && (dosage.relatedOrder !== undefined)) {
				dosage.relatedOrder = String(dosage.relatedOrder);
			}
			if ((dosage.complexDuration !== null) && (dosage.complexDuration !== undefined)) {
				dosage.complexDuration = String(dosage.complexDuration);
			}
		});
	}
	if (!_.isEmpty(record.fills)) {
		_.each(record.fills, function(fill) {
			if ((fill.dispenseDate !== null) && (fill.dispenseDate !== undefined)) {
				fill.dispenseDate = String(fill.dispenseDate);
			}
			if ((fill.releaseDate !== null) && (fill.releaseDate !== undefined)) {
				fill.releaseDate = String(fill.releaseDate);
			}
			if ((fill.quantityDispensed !== null) && (fill.quantityDispensed !== undefined)) {
				fill.quantityDispensed = String(fill.quantityDispensed);
			}
		});
	}
	if (!_.isEmpty(record.orders)) {
		_.each(record.orders, function(order) {
			if ((order.ordered !== null) && (order.ordered !== undefined)) {
				order.ordered = String(order.ordered);
			}
			if ((order.expiration !== null) && (order.expiration !== undefined)) {
				order.expiration = String(order.expiration);
			}
			if ((order.fillCost !== null) && (order.fillCost !== undefined)) {
				order.fillCost = String(order.fillCost);
			}
			if ((order.quantityOrdered !== null) && (order.quantityOrdered !== undefined)) {
				order.quantityOrdered = String(order.quantityOrdered);
			}
		});
	}

	if (!_.isEmpty(record.indications)) {
		_.each(record.indications, function(indication) {
			if ((indication.code !== null) && (indication.code !== undefined)) {
				indication.code = String(indication.code);
			}
		});
	}

	if (!_.isEmpty(record.products)) {
		_.each(record.products, function(product) {
			if ((product.strength !== null) && (product.strength !== undefined)) {
				product.strength = String(product.strength);
			}
			if ((product.volume !== null) && (product.volume !== undefined)) {
				product.volume = String(product.volume);
			}
			if ((product.ivBag !== null) && (product.ivBag !== undefined)) {
				product.ivBag = String(product.ivBag);
			}
			if ((product.relatedOrder !== null) && (product.relatedOrder !== undefined)) {
				product.relatedOrder = String(product.relatedOrder);
			}
		});
	}

}

//------------------------------------------------------------------------------------
// This method does any terminology mapping lookups for the rxnCodes field and inserts
// the codes it receives into the record.
//
// record: The record that is being updated.
// log: The logger to use for log messages.
// terminologyUtils: The utility to use for accessing terminologies.
// callback: The handler to call when the record has been updated with terminology
//           content.  Signature:
//           function(error, recordWithRxnCodes) where:
//               error: Is the error if one occurs
//               recordWithRxnCodes: Is the record with the terminology codes
//                                   added.
//------------------------------------------------------------------------------------
function addInRxnCodesTerminology(record, log, terminologyUtils, callback) {
	log.debug('record-enrichment-med-xformer.addInRxnCodesTerminology: Entered method: record: %j', record);

	if (!_.isEmpty(record.products)) {
		var vuidLookupFunctionList = _.map(record.products, function(product) {
			var vuid = product.ingredientCode;
			if (!_.isString(vuid)) {
				return null;
			}

			var parts = vuid.split(':');
			vuid = (parts.length >= 4) ? 'urn:vandf:' + parts[3] : null;
			if (!_.isString(vuid)) {
				return null;
			}

			return addInRxnCodesForOneProduct.bind(null, vuid, log, terminologyUtils);
		});

		// Get rid of null or undefined entries.
		//--------------------------------------
		vuidLookupFunctionList = _.filter(vuidLookupFunctionList, function(vuidLookupFunction) {
			return (_.isFunction(vuidLookupFunction));
		});

		if (!_.isEmpty(vuidLookupFunctionList)) {
			vuidLookupFunctionList[0] = vuidLookupFunctionList[0].bind(null, record); // Need to fix the record on the first one - the rest will happen through waterfall
			async.waterfall(vuidLookupFunctionList, function(error, recordWithRxnCodes) {
				log.debug('record-enrichment-med-xformer.addInRxnCodesTerminology: Returned from async.waterfall.  error: %s; recordWithRxnCodes: %j', error, recordWithRxnCodes);
				return callback(error, recordWithRxnCodes);
			});
		} else {
			return callback(null, record);
		}
	} else {
		return callback(null, record);
	}
}

//--------------------------------------------------------------------------------------
// This function adds in the codes under rxnCodes for the given vuid based on a
// retrieval of the concepts from the drugdb terminology database.
//
// record: The record that is being updated.
// vuid: The concept to search for.
// log: The logger to use for log messages.
// terminologyUtils: The utility to use for accessing terminologies.
// callback: The handler to call when the record has been updated with the rxnCodes
//           content.  Signature:
//           function(error, recordWithUpdatedRxnCodes)
//               error: Is the error if one occurs
//               recordWithRxnCodes: Is the record with the terminology codes
//                                   added.
//--------------------------------------------------------------------------------------
function addInRxnCodesForOneProduct(vuid, log, terminologyUtils, record, callback) {
	log.debug('record-enrichment-med-xformer.addInRxnCodesForOneProduct: Entered method: vuid: %s; record: %j', vuid, record);

	terminologyUtils.getVADrugConcept(vuid, function(error, concept) {
		log.debug('record-enrichment-med-xformer.addInRxnCodesForOneProduct: Received response from getVADrugConcept: error: %s; concept: %j', error, concept);

		if (error) {
			log.error('record-enrichment-med-xformer.addInRxnCodesForOneProduct: Failed to receive terminology concept from drugdb.  vuid: %s; error: %s', vuid, error);
			return callback(null, record); //  This is not catastrophic. Press on....
		}

		if (!concept) {
			log.debug('record-enrichment-med-xformer.addInRxnCodesForOneProduct: No terminology concept found in drugdb.  vuid: %s', vuid);
			return callback(null, record);
		}

		if (_.isEmpty(record.rxncodes)) {
			record.rxncodes = [];
		}

		record.rxncodes = record.rxncodes.concat(concept.urn);

		log.debug('record-enrichment-med-xformer.addInRxnCodesForOneProduct: Finding mappings to concept for vuid: %s, targetSystemCode: ndfrt', vuid);
		terminologyUtils.getVAConceptMappingTo(concept, 'ndfrt', function(error, mappedConcept) {
			log.debug('record-enrichment-med-xformer.addInRxnCodesForOneProduct: Received response from getVAConceptMappingTo: error: %s; mappedConcept: %j', error, mappedConcept);

			if (error) {
				log.error('record-enrichment-med-xformer.addInRxnCodesForOneProduct: Failed to receive terminology concept from drugdb when calling getVAConceptMappingTo.  concept: %j; targetCodeSystem: ndfrt; error: %s', concept, error);
				return callback(null, record); //  This is not catastrophic. Press on....
			}

			if (!mappedConcept) {
				log.debug('record-enrichment-med-xformer.addInRxnCodesForOneProduct: No terminology mappedConcept found in drugdb for ndfrt.  vuid: %s', concept.urn);
				return callback(null, record);
			}

			if (!_.isEmpty(mappedConcept.ancestors)) {
				record.rxncodes = record.rxncodes.concat(mappedConcept.ancestors);
			}

			if (!_.isEmpty(mappedConcept.sameas)) {
				var filteredCodeList = _.filter(mappedConcept.sameas, function(urn) {
					return ((urn.indexOf('urn:ndfrt:') >= 0) || (urn.indexOf('urn:rxnorm:') >= 0));
				});
				if (!_.isEmpty(filteredCodeList)) {
					record.rxncodes = record.rxncodes.concat(filteredCodeList);
				}
			}

			return callback(null, record);
		});
	});
}

//----------------------------------------------------------------------------------
// This method finds the RxNorm Code for this concept it one exists and returns the
// code.
//
// concept: The concept record in VA format.
// returns: The rxnorm code.
//----------------------------------------------------------------------------------
function extractEquivalentRxnormCode(concept) {
	var rxnormCode;

	if (!_.isEmpty(concept.sameas)) {
		var rxnormCodeUrn = _.find(concept.sameas, function(urn) {
			return (urn.indexOf('urn:rxnorm') >= 0);
		});
		if (rxnormCodeUrn) {
			rxnormCode = rxnormCodeUrn.substring('urn:rxnorm:'.length);
		}
	}
	return rxnormCode;
}


//------------------------------------------------------------------------------------------
// This method retrieves the terminology code from the VA terminology database.
//
// record: The record that is being updated.
// log: The logger to use for log messages.
// terminologyUtils: The utility to use for accessing terminologies.
// callback: The handler to call when the code has been retrieved.  Signature:
//           function (error, jdsCode) where:
//               error:  Is the error if one occurs.
//               jdsCode: The terminology code in JDS format.
//-------------------------------------------------------------------------------------------
function getRxNormForProductSuppliedCodeFromVATerminologyDatabase(record, log, terminologyUtils, callback) {
	log.debug('record-enrichment-med-xformer.getRxNormForProductSuppliedCodeFromVATerminologyDatabase: Entered method.  record: %j', record);
	var vuid = null;

	if (!_.isEmpty(record.products)) {
		_.find(record.products, function(product) {
			if (_.isString(product.suppliedCode)) {
				vuid = 'urn:vandf:' + recEnrichXformerUtil.stripUrnFromVuid(product.suppliedCode);
				return true;
			}
		});
	}

	if (_.isString(vuid)) {
		terminologyUtils.getVADrugConcept(vuid, function(error, concept) {
			log.debug('record-enrichment-med-xformer.getRxNormForProductSuppliedCodeFromVATerminologyDatabase: Returned from calling getVADrugConcept.  vuid: %s; error: %s; concept: %j', vuid, error, concept);

			if (error) {
				log.error('record-enrichment-med-xformer.getRxNormForProductSuppliedCodeFromVATerminologyDatabase: Error from calling getVADrugConcept.  vuid: %s; error: %s; concept: %j', vuid, error, concept);
				return callback(null, null);
			}

			if (!concept) {
				log.error('record-enrichment-med-xformer.getRxNormForProductSuppliedCodeFromVATerminologyDatabase: No concept found from calling getVADrugConcept.  vuid: %s; error: %s; concept: %j', vuid, error, concept);
				return callback(null, null);
			}

			var rxnormCode = extractEquivalentRxnormCode(concept);
			if (!_.isString(rxnormCode)) {
				log.debug('record-enrichment-med-xformer.getRxNormForProductSuppliedCodeFromVATerminologyDatabase: No rxnormCode found for this concept.  vuid: %s; concept: %j', vuid, concept);
				return callback(null, null);
			}

			terminologyUtils.getVADrugConcept('urn:rxnorm:' + rxnormCode, function(error, rxnormConcept) {
				log.debug('record-enrichment-med-xformer.getRxNormForProductSuppliedCodeFromVATerminologyDatabase: Returned from calling getVADrugConcept.  code: %s; error: %s; rxnormConcept: %j',
					'urn:rxnorm:' + rxnormCode, error, rxnormConcept);

				if (error) {
					log.error('record-enrichment-med-xformer.getRxNormForProductSuppliedCodeFromVATerminologyDatabase: Error from calling getVADrugConcept.  code: %s; error: %s; rxnormConcept: %j',
						'urn:rxnorm:' + rxnormCode, error, rxnormConcept);
					return callback(null, null);
				}

				if (!rxnormConcept) {
					log.debug('record-enrichment-med-xformer.getRxNormForProductSuppliedCodeFromVATerminologyDatabase: No concept found from calling getVADrugConcept.  code: %s; error: %s; rxnormConcept: %j',
						'urn:rxnorm:' + rxnormCode, error, rxnormConcept);
					return callback(null, null);
				}

				var jdsCode = {
					code: rxnormCode,
					display: rxnormConcept.description,
					system: terminologyUtils.CODE_SYSTEMS.CODE_SYSTEM_RXNORM
				};
				log.debug('record-enrichment-med-xformer.getRxNormForProductSuppliedCodeFromVATerminologyDatabase: Returning RxNorm concept.  jdsCode: %j', jdsCode);
				return callback(null, jdsCode);

			});
		});
	} else {
		return callback(null, null);
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
	log.debug('record-enrichment-med-xformer.addTerminologyCodeTranslations: Entered method: record: %j', record);

	if (recEnrichXformerUtil.recordContainsCode(terminologyUtils.CODE_SYSTEMS.CODE_SYSTEM_RXNORM, record)) {
		log.debug('record-enrichment-med-xformer.addTerminologyCodeTranslations: Record already contains this terminology code: CodeSystem: %s; record: %j', terminologyUtils.CODE_SYSTEMS.CODE_SYSTEM_RXNORM, record);
		return callback(null, record);
	}

	// First see if the concept is in the VA terminology database
	//------------------------------------------------------------
	getRxNormForProductSuppliedCodeFromVATerminologyDatabase(record, log, terminologyUtils, function(error, jdsCode) {
		log.debug('record-enrichment-med-xformer.addTerminologyCodeTranslations: Returned from calling getRxNormForProductSuppliedCodeFromVATerminologyDatabase: error: %s; jdsCode: %j', error, jdsCode);

		if (jdsCode) {
			record.codes = record.codes.concat(jdsCode);
			return callback(null, record);
		}

		// This means that we did not find it in the VA terminology DB - now we need to look in the JLV database for this
		//-----------------------------------------------------------------------------------------------------------------
		var mappingType;
		var sourceCode;
		var doMapping = false;

		if (isVaMedication(record)) {
			mappingType = 'MedicationVuidToRxNorm';
			sourceCode = getMedicationVuid(record);
			log.debug('record-enrichment-med-xformer.addTerminologyCodeTranslations: Medication Event is a VA medication.  vuid: %s', sourceCode);
			doMapping = true;
		} else if (isDodMedication(record)) {
			mappingType = 'MedicationDodNcidToRxNorm';
			sourceCode = getMedicationDodNcid(record, terminologyUtils);
			log.debug('record-enrichment-med-xformer.addTerminologyCodeTranslations: Medication Event is a DOD medication.  dodNcid: %s', sourceCode);
			doMapping = true;
		} else {
			log.debug('record-enrichment-med-xformer.addTerminologyCodeTranslations: Medication Event is NOT a VA or DOD medication  No terminology lookup will be done.');
		}

		if (doMapping) {
			terminologyUtils.getJlvMappedCode(mappingType, sourceCode, function(error, jlvMappedCode) {
				log.debug('record-enrichment-med-xformer.addTerminologyCodeTranslations: Returned from getJlvMappedCode() error: %s; jlvMappedCode: %j', error, jlvMappedCode);

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

	});
}

//------------------------------------------------------------------------------------------
// Returns true if this is a DoD medication.  False if it is not.
//
// record: The medication data event.
// returns: True if this is a DoD medication.
//------------------------------------------------------------------------------------------
function isDodMedication(record) {
	return ((_.isString(record.uid)) && (record.uid.indexOf(':DOD:') >= 0));
}


//---------------------------------------------------------------------------------------
// Get the medication DOD NCID from the record if it exists.
//
// record: The medication data event.
// terminologyUtils: The utility to use for accessing terminologies.
// returns: The medication DOD NCID if it exists in the record.
//---------------------------------------------------------------------------------------
function getMedicationDodNcid(record, terminologyUtils) {
	if (_.isEmpty(record.codes)) {
		return null;
	}

	var medDodNcidCode = _.find(record.codes, function(code) {
		return ((code.system === terminologyUtils.CODE_SYSTEMS.SYSTEM_DOD_NCID) &&
			(code.code));
	});

	if (medDodNcidCode) {
		return medDodNcidCode.code;
	} else {
		return null;
	}
}

//---------------------------------------------------------------------------------------
// Get the medication VUID from the record if it exists.
//
// record: The medication data event.
// returns: The medication VUID if it exists in the record.
//---------------------------------------------------------------------------------------
function getMedicationVuid(record) {
	var productWithVuid = _.find(record.products, function(product) {
		return (_.isString(product.suppliedCode));
	});

	if (productWithVuid) {
		return recEnrichXformerUtil.stripUrnFromVuid(productWithVuid.suppliedCode);
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
function isVaMedication(record) {
	return (!isDodMedication(record));
}

module.exports = transformAndEnrichRecord;