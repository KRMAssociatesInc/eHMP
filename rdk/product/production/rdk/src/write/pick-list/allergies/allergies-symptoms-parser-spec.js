'use strict';

var log = sinon.stub(require('bunyan').createLogger({
    name: 'allergies-symptoms-fetch-list'
}));

var parseRpc = require('./allergies-symptoms-parser').parseSymptoms;

var message2parse = '476^A FIB-FLUTTER\t<ATRIAL FIBRILLATION-FLUTTER>^ATRIAL FIBRILLATION-FLUTTER\r\n237^ABDOMINAL BLOATING\r\n';

var expectedResult = '[{"ien":"476","synonym":"A FIB-FLUTTER\\t<ATRIAL FIBRILLATION-FLUTTER>","name":"ATRIAL FIBRILLATION-FLUTTER"},{"ien":"237","synonym":"ABDOMINAL BLOATING","name":"ABDOMINAL BLOATING"}]';


describe('unit test to validate allergies parse the RPC response correctly', function() {
    it('parse the RPC data correctly', function () {
        var result = parseRpc(log, message2parse);
        result = JSON.stringify(result);
        expect(result).to.eql(expectedResult);
    });
});
