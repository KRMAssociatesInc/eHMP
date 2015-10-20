'use strict';

var providerList = require('./new-persons-fetch-list').getNewPersons;
var must = require('must');

var log = sinon.stub(require('bunyan').createLogger({ name: 'new-persons-fetch-list' }));
//var log = require('bunyan').createLogger({ name: 'new-persons-fetch-list' }); //Uncomment this line (and comment above) to see output in IntelliJ console

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

describe('new-persons-fetch-list resource integration test', function() {
    it('can call the RPC with searchString, no type, and a date', function(done) {
        this.timeout(20000);
        providerList(log, configuration, 'PROGRAMMER,OND~', '', '3150710', function(err, result) {
            expect(err).to.be.null();
            expect(result).not.to.be.falsy();
            result.must.be.an.array();
            expect(result.length).to.equal(44);
            done();
        });
    });

    it('can call the RPC with no searchString, no type, and a date', function(done) {
        this.timeout(20000);
        providerList(log, configuration, '', '', '3150710', function(err, result) {
            expect(err).to.be.null();
            expect(result).not.to.be.falsy();
            result.must.be.an.array();
            expect(result.length).to.equal(44);
            done();
        });
    });

    it('can call the RPC with searchString, no type, and no date', function(done) {
        this.timeout(20000);
        providerList(log, configuration, 'KHAN,VIHAAM~', null, null, function(err, result) {
            expect(err).to.be.null();
            expect(result).not.to.be.falsy();
            result.must.be.an.array();
            expect(result.length).to.equal(44);
            done();
        });
    });

    it('can call the RPC with no searchString, no type, and no date', function(done) {
        this.timeout(20000);
        providerList(log, configuration, '', null, null, function(err, result) {
            expect(err).to.be.null();
            expect(result).not.to.be.falsy();
            result.must.be.an.array();
            expect(result.length).to.be.gte(44); //Was 115 at the time this test was written.
            done();
        });
    });
});
