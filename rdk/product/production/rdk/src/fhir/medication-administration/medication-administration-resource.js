'use strict';
var rdk = require('../../core/rdk');
var nullchecker = rdk.utils.nullchecker;
var _ = rdk.utils.underscore;
var helpers = require('../common/utils/helpers');
var fhirResource = require('../common/entities/fhir-resource');
var fhirUtils = require('../common/utils/fhir-converter');
var errors = require('../common/errors.js');
var constants = require('../common/utils/constants');
var querystring = require('querystring');

var parameters = {
    get: {
        'subject.identifier': {
            required: true,
            description: 'patient id'
        },
        limit: {
            required: false,
            regex: /\d+/,
            description: 'show this many results'
        }
    }
};

/*ignore jslint start*/
var apiDocs = {
    spec: {
        path: '/fhir/medicationadministration',
        nickname: 'fhir-medicationadministration',
        summary: 'Converts the vpr inpatient medication resource into a FHIR medicationAdministration resource.',
        notes: '',
        method: 'GET',
        parameters: [
            rdk.docs.commonParams.fhir.si,
            rdk.docs.commonParams.jds.limit
        ],
        responseMessages: []
    }
};
/*ignore jslint end*/

var getResourceConfig = function() {
    return [{
        name: 'medicationAdministration',
        path: '',
        parameters: parameters,
        apiDocs: apiDocs,
        get: getFhirMedicationAdministration,
        healthcheck: {
            dependencies: ['patientrecord', 'jds', 'solr', 'jdsSync', 'authorization']
        },
        permissions: [],
        permitResponseFormat: true
    }];
};

function getFhirMedicationAdministration(req, res, next) {
    getMedicationAdministration(req, res, next);
}

function getMedicationAdministration(req, res, next, startFrom, previousResults) {
    startFrom = startFrom || 0;
    previousResults = previousResults || [];
    var limit = req.param('limit');

    var pid = req.query['subject.identifier'];
    if (nullchecker.isNullish(pid)) {
        return next();
    }
    getMedicationAdministrationData(req, pid, function(err, inputJSON) {
        if (err instanceof errors.FetchError) {
            req.logger.error(err.message);
            res.status(rdk.httpstatus.internal_server_error).send('There was an error processing your request. The error has been logged.');
        } else if (err instanceof errors.NotFoundError) {
            res.status(rdk.httpstatus.not_found).send(err.error);
        } else if (err) {
            res.status(rdk.httpstatus.internal_server_error).send(err.message);
        } else {

            var outJSON = {};
            outJSON = convertToFhir(inputJSON, req, previousResults, limit);

            if (!nullchecker.isNullish(limit) && limit > outJSON.entry.length && inputJSON.data.items && inputJSON.data.items.length > 0) {
                getMedicationAdministration(req, res, next, startFrom + inputJSON.data.items.length, outJSON.entry);
            } else {
                res.status(200).send(outJSON);
            }
        }
    }, next, startFrom, limit);
}


