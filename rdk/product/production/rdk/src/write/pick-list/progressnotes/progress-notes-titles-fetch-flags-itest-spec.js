'use strict';

var fetchFlags = require('../progressnotes/progress-notes-titles-fetch-flags').getProgressNoteTitlesFlags;

var log = sinon.stub(require('bunyan').createLogger({ name: 'progress-notes-titles-fetch-flags' }));

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

describe('progress-note-flags resource integration test', function() {
    it('can call the RPCs to fetch the flags', function(done) {
        this.timeout(20000);
        fetchFlags(log, configuration, '1354', function(err, result) {
            expect(err).to.be.falsy();
            expect(result).to.be.truthy();

            expect(result.isSurgeryNote).to.exist();
            expect(result.isSurgeryNote).to.eql(false);

            expect(result.isOneVisitNote).to.exist();
            expect(result.isOneVisitNote).to.eql(false);

            expect(result.isPrfNote).to.exist();
            expect(result.isPrfNote).to.eql(true);

            expect(result.isConsultNote).to.exist();
            expect(result.isConsultNote).to.eql(false);

            done();
        });
    });
});
