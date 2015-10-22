'use strict';

var resource = require('./orders-common-edit-vista-writer');

describe('write-back orders common edit vista writer', function() {
    it('tests that getParameters returns correct parameters array', function() {
        var resourceId = '12345;1';
        var expectedArray = ['X12345;1', '0'];
        var parameters = resource._getParameters(resourceId);
        expect(parameters).to.eql(expectedArray);
    });
});
