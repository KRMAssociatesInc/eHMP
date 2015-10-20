'use strict';

var fetch = require('./lab-order-orderable-items-fetch-list').getLabOrderOrderableItemsDirectRpcCall;

var log = sinon.stub(require('bunyan').createLogger({
    name: 'lab-order-orderable-items-itest'
}));

// log = require('bunyan').createLogger({
//     name: 'lab-order-orderable-items-itest',
//     level: 'debug'
// });

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

describe('lab-order-orderable-items resource integration test', function() {
    it('Normal path (direct rpc call): can call the getLabOrderOrderableItemsDirectRpcCall RPC', function(done) {
        this.timeout(120000);
        fetch(log, configuration, 'ABC', 'S.LAB', function(err, result) {
            expect(err).to.be.null();
            expect(result).to.be.truthy();
            done();
        });
    });
    it('Error path (direct rpc call): return error when labType parameter is missing', function(done) {
        this.timeout(120000);
        fetch(log, configuration, 'ABC', '', function(err, result) {
            expect(err).to.be.truthy();
            expect(result).to.be.falsy();
            done();
        });
    });
    it('Error path (direct rpc call): no data returned on invalid labType', function(done) {
        this.timeout(120000);
        fetch(log, configuration, 'ABC', 'A', function(err, result) {
            expect(err).to.be.truthy();
            expect(result).to.be.falsy();
            done();
        });
    });
});