function convertToFhir(result, req, previousResults, limit) {
    previousResults = previousResults || [];
    var fhirResult = {};
    fhirResult.entry = previousResults;
    var items = result.data.items;
    var itemsTransformed = [];
    var iterator = 1;
    for (var i = 0; i < items.length; i++) {
        if (itemsTransformed.length === (parseInt(limit) - previousResults.length)) {
            break;
        }
        if (items[i].products !== undefined && items[i].products.length > 0) {
            if (items[i].products.length === 1) {
                itemsTransformed.push(items[i]);
            } else {
                iterator = 1;
                for (var j = 0; j < items[i].products.length; j++) {
                    if (itemsTransformed.length === (parseInt(limit) - previousResults.length)) {
                        break;
                    }
                    var itemTransformed = {};
                    itemTransformed.uid = items[i].uid + ':' + iterator;
                    iterator++;
                    itemTransformed.summary = items[i].summary;
                    itemTransformed.pid = items[i].pid;
                    itemTransformed.facilityCode = items[i].facilityCode;
                    itemTransformed.facilityName = items[i].facilityName;
                    itemTransformed.localId = items[i].localId;
                    itemTransformed.productFormName = items[i].productFormName;
                    itemTransformed.sig = items[i].sig;
                    itemTransformed.overallStart = items[i].overallStart;
                    itemTransformed.overallStop = items[i].overallStop;
                    itemTransformed.stopped = items[i].stopped;
                    itemTransformed.medStatus = items[i].medStatus;
                    itemTransformed.medStatusName = items[i].medStatusName;
                    itemTransformed.medType = items[i].medType;
                    itemTransformed.vaType = items[i].vaType;
                    itemTransformed.vaStatus = items[i].vaStatus;
                    itemTransformed.supply = items[i].supply;
                    itemTransformed.qualifiedName = items[i].qualifiedName;
                    itemTransformed.units = items[i].units;
                    itemTransformed.kind = items[i].kind;
                    itemTransformed.IMO = items[i].IMO;
                    itemTransformed.name = items[i].name;
                    itemTransformed.fills = [];
                    itemTransformed.administrations = [];
                    itemTransformed.products = [];
                    itemTransformed.dosages = [];
                    itemTransformed.orders = [];
                    itemTransformed.rxncodes = [];
                    itemTransformed.rxncodes = items[i].rxncodes;
                    itemTransformed.codes = [];
                    itemTransformed.codes = items[i].codes;
                    if (_.isArray(items[i].fills)) {
                        if (items[i].fills.length === 1) {
                            itemTransformed.fills.push(items[i].fills[0]);
                        } else if (items[i].fills.length > j) {
                            itemTransformed.fills.push(items[i].fills[j]);
                        }
                    }
                    if (_.isArray(items[i].administrations)) {
                        if (items[i].administrations.length === 1) {
                            itemTransformed.administrations.push(items[i].administrations[0]);
                        } else if (items[i].administrations.length > j) {
                            itemTransformed.administrations.push(items[i].administrations[j]);
                        }
                    }

                    if (_.isArray(items[i].products) && items[i].products.length > j) {
                        itemTransformed.products.push(items[i].products[j]);
                    }
                    if (_.isArray(items[i].dosages)) {
                        if (items[i].dosages.length === 1) {
                            itemTransformed.dosages.push(items[i].dosages[0]);
                        } else if (items[i].dosages.length > j) {
                            itemTransformed.dosages.push(items[i].dosages[j]);
                        }
                    }
                    if (_.isArray(items[i].orders)) {
                        if (items[i].orders.length === 1) {
                            itemTransformed.orders.push(items[i].orders[0]);
                        } else if (items[i].orders.length > j) {
                            itemTransformed.orders.push(items[i].orders[j]);
                        }
                    }
                    itemsTransformed.push(itemTransformed);

                }
            }
        }
    }
    for (i = 0; i < itemsTransformed.length; i++) {
        createMedicationAdministration(itemsTransformed[i], fhirResult.entry, req, fhirResult.updated);
    }


    var entry = [];
    var link = [];

    if (req) {
        link.push(new fhirResource.Link(req.protocol + '://' + req.headers.host + req.originalUrl, 'self'));
    }
    for (i = 0; i < fhirResult.entry.length; i++) {
        if (nullchecker.isNotNullish(fhirResult.entry[i])) {
            var e = new fhirResource.Entry(fhirResult.entry[i]);
            // "Link" at entry level IS on the DSTU2 spec but the HAPI validation
            //tool complains about it. We're not adding any meaninful
            // information on the link so it is safe to be commented out for the moment.
            //e.link = [new fhirResource.Link(req.protocol + '://' + req.headers.host + '/fhir/diagnosticreport/' + (e.resource._id || e.resource.id || '@null'), 'self')];
            entry.push(e);
        }
    }
    return (new fhirResource.Bundle2(link, entry, result.data.totalItems));
}

function createExtension(key, valueX, x) {
    if (nullchecker.isNotNullish(valueX)) {
        return (new fhirResource.Extension(constants.medAdministration.MED_ADMINISTRATION_EXTENSION_URL_PREFIX + key, valueX, x));
    } else {
        return null;
    }
}

