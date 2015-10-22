'use strict';

var application = {};
Object.defineProperty(application, 'APP_NAME', {
    get: function() {
        return 'eHMP';
    }
});
Object.defineProperty(application, 'APP_URI', {
    get: function() {
        return 'https://ehmp.vistacore.us';
    }
});

var fhir = {};
Object.defineProperty(fhir, 'REG_EXP_DATE_TIME', {
    get: function() {
        return new RegExp('-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T(([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\\.[0-9]+)?|(24:00:00(\\.0+)?))(Z|(\\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?');
    }
});
Object.defineProperty(fhir, 'REG_EXP_DATE', {
    get: function() {
        return new RegExp('-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])(Z|(\\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?');
    }
});
Object.defineProperty(fhir, 'FORMAT_DATE', {
    get: function() {
        return 'yyyy-MM-dd';
    }
});
Object.defineProperty(fhir, 'FORMAT_DATE_TIME', {
    get: function() {
        return 'yyyy-MM-dd"T"HH:mm:ss';
    }
});

var hl7v2 = {};
Object.defineProperty(hl7v2, 'REG_EXP_DATE_FORMAT', {
    get: function() {
        return new RegExp('^([1-9][0-9]{7})$');
    }
});
Object.defineProperty(hl7v2, 'REG_EXP_DATE_TIME_FORMAT_NO_SECONDS_INTERNAL', {
    get: function() {
        return new RegExp('([1-9][0-9]{11})');
    }
});
Object.defineProperty(hl7v2, 'REG_EXP_DATE_TIME_FORMAT_NO_SECONDS', {
    get: function() {
        return new RegExp('^' + hl7v2.REG_EXP_DATE_TIME_FORMAT_NO_SECONDS_INTERNAL.source + '$');
    }
});
Object.defineProperty(hl7v2, 'REG_EXP_DATE_TIME_FORMAT_WITH_SECONDS_INTERNAL', {
    get: function() {
        return new RegExp('([1-9][0-9]{13})');
    }
});
Object.defineProperty(hl7v2, 'REG_EXP_DATE_TIME_FORMAT_WITH_SECONDS', {
    get: function() {
        return new RegExp('^' + hl7v2.REG_EXP_DATE_TIME_FORMAT_WITH_SECONDS_INTERNAL.source + '$');
    }
});
Object.defineProperty(hl7v2, 'REG_EXP_DATE_TIME_FORMAT_COMBINED', {
    get: function() {
        return new RegExp('^' + hl7v2.REG_EXP_DATE_TIME_FORMAT_NO_SECONDS_INTERNAL.source + '|' + hl7v2.REG_EXP_DATE_TIME_FORMAT_WITH_SECONDS_INTERNAL.source + '$');
    }
});

