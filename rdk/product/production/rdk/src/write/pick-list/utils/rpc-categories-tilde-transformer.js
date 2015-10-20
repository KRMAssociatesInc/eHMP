'use strict';
var _ = require('lodash');
var nullUtil = require('../../core/null-utils');

//----------------------------------------------------------------------------------------------------------------------
//                               Category Functions
//----------------------------------------------------------------------------------------------------------------------

//Constants for the 3 types of entries we know of so far for categories.
var CATEGORY_REGULAR_ENTRY = 'i';
var CATEGORY_DEFAULT_ENTRY = 'd';
var CATEGORY_TEXT_ENTRY = 't';

module.exports.CATEGORY_REGULAR_ENTRY = CATEGORY_REGULAR_ENTRY;
module.exports.CATEGORY_DEFAULT_ENTRY = CATEGORY_DEFAULT_ENTRY;
module.exports.CATEGORY_TEXT_ENTRY = CATEGORY_TEXT_ENTRY;


//----------------------------------------------------------------------------------------------------------------------

/**
 * INTERNAL METHOD: Validates that the expected type and categoryName match their actual values.
 */
function validateCategoryTypeAndName(logger, retValue, expectedType, actualType, expectedCategoryName) {
    var actualCategoryName = _.last(retValue).categoryName;
    if (expectedCategoryName !== actualCategoryName) {
        logger.error(expectedCategoryName + ' did not match the category we were trying to add it to: ' + actualCategoryName);
        return false;
    }

    if (expectedType !== actualType) {
        logger.error(actualCategoryName + ' type was unexpected, got: ' + actualType);
        return false;
    }
    return true;
}

/**
 * Validates that the size passed in is the length of the array.
 */
function validateCategoryArraySize(logger, size, fields, categoryName) {
    if (size !== fields.length) {
        logger.error(categoryName + ' did not contain ' + size + ' fields, it had ' + fields.length + ': fields=' + fields.join('^'));
        return false;
    }
    return true;
}

module.exports.validateCategoryArraySize = validateCategoryArraySize;

//----------------------------------------------------------------------------------------------------------------------

/**
 * categoryEntry will be pushed to the values array that is contained in the last entry in retValue.
 */
module.exports.addCategoryRegularEntry = function(logger, retValue, categoryName, type, fields, categoryEntry) {
    if (!validateCategoryTypeAndName(logger, retValue, CATEGORY_REGULAR_ENTRY, type, categoryName)) {
        return false;
    }

    if (_.isEmpty(_.last(retValue).values)) {
        _.last(retValue).values = [];
    }

    _.last(retValue).values.push(categoryEntry);
    logger.debug({categoryEntry: categoryEntry});
    return true;
};

/**
 * The first entry in fields will be added to a variable called text and will be pushed to the values array that is contained in the last entry in retValue.
 */
module.exports.addCategoryTextEntry = function(logger, retValue, categoryName, type, fields) {
    if (!validateCategoryTypeAndName(logger, retValue, CATEGORY_TEXT_ENTRY, type, categoryName)) {
        return false;
    }

    //A text field should only have one element in the array.
    if (!validateCategoryArraySize(logger, 1, fields, categoryName)) {
        return false;
    }

    if (_.isEmpty(_.last(retValue).values)) {
        _.last(retValue).values = [];
    }

    var categoryEntry = {
        text: fields[0]
    };

    _.last(retValue).values.push(categoryEntry);
    logger.debug({categoryEntry: categoryEntry});
    return true;
};

/**
 * categoryEntry will be pushed to a variable called default in retValue.
 */
module.exports.addCategoryDefaultEntry = function(logger, retValue, categoryName, type, fields, categoryEntry) {
    if (!validateCategoryTypeAndName(logger, retValue, CATEGORY_DEFAULT_ENTRY, type, categoryName)) {
        return false;
    }

    _.last(retValue).default = categoryEntry;
    logger.debug({categoryEntry: categoryEntry});
    return true;
};

//----------------------------------------------------------------------------------------------------------------------

/**
 * Returns true if the fields array passed in has only one entry in it and that entry starts with a tilde.
 * @param fields
 * @returns {boolean}
 */
module.exports.isCategoryEntry = function(fields) {
    return !nullUtil.isNullish(fields) && fields.length === 1 && fields[0][0] === '~';
};
