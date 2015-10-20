'use strict';

var serviceConnected = require('./encounters-visit-service-connected-fetch-list').serviceConnected;

var log = sinon.stub(require('bunyan').createLogger({
    name: 'encounters-visit-service-connected-fetch-list'
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

describe('encounters-visit-service-connected resource integration test', function() {
    it('can call the RPC', function(done) {
        this.timeout(20000);
        serviceConnected(log, configuration, "230", "3131001", "195", function(err, result) {
            expect(err).to.be.null();
            expect(result).not.to.be.falsy();
            done();
        });
    });
});
