'use strict';

var helpers = require('../utils/helpers.js'),
    rdk = require('../../../core/rdk'),
    nullchecker = rdk.utils.nullchecker,
    fhirUtils = require('../utils/fhir-converter'),
    //var utils = require('../utils/fhir-converter.js');
    _ = rdk.utils.underscore,
    map = {
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
            'not active': 'stopped',
            'hold': 'on hold',
            'active': 'active'
        }


    };

_.mixin({
    compactObject: function(o) {
        _.each(o, function(v, k) {
            var str = JSON.stringify(o[k]);
            if ((str === '{}') || (str === '[]') || (str === '[{}]') || (str === 'undefined')) {
                delete o[k];
            } else if (v instanceof Object) {
                o[k] = _.compactObject(v);
            }
        });
        return o;
    }
});

function objectFactory(objType, item) {
    var obj = new FactoryObject();
    if (obj[objType]) {
        return obj[objType](item);
    } else {
        return null;
    }
}
module.exports.outpatientmedsFactory = objectFactory;


var FactoryObject = function() {};

FactoryObject.prototype = {
    MedicationDispenseItem: BuildMedicationDispense,
    MedicationStatementItem: BuildMedicationStatement
};



function BuildMedicationStatement(item) {
    var contained_and_refs = new BuilContained_and_refs_Statement(item);
    var ret = {
        _id: helpers.generateUUID(),
        resourceType: 'MedicationStatement',
        contained: contained_and_refs,
        identifier: {
            system: 'urn:oid:2.16.840.1.113883.6.233',
            value: item.uid
        },
        patient: {
            reference: 'Patient/' + item.pid
        },
        medication: {
            reference: '#' + _.findWhere(contained_and_refs, {
                resourceType: 'Medication'
            })._id
        },
        extension: _.union(new BuildExtensions(item, 'MedicationStatement', true), new BuildExtensions(item.orders[0], 'MedicationStatement', true))


    };
    if (item.dosages && item.dosages[0]) {
        ret.whenGiven = {
            start: fhirUtils.convertToFhirDateTime(item.dosages[0].start),
            end: fhirUtils.convertToFhirDateTime(item.dosages[0].stop)
        };
        ret.dosage = [{
            route: {
                text: map.getrouteNameDesc(item.dosages[0].routeName),
                coding: {
                    system: 'urn:oid:2.16.840.1.113883.6.233',
                    display: map.getrouteNameDesc(item.dosages[0].routeName),
                    code: (item.dosages[0].routeName)
                }
            },
            quantity: {
                value: item.dosages[0].dose,
                units: item.dosages[0].units
            },
            timing: new BuildDosageTiming(item),
            extension: _.union(new BuildExtensions(item, 'MedicationStatement_dosage', true),
                new BuildExtensions((item.orders && item.orders[0]) ? item.orders[0] : {}, 'MedicationStatement', true),
                new BuildExtensions((item.orders && item.orders[0]) ? item.orders[0] : {}, 'MedicationStatement_dosage', true),
                new BuildExtensions((item.dosages && item.dosages[0]) ? item.dosages[0] : {}, 'MedicationStatement_dosage', true),
                new BuildExtensions((item.fills && item.fills[0]) ? item.fills[0] : {}, 'MedicationStatement_dosage', true)
            )

        }];

    }
    return _.compactObject(ret);
}

function BuilContained_and_refs_Statement(item) {
    var contained = [];
    var medication = new BuildMedication(item);
    var substance = new BuildSubstance(item);
    //add substance reference
    medication.medication.product.ingredient = [{
        item: {
            reference: '#' + substance.substanceId
        }
    }];
    contained.push(medication.medication, substance.substance);
    return contained;
}

