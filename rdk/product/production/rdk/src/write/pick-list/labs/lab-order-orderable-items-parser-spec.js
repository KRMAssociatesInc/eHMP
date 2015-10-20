'use strict';

var log = sinon.stub(require('bunyan').createLogger({
    name: 'cpt-modifier-parser'
}));

// log = require('bunyan').createLogger({
//     name: 'lab-order-orderable-items-itest',
//     level: 'debug'
// });

var parseRpc = require('./lab-order-orderable-items-parser').parseLabOrderOrderableItems;

var message2parse = '515^1,25-DIHYDROXYVIT D^1,25-DIHYDROXYVIT D\r\n350^11-DEOXYCORTISOL^11-DEOXYCORTISOL\r\n683^17-HYDROXYCORTICOSTEROIDS^17-HYDROXYCORTICOSTEROIDS';
var expectedResult = [{
    'ien': '515',
    'synonym': '1,25-DIHYDROXYVIT D',
    'name': '1,25-DIHYDROXYVIT D'
}, {
    'ien': '350',
    'synonym': '11-DEOXYCORTISOL',
    'name': '11-DEOXYCORTISOL'
}, {
    'ien': '683',
    'synonym': '17-HYDROXYCORTICOSTEROIDS',
    'name': '17-HYDROXYCORTICOSTEROIDS'
}];

var mockMessageMoreFieldsThanExpected = '999^aaaaaaaa^1234^aaaa\r\n888^bbbbbbb^1234^ccccc\r\n';
var mockMessageFewerFieldsThanExpected = 'aaa\r\nbbb\r\n';

describe('unit test to verify that the orderable items RPC response is parsed correctly', function() {
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