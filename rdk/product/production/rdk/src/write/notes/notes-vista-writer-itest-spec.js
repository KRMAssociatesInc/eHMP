'use strict';

var vistaWriter = require('./notes-vista-writer');

var writebackContext = {
    pid: '9E7A;8',
    vistaConfig: {
        host: '10.2.2.101',
        port: 9210,
        accessCode: 'pu1234',
        verifyCode: 'pu1234!!',
        localIP: '10.2.2.1',
        localAddress: 'localhost',
        context: 'HMP UI CONTEXT'
    },
    model: {
        'authorUid': '10000000255',
        'documentDefUid': 'urn:va:doc-def:9E7A:40',
        'encounterUid': 'H2931013',
        'encounterDateTime': '199310131400',
        'referenceDateTime': '201507101410',
        'locationUid': 'urn:va:location:9E7A:32',
        'patientIcn': '10110V004877',
        'pid': '9E7A;8',
        'status': 'UNSIGNED'
    }
};

describe('write-back notes vista writer integration', function() {
    describe('tests unsigned', function() {
        it('returns success with note ien', function(done) {
            this.timeout(5000);
            vistaWriter.unsigned(writebackContext, function(err, result) {
                expect(err).to.be.falsy();
                expect(writebackContext.vprResponse).to.be.undefined();
                expect(writebackContext.model.localId).to.be.truthy();
                done();
            });
        });
    });
});
