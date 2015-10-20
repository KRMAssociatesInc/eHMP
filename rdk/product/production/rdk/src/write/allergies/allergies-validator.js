'use strict';

var _ = require('underscore');
var filemanDateUtil = require('../../utils/fileman-date-converter');
var nullChecker = require('../../utils/nullchecker');
var paramUtil = require('../../utils/param-converter');
var allergyConstants = require('./constants');

function AllergyValidator (input) {
    this.errors = [];
    this.model = input;
    this.initialize();
}

AllergyValidator.prototype.getErrors = function() {
    return this.errors;
};

AllergyValidator.prototype.initialize = function(){
    var self = this;

    if (_.isUndefined(self.model)) {
        self.errors.push('Missing model');
        return;
    }

    if (_.isUndefined(self.model.dfn)) {
        self.errors.push('patient dfn is missing');
    }

    if (_.isUndefined(self.model.eventDateTime)) {
        self.errors.push('eventDateTime is missing');
    }

    if (_.isUndefined(self.model.allergyName)) {
        self.errors.push('allergy name is missing');
    }

    if (_.isUndefined(self.model.natureOfReaction)) {
        self.errors.push('nature of reaction is missing');
    }

    if (_.isUndefined(self.model.historicalOrObserved)) {
        self.errors.push('historical or observed is missing');
    } else {
        if (self.model.historicalOrObserved !== allergyConstants.OBSERVED &&
            self.model.historicalOrObserved !== allergyConstants.HISTORICAL) {
            self.errors.push('historical or observed is not specified');
        }
    }

    if (!_.isUndefined(self.model.symptoms)) {
        if (! _.isArray(self.model.symptoms)) {
            self.errors.push('symptoms are not of type array');
        }else {
            _.each(self.model.symptoms, function (symptom, index) {

                if (_.isUndefined(symptom.name)) {
                    self.errors.push('Symptom name is missing for index"  ' + index);
                }

                if (_.isUndefined(symptom.IEN)) {
                    self.errors.push('Symptom IEN is missing for index"  ' + index);
                }

                if (!nullChecker.isNullish(symptom.dateTime)) {
                    var sympDT = paramUtil.convertWriteBackInputDate(symptom.dateTime);
                    if (filemanDateUtil.getFilemanDateTime(sympDT.toDate()) === -1) {
                        self.errors.push('Symptom date is incorrect');
                    }
                }
            });
        }
    }

    if (self.model.historicalOrObserved === allergyConstants.OBSERVED) {
        if (_.isUndefined(self.model.observedDate) || _.isUndefined(self.model.severity)) {
            self.errors.push('The observed allergy is missing the observed date or severity');
        } else {
            var observedDateTimeMoment = paramUtil.convertWriteBackInputDate(self.model.observedDate);
            var observedDate = filemanDateUtil.getFilemanDateWithArgAsStr(observedDateTimeMoment.format(paramUtil.WRITEBACK_INPUT_DATE_FORMAT));
            if (observedDate === -1) {
                self.errors.push('ObservedDate (a.k.a. GMRARDT) is not a valid date: ' + self.model.observedDate);
            }
        }
    }
};

AllergyValidator.prototype.isValid = function () {
    return _.size(this.errors) <= 0 ;
};


function create (writebackContext, callback) {
    var model = writebackContext.model;
    var logger = writebackContext.logger;

    logger.debug({vitalsVistaWriterModel: model});

    var validator = new AllergyValidator(model);
    var errors = validator.isValid() ? null : validator.getErrors();

    return setImmediate(callback, errors);
}

module.exports._AllergyValidator = AllergyValidator;
module.exports.create = create;

