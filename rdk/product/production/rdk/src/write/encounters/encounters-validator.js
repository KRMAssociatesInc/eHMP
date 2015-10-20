'use strict';

var _ = require('underscore');
var nullChecker = require('../../utils/nullchecker');

/**
 * Updates an existing encounter in VistA.
 *
 * @param  {Object} model  - the model derived from the
 * @param  {Object} logger - function to callback to
 * @param  {Object} error  - the array to put error messages into
 *
 * @return The array of any invalid fields found.
*/
function validateInput(model, logger, errors){

    if (nullChecker.isNotNullish(model)) {

        // piece 1: patient IEN
        if (nullChecker.isNullish(model.patientIEN)) {
            errors.push('The patient DFN is required');
        }

        // piece 2: inpatient/outpatient
        if (nullChecker.isNullish(model.isInPatient)) {
            errors.push('The visit type is required');
        }

        // piece 3: hospital IEN
        if (nullChecker.isNullish(model.facilityIEN)) {
            errors.push('The location IEN is required');
        }

        // piece 4: encounter date
        if (nullChecker.isNullish(model.encounterDateTime)) {
            errors.push('The encounter date and time is required');
        }

        // piece 5: service category
        if (nullChecker.isNullish(model.serviceCategory)) {
            errors.push('The service category is required');
        }

        // piece 6: author (provider)
        if (nullChecker.isNullish(model.providerIEN)) {
            errors.push('The provider IEN is required');
        }

        // piece 7: encounter type
        if (nullChecker.isNullish(model.encounterType)) {
            errors.push('The encounter type is required');
        }

        // piece 8: encounter ID
        if (nullChecker.isNullish(model.encounterIEN)) {
            errors.push('The encounter ID is required');
        }

        // piece 9: encounter result
        if (nullChecker.isNullish(model.encounterResult)) {
            errors.push('The encounter result is required');
        }

        // piece 10: encounter comment number
        if (nullChecker.isNullish(model.commentNumber)) {
            errors.push('The comment number is required');
        }

        // piece 11: encounter comment
        if (nullChecker.isNullish(model.comment)) {
            errors.push('The comment is required');
        }

        logger.debug('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        logger.debug('             ::ENCOUNTER::            ');
        logger.debug(' patientIEN        = ' + model.patientIEN);
        logger.debug(' isInPatient       = ' + model.isInPatient);
        logger.debug(' facilityIEN       = ' + model.facilityIEN);
        logger.debug(' encounterDateTime = ' + model.encounterDateTime);
        logger.debug(' serviceCategory   = ' + model.serviceCategory);
        logger.debug(' providerIEN       = ' + model.providerIEN);
        logger.debug(' encounterType     = ' + model.encounterType);
        logger.debug(' encounterIEN      = ' + model.encounterIEN);
        logger.debug(' encounterResult   = ' + model.encounterResult);
        logger.debug(' commentNumber     = ' + model.commentNumber);
        logger.debug(' comment           = ' + model.comment);
        logger.debug('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');

        return true;

    } else {
        errors.push('Missing message body');
        return false;
    }
}

module.exports.create = function(writebackContext, callback) {
    var logger = writebackContext.logger;

    logger.debug('Inside validator.create()');

    var model = writebackContext.model;
    // TODO string or array?
    var errors = [];

    validateInput(model, logger, errors);

    var retVal = _.size(errors) === 0 ? null : errors;
    return setImmediate(callback, retVal);
};

// TODO do we need a separate update function?
module.exports.update = function(writebackContext, callback) {
    var model = writebackContext.model;
    var error = null;
    setImmediate(callback, error);
};

module.exports._validateInput = validateInput;