var labResults = {};
Object.defineProperty(labResults, 'LAB_RESULTS_UID_IDENTIFIER_SYSTEM', {
    get: function() {
        return 'urn:oid:2.16.840.1.113883.6.233';
    }
});
Object.defineProperty(labResults, 'VUID_SYSTEM', {
    get: function() {
        return 'urn:oid:2.16.840.1.113883.6.233';
    }
});
Object.defineProperty(labResults, 'DIAGNOSTIC_REPORTS_SYSTEM', {
    get: function() {
        return 'urn:oid:2.16.840.1.113883.4.642.2.58';
    }
});
Object.defineProperty(labResults, 'COMPLETE_STATUS_CODE', {
    get: function() {
        return 'urn:va:lab-status:completed';
    }
});
Object.defineProperty(labResults, 'COMMENTS_REGEX_STRING', {
    get: function() {
        return '^(.*)Ordering Provider: (.+) Report Released Date/Time: (.*)\r\n Performing Lab: (.*)\r\n *(.*)\r\n *';
    }
});
Object.defineProperty(labResults, 'ADDRESS_REGEX_STRING', {
    get: function() {
        return '^ *(.+) (.+), (.{2}) ([0-9\\-]{5,})$';
    }
});
var allergyintolerance = {};
Object.defineProperty(allergyintolerance, 'ALLERGYINTOLERANCE_EXTENSION_URL_PREFIX', {
    get: function() {
        return 'http://vistacore.us/fhir/extensions/algyInt#';
    }
});
Object.defineProperty(labResults, 'LAB_EXTENSION_URL_PREFIX', {
    get: function() {
        return 'http://vistacore.us/fhir/extensions/lab#';
    }
});
Object.defineProperty(labResults, 'PATIENT_PREFIX', {
    get: function() {
        return 'Patient/';
    }
});
Object.defineProperty(labResults, 'COMPOSITION_PREFIX', {
    get: function() {
        return 'Composition/';
    }
});
Object.defineProperty(labResults, 'UNKNOWN_NAME', {
    get: function() {
        return 'Unknown Name';
    }
});
Object.defineProperty(labResults, 'GRAMSTAIN_CODE', {
    get: function() {
        return '664-3';
    }
});
Object.defineProperty(labResults, 'GRAMSTAIN_DISPLAY', {
    get: function() {
        return 'Microscopic observation [Identifier] in Unspecified specimen by Gram stain';
    }
});
Object.defineProperty(labResults, 'GRAMSTAIN_SYSTEM', {
    get: function() {
        return 'http://loinc.org';
    }
});
Object.defineProperty(labResults, 'ORGANISM_CODE', {
    get: function() {
        return '252390002';
    }
});
Object.defineProperty(labResults, 'ORGANISM_DISPLAY', {
    get: function() {
        return 'Culture and Susceptibility';
    }
});
Object.defineProperty(labResults, 'ORGANISM_SYSTEM', {
    get: function() {
        return 'http://snomed.org/sct';
    }
});
Object.defineProperty(labResults, 'SERVICE_CATEGORY_SYSTEM', {
    get: function() {
        return 'http://hl7.org/fhir/v2/0074';
    }
});
Object.defineProperty(labResults, 'INTERPRETATION_VPR_PREFIX', {
    get: function() {
        return 'urn:hl7:observation-interpretation:';
    }
});
Object.defineProperty(labResults, 'INTERPRETATION_SYSTEM', {
    get: function() {
        return 'http://hl7.org/fhir/vs/observation-interpretation';
    }
});

var orders = {};
Object.defineProperty(orders, 'ORDER_EXTENSION_URL_PREFIX', {
    get: function() {
        return 'http://vistacore.us/fhir/extensions/order#';
    }
});
Object.defineProperty(orders, 'ORDER_PREFIX', {
    get: function() {
        return 'Order/';
    }
});
Object.defineProperty(orders, 'DIAGNOSTIC_REPORT_PREFIX', {
    get: function() {
        return 'DiagnosticReport/';
    }
});
Object.defineProperty(orders, 'MEDICATION_ADMINISTRATION_PREFIX', {
    get: function() {
        return 'MedicationAdministration/';
    }
});
Object.defineProperty(orders, 'PATIENT_PREFIX', {
    get: function() {
        return 'Patient/';
    }
});

var conditions = {};
Object.defineProperty(conditions, 'CONDITION_PREFIX', {
    get: function() {
        return 'Condition/';
    }
});

//----------------------------
// MEDICAL DISPENSE CONSTANTS
//----------------------------
var medDispense = {};

Object.defineProperty(medDispense, 'MED_DISPENSE_UID_IDENTIFIER_SYSTEM', {
    get: function() {
        return 'urn:oid:2.16.840.1.113883.6.233';
    }
});
Object.defineProperty(medDispense, 'MED_DISPENSE_EXTENSION_URL_PREFIX', {
    get: function() {
        return 'http://vistacore.us/fhir/extensions/med#';
    }
});

//----------------------------
// COMPOSITION CONSTANTS
//----------------------------
var composition = {};

