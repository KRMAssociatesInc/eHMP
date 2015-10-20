/*jslint node: true*/
'use strict';
var rdk = require('../../core/rdk');
var _ = rdk.utils.underscore;
var fhirResource = require('../common/entities/fhir-resource');
var fhirUtils = require('../common/utils/fhir-converter');
var nullchecker = rdk.utils.nullchecker;
var constants = require('../common/utils/constants');
var helpers = require('../common/utils/helpers');

var map = {
    vaStatus: {
        'EXPIRED': 'completed',
        'DISCONTINUED': 'stopped',
        'HOLD': 'on hold',
        'FLAGGED': 'on hold',
        'PENDINNG': 'in progress',
        'ACTIVE': 'in progress',
        'DELAYED': 'on hold',
        'UNRELEASED': 'in progress',
        'DISCONTINUED/EDIT': 'stopped',
        'CANCELLED': 'stopped',
        'LAPSED': 'stopped',
        'RENEWED': 'in progress',
        'NO STATUS': 'on hold',
        '_default_': 'ccccompleted'
    },
    getvaStatus: function(vaStatus) {
        return this.vaStatus[vaStatus.toUpperCase()] || this.vaStatus._default_;
    },
    routeName: {
        'AP': ['Apply Externally', 'TODO'],
        'B': ['Buccal', 'TODO'],
        'DT': ['Dental', 'TODO'],
        'EP': ['Epidural', 'TODO'],
        'ET': ['Endotrachial Tube', 'TODO'],
        'GTT': ['Gastrostomy Tube', 'TODO'],
        'GU': ['GU Irrigant', 'TODO'],
        'IA': ['Intra-arterial', 'TODO'],
        'IB': ['Intrabursal', 'TODO'],
        'IC': ['Intracardiac', 'TODO'],
        'ICV': ['Intracervical (uterus)', 'TODO'],
        'ID': ['Intradermal', 'TODO'],
        'IH': ['Inhalation', 'TODO'],
        'IHA': ['Intrahepatic Artery', 'TODO'],
        'IM': ['Intramuscular', 'TODO'],
        'IMR': ['Immerse (Soak) Body Part', 'TODO'],
        'IN': ['Intranasal', 'TODO'],
        'IO': ['Intraocular', 'TODO'],
        'IP': ['Intraperitoneal', 'TODO'],
        'IS': ['Intrasynovial', 'TODO'],
        'IT': ['Intrathecal', 'TODO'],
        'IU': ['Intrauterine', 'TODO'],
        'IV': ['Intravenous', 'TODO'],
        'MM': ['Mucous Membrane', 'TODO'],
        'MTH': ['Mouth/Throat', 'TODO'],
        'NG': ['Nasogastric', 'TODO'],
        'NP': ['Nasal Prongs', 'TODO'],
        'NS': ['Nasal', 'TODO'],
        'NT': ['Nasotrachial Tube', 'TODO'],
        'OP': ['Ophthalmic', 'TODO'],
        'OT': ['Otic', 'TODO'],
        'OTH': ['Other/Miscellaneous', 'TODO'],
        'PF': ['Perfusion', 'TODO'],
        'PO': ['Oral', 'TODO'],
        'PR': ['Rectal', 'TODO'],
        'RM': ['Rebreather Mask', 'TODO'],
        'SC': ['Subcutaneous', 'TODO'],
        'SD': ['Soaked Dressing', 'TODO'],
        'SL': ['Sublingual', 'TODO'],
        'TD': ['Transdermal', 'TODO'],
        'TL': ['Translingual', 'TODO'],
        'TP': ['Topical', 'TODO'],
        'TRA': ['Tracheostomy', 'TODO'],
        'UR': ['Urethral', 'TODO'],
        'VG': ['Vaginal', 'TODO'],
        'VM': ['Ventimask', 'TODO'],
        'WND': ['Wound', 'TODO']
    },
    getrouteNameDesc: function(jdsCode) {

        return (this.routeName[jdsCode]) ? this.routeName[jdsCode][0] : jdsCode;
    },
    getrouteNameFhir: function(jdsCode) {
        return (this.routeName[jdsCode]) ? this.routeName[jdsCode][1] : jdsCode;
    },
    vaType: {
        'I': 'Inpatient',
        'N': 'Non-Va',
        'O': 'Outpatient',
        'V': 'IV'
    },
    medStatusName: {
        'historical': 'completed',
        'not active': 'stopped',
        'hold': 'on hold',
        'active': 'active'
    },
    getmedStatusName: function(medStatusName) {
        return this.medStatusName[medStatusName] || this.medStatusName._default_;
    },
};

