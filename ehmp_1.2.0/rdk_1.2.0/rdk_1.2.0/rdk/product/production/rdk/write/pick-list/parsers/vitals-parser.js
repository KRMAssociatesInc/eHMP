/*jslint node: true */
'use strict';

var _ = require('lodash');
var loggingUtil = require('../utils/logging-util');
var errorUtil = require('../utils/error-util');


/**
 * 1 = V for vital type
 * 2 = FILE 120.51 IEN for this vital type
 * 3 = vital type name (FILE 120.51, Field .01)
 * 4 = Abbreviation (FILE 120.51, Field 1)
 * 5 = PCE Abbreviation (FILE 120.51, Field 7)
 * 6 = If vital type is Blood Pressure this is the abnormal systolic high value (File 120.57, Field 5.7).
 *     If vital type is Temperature, this is the abnormal high value (File 120.57, Field 5.1)
 *     If vital type is Respiration, this is the abnormal high value (File 120.57, Field 5.5)
 *     If vital type is Pulse, this is the abnormal high value (File 120.57, Field 5.3)
 *     If vital type is Central Venous Pressure, this is the abnormal high value (File 120.57, Field 6.1)
 * 7 = If vital type is Blood Pressure this is the abnormal diastolic high value (File 120.57, Field 5.71).
 *     If vital type is Temperature, this is the abnormal low value (File 120.57, Field 5.2)
 *     If vital type is Respiration, this is the abnormal low value (File 120.57, Field 5.6)
 *     If vital type is Pulse, this is the abnormal low value (File 120.57, Field 5.4)
 *     If vital type is Central Venous Pressure, this is the abnormal low value (File 120.57, Field 6.2)
 * 8 = If vital type is Blood Pressure this is the abnormal systolic low value (File 120.57, Field 5.8).
 *     If vital type is Central Pressure, this is the abnormal O2 saturation (File 120.57, Field 6.3)
 * 9 = If vital type is Blood Pressure this is the abnormal diastolic low value (File 120.57, Field 5.81).
 *
 * @param log The logger
 * @param str The string to parse.
 */
function createVital(log, str) {
    loggingUtil.logDebug(log, "vital=" + str);

    var arr = str.split('^');
    if (arr.length < 5)
        errorUtil.throwError("The RPC returned data but the vital was missing elements: " + str);

    var vital = {
        ien: arr[1],
        name: arr[2],
        abbreviation: arr[3],
        pceAbbreviation: arr[4]
    };

    if (vital.name === "BLOOD PRESSURE") {
        if (arr.length < 9)
            errorUtil.throwError("The RPC returned data but the vital BLOOD PRESSURE was missing elements: " + str);
        vital.abnormalSystolicHigh = arr[5];
        vital.abnormalDiastolicHigh = arr[6];
        vital.abnormalSystolicLow = arr[7];
        vital.abnormalDiastolicLow = arr[8];
    }
    else if (vital.name === "TEMPERATURE") {
        if (arr.length < 7)
            errorUtil.throwError("The RPC returned data but the vital TEMPERATURE was missing elements: " + str);
        vital.abnormalHigh = arr[5];
        vital.abnormalLow = arr[6];
    }
    else if (vital.name === "RESPIRATION") {
        if (arr.length < 7)
            errorUtil.throwError("The RPC returned data but the vital RESPIRATION was missing elements: " + str);
        vital.abnormalHigh = arr[5];
        vital.abnormalLow = arr[6];
    }
    else if (vital.name === "PULSE") {
        if (arr.length < 7)
            errorUtil.throwError("The RPC returned data but the vital PULSE was missing elements: " + str);
        vital.abnormalHigh = arr[5];
        vital.abnormalLow = arr[6];
    }
    else if (vital.name === "CENTRAL VENOUS PRESSURE") {
        if (arr.length < 8)
            errorUtil.throwError("The RPC returned data but the vital CENTRAL VENOUS PRESSURE was missing elements: " + str);
        vital.abnormalHigh = arr[5];
        vital.abnormalLow = arr[6];
        vital.abnormalO2Saturation = arr[7];
    }
    loggingUtil.logDebug(log, JSON.stringify(vital));

    return vital;
}

/**
 * 1 = C for Category
 * 2 = FILE 120.53 IEN for this category
 * 3 = category name (FILE 120.53, Field .01)
 *
 * @param log The logger
 * @param str The string to parse
 */
function createCategory(log, str) {
    loggingUtil.logDebug(log, "category=" + str);

    var arr = str.split('^');
    if (arr.length !== 3)
        errorUtil.throwError("The RPC returned data but the category was missing elements: " + str);

    var category = {
        ien: arr[1],
        name: arr[2]
    };

    loggingUtil.logDebug(log, JSON.stringify(category));
    return category;
}

/**
 * 1 = Q for Qualifier
 * 2 = FILE 120.52 IEN for this qualifier
 * 3 = qualifier name (FILE 120.52, Field .01)
 * 4 = synonym (FILE 120.52, Field .02)
 *
 * @param log The logger
 * @param str The string to parse
 */
function createQualifier(log, str) {
    loggingUtil.logDebug(log, "qualifier=" + str);

    var arr = str.split('^');
    if (arr.length !== 4)
        errorUtil.throwError("The RPC returned data but the qualifier was missing elements: " + str);

    var qualifier = {
        ien: arr[1],
        name: arr[2],
        synonym: arr[3]
    };

    loggingUtil.logDebug(log, JSON.stringify(qualifier));
    return qualifier;
}

/**
 * Takes the return string from the RPC 'GMV VITALS/CAT/QUAL' and parses out the vitals, categories, and qualifiers.
 *
 * @param log The logger
 * @param str The string to parse
 * @returns {Array} An array containing the the vitals, categories, and qualifiers.
 */
function parseVitals(log, str) {
    var retValue = [];
    var arr = str.split('\r\n');
    arr = _.filter(arr, Boolean); //Remove all of the empty Strings.

    _.forEach(arr, function(s) {
        if (s.indexOf("V^") === 0) {
            var vital = createVital(log, s);
            retValue.push(vital);
        }
        else if (s.indexOf("C^") === 0) {
            if (retValue.length === 0)
                errorUtil.throwError(log, "Cannot add a category if no vital has been created");

            var category = createCategory(log, s);
            var categories = retValue[retValue.length-1].categories;
            if (categories === undefined) {
                retValue[retValue.length-1].categories = [];
                categories = retValue[retValue.length-1].categories;
            }
            categories.push(category);
        }
        else if (s.indexOf("Q^") === 0) {
            if (retValue.length === 0)
                errorUtil.throwError(log, "Cannot add a qualifier if no vital has been created");
            if (retValue[retValue.length-1].categories === undefined)
                errorUtil.throwError(log, "Cannot add a qualifier if no category has been created");
            if (retValue[retValue.length-1].categories.length === 0)
                errorUtil.throwError(log, "Cannot add a qualifier if no category has been added");

            var qualifier = createQualifier(log, s);
            var qualifiers = retValue[retValue.length-1].categories[retValue[retValue.length-1].categories.length-1].qualifiers;
            if (qualifiers === undefined) {
                retValue[retValue.length-1].categories[retValue[retValue.length-1].categories.length-1].qualifiers = [];
                qualifiers = retValue[retValue.length-1].categories[retValue[retValue.length-1].categories.length-1].qualifiers;
            }
            qualifiers.push(qualifier);
        }
        else
            errorUtil.throwError(log, "Unrecognized line: " + s);
    });

    loggingUtil.logInfo(log, JSON.stringify(retValue));
    return retValue;
}

module.exports.parseVitals = parseVitals;
