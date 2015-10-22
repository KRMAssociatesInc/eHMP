'use strict';

var _ = require('underscore');
var filemanDateUtil = require('../../utils/fileman-date-converter');
var nullChecker = require('../../utils/nullchecker');
var paramUtil = require('../../utils/param-converter');

function ProblemsValidator (input) {
    this.errors = [];
    this.model = input;
    this.initialize();
}

ProblemsValidator.prototype.getErrors = function() {
    return this.errors;
};

ProblemsValidator.prototype.initialize = function(){
    var self = this;

    if (_.isUndefined(self.model)) {
        self.errors.push('Missing model');
        return;
    }

    if (_.isUndefined(self.model.patientIEN)) {
        self.errors.push('patient IEN is missing');
    }

    if (_.isUndefined(self.model.patientName)) {
        self.errors.push('patient Name is missing');
    }

    if (_.isUndefined(self.model.problemText)) {
        self.errors.push('problem text is missing');
    }


    if (_.isUndefined(self.model.dateOfOnset)) {
        self.errors.push('date Of On Set is missing');
    }

    if (_.isUndefined(self.model.problemName)) {
        self.errors.push('problem name is missing');
    }

    if (_.isUndefined(self.model.providerIEN)) {
        self.errors.push('provider IEN is missing');
    }

    if (_.isUndefined(self.model.status)) {
        self.errors.push('status is missing');
    }

};

ProblemsValidator.prototype.isValid = function () {
    return _.size(this.errors) <= 0 ;
};

module.exports.create = function(writebackContext, callback) {

    var model = writebackContext.model;
    var logger = writebackContext.logger;

    logger.debug({problemsVistaWriterModel: model});

    var validator = new ProblemsValidator(model);
    var errors = validator.isValid() ? null : validator.getErrors();

    return setImmediate(callback, errors);
};

module.exports.update = function(writebackContext, callback) {
    // TODO: validate newNotes

    var error = null;  // set if there is an error validating
    return setImmediate(callback, error);
};

module.exports.ProblemsValidator= ProblemsValidator;
