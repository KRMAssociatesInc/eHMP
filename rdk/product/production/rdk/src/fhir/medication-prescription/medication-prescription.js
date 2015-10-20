/*jslint node: true*/
'use strict';

var rdk = require('../../core/rdk');
var _ = rdk.utils.underscore;
var fhirResource = require('../common/entities/fhir-resource');
var fhirUtils = require('../common/utils/fhir-converter');
var nullchecker = rdk.utils.nullchecker;
var constants = require('../common/utils/constants');
var helpers = require('../common/utils/helpers');

function buildBundle(results, req, total) {
    var link;
    var entry = [];

    if (req) {
        link = [new fhirResource.Link(req.protocol + '://' + req.headers.host + req.originalUrl, 'self')];
    }
    for (var i = 0; i < results.length; i++) {
        entry.push(new fhirResource.Entry(results[i]));
    }
    return (new fhirResource.Bundle2(link, entry, total));
}

function convertToFhir(items, req) {
    var fhirItems = [];
    for (var i = 0; i < items.length; i++) {
        fhirItems.push(convertToMedicationPrescription(items[i], req._pid));
    }
    return fhirItems;
}

function convertToMedicationPrescription(item, pid) {
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
    if (nullchecker.isNotNullish(pid)) {
        mp.patient = new fhirResource.ReferenceResource(constants.medPrescription.PATIENT_PREFIX + pid);
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
    setExtensions(mp, item);
    return mp;
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

function setDispense(mp, item) {
    var d = {
        medication: mp.medication,
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
    mp.dispense = d;
}

function createExtension(key, valueX, x) {
    if (nullchecker.isNotNullish(valueX)) {
        return (new fhirResource.Extension(constants.medPrescription.MED_PRESCRIPTION_EXTENSION_URL_PREFIX + key, valueX, x));
    } else {
        return null;
    }
}

function setExtensions(mp, item) {
    var ext = [
        createExtension('IMO', item.IMO, 'Boolean'),
        createExtension('facilityCode', item.facilityCode, 'String'),
        createExtension('facilityName', item.facilityName, 'String'),
        createExtension('kind', item.kind, 'String'),
        createExtension('lastFilled', item.lastFilled, 'String'),
        createExtension('lastUpdateTime', item.lastUpdateTime, 'String'),
        createExtension('localId', item.localId, 'String'),
        createExtension('medStatus', item.medStatus, 'String'),
        createExtension('medStatusName', item.medStatusName, 'String'),
        createExtension('medType', item.medType, 'String'),
        createExtension('patientInstruction', item.patientInstruction, 'String'),
        createExtension('qualifiedName', item.qualifiedName, 'String'),
        createExtension('stampTime', item.stampTime, 'String'),
        createExtension('stopped', item.stopped, 'String'),
        createExtension('supply', item.supply, 'Boolean'),
        createExtension('type', item.type, 'String'),
        createExtension('units', item.units, 'String'),
        createExtension('vaType', item.vaType, 'String')
    ];
    setDosagesExtensions(ext, item);
    setFillsExtensions(ext, item);
    setOrdersExtensions(ext, item);
    setProductsExtensions(ext, item);

    mp.extension = _.compact(ext); // remove all null entries from ext
}

function setDosagesExtensions(ext, item) {
    if (nullchecker.isNotNullish(item.dosages)) {
        for (var i = 0; i < item.dosages.length; i++) {
            var o = item.dosages[i];
            ext.push(createExtension('dosages[' + i + ']]/instructions', o.instructions, 'String'));
            ext.push(createExtension('dosages[' + i + ']]/noun', o.noun, 'String'));
            ext.push(createExtension('dosages[' + i + ']]/relativeStart', o.relativeStart, 'Integer'));
            ext.push(createExtension('dosages[' + i + ']]/relativeStop', o.relativeStop, 'Integer'));
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
            ext.push(createExtension('orders[' + i + ']/prescriptionId', o.prescriptionId, 'String'));
            ext.push(createExtension('orders[' + i + ']/providerName', o.providerName, 'String'));
            ext.push(createExtension('orders[' + i + ']/summary', o.summary, 'String'));
            ext.push(createExtension('orders[' + i + ']/vaRouting', o.vaRouting, 'String'));
        }
    }
}

function setProductsExtensions(ext, item) {
    if (nullchecker.isNotNullish(item.products)) {
        for (var i = 0; i < item.products.length; i++) {
            var o = item.orders[i];
            ext.push(createExtension('products[' + i + ']/drugClassCode', o.drugClassCode, 'String'));
            ext.push(createExtension('products[' + i + ']/ingredientRXNCode', o.ingredientRXNCode, 'String'));
            ext.push(createExtension('products[' + i + ']/strength', o.strength, 'String'));
            ext.push(createExtension('products[' + i + ']/summary', o.summary, 'String'));
            ext.push(createExtension('products[' + i + ']/suppliedCode', o.suppliedCode, 'String'));
        }
    }
}

module.exports.buildBundle = buildBundle;
module.exports.convertToFhir = convertToFhir;
module.exports.convertToMedicationPrescription = convertToMedicationPrescription;