Object.defineProperty(composition, 'COMPOSITION_UID_IDENTIFIER_SYSTEM', {
    get: function() {
        return 'urn:oid:2.16.840.1.113883.6.233';
    }
});
Object.defineProperty(composition, 'COMPOSITION_EXTENSION_URL_PREFIX', {
    get: function() {
        return 'http://vistacore.us/fhir/extensions/composition#';
    }
});

//----------------------------
// REFERRAL REQUEST CONSTANTS
//----------------------------
var referralRequest = {};

Object.defineProperty(referralRequest, 'REFERRAL_REQUEST_UID_IDENTIFIER_SYSTEM', {
    get: function() {
        return 'urn:oid:2.16.840.1.113883.6.233';
    }
});
Object.defineProperty(referralRequest, 'REFERRAL_REQUEST_EXTENSION_URL_PREFIX', {
    get: function() {
        return 'http://vistacore.us/fhir/extensions/referralrequest#';
    }
});

//-------------------------------------
// MEDICATION PRESCRIPTION CONSTANTS
//-------------------------------------
var medPrescription = {};

Object.defineProperty(medPrescription, 'MED_PRESCRIPTION_UID_IDENTIFIER_SYSTEM', {
    get: function() {
        return 'urn:oid:2.16.840.1.113883.6.233';
    }
});
Object.defineProperty(medPrescription, 'MED_PRESCRIPTION_EXTENSION_URL_PREFIX', {
    get: function() {
        return 'http://vistacore.us/fhir/extensions/med#';
    }
});
Object.defineProperty(medPrescription, 'PATIENT_PREFIX', {
    get: function() {
        return 'Patient/';
    }
});
Object.defineProperty(medPrescription, 'PRESCRIBER_PREFIX', {
    get: function() {
        return 'Provider/';
    }
});
Object.defineProperty(medPrescription, 'INGREDIENT_IDENTIFIER_SYSTEM', {
    get: function() {
        return 'urn:oid:2.16.840.1.113883.6.233';
    }
});

//-------------------------------------
// MEDICATION ADMINISTRATION CONSTANTS
//-------------------------------------
var medAdministration = {};

Object.defineProperty(medAdministration, 'MED_ADMINISTRATION_UID_IDENTIFIER_SYSTEM', {
    get: function() {
        return 'urn:oid:2.16.840.1.113883.6.233';
    }
});
Object.defineProperty(medAdministration, 'MED_ADMINISTRATION_EXTENSION_URL_PREFIX', {
    get: function() {
        return 'http://vistacore.us/fhir/extensions/med#';
    }
});
Object.defineProperty(medAdministration, 'PATIENT_PREFIX', {
    get: function() {
        return 'Patient/';
    }
});
Object.defineProperty(medAdministration, 'ADMINISTRATOR_PREFIX', {
    get: function() {
        return 'Provider/';
    }
});

//-------------------------------------
//IMMUNIZATION CONSTANTS
//-------------------------------------
var immunization = {};

Object.defineProperty(immunization, 'PATIENT_PREFIX', {
    get: function() {
        return 'Patient/';
    }
});

Object.defineProperty(immunization, 'IMMUNIZATION_EXTENSION_URL_PREFIX', {
    get: function() {
        return 'http://vistacore.us/fhir/extensions/immunization#';
    }
});

module.exports.immunization = immunization;
module.exports.medAdministration = medAdministration;
module.exports.medPrescription = medPrescription;
module.exports.medDispense = medDispense;
module.exports.fhir = fhir;
module.exports.hl7v2 = hl7v2;
module.exports.allergyintolerancefhir = allergyintolerance;
module.exports.labResultsFhir = labResults;
module.exports.application = application;
module.exports.ordersFhir = orders;
module.exports.conditionsFhir = conditions;
module.exports.composition = composition;
module.exports.referralRequest = referralRequest;