function createMedicationAdministration(jdsItem, fhirItems, req) {

    var fhirItem = new fhirResource.MedicationAdministration_DSTU2(helpers.generateUUID(), jdsItem.vaStatus);
    fhirItem.contained = [];

    // Identifier
    if (nullchecker.isNotNullish(jdsItem.uid)) {
        fhirItem.identifier = [new fhirResource.Identifier(jdsItem.uid,
                                                           constants.medPrescription.MED_PRESCRIPTION_UID_IDENTIFIER_SYSTEM)];
    }

    var ext = [
        createExtension('IMO', jdsItem.IMO, 'Boolean'),
        createExtension('kind', jdsItem.kind, 'String'),
        createExtension('localId', jdsItem.localId, 'String'),
        createExtension('medStatus', jdsItem.medStatus, 'String'),
        createExtension('medStatusName', jdsItem.medStatusName, 'String'),
        createExtension('medType', jdsItem.medType, 'String'),
        createExtension('supply', jdsItem.supply, 'Boolean')
    ];
    setDosagesExtensions(ext, jdsItem);
    setFillsExtensions(ext, jdsItem);
    setOrdersExtensions(ext, jdsItem);
    setProductsExtensions(ext, jdsItem);

    fhirItem.extension = _.compact(ext); // remove all null entries from ext

    fhirItem.patient = {
        'reference': 'Patient/' + jdsItem.pid
    };

    var wasNotGiven = false;
    if (nullchecker.isNullish(jdsItem.dosages) || jdsItem.dosages.length === 0) {
        wasNotGiven = true;
    }
    fhirItem.wasNotGiven = wasNotGiven;

    //https://hl7-fhir.github.io/valueset-reason-medication-not-given-codes.html
    //https://hl7-fhir.github.io/valueset-reason-medication-given-codes.html

    var reasonNotGiven;
    var reasonGiven;
    if(wasNotGiven) {
        reasonNotGiven = 'a';
    } else {
        reasonGiven = 'a';
    }

    if(nullchecker.isNotNullish(reasonNotGiven)) {
        var medicationNotGivenUrl = 'http://hl7.org/fhir/reason-medication-not-given';
        var medicationNotGivenDisplay;
        switch(reasonNotGiven) {
            case 'a':
                medicationNotGivenDisplay =  'None';
                break;
            case 'b':
                medicationNotGivenDisplay = 'Away';
                break;
            case 'c':
                medicationNotGivenDisplay = 'Asleep';
                break;
            case 'd':
                medicationNotGivenDisplay = 'Vomit';
                break;
            default:
                //log error condition?
        }
        var notGivenCoding = new fhirResource.Coding(reasonNotGiven, medicationNotGivenDisplay, medicationNotGivenUrl);
        var notGivenCode = new fhirResource.CodeableConcept(medicationNotGivenDisplay, [notGivenCoding]);
        fhirItem.reasonNotGiven = [];
        fhirItem.reasonNotGiven.push(notGivenCode);
    }

    if(nullchecker.isNotNullish(reasonGiven)) {
        var medicationGivenUrl = 'http://hl7.org/fhir/reason-medication-given';
        var medicationGivenDisplay;
        switch(reasonGiven) {
            case 'a':
                medicationGivenDisplay =  'None';
                break;
            case 'b':
                medicationGivenDisplay = 'Given as Ordered';
                break;
            case 'c':
                medicationGivenDisplay = 'Emergency';
                break;
            default:
                //log error condition?
        }
        var givenCoding = new fhirResource.Coding(reasonGiven, medicationGivenDisplay, medicationGivenUrl);
        var givenCode = new fhirResource.CodeableConcept(medicationGivenDisplay, [givenCoding]);
        fhirItem.reasonGiven = [];
        fhirItem.reasonGiven.push(givenCode);
    }

    if(nullchecker.isNotNullish(jdsItem.dosages) &&
       nullchecker.isNotNullish(jdsItem.dosages[0].start) &&
       nullchecker.isNotNullish(jdsItem.dosages[0].stop) &&
       jdsItem.dosages[0].start <= jdsItem.dosages[0].stop) {

        var period = {};
        if (nullchecker.isNotNullish(jdsItem.dosages[0].start)) {
            period.start = fhirUtils.convertToFhirDateTime(jdsItem.dosages[0].start);
        }
        if (nullchecker.isNotNullish(jdsItem.dosages[0].stop)) {
            period.end = fhirUtils.convertToFhirDateTime(jdsItem.dosages[0].stop);
        }
        fhirItem.effectiveTimePeriod = period;

    } else if (nullchecker.isNotNullish(jdsItem.dosages) && nullchecker.isNotNullish(jdsItem.dosages[0].start)) {
        fhirItem.effectiveTimeDateTime = fhirUtils.convertToFhirDateTime(jdsItem.dosages[0].start);

    } else if (nullchecker.isNotNullish(jdsItem.overallStart)) {

        fhirItem.effectiveTimeDateTime = fhirUtils.convertToFhirDateTime(jdsItem.overallStart);
    }

    //note
    if(nullchecker.isNotNullish(jdsItem.dosages) && nullchecker.isNotNullish(jdsItem.dosages[0].summary)) {
        fhirItem.note = jdsItem.dosages[0].summary;
    }

    //dosage
    if(nullchecker.isNotNullish(jdsItem.dosages) && nullchecker.isNotNullish(jdsItem.dosages[0])) {

        if(nullchecker.isNotNullish(jdsItem.dosages[0].dose) &&
           nullchecker.isNotNullish(jdsItem.dosages[0].units)) {

            var dosage = {};

            //'system' is assumed from here: https://hl7-fhir.github.io/terminologies-systems.html
            dosage.quantity = new fhirResource.Quantity(jdsItem.dosages[0].dose,
                                                        jdsItem.dosages[0].units,
                                                        null,
                                                        'urn:oid:2.16.840.1.113883.6.8');

            if(nullchecker.isNotNullish(jdsItem.dosages[0].routeName)) {
                dosage.route = new fhirResource.CodeableConcept(jdsItem.dosages[0].routeName);
            }

            fhirItem.dosage = dosage;
        }
    }


    // medicationPerscription ( and related objects... )
    setMedicationPrescription(fhirItem, jdsItem, req);

    //omitting 'medication' for now as it would be redundant with 'medicationPrescription'

    setPractitioner(fhirItem, jdsItem);

    //not enough information to complete the encounter element at this time.
    //setEncounter(fhirItem, jdsItem);

    fhirItems.push(fhirItem);
}


