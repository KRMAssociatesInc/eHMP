'use strict';

var fetchList = require('./lab-collect-times-fetch-list').fetch;

var log = sinon.stub(require('bunyan').createLogger({
    name: 'lab-collect-times-fetch-list'
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

describe('lab-all-samples resource integration test', function() {
    it('can call the RPC', function (done) {
        this.timeout(20000);
        fetchList(log, configuration, function(err, result) {
            expect(err).to.be.falsy();
            expect(result).to.be.truthy();
            done();
        });
    });
});
