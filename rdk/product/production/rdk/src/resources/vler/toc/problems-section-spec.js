'use strict';
var problems = require('./problems-section');

describe('Problems Section', function() {

    var dataInput = {};

    dataInput.data = {};
    dataInput.data.items = [];
    dataInput.data.items.push('data');

    var data = problems.buildResult(dataInput);

    it('verifies that given problems buildResult function returns the appropriate function', function() {
        expect(data.problem).to.eql(['data']);
    });

});
