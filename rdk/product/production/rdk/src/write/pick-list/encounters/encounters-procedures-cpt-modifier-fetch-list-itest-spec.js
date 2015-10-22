'use strict';

var fetchList = require('./encounters-procedures-cpt-modifier-fetch-list').getEncountersProceduresCptModifier;

var log = sinon.stub(require('bunyan').createLogger({
    name: 'cpt-modifier-fetch-list'
}));

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

describe('cpt-modifier resource integration test', function() {
    it('Normal path: can call the getEncountersProceduresCptModifier RPC', function (done) {
        this.timeout(8000);
        fetchList(log, configuration, '99202', '3150617', function (err, result) {
            expect(err).to.be.falsy();
            expect(result).to.exist();
            done();
        });
    });
    it('Error path: receive error when cpt parameter is missing', function(done){
        this.timeout(8000);
        fetchList(log, configuration, '', '', function (err, result) {
            expect(err).to.be.truthy();
            expect(result).not.to.exist();
            done();
        });
    });
    it('Error path: no data returned', function(done){
        this.timeout(8000);
        fetchList(log, configuration, '1', '3150617', function (err, result) {
            expect(err).to.be.truthy();
            expect(result).not.to.exist();
            done();
        });
    });
});
