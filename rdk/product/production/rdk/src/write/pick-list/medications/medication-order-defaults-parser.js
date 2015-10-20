'use strict';

var _ = require('lodash');
var rpcCategoryTransformer = require('../utils/rpc-categories-tilde-transformer');
var rpcUtil = require('../utils/rpc-util');
var validate = require('../utils/validation-util');


//----------------------------------------------------------------------------------------------------------------------

/**
 * ~Medication<br/>
 * d+orderableItemIen^orderableItemName
 */
function addMedication(logger, retValue, categoryName, type, fields) {
    if (!rpcCategoryTransformer.validateCategoryArraySize(logger, 2, fields, categoryName)) {
        return;
    }
    var categoryEntry = {
        orderableItemIen: fields[0],
        orderableItemName: fields[1]
    };
    rpcCategoryTransformer.addCategoryDefaultEntry(logger, retValue, categoryName, type, fields, categoryEntry);
}

/**
 * ~Verb<br/>
 * d+verb (example: dTAKE)
 */
function addVerb(logger, retValue, categoryName, type, fields) {
    if (!rpcCategoryTransformer.validateCategoryArraySize(logger, 1, fields, categoryName)) {
        return;
    }
    var categoryEntry = {
        verb: fields[0]
    };
    rpcCategoryTransformer.addCategoryDefaultEntry(logger, retValue, categoryName, type, fields, categoryEntry);
}

/**
 * ~Preposition<br/>
 * d+preposition (example: dBY)
 */
function addPreposition(logger, retValue, categoryName, type, fields) {
    if (!rpcCategoryTransformer.validateCategoryArraySize(logger, 1, fields, categoryName)) {
        return;
    }
    var categoryEntry = {
        preposition: fields[0]
    };
    rpcCategoryTransformer.addCategoryDefaultEntry(logger, retValue, categoryName, type, fields, categoryEntry);
}

function addPatientInstructionsRegular(logger, retValue, categoryName, type, fields) {
    if (!rpcCategoryTransformer.validateCategoryArraySize(logger, 1, fields, categoryName)) {
        return;
    }
    var categoryEntry = {
        patientInstructions: fields[0]
    };
    rpcCategoryTransformer.addCategoryRegularEntry(logger, retValue, categoryName, type, fields, categoryEntry);
}

/**
 * * ~PtInstr (Patient instructions)<br/>
 * i+PI<br/>
 * t+patientInstruction (may have multiple t lines returned)
 */
function addPatientInstructions(logger, retValue, categoryName, type, fields) {
    if (!rpcCategoryTransformer.validateCategoryArraySize(logger, 1, fields, categoryName)) {
        return;
    }
    if (rpcCategoryTransformer.CATEGORY_TEXT_ENTRY === type) {
        rpcCategoryTransformer.addCategoryTextEntry(logger, retValue, categoryName, type, fields);
    }
    else {
        addPatientInstructionsRegular(logger, retValue, categoryName, type, fields);
    }
}

/**
 * ~AllDoses<br/>
 * i+strength^nationalDrugId^prescriptionText
 */
function addAllDoses(logger, retValue, categoryName, type, fields) {
    if (!rpcCategoryTransformer.validateCategoryArraySize(logger, 3, fields, categoryName)) {
        return;
    }
    var categoryEntry = {
        strength: fields[0],
        nationalDrugId: fields[1],
        prescriptionText: fields[2]
    };
    rpcCategoryTransformer.addCategoryRegularEntry(logger, retValue, categoryName, type, fields, categoryEntry);
}

