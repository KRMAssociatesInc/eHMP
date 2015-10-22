'use strict';

var log = sinon.stub(require('bunyan').createLogger({
    name: 'lab-default-immediate-collect-time-parser'
}));

var parseRpcData = require('./lab-default-immediate-collect-time-parser').parseDefaultImmediateCollectTime;

describe('verify lab default immediate collect time parser', function() {

    it('parse undefined data', function() {
        expect(function() {
            parseRpcData(log, undefined);
        }).to.throw(Error);
    });

    it('parse data with with blank fields', function() {
        expect(function() {
            parseRpcData(log, '');
        }).to.throw(Error);
    });

    it('parse data with with 1 field', function() {
        expect(function() {
            parseRpcData(log, '3150702.1940');
        }).to.throw(Error);
    });

    it('parse valid RPC data', function() {
        var result = parseRpcData(log, '3150702.1940^Jul 02, 2015@19:40^5^24');
        expect(result).to.eql([{
            "defaultImmediateCollectTime": "20150702194000"
        }]);
    });

});
