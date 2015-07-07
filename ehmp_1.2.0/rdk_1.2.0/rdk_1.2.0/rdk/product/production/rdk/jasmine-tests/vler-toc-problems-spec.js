'use strict';
var problems = require('../vler/toc/problemsSection');

describe('Problems Section', function() {

    var dataInput = {};

    dataInput.data = {};
    dataInput.data.items = [];
    dataInput.data.items.push('data');

    var data = problems.buildResult(dataInput);

    it('verifies that given problems buildResult function returns the appropriate function', function() {
        expect(data.problem).toEqual(['data']);
    });

});
