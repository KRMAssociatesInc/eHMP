'use strict';

var _ = require('lodash');
var rpcUtil = require('./../utils/rpc-util');


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
 * @param logger The logger
 * @param line The string to parse.
 */
function createVital(logger, line) {
    logger.debug('vital=' + line);

    var fields = line.split('^');
    var MINIMUM_FIELDS_LENGTH = 5;
    var BLOOD_PRESSURE_FIELD_LENGTH = 9;
    var TEMPERATURE_FIELD_LENGTH = 7;
    var RESPIRATION_FIELD_LENGTH = 7;
    var PULSE_FIELD_LENGTH = 7;
    var CENTRAL_VENOUS_PRESSURE_FIELD_LENGTH = 8;

    if (fields.length < MINIMUM_FIELDS_LENGTH) {
        throw new Error('The RPC returned data but the vital was missing elements: ' + line);
    }

    var vital = {
        ien: fields[1],
        name: fields[2],
        abbreviation: fields[3],
        pceAbbreviation: fields[4]
    };

    if (vital.name === 'BLOOD PRESSURE') {
        if (fields.length < BLOOD_PRESSURE_FIELD_LENGTH) {
            throw new Error('The RPC returned data but the vital BLOOD PRESSURE was missing elements: ' + line);
        }
        vital.abnormalSystolicHigh = fields[5];
        vital.abnormalDiastolicHigh = fields[6];
        vital.abnormalSystolicLow = fields[7];
        vital.abnormalDiastolicLow = fields[8];
    }
    else if (vital.name === 'TEMPERATURE') {
        if (fields.length < TEMPERATURE_FIELD_LENGTH) {
            throw new Error('The RPC returned data but the vital TEMPERATURE was missing elements: ' + line);
        }
        vital.abnormalHigh = fields[5];
        vital.abnormalLow = fields[6];
    }
    else if (vital.name === 'RESPIRATION') {
        if (fields.length < RESPIRATION_FIELD_LENGTH) {
            throw new Error('The RPC returned data but the vital RESPIRATION was missing elements: ' + line);
        }
        vital.abnormalHigh = fields[5];
        vital.abnormalLow = fields[6];
    }
    else if (vital.name === 'PULSE') {
        if (fields.length < PULSE_FIELD_LENGTH) {
            throw new Error('The RPC returned data but the vital PULSE was missing elements: ' + line);
        }
        vital.abnormalHigh = fields[5];
        vital.abnormalLow = fields[6];
    }
    else if (vital.name === 'CENTRAL VENOUS PRESSURE') {
        if (fields.length < CENTRAL_VENOUS_PRESSURE_FIELD_LENGTH) {
            throw new Error('The RPC returned data but the vital CENTRAL VENOUS PRESSURE was missing elements: ' + line);
        }
        vital.abnormalHigh = fields[5];
        vital.abnormalLow = fields[6];
        vital.abnormalO2Saturation = fields[7];
    }
    logger.debug({vital: vital});

    return vital;
}

/**
 * 1 = C for Category
 * 2 = FILE 120.53 IEN for this category
 * 3 = category name (FILE 120.53, Field .01)
 *
 * @param logger The logger
 * @param line The string to parse
 */
function createCategory(logger, line) {
    logger.debug('category=' + line);

    var MINIMUM_FIELDS_LENGTH = 3;
    var arr = line.split('^');
    if (arr.length !== MINIMUM_FIELDS_LENGTH) {
        throw new Error('The RPC returned data but the category was missing elements: ' + line);
    }

    var category = {
        ien: arr[1],
        categoryName: arr[2]
    };

    logger.debug({category: category});
    return category;
}

/**
 * 1 = Q for Qualifier
 * 2 = FILE 120.52 IEN for this qualifier
 * 3 = qualifier name (FILE 120.52, Field .01)
 * 4 = synonym (FILE 120.52, Field .02)
 *
 * @param logger The logger
 * @param line The string to parse
 */
function createQualifier(logger, line) {
    logger.debug('qualifier=' + line);

    var MINIMUM_FIELDS_LENGTH = 4;
    var arr = line.split('^');
    if (arr.length !== MINIMUM_FIELDS_LENGTH) {
        throw new Error('The RPC returned data but the qualifier was missing elements: ' + line);
    }

    var qualifier = {
        ien: arr[1],
        name: arr[2],
        synonym: arr[3]
    };

    logger.debug({qualifier: qualifier});
    return qualifier;
}

/**
 * Takes the return string from the RPC 'GMV VITALS/CAT/QUAL' and parses out the vitals, categories, and qualifiers.
 *
 * @param logger The logger
 * @param rpcData The string to parse
 * @returns {Array} An array containing the the vitals, categories, and qualifiers.
 */
module.exports.parseVitals = function(logger, rpcData) {
    logger.info({rpcData: rpcData});

    var retValue = [];
    var lines = rpcData.split('\r\n');
    lines = rpcUtil.removeEmptyValues(lines);

    _.each(lines, function(line) {
        if (line.indexOf('V^') === 0) {
            var vital = createVital(logger, line);
            retValue.push(vital);
        }
        else if (line.indexOf('C^') === 0) {
            if (retValue.length === 0) {
                throw new Error('Cannot add a category if no vital has been created');
            }

            var category = createCategory(logger, line);
            var categories = _.last(retValue).categories;
            if (_.isUndefined(categories)) {
                _.last(retValue).categories = [];
                categories = _.last(retValue).categories;
            }
            categories.push(category);
        }
        else if (line.indexOf('Q^') === 0) {
            if (retValue.length === 0) {
                throw new Error('Cannot add a qualifier if no vital has been created');
            }
            if (_.isUndefined(_.last(retValue).categories)) {
                throw new Error('Cannot add a qualifier if no category has been created');
            }
            if (_.last(retValue).categories.length === 0) {
                throw new Error('Cannot add a qualifier if no category has been added');
            }

            var qualifier = createQualifier(logger, line);
            var qualifiers = _.last(retValue).categories[_.last(retValue).categories.length-1].qualifiers;
            if (_.isUndefined(qualifiers)) {
                _.last(retValue).categories[_.last(retValue).categories.length-1].qualifiers = [];
                qualifiers = _.last(retValue).categories[_.last(retValue).categories.length-1].qualifiers;
            }
            qualifiers.push(qualifier);
        }
        else {
            throw new Error('Unrecognized line: ' + line);
        }
    });

    //console.log(JSON.stringify(retValue, null, 2));
    logger.info({retValue: retValue});
    return retValue;
};