/**
 * ~Dosage<br/>
 * i+drugName^strength^nationalDrugId^prescriptionText^strength^costPerUnit^refill^doseForm<br/><br/>
 *
 * Dosage has 2 entries for strength, why?<br/>
 * Example 1 tablet:  iACETAMINOPHEN 325MG TAB^325MG^^325&MG&1&TABLET&325MG&5591&325&MG^325MG^0.0029^11^TAB<br/>
 * Example 2 tablets: iACETAMINOPHEN 325MGTAB^325MG^^650&MG&2&TABLETS&650MG&5591&325&MG^650MG^0.0058^11^TAB<br/>
 * One is the strength of the individual unit and the other is the overall dosage, and the info relating to cost per
 * unit would bare this out. 325MG is the strength of the orderable item associated with the national drug ID 5591.
 * This selection is for 2 tablets for a total strength of 650MG.
 * The cost for 2 tablets is 0.0058 vs 0.0029 for one as demonstrated by the 325MG total dose.
 */
function addDosage(logger, retValue, categoryName, type, fields) {
    if (!rpcCategoryTransformer.validateCategoryArraySize(logger, 8, fields, categoryName)) {
        return;
    }
    var categoryEntry = {
        drugName: fields[0],
        strengthIndividualUnit: fields[1],
        nationalDrugId: fields[2],
        prescriptionText: fields[3],
        strengthOverallDosage: fields[4],
        costPerUnit: fields[5],
        refill: fields[6],
        doseForm: fields[7]
    };
    rpcCategoryTransformer.addCategoryRegularEntry(logger, retValue, categoryName, type, fields, categoryEntry);
}

/**
 * ~Dispense<br/>
 * i+nationalDrugId^strength^units^drugName^splitTab (Note: splitTab is boolean 1 or 0)
 */
function addDispense(logger, retValue, categoryName, type, fields) {
    if (!rpcCategoryTransformer.validateCategoryArraySize(logger, 5, fields, categoryName)) {
        return;
    }
    var categoryEntry = {
        nationalDrugId: fields[0],
        strength: fields[1],
        units: fields[2],
        drugName: fields[3],
        splitTab: (fields[4] === 1)
    };
    rpcCategoryTransformer.addCategoryRegularEntry(logger, retValue, categoryName, type, fields, categoryEntry);
}

function addRouteRegular(logger, retValue, categoryName, type, fields) {
    if (!rpcCategoryTransformer.validateCategoryArraySize(logger, 5, fields, categoryName)) {
        return;
    }
    var categoryEntry = {
        routeIen: fields[0],
        routeName: fields[1],
        routeAbbrev: fields[2],
        outpatientExpansion: fields[3],
        IV: (fields[4] === 1)
    };
    rpcCategoryTransformer.addCategoryRegularEntry(logger, retValue, categoryName, type, fields, categoryEntry);
}

function addRouteDefault(logger, retValue, categoryName, type, fields) {
    if (!rpcCategoryTransformer.validateCategoryArraySize(logger, 2, fields, categoryName)) {
        return;
    }
    var categoryEntry = {
        routeIen: fields[0],
        routeName: fields[1]
    };
    rpcCategoryTransformer.addCategoryDefaultEntry(logger, retValue, categoryName, type, fields, categoryEntry);
}

/**
 * ~Route<br/>
 * i+routeIen^routeName^routeAbbrev^outpatientExpansion^IV (intravenous) flag<br/>
 * d+routeIen^routeName
 */
function addRoute(logger, retValue, categoryName, type, fields) {
    if (rpcCategoryTransformer.CATEGORY_DEFAULT_ENTRY === type) {
        addRouteDefault(logger, retValue, categoryName, type, fields);
    }
    else {
        addRouteRegular(logger, retValue, categoryName, type, fields);
    }
}

/**
 * ~Schedule<br/>
 * d+schedule
 */
function addSchedule(logger, retValue, categoryName, type, fields) {
    if (!rpcCategoryTransformer.validateCategoryArraySize(logger, 1, fields, categoryName)) {
        return;
    }
    var categoryEntry = {
        schedule: fields[0]
    };
    rpcCategoryTransformer.addCategoryDefaultEntry(logger, retValue, categoryName, type, fields, categoryEntry);
}

