/*jslint node: true*/
'use strict';

var opResource = require('../resources/jdsoperationaldata/opDataResource');

describe('JDS Operational Data Resource Test', function() {
    it('tests that getResourceConfig() is setup correctly for vital types lists', function() {
        var resources = opResource.getResourceConfig();

        expect(resources[0].name).toEqual('type-vital');
        expect(resources[0].path).toEqual('/vital');
        expect(resources[0].interceptors).toEqual({
            pep: false
        });
        expect(resources[0].healthcheck).toBeDefined();
        expect(resources[0].get).toBeDefined();
    });

    it('tests that getResourceConfig() is setup correctly for laboratory types lists', function() {
        var resources = opResource.getResourceConfig();

        expect(resources[1].name).toEqual('type-laboratory');
        expect(resources[1].path).toEqual('/laboratory');
        expect(resources[1].interceptors).toEqual({
            pep: false
        });
        expect(resources[1].healthcheck).toBeDefined();
        expect(resources[1].get).toBeDefined();
    });

    it('tests that getResourceConfig() is setup correctly for medication types lists', function() {
        var resources = opResource.getResourceConfig();

        expect(resources[2].name).toEqual('type-medication');
        expect(resources[2].path).toEqual('/medication');
        expect(resources[2].interceptors).toEqual({
            pep: false
        });
        expect(resources[2].healthcheck).toBeDefined();
        expect(resources[2].get).toBeDefined();
    });
});
