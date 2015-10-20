'use strict';

var _ = require('underscore');
var nullChecker = require('../../utils/nullchecker');
var filemanDateUtil = require('../../utils/fileman-date-converter');
var paramUtil = require('../../utils/param-converter');
var dd = require('drilldown');

// return a negative number in case of bad input
function timeFormatter(dateTime) {
    if (_.isUndefined(dateTime) || _.isNull(dateTime)) {
        return -1;
    }

    var eventDateTimeMoment = paramUtil.convertWriteBackInputDate(dateTime);
    if (_.isUndefined(eventDateTimeMoment)) {
        return -1;
    }

    return filemanDateUtil.getFilemanDateWithArgAsStr(eventDateTimeMoment.format(paramUtil.WRITEBACK_INPUT_DATE_FORMAT));
}

function validateInput(logger, model, errors){
    if (! _.isArray(errors)) {
        return false;
    }

    if (nullChecker.isNullish(model)) {
        errors.push('Missing message body');
        return false;
    }

    if (nullChecker.isNullish(model.dateTime)) {
        errors.push('The patient dateTime is required');
    } else {
        var eventDateTimeMoment = paramUtil.convertWriteBackInputDate(model.dateTime);
        var eventFilemanYear = filemanDateUtil.getFilemanDateWithArgAsStr(eventDateTimeMoment.format(paramUtil.WRITEBACK_INPUT_DATE_FORMAT));
        if (eventFilemanYear <= 0) {
            errors.push('The patient dateTime is malformed');
        }
    }

    if (nullChecker.isNullish(model.dfn)) {
        errors.push('The patient dfn (localId) is required');
    }

    if (nullChecker.isNullish(model.enterdByIEN)){
        errors.push('The entered by IEN is required');
    }

    if (nullChecker.isNullish(model.locIEN)) {
        errors.push('The location is required');
    }

    if (nullChecker.isNullish(model.vitals)) {
        errors.push('vitals are required');
    } else {
        _.each(model.vitals, (function(vital, index) {
            if (nullChecker.isNullish(vital.fileIEN)) {
            errors.push('The vital IEN is required for vital in index ' + index);
        }

            if (nullChecker.isNullish(vital.reading)) {
            errors.push('The vital reading is required for vital in index ' + index);
        }
        }));
    }
}

function create(writebackContext, callback) {
    var errors = [];
    var model = writebackContext.model;
    // dfn is now part of the interceptor results...
    model.dfn = dd(writebackContext)('interceptorResults')('patientIdentifiers')('dfn').val;

    validateInput(writebackContext.logger, model, errors);

    var retVal = _.size(errors) === 0 ? null : errors;
    return setImmediate(callback, retVal);
}

module.exports.create = create;
module.exports._validateInput = validateInput;
module.exports._timeFormatter = timeFormatter;

