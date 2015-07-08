'use strict';

var _ = require('underscore');

module.exports = labGroupSearch;

function labGroupSearch(searchTerm) {

    var labGroups = [
        '2ND NEW HEADER',
        '2ND NEW HEADER',
        'CHEMISTRY (SERUM)',
        'CHEMISTRY (SERUM)',
        'CHEMISTRY-GLUCOSE TOL.',
        'CHEMISTRY-GLUCOSE TOL.',
        'CHEMISTRY-MISC.',
        'CHEMISTRY-MISC.',
        'COAG & MISC. HEM',
        'COAG & MISC. HEM',
        'DIFFERENTIAL COUNT',
        'DIFFERENTIAL COUNT',
        'FLUIDS',
        'FLUIDS',
        'HEMATOLOGY',
        'HEMATOLOGY',
        'LAB LONG TERM TESTS',
        'LAB LONG TERM TESTS',
        'NEW CHEM HEADER',
        'NEW CHEM HEADER',
        'RIA',
        'RIA',
        'RIA-(PLASMA)',
        'RIA-(PLASMA)',
        'SEROLOGY',
        'SEROLOGY',
        'TOXICOLOGY',
        'TOXICOLOGY',
        'URINALYSIS',
        'URINALYSIS',
        'URINE CHEMS',
        'URINE CHEMS'
    ];

    var responseArray = [];

    _.each(labGroups, function (labGroup) {
        if (labGroup.toUpperCase().indexOf(searchTerm.toUpperCase()) > -1) {
            responseArray = responseArray.concat(labGroup);
        }
    });
    return responseArray;

}
