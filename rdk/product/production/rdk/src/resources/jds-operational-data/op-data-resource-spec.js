/*jslint node: true*/
'use strict';

var opResource = require('./op-data-resource');

describe('JDS Operational Data Resource Test', function() {
    it('tests that getResourceConfig() is setup correctly for vital types lists', function() {
        var resources = opResource.getResourceConfig();

        expect(resources[0].name).to.equal('type-vital');
        expect(resources[0].path).to.equal('/vital');
        expect(resources[0].interceptors).to.eql({
            pep: false,
            synchronize: false
        });
        expect(resources[0].healthcheck).not.to.be.undefined();
        expect(resources[0].get).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for laboratory types lists', function() {
        var resources = opResource.getResourceConfig();

        expect(resources[1].name).to.equal('type-laboratory');
        expect(resources[1].path).to.equal('/laboratory');
        expect(resources[1].interceptors).to.eql({
            pep: false,
            synchronize: false
        });
        expect(resources[1].healthcheck).not.to.be.undefined();
        expect(resources[1].get).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for medication types lists', function() {
        var resources = opResource.getResourceConfig();

        expect(resources[2].name).to.equal('type-medication');
        expect(resources[2].path).to.equal('/medication');
        expect(resources[2].interceptors).to.eql({
            pep: false,
            synchronize: false
        });
        expect(resources[2].healthcheck).not.to.be.undefined();
        expect(resources[2].get).not.to.be.undefined();
    });
});