function BuildMedicationDispense(item) {
    var contained_and_refs = new BuildContained_and_refs(item);
    var practicioner = _.findWhere(contained_and_refs, {
        resourceType: 'Practitioner'
    });
    var id;
    if (practicioner) {
        id = practicioner._id;
    }
    var ret = {
        _id: item.uid,
        text: item.summary,
        resourceType: 'MedicationDispense',
        identifier: {
            system: 'urn:oid:2.16.840.1.113883.6.233',
            value: item.uid
        },
        status: map.getvaStatus(item.vaStatus),
        contained: contained_and_refs,
        dispenser: {
            practitioner: {
                reference: '#' + id
            }
        },
        authorizingPrescription: {
            reference: '#' + _.findWhere(contained_and_refs, {
                resourceType: 'MedicationPrescription'
            })._id
        },
        dispense: {
            extension: _.union(new BuildExtensions(item, 'dispense'),
                new BuildExtensions((item.orders && item.orders[0]) ? item.orders[0] : {}, 'dispense'),
                new BuildExtensions((item.administrations && item.administrations[0]) ? item.administrations[0] : {}, 'dispense'),
                new BuildExtensions((item.fills) ? item.fills[0] : {}, 'dispense')),
            quantity: ((item.fills && item.fills[0]) ? item.fills[0] : {}).quantityDispensed,
            whenPrepared: fhirUtils.convertToFhirDateTime((item.fills && item.fills[0]) ? item.fills[0].releaseDate : null),
            whenHandedOver: fhirUtils.convertToFhirDateTime((item.fills && item.fills[0]) ? item.fills[0].dispenseDate : null)
        },
        extension: new BuildExtensions(item),
    };
    return _.compactObject(ret);
}

function BuildContained_and_refs(item) {
    var contained = [];
    var location = new BuildLocation(item);
    var medication = new BuildMedication(item);
    var enc = new BuildEncounter(item);
    var medprescription = new BuildMedicationPrescription(item);
    var substance = new BuildSubstance(item);
    //add location reference
    enc.location = [];
    enc.location.push({
        location: {
            reference: '#' + location.locationId
        },
        period: {
            start: fhirUtils.convertToFhirDateTime((item.orders && item.orders[0]) ? item.orders[0].ordered : null),
            end: fhirUtils.convertToFhirDateTime((item.orders && item.orders[0]) ? item.orders[0].ordered : null)
        }
    });
    //add medication reference
    medprescription.medication.reference = '#' + medication.medicationId;
    //add substance reference
    medication.medication.product.ingredient = [{
        item: {
            reference: '#' + substance.substanceId
        }
    }];

    contained.push(location.location);
    contained.push(enc);
    contained.push(substance.substance);
    contained.push(new BuildPractitioner(item));
    contained.push(medication.medication);
    contained.push(medprescription);
    return contained;
}

function BuildSubstance(item) {
    var obj = this;
    var substanceId = helpers.generateUUID();
    obj.substanceId = substanceId;
    obj.substance = {
        resourceType: 'Substance',
        _id: substanceId,
        description: item.qualifiedName,
        type: {
            text: item.name,
            coding: []
        }
    };

    if (item.products && item.products[0]) {
        obj.substance.type.coding.push({
            code: (item.products[0].ingredientCode),
            display: (item.products[0].ingredientCodeName),
            system: 'urn:oid:2.16.840.1.113883.6.233'
        });
    }
    if (item.products && item.products[0] && item.products[0].ingredientRole && item.products[0].ingredientRole.indexOf('urn:sct:') === 0) {
        obj.substance.type.coding.push({
            code: (item.products[0].ingredientRole),
            display: (item.products[0].ingredientName),
            system: 'SNOMED-CT'
        });
    }

    return obj;
}

function BuildMedication(item) {
    var obj = this;
    var medicationId = 'Medication/' + item.uid;
    obj.medication = {
        resourceType: 'Medication',
        _id: medicationId,
        name: item.name,
        code: {
            coding: _.union(
                _.map(item.rxncodes, function(code) {
                    return {
                        code: code
                    };
                }),
                _.map(item.codes, function(obj) {
                    return {
                        code: obj.code,
                        system: obj.system,
                        display: obj.display
                    };
                })),
            text: item.name

        },
        product: {
            form: {
                text: item.productFormName,
                coding: [{
                    system: 'urn:oid:2.16.840.1.113883.6.233',
                    code: item.productFormCode
                }]
            }

        },
        extension: new BuildExtensions(item.products[0] ? item.products[0] : {}, 'Medication')
    };
    obj.medicationId = medicationId;
    return obj;
}

