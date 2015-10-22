'use strict';

var fhirToJDSSearch = require('../common/utils/fhir-to-jds-search');


function validParams(params) {
    // check common parameters
    if (!fhirToJDSSearch.validateCommonParams(params)) {
        return false;
    }
    // validate date
    if (!fhirToJDSSearch.validateDateParams(params)) {
        return false;
    }
    // TODO: add validation for code param

    return true; // all parameters passed validation
}

module.exports.validParams = validParams;