// function createEncounter(item) {
//     var encounter = new fhirResource.Encounter(helpers.generateUUID());

//     if (nullchecker.isNotNullish(item.orders) && item.orders.length > 0) {
//         if(nullchecker.isNotNullish(item.orders[0].providerName)) {
//             encounter.name = item.orders[0].providerName;
//         }
//     }
//     //TODO - location information may not have some required elements.
//     return encounter;
// }

// function setEncounter(fhirItem, item) {
//     var encounter = createEncounter(item);
//     fhirItem.contained.push(encounter);
//     fhirItem.encounter = new fhirResource.ReferenceResource('#' + encounter.id);
// }


function createPractitioner(item) {
    var practitioner = new fhirResource.Practitioner(helpers.generateUUID());

    if (nullchecker.isNotNullish(item.orders) && item.orders.length > 0) {
        if(nullchecker.isNotNullish(item.orders[0].name)) {
            practitioner.name = item.orders[0].providerName;
        }
    }
    return practitioner;
}

function setPractitioner(fhirItem, item) {
    var practitioner = createPractitioner(item);
    fhirItem.contained.push(practitioner);
    fhirItem.practitioner = new fhirResource.ReferenceResource('#' + practitioner.id);
}

//NOTE:  MedicationPrescription is essentially a copy of the code for the proper MedicationPrescription record.
//This can be refactored to eliminate the redundancy.
function createMedicationPrescription(item, req) {
    var mp = new fhirResource.MedicationPrescription_DSTU2(helpers.generateUUID(), item.vaStatus);
    mp.contained = [];

    // Identifier
    if (nullchecker.isNotNullish(item.uid)) {
        mp.identifier = [new fhirResource.Identifier(item.uid, constants.medPrescription.MED_PRESCRIPTION_UID_IDENTIFIER_SYSTEM)];
    }
    // Note
    mp.note = item.summary;

    // medication
    setMedication(mp, item);

    // patient
    if (nullchecker.isNotNullish(req._pid)) {
        mp.patient = new fhirResource.ReferenceResource(constants.medPrescription.PATIENT_PREFIX + req._pid);
    }

    // prescriber // dateWritten
    if (nullchecker.isNotNullish(item.orders) && item.orders.length > 0) {
        var order = item.orders[0];
        if (nullchecker.isNotNullish(order.ordered)) {
            mp.dateWritten = fhirUtils.convertToFhirDateTime(order.ordered);
        }
        if (nullchecker.isNotNullish(order.providerUid)) {
            mp.prescriber = new fhirResource.ReferenceResource(constants.medPrescription.PRESCRIBER_PREFIX + order.providerUid);
        }
    }

    setDosageInstruction(mp, item);
    setDispense(mp, item);
    //setExtensions(mp, item);
    return mp;
}