/**
 * ~Guideline<br/>
 * t+guideline (may have multiple t lines returned)
 */
function addGuideline(logger, retValue, categoryName, type, fields) {
    if (!rpcCategoryTransformer.validateCategoryArraySize(logger, 1, fields, categoryName)) {
        return;
    }
    rpcCategoryTransformer.addCategoryTextEntry(logger, retValue, categoryName, type, fields);
}

/**
 * ~Message<br/>
 * t+message (may have multiple t lines returned)
 */
function addMessage(logger, retValue, categoryName, type, fields) {
    if (!rpcCategoryTransformer.validateCategoryArraySize(logger, 1, fields, categoryName)) {
        return;
    }
    rpcCategoryTransformer.addCategoryTextEntry(logger, retValue, categoryName, type, fields);
}

/**
 * ~DEASchedule<br/>
 * d+drugSchedule (drugSchedule can be 1-4 or empty)
 */
function addDEASchedule(logger, retValue, categoryName, type, fields) {
    if (!rpcCategoryTransformer.validateCategoryArraySize(logger, 1, fields, categoryName)) {
        return;
    }
    var categoryEntry = {
        drugSchedule: fields[0]
    };
    rpcCategoryTransformer.addCategoryDefaultEntry(logger, retValue, categoryName, type, fields, categoryEntry);
}

//----------------------------------------------------------------------------------------------------------------------

function addCategoryEntry(logger, retValue, categoryName, fields) {
    if (!fields && fields.length === 0) {
        throw new Error('category entry for ' + categoryName + ' did not contain any fields');
    }
    if (validate.isStringNullish(categoryName)) {
        throw new Error('Cannot add a category entry if no category has been created: ' + fields.join('^'));
    }

    var type = fields[0][0];
    fields[0] = fields[0].substring(1); //Remove the type from the first entry

    if (categoryName === 'Medication') {
        addMedication(logger, retValue, categoryName, type, fields);
    }
    else if (categoryName === 'Verb') {
        addVerb(logger, retValue, categoryName, type, fields);
    }
    else if (categoryName === 'Preposition') {
        addPreposition(logger, retValue, categoryName, type, fields);
    }
    else if (categoryName === 'PtInstr') {
        addPatientInstructions(logger, retValue, categoryName, type, fields);
    }
    else if (categoryName === 'AllDoses') {
        addAllDoses(logger, retValue, categoryName, type, fields);
    }
    else if (categoryName === 'Dosage') {
        addDosage(logger, retValue, categoryName, type, fields);
    }
    else if (categoryName === 'Dispense') {
        addDispense(logger, retValue, categoryName, type, fields);
    }
    else if (categoryName === 'Route') {
        addRoute(logger, retValue, categoryName, type, fields);
    }
    else if (categoryName === 'Schedule') {
        addSchedule(logger, retValue, categoryName, type, fields);
    }
    else if (categoryName === 'Guideline') {
        addGuideline(logger, retValue, categoryName, type, fields);
    }
    else if (categoryName === 'Message') {
        addMessage(logger, retValue, categoryName, type, fields);
    }
    else if (categoryName === 'DEASchedule') {
        addDEASchedule(logger, retValue, categoryName, type, fields);
    }
    else {                               //This is an unknown entry
        logger.error('unknown category entry for ' + categoryName + ': rpcData=' + type + '' + fields.join('^'));
    }
}

//----------------------------------------------------------------------------------------------------------------------

