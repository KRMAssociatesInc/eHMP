'use strict';

var log = sinon.stub(require('bunyan').createLogger({
    name: 'cpt-modifier-parser'
}));

var parseRpc = require('./encounters-procedures-cpt-modifier-parser').parseEncountersProceduresCptModifier;

var message2parse = '367^\'OPT OUT\' PHYS/PRACT EMERG OR URGENT SERVICE^GJ\r\n390^ACTUAL ITEM/SERVICE ORDERED^GK\r\n499^AMCC TEST FOR ESRD OR MCP MD^CD';
var expectedResult = [{
    'ien': '367',
    'name': '\'OPT OUT\' PHYS/PRACT EMERG OR URGENT SERVICE',
    'code': 'GJ'
}, {
    'ien': '390',
    'name': 'ACTUAL ITEM/SERVICE ORDERED',
    'code': 'GK'
}, {
    'ien': '499',
    'name': 'AMCC TEST FOR ESRD OR MCP MD',
    'code': 'CD'
}];

var mockMessageMoreFieldsThanExpected = '999^aaaaaaaa^1234^aaaa\r\n888^bbbbbbb^1234^ccccc\r\n';
var mockMessageFewerFieldsThanExpected = 'aaa\r\nbbb\r\n';

describe('unit test to verify that the cpt modifier RPC response is parsed correctly', function() {
    it('parse the RPC data correctly', function() {
        var result = parseRpc(log, message2parse);
        expect(result).to.eql(expectedResult);
    });
    it('parse empty string', function(){
        var result = parseRpc(log, '');
        expect(result).to.eql([]);
    });
    it('Error path: handles null', function(){
        var result = parseRpc(log, null);
        expect(result).to.eql([]);
    });
    it('Error path: handles undefined', function(){
        var result = parseRpc(log, undefined);
        expect(result).to.eql([]);
    });
    it('Error path: data has more fields than expected', function(){
        var result = parseRpc(log, mockMessageMoreFieldsThanExpected);
        expect(result).to.eql([]);
    });
     it('Error path: data has fewer fields than expected', function(){
        var result = parseRpc(log, mockMessageFewerFieldsThanExpected);
        expect(result).to.eql([]);
    });
});
