'use strict';

var rdk = require('../../../core/rdk');
var nullchecker = rdk.utils.nullchecker;
var _ = rdk.utils.underscore;
var constants = require('./constants');

/**
 * This method creates a FHIR DateTime object from the given date.
 *
 * @param dDateTime The Date form of the date and time to be loaded.
 * @return
 */
function convertDate2FhirDateTime(dDateTime, ignoreTimeZone, ignoreMilliSeconds) {
    var sFhirDateTime = null;

    if (nullchecker.isNotNullish(dDateTime)) {
        var d = dDateTime.getDate();
        var M = dDateTime.getMonth();
        var y = dDateTime.getFullYear();
        var H = dDateTime.getHours();
        var m = dDateTime.getMinutes();
        var s = dDateTime.getSeconds();
        var ms = dDateTime.getMilliseconds();

        sFhirDateTime = y + '-' + (M < 10 ? '0' : '') + M + '-' + (d < 10 ? '0' : '') + d + 'T' + (H < 10 ? '0' : '') + H + ':' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
        if (nullchecker.isNullish(ignoreMilliSeconds) || ignoreMilliSeconds !== true) {
            sFhirDateTime += '.' + (ms < 100 ? '0' : '') + (ms < 10 ? '0' : '') + ms;
        }
        if (nullchecker.isNullish(ignoreTimeZone) || ignoreTimeZone !== true) {
            //sFhirDateTime += '-00:00'; // for UTC
            var o = dDateTime.getTimezoneOffset();
            var om = Math.abs(o) % 60;
            var oh = Math.floor(Math.abs(o) / 60);
            sFhirDateTime += (o <= 0 ? '-' : '+') + (oh < 10 ? '0' : '') + oh + ':' + (om < 10 ? '0' : '') + om;
        }
    }

    return sFhirDateTime;
}
module.exports.convertDate2FhirDateTime = convertDate2FhirDateTime;

/**
 * This method creates a FHIR Date object from the given date.
 *
 * @param dDateTime The Date form of the date and time to be loaded.
 * @return
 */
function convertDate2FhirDate(dDateTime) {
    var sFhirDateTime = null;

    if (nullchecker.isNotNullish(dDateTime)) {
        var d = dDateTime.getDate();
        var M = dDateTime.getMonth();
        var y = dDateTime.getFullYear();

        sFhirDateTime = y + '-' + (M < 10 ? '0' : '') + M + '-' + (d < 10 ? '0' : '') + d;

    }

    return sFhirDateTime;
}
module.exports.convertDate2FhirDate = convertDate2FhirDate;

function isValidDate(value) {
    var dateWrapper = new Date(value);
    return !isNaN(dateWrapper.getDate());
}

function isFhirDateFormat(sDateTime) {
    var bResult = false;

    if (nullchecker.isNotNullish(sDateTime)) {
        bResult = constants.fhir.REG_EXP_DATE.test(sDateTime);
    }

    return bResult;
}

function isFhirDateTimeFormat(sDateTime) {
    var bResult = false;

    if (nullchecker.isNotNullish(sDateTime)) {
        bResult = constants.fhir.REG_EXP_DATE_TIME.test(sDateTime);
    }

    return bResult;
}

function isHL7V2DateFormat(sDateTime) {
    var bResult = false;

    if (nullchecker.isNotNullish(sDateTime)) {
        bResult = constants.hl7v2.REG_EXP_DATE_FORMAT.test(sDateTime);
    }

    return bResult;
}

function isHL7V2DateTimeFormat(sDateTime) {
    var bResult = false;

    if (nullchecker.isNotNullish(sDateTime)) {
        bResult = constants.hl7v2.REG_EXP_DATE_TIME_FORMAT_COMBINED.test(sDateTime);
    }

    return bResult;
}

function convertHL7V2DateToFhirDateTime(sHL7Date) {
    var sFhirDateTime = '';

    if (isHL7V2DateFormat(sHL7Date)) {
        sFhirDateTime = sHL7Date.substring(0, 4) + '-' + sHL7Date.substring(4, 6) + '-' + sHL7Date.substring(6);
    }

    return sFhirDateTime;
}