//--------------------------------------------------------------------------
// MAIN - build bundle (note DSTU2 Bundle) and convert to fhir format.
//--------------------------------------------------------------------------
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
        fhirItems.push(buildMedicationDispense(items[i], req));
    }
    return fhirItems;
}

//--------------------------------------
//BUILD MEDICATIONDISPENSE ENTRIES
//--------------------------------------
function buildMedicationDispense(item) {

    var md = new fhirResource.MedicationDispense();
    md.contained = [];

    //  md.text = ...
    //  SetContained_and_refs(md,item);
    //  setPrimaryExtensions(md, item);

    setIdentifier(md, item);
    setDispenseStatus(md, item);
    setPatient(md, item);
    setDispenser(md, item);
    setAuthorizingPrescription(md, item);
    //  setType(md, item);        //NO OBVIOUS PLACE IN FHIR
    setQuantityDispensed(md, item);
    setDaysSupply(md, item);
    setMedication(md, item);
    setWhenPrepared(md, item);
    setWhenHandedOver(md, item);
    //  setDestination(md, item); //NOT EXPLICITELY GIVEN BY DATA SOURCE
    //  setReceiver(md, item);    //NOT EXPLICITELY GIVEN BY DATA SOURCE
    setNote(md, item);
    setDosageInstruction(md, item);
    //  setSubstitution(md, item); //NOT EXPLICITELY GIVEN BY DATA SOURCE

    return md;

}

//-------------------------------------------------------
//SET IDENTIFIER
//-------------------------------------------------------
function setIdentifier(md, item) {
        if (nullchecker.isNotNullish(item.uid)) {
            md.identifier = new fhirResource.Identifier(item.uid, constants.medDispense.MED_DISPENSE_UID_IDENTIFIER_SYSTEM);
        }
    }
    //-------------------------------------------------------
    //SET DISPENSE STATUS
    //-------------------------------------------------------
function setDispenseStatus(md, item) {
        if (nullchecker.isNotNullish(item.vaStatus)) {
            md.status = map.getvaStatus(item.vaStatus);
        }
        // FHIR DSTU2 spec does not define what the default status, so we will default the default.
        //    if (nullchecker.isNullish(md.status)) {
        //        md.status = fhirResource.MedicationDispenseStatus['completed'];
        //    }
    }
    //-------------------------------------------------------
    //SET PATIENT
    //-------------------------------------------------------
function setPatient(md, item) {
        var value = item.pid;

        if (nullchecker.isNotNullish(value)) {
            md.patient = new fhirResource.ReferenceResource('Patient/' + value);
        }
    }
    //-------------------------------------------------------
    //SET DISPENSER
    //-------------------------------------------------------
function setDispenser(md, item) {
    var value = item.orders[0].providerUid;

    if (nullchecker.isNotNullish(value)) {
        md.dispenser = new fhirResource.ReferenceResource('Provider/' + value);
    }
}

//-------------------------------------------------------
//SET AUHTORIZING PRESCRIPTION
//Indicates the medication order that is being dispensed against.
//NOTE:  JDS give the original PrescriptionId .. so we can use
//       that instead of building a "contained" node of
//-------------------------------------------------------
function setAuthorizingPrescription(md, item) {
    var mp = createPrescriptionResource(item);
    md.authorizingPrescription = new fhirResource.ReferenceResource('#' + mp.id, item.name);
    md.contained.push(mp);
}

function createPrescriptionResource(item) { //(md, item) {

    //GENERATE a unique UUID as reference id for this internal contained Prescription object.
    var mp = new fhirResource.MedicationPrescription(helpers.generateUUID(), item.pid);

    //identifier
    if (nullchecker.isNotNullish(item.uid)) {
        mp.identifier = [new fhirResource.Identifier(item.uid, constants.medPrescription.MED_PRESCRIPTION_UID_IDENTIFIER_SYSTEM)];
    }


    //status
    if (nullchecker.isNotNullish(item.medStatusName)) {
        mp.status = map.getmedStatusName(item.medStatusName);
        //mp.status = fhirResource.MedicationDispenseStatus[fhirResource.getMedicationPrescriptionStatus(item.vaStatus)];
    }

    //patient (REF)
    if (nullchecker.isNotNullish(item.pid)) {
        mp.patient = new fhirResource.ReferenceResource(constants.medPrescription.PATIENT_PREFIX + item.pid);
    }

    //prescriber (REF) & dateWritten
    if (nullchecker.isNotNullish(item.orders) && item.orders.length > 0) {
        var order = item.orders[0];
        if (nullchecker.isNotNullish(order.ordered)) {
            mp.dateWritten = fhirUtils.convertToFhirDateTime(order.ordered);
        }
        if (nullchecker.isNotNullish(order.providerUid)) {
            mp.prescriber = new fhirResource.ReferenceResource(constants.medPrescription.PRESCRIBER_PREFIX + order.providerUid);
        }
    }

    //encounter (REF)
    //reasonCodeableConcept || reasonReference
    //note
    mp.note = item.summary;

    //medication (REF)
    //dosageInstruction
    //dispense
    //substitution

    //        var medprescription = BuildMedicationPrescription(item);
    //
    //        //add medication reference
    //        medprescription.medication.reference = '#' + medication.medicationId;
    //        //add substance reference
    //        medication.medication.product.ingredient = [{
    //            item: {
    //                reference: '#' + substance.substanceId
    //            }
    //        }];
    //
    //        md.contained.push(medprescription);

    return mp;
}

