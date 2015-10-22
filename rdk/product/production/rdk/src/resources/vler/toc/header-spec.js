'use strict';
var header = require('./header');

describe('Header Section', function() {

    var dataInput = {};

    dataInput.data = {};
    dataInput.data.items = [];
    dataInput.data.items.push('data');

    var data = header.buildResult(dataInput);

    it('verifies that given header buildResult function returns the appropriate function', function() {
        expect(data.patient).to.eql(['data']);
    });

});
