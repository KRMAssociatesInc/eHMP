'use strict';

var resource = require('./orders-common-discontinue-vista-writer');

describe('write-back orders common discontinue vista writer', function() {
    it('tests that getParameters returns correct parameters array', function() {
        var model = {
            'orderId': '38479;1',
            'provider': '10000000231',
            'location': '285',
            'localId': '12519',
            'uid': 'urn:va:order:9E7A:100615:12519',
            'kind': 'Laboratory'
        };
        var expectedArray = ['38479;1', '10000000231', '285', '0', '0', '0'];
        var parameters = resource._getParameters(model);
        expect(parameters).to.eql(expectedArray);
    });
});
