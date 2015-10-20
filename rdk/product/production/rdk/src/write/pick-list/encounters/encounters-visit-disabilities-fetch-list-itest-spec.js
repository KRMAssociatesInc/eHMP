'use strict';

var disabilities = require('./encounters-visit-disabilities-fetch-list').getDisabilities;

var log = sinon.stub(require('bunyan').createLogger({
    name: 'encounters-visit-disabilities-fetch-list'
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

describe('encounters-visit-disabilities resource integration test', function() {
    it('can call the RPC', function(done) {
        this.timeout(20000);
        disabilities(log, configuration, '230', function(err, result) {
            expect(err).to.be.null();
            expect(result).not.to.be.falsy();
            done();
        });
    });
});
