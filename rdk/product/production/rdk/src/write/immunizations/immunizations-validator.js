'use strict';

var _ = require('underscore');
var filemanDateUtil = require('../../utils/fileman-date-converter');
var nullChecker = require('../../utils/nullchecker');
var paramUtil = require('../../utils/param-converter');
var dd = require('drilldown');


function ImmunizationValidator (model, logger) {
    this.model = model;
    this.logger = logger;
    this.errors = [];
    this.initialize();
}

ImmunizationValidator.prototype.getErrors = function() {
    return this.errors;
};

ImmunizationValidator.prototype.initialize = function(){
    var self = this;

    self.errors = [];

    var model = dd(self)('model').val;
    if(!model) {
        self.logger.error('ImmunizationValidator missing model');
        self.errors.push('Missing model');
        return;
    }

    self.dfn = dd(model)('dfn').val;
    if (!self.dfn) {
        self.logger.error('Missing dfn');
        self.errors.push('Missing dfn');
        return;
    }

    self.encounterServiceCategory = dd(model)('encounterServiceCategory').val;
    if (!self.encounterServiceCategory) {
        self.logger.error('Missing encounter service category');
        self.errors.push('Missing encounter service category');
    }

    self.visitDate = dd(model)('visitDate').val;
    if (!self.visitDate) {
        self.logger.error('Missing visit date');
        self.errors.push('Missing visit date');
    }

    self.immunizationIEN = dd(model)('immunizationIEN').val;
    if (!self.immunizationIEN) {
        self.logger.error('Missing immunizationIEN');
        self.errors.push('Missing immunizationIEN');
    }

    self.action = dd(model)('action').val;
    if (!_.isUndefined(self.action) && self.action !== 'add' && self.action !== 'delete') {
            self.logger.error('Bad action');
            self.errors.push('Bad action');
        }

    if (self.errors.length !== 0) {
        return;
    }

    self.logger.debug('valid immunization parsed');
};

ImmunizationValidator.prototype.isValid = function () {
    return _.size(this.errors) <= 0 ;
};


function create (writebackContext, callback) {
    var model = writebackContext.model;
    var logger = writebackContext.logger;

    logger.debug({ImmunizationVistaWriterModel: model});

    var validator = new ImmunizationValidator(model, logger);
    var errors = validator.isValid() ? null : validator.getErrors();

    return setImmediate(callback, errors);
}

module.exports._ImmunizationValidator = ImmunizationValidator;
module.exports.create = create;


