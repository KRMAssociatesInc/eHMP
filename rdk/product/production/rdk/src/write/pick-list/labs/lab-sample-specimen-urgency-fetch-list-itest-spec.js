'use strict';

var fetchList = require('./lab-sample-specimen-urgency-fetch-list').getLabSampleSpecimenUrgency;
var async = require('async');

var log = sinon.stub(require('bunyan').createLogger({ name: 'lab-sample-specimen-urgency-fetch-list' }));
//var log = require('bunyan').createLogger({ name: 'lab-sample-specimen-urgency-fetch-list' }); //Uncomment this line (and comment above) to see output in IntelliJ console

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

function testIenForSuccess(ien) {
    it('can call the RPC', function (done) {
        this.timeout(20000);
        async.series([function (callback) {
            fetchList(log, configuration, ien, callback);
        }], function(err, result) {
            expect(err).to.be.falsy();
            expect(result).to.be.truthy();
            done();
        });
    });
}

describe('lab-sample-specimen-urgency resource integration test', function() {
    testIenForSuccess(291);  //Text entries for CollSamp belong associated with the row above them (all but last row has text)
    testIenForSuccess(312);  //Text entries for CollSamp belong associated with the row above them (only one row has text)
    testIenForSuccess(515);
    testIenForSuccess(548);  //unknown category entry \"ReqCom\""
    testIenForSuccess(1076); //unknown category entry \"Default Urgency\""
    testIenForSuccess(312);  //CollSamp array did not contain 10 entries, it had 9
    testIenForSuccess(314);  //CollSamp array did not contain 10 entries, it had 1
});
