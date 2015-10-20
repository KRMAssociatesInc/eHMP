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
        '_default_': 'completed'
    },
    getvaStatus: function(vaStatus) {
        return this.vaStatus[vaStatus] || this.vaStatus._default_;
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
        'not active': 'entered-in-error', // ?? DSTU1 used to have: 'stopped'
        'hold': 'entered-in-error', // ?? DSTU1 used to have: 'on hold'
        'active': 'in-progress',
        '_default_': 'entered-in-error' // ?? DSTU2 spec has no default setting
    },
    getmedStatusName: function(medStatusName) {
        return this.medStatusName[medStatusName] || this.medStatusName._default_;
    }
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
        fhirItems.push(buildMedicationStatement(items[i], req));
    }
    return fhirItems;
}

//--------------------------------------
//BUILD MEDICATION STATEMENT ENTRIES
//--------------------------------------
function buildMedicationStatement(item) {

    var md = new fhirResource.MedicationStatement();
    md.contained = [];

    setIdentifier(md, item);
    setPatient(md, item);
    setInformationSource(md, item);
    //setDateAsserted(md, item);   //unmapped due to no data from source
    setStatus(md, item);
    setWasNotGiven(md, item);
    //setreasonNotGiven(md,item); //unmapped due to no data from source
    //setReasonForUse(md,item);   //unmapped due to no data from source
    setEffective(md, item);
    setNote(md, item);
    setMedication(md, item);
    setDosage(md, item);

    return md;

}


//-------------------------------------------------------
//SET NOTE
//-------------------------------------------------------
function setNote(md, item) {
        md.note = item.summary;
    }
    //-------------------------------------------------------
    //SET EFFECTIVEPERIOD
    //-------------------------------------------------------
function setEffective(md, item) {

    if (nullchecker.isNotNullish(item.dosages) && item.dosages.length > 0) {

        md.effectivePeriod = {};

        if (nullchecker.isNotNullish(item.dosages[0].start)) {
            md.effectivePeriod.start = fhirUtils.convertToFhirDateTime(item.dosages[0].start);
        }

        if (nullchecker.isNotNullish(item.dosages[0].stop)) {
            md.effectivePeriod.end = fhirUtils.convertToFhirDateTime(item.dosages[0].stop);
        }
    }
}

//-------------------------------------------------------
//SET WASNOTGIVEN
//-------------------------------------------------------
function setWasNotGiven(md, item) {

        md.wasNotGiven = true;
        if (nullchecker.isNotNullish(item.dosages) && item.dosages.length > 0) {
            md.wasNotGiven = false;
        }
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
    //SET STATEMENT STATUS
    //-------------------------------------------------------
function setStatus(md, item) {
        if (nullchecker.isNotNullish(item.medStatusName)) {
            md.status = map.getmedStatusName(item.medStatusName);
        }
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
    //SET INFORMATIONSOURCE
    //-------------------------------------------------------
function setInformationSource(md, item) {

    if (nullchecker.isNotNullish(item.orders[0]) && nullchecker.isNotNullish(item.orders[0].providerUid)) {

        var value = item.orders[0].providerUid;
        md.informationSource = new fhirResource.ReferenceResource('Practitioner/' + value);
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
    if (nullchecker.isNotNullish(item.rxncodes)) {

        var ext = [];
        for (i in valueX) {
            if (nullchecker.isNotNullish(valueX[i].code)) {
                ext.push(new fhirResource.Extension(url, valueX[i].code, 'string'));
            }
        }
        med.extension = ext;
    }

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
// function setWhenPrepared(md, item) {
//     if (nullchecker.isNotNullish(item.lastFilled)) {
//         md.whenPrepared = fhirUtils.convertToFhirDateTime(item.lastFilled);
//     }
// }
//-------------------------------------------------------
//SET WHENHANDEDOVER
//NOTE: setting to last fill date since fill/dispenseDate can be multi.
//-------------------------------------------------------
// function setWhenHandedOver(md, item) {
//     if (nullchecker.isNotNullish(item.lastFilled)) {
//         md.whenPrepared = fhirUtils.convertToFhirDateTime(item.lastFilled);
//     }
// }
//-------------------------------------------------------
// SET NOTE
//-------------------------------------------------------
function setNote(md, item) {
        md.note = item.summary;
    }
    //-------------------------------------------------------
    // SET DOSAGEINSTRUCTION
    //-------------------------------------------------------
function setDosage(md, item) {

    if (nullchecker.isNotNullish(item.dosages) && item.dosages.length > 0) {

        md.dosage = {};

        //text
        md.dosage.text = item.dosages[0].summary;

        //scheduleTiming
        //NOTE:  NO CodeableConcept (system, version, primary) DATA FROM SOURCE
        if (nullchecker.isNotNullish(item.dosages[0].scheduleName)) {
            md.dosage.schedule = {};
            md.dosage.schedule.code = new fhirResource.CodeableConcept(
                item.dosages[0].scheduleName,
                new fhirResource.Coding(item.dosages[0].scheduleName, item.dosages[0].scheduleName));
            md.dosage.schedule.repeat = {};
            md.dosage.schedule.repeat.frequency = item.dosages[0].scheduleFreq;
        }

        //asNeededBoolean
        //asNeededCodeableConcept
        //site

        //route
        md.dosage.route = new fhirResource.CodeableConcept(
            map.getrouteNameDesc(item.dosages[0].routeName),
            new fhirResource.Coding(
                item.dosages[0].routeName,
                map.getrouteNameDesc(item.dosages[0].routeName),
                'urn:oid:2.16.840.1.113883.6.233')
        );

        //method

        //doseQuantity
        var value = item.dosages[0].dose;
        var units = item.dosages[0].units;

        if (nullchecker.isNotNullish(value)) {
            md.dosage.quantity = new fhirResource.Quantity(value, units);
        }
        //rate
        //maxDosePerPeriod

    }
}

// EXTENSIONS at main level
// function setPrimaryExtensions(md, item) {
//     var ext = [];
//     var url = '';
//     var valueX = '';

//     // SET all fills' (releaseDate)
//     url = constants.medDispense.MED_DISPENSE_EXTENSION_URL_PREFIX + 'fills/releaseDate';
//     valueX = item.fills;
//     for (var i in valueX) {
//         if (nullchecker.isNotNullish(valueX[i].releaseDate)) {
//             ext.push(new fhirResource.Extension(url, valueX[i].releaseDate, 'string'));
//         }
//     }

//     // SET all fills' (dispensedate)
//     url = constants.medDispense.MED_DISPENSE_EXTENSION_URL_PREFIX + 'fills/dispenseDate';
//     valueX = item.fills;
//     for (var i in valueX) {
//         if (nullchecker.isNotNullish(valueX[i].dispenseDate)) {
//             ext.push(new fhirResource.Extension(url, valueX[i].dispenseDate, 'string'));
//         }
//     }

//     //ext.push(Extensions(item, 'validityPeriod', ))
//     md.extension = ext;
// }


module.exports.buildBundle = buildBundle;
module.exports.convertToFhir = convertToFhir;
