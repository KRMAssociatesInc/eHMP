'use strict';
var allergies = require('../vler/toc/allergiesSection');

describe('Allergies Section', function() {

    var dataInput = {};

    dataInput.data = {};
    dataInput.data.items = [];
    dataInput.data.items.push('data');

    var data = allergies.buildResult(dataInput);

    it('verifies that given problems buildResult function returns the appropriate function', function() {
        expect(data.allergy).toEqual(['data']);
    });

});