function convertHL7V2DateTimeToFhirDateTime(sHL7Date) {
    var sFhirDateTime = '';

    if (isHL7V2DateTimeFormat(sHL7Date)) {
        if (constants.hl7v2.REG_EXP_DATE_TIME_FORMAT_NO_SECONDS.test(sHL7Date)) {
            sFhirDateTime = sHL7Date.substring(0, 4) + '-' + sHL7Date.substring(4, 6) + '-' + sHL7Date.substring(6, 8) + 'T' + sHL7Date.substring(8, 10) + ':' + sHL7Date.substring(10) + ':00';
        } else if (constants.hl7v2.REG_EXP_DATE_TIME_FORMAT_WITH_SECONDS.test(sHL7Date)) {
            sFhirDateTime = sHL7Date.substring(0, 4) + '-' + sHL7Date.substring(4, 6) + '-' + sHL7Date.substring(6, 8) + 'T' + sHL7Date.substring(8, 10) + ':' + sHL7Date.substring(10, 12) + ':' + sHL7Date.substring(12);
        }
    }

    return sFhirDateTime;
}

function convertDateToHL7V2(date, includeSeconds) {
    // ISO 8601 follows this format: 2015-01-26T01:23:45.000Z
    // HL7V2 is similar to ISO 8601 but without decorating dashes, colons and no T between date and time.
    return date.toISOString().replace(/-|:|T|\.|Z/g, '').substring(0, includeSeconds ? 14 : 12);
}
module.exports.convertDateToHL7V2 = convertDateToHL7V2;

function convertToFhirDateTime(sDateTime) {
    if (sDateTime === undefined) {
        return undefined;
    }
    var sFhirDateTime = null;

    if (nullchecker.isNotNullish(sDateTime)) {
        if (isValidDate(sDateTime)) {
            sFhirDateTime = convertDate2FhirDateTime(new Date(sDateTime));
        } else if ((isFhirDateFormat(sDateTime)) || (isFhirDateTimeFormat(sDateTime))) {
            sFhirDateTime = sDateTime;
        } else if (isHL7V2DateFormat(sDateTime)) {
            sFhirDateTime = convertHL7V2DateToFhirDateTime(sDateTime);
        } else if (isHL7V2DateTimeFormat(sDateTime)) {
            sFhirDateTime = convertHL7V2DateTimeToFhirDateTime(sDateTime);
        }
    }

    return sFhirDateTime;
}
module.exports.convertToFhirDateTime = convertToFhirDateTime;

function findExtension(extensions, url) {
    var found = _.find(extensions, function(ext) {
        return ext.url === url;
    });

    return found;
}
module.exports.findExtension = findExtension;

function getExtensionValue(extensions, url) {
    var ext = extensions;
    if (nullchecker.isNotNullish(url)) {
        ext = findExtension(extensions, url);
    }
    if (nullchecker.isNotNullish(ext)) {
        for (var prop in ext) {
            if (prop.indexOf('value') === 0) {
                return ext[prop];
            }
        }
    }

    return undefined;
}
module.exports.getExtensionValue = getExtensionValue;

function removeDivFromText(text) {
    var noDiv = text;
    if (noDiv.indexOf('<div>') === 0) {
        noDiv = noDiv.substring(5);
        if (noDiv.lastIndexOf('</div>') === noDiv.length - 6) {
            noDiv = noDiv.substring(0, noDiv.length - 6);
        }
    }
    return noDiv;
}
module.exports.removeDivFromText = removeDivFromText;