function setMedicationPrescription(fhirItem, item, req) {
    var prescription = createMedicationPrescription(item, req);
    fhirItem.contained.push(prescription);
    fhirItem.prescription = new fhirResource.ReferenceResource('#' + prescription.id);
}

function createMedication(item) {
    var med = new fhirResource.Medication(helpers.generateUUID(), item.name);
    if (nullchecker.isNotNullish(item.codes) && item.codes.length > 0) {
        var c = item.codes[0];
        var coding = new fhirResource.Coding(c.code, c.display, c.system);
        med.code = new fhirResource.CodeableConcept(c.display, [coding]);
    }
    med.product = {
        form: {
            text: item.productFormName
        }
    };
    if (nullchecker.isNotNullish(item.products) && item.products.length > 0) {
        med.contained = [];
        med.product.ingredient = [];

        for (var i = 0; i < item.products.length; i++) {
            var substance = createSubstance(item.products[i]);
            med.contained.push(substance);
            med.product.ingredient.push({
                item: new fhirResource.ReferenceResource('#' + substance.id, item.products[0].ingredientName)
            });
        }
    }
    return med;
}

function setMedication(mp, item) {
    var med = createMedication(item);
    mp.contained.push(med);
    mp.medication = new fhirResource.ReferenceResource('#' + med.id);
}

function createSubstance(p) {
    var coding = [
        new fhirResource.Coding(p.ingredientCode, p.ingredientCodeName, constants.medPrescription.INGREDIENT_IDENTIFIER_SYSTEM),
        new fhirResource.Coding(p.ingredientRole, p.ingredientName, 'SNOMED-CT')
    ];
    var type = new fhirResource.CodeableConcept(p.suppliedName, coding);
    return new fhirResource.Substance(helpers.generateUUID(), type, p.suppliedName);
}

function setDosageInstruction(fhirItem, item) {
    if (nullchecker.isNotNullish(item.dosages) && item.dosages.length > 0) {
        fhirItem.dosageInstruction = [createDosageInstruction(item.sig, item.dosages[0])];
    }
}

function createDosageInstruction(text, dosage) {
    return {
        text: text,
        scheduledTiming: {
            repeat: {
                frequency: dosage.amount,
                period: dosage.scheduleFreq,
                periodUnits: 's'
            },
            code: new fhirResource.CodeableConcept(dosage.scheduleName)
        },
        route: new fhirResource.CodeableConcept(dosage.routeName),
        doseQuantity: new fhirResource.Quantity(dosage.dose, dosage.units)
    };
}