function BuildMedicationPrescription(item) {
    var medpresc = {
        resourceType: 'MedicationPrescription',
        _id: helpers.generateUUID(),
        identifier: [{
            value: item.uid,
            system: 'urn:oid:2.16.840.1.113883.6.233'
        }],
        dateWritten: fhirUtils.convertToFhirDateTime(item.orders && item.orders[0] ? item.orders[0].ordered : null),
        status: {
            code: map.medStatusName[item.medStatusName]
        },
        patient: {
            reference: 'Patient/' + item.pid
        },
        text: {
            div: item.summary
        },
        encounter: {
            location: [{
                location: {
                    identifier: item.facilityCode
                }
            }]
        },
        medication: {
            display: item.name
        },

        extension: _.union(new BuildExtensions(item, 'MedicationPrescription'),
            new BuildExtensions(item.orders && item.orders[0] ? item.orders[0] : {}, 'MedicationPrescription'),
            new BuildExtensions(item.dosages && item.dosages[0] ? item.dosages[0] : {}, 'MedicationPrescription'))

    };
    if (item.orders && item.orders[0]) {
        medpresc.dispense = {
            numberOfRepeatsAllowed: item.orders[0].fillsAllowed,
            quantity: item.orders[0].quantityOrdered,
            expectedSupplyDuration: item.orders[0].daysSupply,
            validityPeriod: {
                extension: [new Extension(item, 'stopped', 'validityPeriod')],
                start: fhirUtils.convertToFhirDateTime(item.overallStart),
                end: fhirUtils.convertToFhirDateTime(item.overallStop)
            }
        };

        medpresc.identifier.push({
            value: item.orders[0].prescriptionId,
            system: 'urn:oid:2.16.840.1.113883.6.233',
            use: 'prescriptionId'
        });
    }
    if (item.dosages && item.dosages[0]) {
        medpresc.dosageInstruction = new BuildDosageInstruction(item);
    }
    return medpresc;
}

function BuildDosageTiming(item) {
    if (item.dosages && item.dosages[0]) {
        return {
            period: {
                extension: [new Extension((item.dosages[0]), 'scheduleType', 'timing')],
                start: fhirUtils.convertToFhirDateTime((item.dosages && item.dosages[0]) ? item.dosages[0].start : null),
                end: fhirUtils.convertToFhirDateTime((item.dosages && item.dosages[0]) ? item.dosages[0].stop : null)
            },
            schedule: {
                extension: [new Extension(item.dosages[0], 'scheduleName', 'timing')]
            }

        };
    }
}

function BuildDosageInstruction(item) {
    if (item.dosages && item.dosages[0]) {
        return [{
            extension: new BuildExtensions((item.dosages[0]), 'dosageInstruction'),
            text: item.sig,
            timing: new BuildDosageTiming(item),
            route: {
                text: map.getrouteNameDesc(item.dosages[0].routeName),
                coding: {
                    system: 'urn:oid:2.16.840.1.113883.6.233',
                    display: map.getrouteNameDesc(item.dosages[0].routeName),
                    code: item.dosages[0].routeName
                }
            },
            doseQuantity: {
                value: item.dosages[0].dose,
                units: item.dosages[0].units
            }
        }];
    }
}

function BuildPractitioner(item) {
    if (item.fills && item.fills[0] && item.orders && item.orders[0]) {
        var ret = {
            resourceType: 'Practitioner',
            _id: helpers.generateUUID(),
            name: {
                text: item.orders[0].providerName
            },
            identifier: {
                label: 'provider-uid',
                value: item.orders[0].providerUid,
                system: 'urn:oid:2.16.840.1.113883.6.233'
            }
        };
        if (item.fills && item.fills[0]) {
            ret.organization = {
                name: item.fills[0].dispensingPharmacy
            };
        }
        return ret;
    }

}

function BuildLocation(item) {
    var obj = this;
    var locationId = helpers.generateUUID();
    obj.location = {
        resourceType: 'Location',
        _id: locationId,
        name: item.facilityName,
        identifier: {
            value: item.facilityCode,
            system: 'urn:oid:2.16.840.1.113883.6.233'
        }
    };
    if (item.orders && item.orders[0]) {
        obj.location.display = item.orders[0].locationName;
    }
    obj.locationId = locationId;
    return obj;
}

function BuildEncounter(item) {
    var ret = {
        resourceType: 'Encounter',
        _id: helpers.generateUUID(),
        text: {
            status: 'generated',
            div: '<div>Encounter with patient ' + item.pid + '</div>'
        },
        extension: new BuildExtensions((item.orders && item.orders[0]) ? item.orders[0] : {}, 'location'),
        type: map.vaType[item.vaType],
        location: []
    };
    return ret;
}


function BuildExtensions(obj, parent, isstatement) {
    var ret = [];
    if (obj) {
        for (var i = 0, k = Object.keys(obj), l = k.length; i < l; i++) {
            var ext = (!isstatement) ? new Extension(obj, k[i], parent) : new StatementExtension(obj, k[i], parent);
            if (!helpers.isEmpty(ext)) {
                ret.push(ext);
            }
        }
    }
    return ret;

}

function addValueProp(obj, val) {
    if (val === false || val === true) {
        obj.valueBoolean = val;
    } else {
        obj.valueString = val;
    }
    return obj;
}

