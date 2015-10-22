'use strict';

var fetchList = require('./encounters-procedure-types-fetch-list').getEncountersProcedureTypes;

var log = sinon.stub(require('bunyan').createLogger({ name: 'encounters-procedure-types-fetch-list' }));
//var log = require('bunyan').createLogger({ name: 'encounters-procedure-types-fetch-list' }); //Uncomment this line (and comment above) to see output in IntelliJ console

var configuration = {
    environment: 'development',
    context: 'OR CPRS GUI CHART',
    host: '10.2.2.101',
    port: 9210,
    accessCode: 'pu1234',
    verifyCode: 'pu1234!!',
    localIP: '10.2.2.1',
    localAddress: 'localhost'
};

describe('encounters-procedure-types resource integration test', function() {
    it('can call the getEncountersProcedureTypes RPC', function (done) {
        this.timeout(20000);
        fetchList(log, configuration, '195', '3131001', function(err, result) {
            expect(err).to.be.falsy();
            expect(result).to.be.truthy();
            done();
        });
    });
    it('will return an error if ien is missing', function (done) {
        this.timeout(8000);
        fetchList(log, configuration, null, '3131001', function (err, result) {
            expect(err).to.be.truthy();
            expect(result).to.be.falsy();
            done();
        });
    });
    it('will NOT return an error if visitDate is missing', function (done) {
        this.timeout(8000);
        fetchList(log, configuration, 195, '', function (err, result) {
            expect(err).to.be.falsy();
            expect(result).to.be.truthy();
            done();
        });
    });
});
