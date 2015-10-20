'use strict';

var fetch = require('./encounters-diagnosis-lexicon-lookup-fetch-list').getEncountersDiagnosisLexiconLookup;

var log = sinon.stub(require('bunyan').createLogger({
    name: 'encounters-diagnosis-lexicon-lookup-fetch-list'
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

describe('encounters-diagnosis-lexicon-lookup-fetch-list resource integration test', function() {
    it('can call the RPC', function(done) {
        this.timeout(20000);
        fetch(log, configuration, 'CAD', function(err, result) {
            expect(err).to.be.null();
            expect(result).not.to.be.falsy();
            done();
        });
    });
});