//-------------------------------------------------------
//SET QUANTITYDISPENSED
//-------------------------------------------------------
function setQuantityDispensed(md, item) {
        var value = item.fills[0].quantityDispensed;
        var units = item.productFormName;

        if (nullchecker.isNotNullish(value)) {
            md.quantity = new fhirResource.Quantity(value, units, null, null);
        }
    }
    //-------------------------------------------------------
    //SET DAYS SUPPLY
    //The amount of medication expressed as a timing amount.
    //-------------------------------------------------------
function setDaysSupply(md, item) {
        var value = item.orders[0].daysSupply;

        if (nullchecker.isNotNullish(value)) {
            md.daysSupply = new fhirResource.Quantity(value, 'days', null, null);
        }
    }
    //-------------------------------------------------------
    //SET MEDICATION as a contained resource, and it's reference
    //-------------------------------------------------------
function setMedication(md, item) {
    var med = createMedicationResource(item);
    md.medication = new fhirResource.ReferenceResource('#' + med.id, item.name);
    md.contained.push(med);
}

function createMedicationResource(item) {
    var i;
    //GENERATE a unique UUID as reference id for this internal contained Medication object.
    var med = new fhirResource.Medication(helpers.generateUUID(), item.name);

    //--------------------------------------
    // SET medication.codes
    // NOTE:  JDS source can return multiple codes but FHIR can only hold 1.
    // TODO:  Need to loop through all codes found from source,
    //        and store 1st one in fhirItem.code,
    //        then put rest in localized extensions (sim. to rxncodes).
    //--------------------------------------
    if (nullchecker.isNotNullish(item.codes) && item.codes.length > 0) {
        var c = item.codes[0];
        var coding = new fhirResource.Coding(c.code, c.display, c.system);
        med.code = new fhirResource.CodeableConcept(c.display, [coding]);
        med.code.text = c.code + '/' + c.display;
    }

    //SET PRODUCT
    med.product = {
        form: {
            text: item.productFormName
        }
    };
    if (nullchecker.isNotNullish(item.products) && item.products.length > 0) {
        med.contained = [];
        med.product.ingredient = [];

        for (i = 0; i < item.products.length; i++) {
            //SET product.item.substance
            var substance = createSubstance(item.products[i]);
            med.contained.push(substance);
            med.product.ingredient.push({
                item: new fhirResource.ReferenceResource('#' + substance.id, item.products[0].ingredientName)
            });
        }
    }

    //SET any additional codes: i.e. RXNORM
    var url = constants.medDispense.MED_DISPENSE_EXTENSION_URL_PREFIX + 'rxncodes';
    var valueX = _.union(
        _.map(item.rxncodes, function(code) {
            return {
                code: code
            };
        })
    );
    // SET extensions for medication
    var ext = [];
    for (i in valueX) {
        if (nullchecker.isNotNullish(valueX[i].code)) {
            ext.push(new fhirResource.Extension(url, valueX[i].code, 'string'));
        }
    }
    med.extension = ext;
    return med;
}

function createSubstance(p) {
    var coding = [
        new fhirResource.Coding(p.ingredientCode, p.ingredientCodeName, constants.medPrescription.INGREDIENT_IDENTIFIER_SYSTEM),
        new fhirResource.Coding(p.ingredientRole, p.ingredientName, 'SNOMED-CT')
    ];
    var type = new fhirResource.CodeableConcept(p.suppliedName, coding);
    return new fhirResource.Substance(helpers.generateUUID(), type, p.suppliedName);
}