function setDispense(fhirItem, item) {
    var d = {
        medication: fhirItem.medication,
        validityPeriod: new fhirResource.Period(
            fhirUtils.convertToFhirDateTime(item.overallStart),
            fhirUtils.convertToFhirDateTime(item.overallStop)),
    };
    if (nullchecker.isNotNullish(item.orders) && item.orders.length > 0) {
        var order = item.orders[0];
        // Some order data coming from JDS have values of 0 for fillsAllowed. DSTU2 requires
        // numberOfRepeatsAllowed to be a positive integer (min. value = 1). So we skip it if
        // invalid.
        if (order.fillsAllowed > 0) {
            d.numberOfRepeatsAllowed = order.fillsAllowed;
        }
        d.quantity = new fhirResource.Quantity(order.quantityOrdered);
        d.expectedSupplyDuration = new fhirResource.Quantity(order.daysSupply, 'days');
    }
    fhirItem.dispense = d;
}

function setDosageInstruction(mp, item) {
    if (nullchecker.isNotNullish(item.dosages) && item.dosages.length > 0) {
        mp.dosageInstruction = [createDosageInstruction(item.sig, item.dosages[0])];
    }
}

function createDosageInstruction(text, dosage) {
    return {
        text: text,
        scheduledTiming: {
            repeat: {
                frequency: dosage.amount,
                period: dosage.scheduleFreq,
                periodUnits: 's'
            },
            code: new fhirResource.CodeableConcept(dosage.scheduleName)
        },
        route: new fhirResource.CodeableConcept(dosage.routeName),
        doseQuantity: new fhirResource.Quantity(dosage.dose, dosage.units)
    };
}

function setDosagesExtensions(ext, item) {
    if (nullchecker.isNotNullish(item.dosages)) {
        for (var i = 0; i < item.dosages.length; i++) {
            var o = item.dosages[i];
            ext.push(createExtension('dosages[' + i + ']]/amount', o.amount, 'String'));
            ext.push(createExtension('dosages[' + i + ']]/instructions', o.instructions, 'String'));
            ext.push(createExtension('dosages[' + i + ']]/ivRate', o.ivRate, 'String'));
            ext.push(createExtension('dosages[' + i + ']]/noun', o.noun, 'String'));
            ext.push(createExtension('dosages[' + i + ']]/relativeStart', o.relativeStart, 'Integer'));
            ext.push(createExtension('dosages[' + i + ']]/relativeStop', o.relativeStop, 'Integer'));
            ext.push(createExtension('dosages[' + i + ']]/scheduleFreq', o.scheduleFreq, 'String'));
            ext.push(createExtension('dosages[' + i + ']]/scheduleName', o.scheduleName, 'String'));
            ext.push(createExtension('dosages[' + i + ']]/scheduleType', o.scheduleType, 'String'));
            ext.push(createExtension('dosages[' + i + ']]/summary', o.summary, 'String'));
        }
    }
}

function setFillsExtensions(ext, item) {
    if (nullchecker.isNotNullish(item.fills)) {
        for (var i = 0; i < item.fills.length; i++) {
            var o = item.fills[i];
            ext.push(createExtension('fills[' + i + ']/daysSupplyDispensed', o.daysSupplyDispensed, 'Integer'));
            ext.push(createExtension('fills[' + i + ']/dispenseDate', o.dispenseDate, 'String'));
            ext.push(createExtension('fills[' + i + ']/quantityDispensed', o.quantityDispensed, 'String'));
            ext.push(createExtension('fills[' + i + ']/releaseDate', o.releaseDate, 'String'));
            ext.push(createExtension('fills[' + i + ']/routing', o.routing, 'String'));
            ext.push(createExtension('fills[' + i + ']/summary', o.summary, 'String'));
        }
    }
}