/**
 * The RPC returns data in the following format:<br/>
 * ~category<br/>
 * i+delimited string = entry<br/>
 * d+delimited string = default<br/>
 * t+string = text<br/><br/>
 *
 * Output element definitions:<br/>
 * ~Medication<br/>
 * d+orderableItemIen^orderableItemName<br/><br/>
 *
 * ~Verb<br/>
 * d+verb (example: dTAKE)<br/><br/>
 *
 * ~Preposition<br/>
 * d+preposition (example: dBY)<br/><br/>
 *
 * ~PtInstr (Patient instructions)<br/>
 * i+PI<br/>
 * t+patientInstruction (may have multiple t lines returned)<br/><br/>
 *
 * ~AllDoses<br/>
 * i+strength^nationalDrugId^prescriptionText<br/><br/>
 *
 * ~Dosage<br/>
 * i+drugName^strength^nationalDrugId^prescriptionText^strength^costPerUnit^refill^doseForm<br/><br/>
 *
 * ~Dispense<br/>
 * i+nationalDrugId^strength^units^drugName^splitTab (Note: splitTab is boolean 1 or 0)<br/><br/>
 *
 * ~Route<br/>
 * i+routeIen^routeName^routeAbbrev^outpatientExpansion^UNKNOWN<br/><br/>
 *
 * ~Schedule<br/>
 * d+schedule<br/><br/>
 *
 * ~Guideline<br/>
 * t+guideline (may have multiple t lines returned)<br/><br/>
 *
 * ~Message<br/>
 * t+message (may have multiple t lines returned)<br/><br/>
 *
 * ~DEASchedule<br/>
 * d+drugSchedule (drugSchedule can be 1-4 or empty)<br/><br/>
 *
 * Example of the RPC Data that is returned:<br/>
 * <pre>
 * ~Medication
 * d1348^ACETAMINOPHEN TAB
 * ~Verb
 * dTAKE
 * ~Preposition
 * dBY
 * ~PtInstr
 * ~AllDoses
 * i325MG^5591^325&MG&1&TABLET&325MG&5591&325&MG
 * i500MG^213^500&MG&1&TABLET&500MG&213&500&MG
 * i650MG^5591^650&MG&2&TABLETS&650MG&5591&325&MG
 * i1000MG^213^1000&MG&2&TABLETS&1000MG&213&500&MG
 * ~Dosage
 * iACETAMINOPHEN 325MG TAB^325MG^^325&MG&1&TABLET&325MG&5591&325&MG^325MG^0.0029^^TAB
 * iACETAMINOPHEN 500MG TAB^500MG^^500&MG&1&TABLET&500MG&213&500&MG^500MG^0.0062^^TAB
 * iACETAMINOPHEN 325MG TAB^325MG^^650&MG&2&TABLETS&650MG&5591&325&MG^650MG^0.0058^^TAB
 * iACETAMINOPHEN 500MG TAB^500MG^^1000&MG&2&TABLETS&1000MG&213&500&MG^1000MG^0.0124^^TAB
 * ~Dispense
 * i213^500^MG^ACETAMINOPHEN 500MG TAB^0
 * i5591^325^MG^ACETAMINOPHEN 325MG TAB^0
 * ~Route
 * i1^ORAL (BY MOUTH)^PO^MOUTH^0
 * d1^ORAL (BY MOUTH)
 * ~Schedule
 * dQ6H PRN
 * ~Guideline
 * ~Message
 * ~DEASchedule
 * d
 * </pre>
 * END Example of the RPC Data that is returned:<br/>
 */
module.exports.parseMedicationOrderDefaults = function(logger, rpcData) {

    logger.info({rpcData: rpcData});

    var retValue = [];
    var lines = rpcData.split('\r\n');
    var categoryName = null;
    lines = rpcUtil.removeEmptyValues(lines);

    _.each(lines, function(line) {
        var fields = line.split('^');
        if (rpcCategoryTransformer.isCategoryEntry(fields)) {
            categoryName = fields[0].substring(1);
            var category = {
                categoryName: categoryName
            };

            logger.debug({categoryName: categoryName});
            retValue.push(category);
        }
        else {
            addCategoryEntry(logger, retValue, categoryName, fields);
        }
    });

    logger.info({retValue: retValue});
    return retValue;
};