//-------------------------------------------------------
//SET WHENPREPARED
//NOTE: setting to last fill date since fill/releaseDate can be multi.
//-------------------------------------------------------
function setWhenPrepared(md, item) {

        if (nullchecker.isNotNullish(item.lastFilled)) {
            md.whenPrepared = fhirUtils.convertToFhirDateTime(item.lastFilled);
        }

    }
    //-------------------------------------------------------
    //SET WHENHANDEDOVER
    //NOTE: setting to last fill date since fill/dispenseDate can be multi.
    //-------------------------------------------------------
function setWhenHandedOver(md, item) {

        if (nullchecker.isNotNullish(item.lastFilled)) {
            md.whenPrepared = fhirUtils.convertToFhirDateTime(item.lastFilled);
        }
    }
    //-------------------------------------------------------
    // SET NOTE
    //-------------------------------------------------------
function setNote(md, item) {
        md.note = item.summary;
    }
    //-------------------------------------------------------
    // SET DOSAGEINSTRUCTION
    //-------------------------------------------------------
function setDosageInstruction(md, item) {

    if (nullchecker.isNotNullish(item.dosages) && item.dosages.length > 0) {


        md.dosageInstruction = {};

        //additionalInstructions ... NO COMPATIBLE DATA FROM SOURCE
        //scheduleDateTime ... NO COMPATIBLE DATA FROM SOURCE

        //schedulePeriod
        //if (nullchecker.isNotNullish(item.dosages[0].start)) {
        if (nullchecker.isNotNullish(item.dosages[0].start)) {
            md.dosageInstruction.schedulePeriod = {};
            md.dosageInstruction.schedulePeriod.start = fhirUtils.convertToFhirDateTime(item.dosages[0].start);
            md.dosageInstruction.schedulePeriod.end = fhirUtils.convertToFhirDateTime(item.dosages[0].stop);
            //?md.dosageInstruction.schedulePeriod.extension = new Extension((item.dosages[0]), 'scheduleType', 'timing');
        }
        //scheduleTiming
        //NOTE:  NO CodeableConcept (system, version, primary) DATA FROM SOURCE

        if (nullchecker.isNotNullish(item.dosages[0].scheduleName)) {
            md.dosageInstruction.scheduleTiming = {};
            md.dosageInstruction.scheduleTiming.code = new fhirResource.CodeableConcept(
                item.dosages[0].scheduleName,
                new fhirResource.Coding(item.dosages[0].scheduleName, item.dosages[0].scheduleName));
            md.dosageInstruction.scheduleTiming.repeat = {};
            md.dosageInstruction.scheduleTiming.repeat.frequency = item.dosages[0].scheduleFreq;
        }

        //asNeededBoolean
        //asNeededCodeableConcept
        //site

        //route
        //Coding(code, display, system, version, primary)
        md.dosageInstruction.route = new fhirResource.CodeableConcept(
            map.getrouteNameDesc(item.dosages[0].routeName),
            new fhirResource.Coding(
                item.dosages[0].routeName,
                map.getrouteNameDesc(item.dosages[0].routeName),
                'urn:oid:2.16.840.1.113883.6.233')
        );

        //method
        //doseRange

        //doseQuantity
        var value = item.dosages[0].dose;
        var units = item.dosages[0].units;

        if (nullchecker.isNotNullish(value)) {
            md.dosageInstruction.doseQuantity = new fhirResource.Quantity(value, units);
        }
        //rate
        //maxDosePerPeriod
    }
}

// EXTENSIONS at main level
// function setPrimaryExtensions(md, item) {
//     var i;
//     var ext = [];
//     var url = '';
//     var valueX = '';

//     // SET all fills' (releaseDate)
//     url = constants.medDispense.MED_DISPENSE_EXTENSION_URL_PREFIX + 'fills/releaseDate';
//     valueX = item.fills;
//     for (i in valueX) {
//         if (nullchecker.isNotNullish(valueX[i].releaseDate)) {
//             ext.push(new fhirResource.Extension(url, valueX[i].releaseDate, 'string'));
//         }
//     }

//     // SET all fills' (dispensedate)
//     url = constants.medDispense.MED_DISPENSE_EXTENSION_URL_PREFIX + 'fills/dispenseDate';
//     valueX = item.fills;
//     for (i in valueX) {
//         if (nullchecker.isNotNullish(valueX[i].dispenseDate)) {
//             ext.push(new fhirResource.Extension(url, valueX[i].dispenseDate, 'string'));
//         }
//     }

//     //ext.push(Extensions(item, 'validityPeriod', ))
//     md.extension = ext;
// }


module.exports.buildBundle = buildBundle;
module.exports.convertToFhir = convertToFhir;