function StatementExtension(item, key, parent) {
    var obj = this;

    if (nullchecker.isNullish(item)) {
        return obj;
    }
    switch (key) {
        case 'vaStatus':
            if (parent === 'MedicationStatement' && nullchecker.isNotNullish(item[key])) {
                obj.url = 'http://vistacore.us/fhir/extensions/med#status';
                obj.valueString = map.getvaStatus(item[key]);
            }
            break;

            //MedicationStatement
        case 'kind':
        case 'orderUid':
        case 'pharmacistUid':
        case 'pharmacistName':
        case 'administrations':
        case 'supply':
        case 'providerUid':
        case 'providerName':
        case 'locationUid':
        case 'locationName':
            if (parent === 'MedicationStatement' && nullchecker.isNotNullish(item[key])) {
                obj.url = 'http://vistacore.us/fhir/extensions/med#' + key;
                obj = addValueProp(this, item[key]);
            }
            break;
            //MedicationStatement.dosage
        case 'successor':
        case 'predecessor':
        case 'IMO':
        case 'fills':
        case 'noun':
        case 'instructions':
        case 'amount':
        case 'relativeStart':
        case 'relativeStop':
            if (parent === 'MedicationStatement_dosage' && nullchecker.isNotNullish(item[key])) {
                obj.url = 'http://vistacore.us/fhir/extensions/med#' + key;
                obj = addValueProp(this, item[key]);
            }
            break;
        default:
            break;
    }
    return obj;
}

function Extension(item, key, parent) {
    var obj = this;

    if (nullchecker.isNullish(item)) {
        return obj;
    }
    switch (key) {
        case 'lastFilled':
        case 'type':
            if (!parent && nullchecker.isNotNullish(item[key])) {
                obj.url = 'http://vistacore.us/fhir/extensions/med#' + key;
                obj = addValueProp(this, item[key]);
            }
            break;
        case 'localId':
        case 'medStatus':
        case 'medStatusName':
        case 'medType':
        case 'pharmacistUid':
        case 'pharmacistName':
        case 'supply':
        case 'orderUid':
        case 'kind':
        case 'scheduleFreq':
            if (parent === 'MedicationPrescription' && nullchecker.isNotNullish(item[key])) {
                obj.url = 'http://vistacore.us/fhir/extensions/med#' + key;
                obj = addValueProp(this, item[key]);
            }
            break;
        case 'drugClassCode':
        case 'drugClassName':
        case 'suppliedCode':
        case 'suppliedName':
        case 'strength':
        case 'ingredientRXNCode':
        case 'ingredientCode':
        case 'ingredientCodeName':
        case 'ingredientRole':
            if (parent === 'Medication' && nullchecker.isNotNullish(item[key])) {
                obj.url = 'http://vistacore.us/fhir/extensions/med#' + key;
                obj = addValueProp(this, item[key]);
            }
            break;
        case 'noun':
        case 'instructions':
        case 'amount':
        case 'relativeStart':
        case 'relativeStop':
            if (parent === 'dosageInstruction' && nullchecker.isNotNullish(item[key])) {
                obj.url = 'http://vistacore.us/fhir/extensions/med#' + key;
                obj = addValueProp(this, item[key]);
            }
            break;
        case 'scheduleType':
        case 'scheduleName':
            if (parent === 'timing' && nullchecker.isNotNullish(item[key])) {
                obj.url = 'http://vistacore.us/fhir/extensions/med#' + key;
                obj = addValueProp(this, item[key]);
            }
            break;
        case 'fillCost':
        case 'fillsRemaining':
        case 'vaRouting':
        case 'administrations':
        case 'units':
        case 'IMO':
        case 'daysSupplyDispensed':
        case 'routing':
        case 'partial':
            if (parent === 'dispense' && nullchecker.isNotNullish(item[key])) {
                obj.url = 'http://vistacore.us/fhir/extensions/med#' + key;
                obj = addValueProp(this, item[key]);
            }
            break;
        case 'stopped':
            if (parent === 'validityPeriod' && nullchecker.isNotNullish(item[key])) {
                obj.url = 'http://vistacore.us/fhir/extensions/med#' + key;
                obj = addValueProp(this, item[key]);
            }
            break;
        case 'locationUid':
            if (parent === 'location' && nullchecker.isNotNullish(item[key])) {
                obj.url = 'http://vistacore.us/fhir/extensions/med#' + key;
                obj = addValueProp(this, item[key]);
            }
            break;
        default:
            break;
    }
    return obj;
}
