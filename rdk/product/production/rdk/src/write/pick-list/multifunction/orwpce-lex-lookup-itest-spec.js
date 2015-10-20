/*global sinon, describe, it, before, beforeEach, after, afterEach, spyOn, expect, runs, waitsFor */
'use strict';

var fetchList = require('./orwpce-lex-lookup-fetch-list').getOrwpceLexLookUp;

var log = sinon.stub(require('bunyan').createLogger({ name: 'orwpce-lex-look-up-fetch-list' }));
//var log = require('bunyan').createLogger({ name: 'orwpce-lex-look-up-fetch-list' }); //Uncomment this line (and comment above) to see output in IntelliJ console

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

describe('orwpce-lex-look-up resource integration test', function() {
    it('can call the getOrwpceLexLookUp RPC to retrieve ICD codes', function (done) {
        this.timeout(20000);
        fetchList(log, configuration, 'CAD', 'ICD', 0, function(err, result) {
            expect(err).to.be.falsy();
            expect(result).to.be.truthy();
            result.must.be.an.array();
            done();
        });
    });
    it('can call the getOrwpceLexLookUp RPC to retrieve CHP codes', function (done) {
        this.timeout(20000);
        fetchList(log, configuration, 'CAD', 'CHP', 0, function(err, result) {
            expect(err).to.be.falsy();
            expect(result).to.be.truthy();
            result.must.be.an.array();
            done();
        });
    });
    it('can call the getOrwpceLexLookUp RPC to retrieve CPT codes', function (done) {
        this.timeout(20000);
        fetchList(log, configuration, 'CAD', 'CPT', 0, function(err, result) {
            expect(err).to.be.falsy();
            expect(result).to.be.truthy();
            result.must.be.an.array();
            done();
        });
    });
});
