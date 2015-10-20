'use strict';
var medications = require('./medications-section');

describe('Medications Section', function() {

    var dataInput = {};

    dataInput.data = {};
    dataInput.data.items = [];
    dataInput.data.items.push('data');

    var data = medications.buildResult(dataInput);

    it('verifies that given problems buildResult function returns the appropriate function', function() {
        expect(data.medication).to.eql(['data']);
    });

});
