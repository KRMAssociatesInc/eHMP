'use strict';

var fetchListRpcDirect = require('../progressnotes/progress-notes-titles-fetch-list').getProgressNotesTitlesDirectRpcCall;

var log = sinon.stub(require('bunyan').createLogger({ name: 'progress-notes-titles-fetch-list' }));
//var log = require('bunyan').createLogger({ name: 'progress-notes-titles-fetch-list' }); //Uncomment this line (and comment above) to see output in IntelliJ console

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

describe('progress-notes-titles resource integration test', function() {
    it('can call the getProgressNotesTitlesDirectRpcCall RPC', function (done) {
        this.timeout(200000);
        fetchListRpcDirect(log, configuration, 'ABC', '3', function(err, result) {
            expect(err).to.be.falsy();
            expect(result).to.be.truthy();
            expect(result.length).to.eql(44);
            done();
        });
    });
});