function generateReferenceMeaning(vitalSign) {
    var vitalSignRange = {};
    switch (vitalSign) {
        case 'TEMPERATURE':
            {
                vitalSignRange = {
                    'system': 'http://snomed.info/id',
                    'code': '87273009',
                    'display': 'Normal Temperature'
                };
            }
            break;
        case 'RESPIRATION':
            {
                vitalSignRange = {
                    'system': 'http://snomed.info/id',
                    'code': '276888009',
                    'display': 'Normal spontaneous respiration'
                };
            }
            break;
        case 'PULSE':
            {
                vitalSignRange = {
                    'system': 'http://snomed.info/id',
                    'code': '12146004',
                    'display': 'Normal Pulse'
                };
            }
            break;
        case 'HEIGHT':
            {
                vitalSignRange = {
                    'system': 'http://snomed.info/id',
                    'code': '309534003',
                    'display': 'Normal Height'
                };
            }
            break;
        case 'WEIGHT':
            {
                vitalSignRange = {
                    'system': 'http://snomed.info/id',
                    'code': '43664005',
                    'display': 'Normal Weight'
                };
            }
            break;
        case 'CENTRAL VENOUS PRESSURE':
            {
                vitalSignRange = {
                    'system': 'http://snomed.info/id',
                    'code': '91297005',
                    'display': 'Normal central venous pressure'
                };
            }
            break;
        case 'CIRCUMFERENCE/GIRTH':
            {
                vitalSignRange = {
                    'system': 'http://snomed.info/id',
                    'code': '53461003',
                    'display': 'Normal Size'
                };
            }
            break;
        case 'PULSE OXIMETRY':
            {
                vitalSignRange = {
                    'system': 'http://snomed.info/id',
                    'code': '167025001',
                    'display': 'Blood oxygen level normal'
                };
            }
            break;
        case 'PAIN':
            {
                vitalSignRange = {
                    'system': 'http://snomed.info/id',
                    'code': '163729003',
                    'display': 'Pain sensation normal'
                };
            }
            break;
        case 'BLOOD PRESSURE SYSTOLIC':
            {
                vitalSignRange = {
                    'system': 'http://snomed.info/id',
                    'code': '12929001',
                    'display': 'Normal systolic arterial pressure'
                };
            }
            break;
        case 'BLOOD PRESSURE DIASTOLIC':
            {
                vitalSignRange = {
                    'system': 'http://snomed.info/id',
                    'code': '53813002',
                    'display': 'Normal diastolic arterial pressure'
                };
            }
            break;
    }
    return vitalSignRange;
}

module.exports.generateReferenceMeaning = generateReferenceMeaning;

function generateResultMeaning(vitalSign) {
    var vitalSignResultRange = {};
    switch (vitalSign) {
        case 'BLOOD PRESSURE SYSTOLIC':
            {
                vitalSignResultRange = {
                    'system': 'http://loinc.org',
                    'code': '8480-6',
                    'display': 'Systolic blood pressure'
                };
            }
            break;
        case 'BLOOD PRESSURE DIASTOLIC':
            {
                vitalSignResultRange = {
                    'system': 'http://loinc.org',
                    'code': '8462-4',
                    'display': 'Diastolic blood pressure'
                };
            }
            break;
    }
    return vitalSignResultRange;
}

module.exports.generateResultMeaning = generateResultMeaning;

function generateMonthName(month) {
    var monthResult = '';
    switch (month) {
        case '01':
            {
                monthResult = 'Jan';
            }
            break;
        case '02':
            {
                monthResult = 'Feb';
            }
            break;
        case '03':
            {
                monthResult = 'Mar';
            }
            break;
        case '04':
            {
                monthResult = 'Apr';
            }
            break;
        case '05':
            {
                monthResult = 'May';
            }
            break;
        case '06':
            {
                monthResult = 'Jun';
            }
            break;
        case '07':
            {
                monthResult = 'Jul';
            }
            break;
        case '08':
            {
                monthResult = 'Aug';
            }
            break;
        case '09':
            {
                monthResult = 'Sep';
            }
            break;
        case '10':
            {
                monthResult = 'Oct';
            }
            break;
        case '11':
            {
                monthResult = 'Nov';
            }
            break;
        case '12':
            {
                monthResult = 'Dec';
            }
            break;

    }
    return monthResult;
}

module.exports.generateMonthName = generateMonthName;

function generateMonth(date) {
    return date.getMonth() + 1;
}

module.exports.generateMonth = generateMonth;
