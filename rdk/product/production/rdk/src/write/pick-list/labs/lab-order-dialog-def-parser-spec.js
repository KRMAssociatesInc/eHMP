
var log = sinon.stub(require('bunyan').createLogger({
    name: 'lab-order-dialog-def-parser'
}));

var parseRpcData = require('./lab-order-dialog-def-parser').parseLabOrderDialogDef;

describe('verify lab order dialog def parser', function() {
    it('parse empty string data', function () {
        var result = parseRpcData(log, '');
        expect(result).to.eql([]);
    });

    it('parse invalid string data', function () {
        expect(function() {parseRpcData(log, 'Home is where the heart is.');}).to.throw(Error);
    });

    it('parse empty ~ only data', function () {
        var result = parseRpcData(log, '~');
        expect(result).to.eql([{categoryName: ''}]);
    });

    it('parse field data with blank group name', function () {
        var result = parseRpcData(log, '~\r\niLNEXT^Next scheduled lab collection');
        expect(result).to.eql([{categoryName: '', values: [{code: 'LNEXT', name: 'Next scheduled lab collection'}]}]);
    });
});
