
var log = sinon.stub(require('bunyan').createLogger({
    name: 'diagnostic-codes-clinic-parser'
}));

var parseRpcData = require('./encounters-diagnosis-codes-for-clinic-parser').parseEncountersDiagnosisCodesForClinic;

describe('verify diagnostic codes for clinic parser', function() {
    it('parse undefined data', function () {
        expect(function() {parseRpcData(log, undefined);}).to.throw(Error);
    });

    it('parse zero entries', function () {
        var result = parseRpcData(log, '0');
        expect(result).to.eql([]);

        result = parseRpcData(log, '0^');
        expect(result).to.eql([]);
    });

    it('parse field data with blank category name', function () {
        var result = parseRpcData(log, '1\r\n^\r\n441.3^ABDOMINAL, RUPTURED^^^^^^^^ABDOMINAL ANEURYSM, RUPTURED');
        expect(result).to.eql([{source: '', categoryName: '', values: [{icdCode: '441.3', name: 'ABDOMINAL, RUPTURED', description: 'ABDOMINAL ANEURYSM, RUPTURED'}]}]);
    });

    it('parse data with group name only', function () {
        var result = parseRpcData(log, '1\r\n^OTHERS');
        expect(result).to.eql([{source: '', categoryName: 'OTHERS'}]);
    });

    it('parse data fields', function () {
        var result = parseRpcData(log, '1\r\n^ANEURYSMS\r\n441.3^ABDOMINAL, RUPTURED^^^^^^^^ABDOMINAL ANEURYSM, RUPTURED');
        expect(result).to.eql([{source: '', categoryName: 'ANEURYSMS', values: [{icdCode: '441.3', name: 'ABDOMINAL, RUPTURED', description: 'ABDOMINAL ANEURYSM, RUPTURED'}]}]);
    });
});
