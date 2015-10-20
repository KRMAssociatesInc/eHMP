'use strict';
var allergies = require('./allergies-section');

describe('Allergies Section', function() {

    var dataInput = {};

    dataInput.data = {};
    dataInput.data.items = [];
    dataInput.data.items.push('data');

    var data = allergies.buildResult(dataInput);

    it('verifies that given problems buildResult function returns the appropriate function', function() {
        expect(data.allergy).to.eql(['data']);
    });

});