function setOrdersExtensions(ext, item) {
    if (nullchecker.isNotNullish(item.orders)) {
        for (var i = 0; i < item.orders.length; i++) {
            var o = item.orders[i];
            ext.push(createExtension('orders[' + i + ']/fillCost', o.fillCost, 'String'));
            ext.push(createExtension('orders[' + i + ']/fillsRemaining', o.fillsRemaining, 'Integer'));
            ext.push(createExtension('orders[' + i + ']/locationName', o.locationName, 'String'));
            ext.push(createExtension('orders[' + i + ']/locationUid', o.locationUid, 'String'));
            ext.push(createExtension('orders[' + i + ']/orderUid', o.orderUid, 'String'));
            ext.push(createExtension('orders[' + i + ']/pharmacistName', o.pharmacistName, 'String'));
            ext.push(createExtension('orders[' + i + ']/pharmacistUid', o.pharmacistUid, 'String'));
            ext.push(createExtension('orders[' + i + ']/predecessor', o.predecessor, 'String'));
            ext.push(createExtension('orders[' + i + ']/prescriptionId', o.prescriptionId, 'String'));
            ext.push(createExtension('orders[' + i + ']/providerName', o.providerName, 'String'));
            ext.push(createExtension('orders[' + i + ']/successor', o.successor, 'String'));
            ext.push(createExtension('orders[' + i + ']/summary', o.summary, 'String'));
            ext.push(createExtension('orders[' + i + ']/vaRouting', o.vaRouting, 'String'));
        }
    }
}

function setProductsExtensions(ext, item) {
    if (nullchecker.isNotNullish(item.products)) {
        for (var i = 0; i < item.products.length; i++) {
            var o = item.products[i];
            ext.push(createExtension('products[' + i + ']/drugClassCode', o.drugClassCode, 'String'));
            ext.push(createExtension('products[' + i + ']/drugClassName', o.drugClassName, 'String'));
            ext.push(createExtension('products[' + i + ']/ingredientCode', o.ingredientCode, 'String'));
            ext.push(createExtension('products[' + i + ']/ingredientCodeName', o.ingredientCodeName, 'String'));
            ext.push(createExtension('products[' + i + ']/ingredientRole', o.ingredientRole, 'String'));
            ext.push(createExtension('products[' + i + ']/ingredientRXNCode', o.ingredientRXNCode, 'String'));
            ext.push(createExtension('products[' + i + ']/strength', o.strength, 'String'));
            ext.push(createExtension('products[' + i + ']/summary', o.summary, 'String'));
            ext.push(createExtension('products[' + i + ']/suppliedCode', o.suppliedCode, 'String'));
            ext.push(createExtension('products[' + i + ']/suppliedName', o.suppliedName, 'String'));
            ext.push(createExtension('products[' + i + ']/volume', o.volume, 'String'));
        }
    }
}

function getMedicationAdministrationData(req, pid, callback, next, start, limit) {
    var config = req.app.config;
    var jdsPath = '';
    var jdsQuery = {
        start: start
    };
    if (limit) {
        jdsQuery.limit = limit;
    }
    jdsPath = '/vpr/' + pid + '/index/medication?filter=in(vaType,%5B%22V%22,%22I%22%5D)' + '&' + querystring.stringify(jdsQuery);
    var options = _.extend({}, config.jdsServer, {
        path: jdsPath,
        method: 'GET'
    });
    var httpConfig = {
        protocol: 'http',
        logger: req.logger,
        options: options
    };

    rdk.utils.http.fetch(req.app.config, httpConfig, function(error, result) {
        req.logger.debug('callback from fetch()');
        if (error) {
            callback(new errors.FetchError('Error fetching pid=' + pid + ' - ' + (error.message || error), error));
        } else {
            var obj = JSON.parse(result);
            if ('data' in obj) {
                return callback(null, obj);
            } else if ('error' in obj) {
                if (errors.isNotFound(obj)) {
                    return callback(new errors.NotFoundError('Object not found', obj));
                }
            }

            return callback(new Error('There was an error processing your request. The error has been logged.'));
        }
    });
}

module.exports.getMedicationAdministrationData = getMedicationAdministrationData;
module.exports.getResourceConfig = getResourceConfig;
module.exports.getMedicationAdministration = getMedicationAdministration;
module.exports.convertToFhir = convertToFhir;
