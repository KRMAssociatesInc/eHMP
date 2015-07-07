'use strict';

var cdsWorkProductResource = require('../resources/cdsworkproduct/cdsWorkProductResource');

describe('CDS Work Product Resource', function() {
    it('tests that getResourceConfig() is setup correctly for retrieveWorkProducts', function() {
        var resources = cdsWorkProductResource.getResourceConfig();
        expect(resources.length).toBe(9);

        expect(resources[0].name).toEqual('retrieveWorkProducts');
        expect(resources[0].path).toEqual('');
        expect(resources[0].interceptors).toEqual({
            audit: false,
            authentication: false,
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[0].healthcheck).toBeDefined();
        expect(resources[0].parameters).toBeDefined();
        expect(resources[0].get).toBeDefined();
    });

    it('tests that getResourceConfig() is setup correctly for createWorkProduct', function() {
        var resources = cdsWorkProductResource.getResourceConfig();

        expect(resources[1].name).toEqual('createWorkProduct');
        expect(resources[1].path).toEqual('');
        expect(resources[1].interceptors).toEqual({
            audit: false,
            authentication: false,
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[1].healthcheck).toBeDefined();
        expect(resources[1].parameters).toBeUndefined();
        expect(resources[1].post).toBeDefined();
    });

    it('tests that getResourceConfig() is setup correctly for retrieveWorkProduct', function() {
        var resources = cdsWorkProductResource.getResourceConfig();

        expect(resources[2].name).toEqual('retrieveWorkProduct');
        expect(resources[2].path).toEqual('/:id');
        expect(resources[2].interceptors).toEqual({
            audit: false,
            authentication: false,
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[2].healthcheck).toBeDefined();
        expect(resources[2].parameters).toBeUndefined();
        expect(resources[2].get).toBeDefined();
    });

    it('tests that getResourceConfig() is setup correctly for user updateWorkProduct', function() {
        var resources = cdsWorkProductResource.getResourceConfig();

        expect(resources[3].name).toEqual('updateWorkProduct');
        expect(resources[3].path).toEqual('/:id');
        expect(resources[3].interceptors).toEqual({
            audit: false,
            authentication: false,
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[3].healthcheck).toBeDefined();
        expect(resources[3].parameters).toBeUndefined();
        expect(resources[3].put).toBeDefined();
    });

    it('tests that getResourceConfig() is setup correctly for deleteWorkProduct', function() {
        var resources = cdsWorkProductResource.getResourceConfig();

        expect(resources[4].name).toEqual('deleteWorkProduct');
        expect(resources[4].path).toEqual('/:id');
        expect(resources[4].interceptors).toEqual({
            audit: false,
            authentication: false,
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[4].healthcheck).toBeDefined();
        expect(resources[4].parameters).toBeUndefined();
        expect(resources[4].delete).toBeDefined();
    });

    it('tests that getResourceConfig() is setup correctly for Preferences', function() {
        var resources = cdsWorkProductResource.getResourceConfig();

        expect(resources[5].name).toEqual('Preferences');
        expect(resources[5].path).toEqual('/preferences');
        expect(resources[5].interceptors).toEqual({
            audit: false,
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[5].healthcheck).toBeDefined();
        expect(resources[5].parameters).toBeUndefined();
        expect(resources[5].get).toBeDefined();

        expect(resources[6].name).toEqual('Preferences');
        expect(resources[6].path).toEqual('/preferences');
        expect(resources[6].interceptors).toEqual({
            audit: false,
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[6].healthcheck).toBeDefined();
        expect(resources[6].parameters).toBeUndefined();
        expect(resources[6].put).toBeDefined();

        expect(resources[7].name).toEqual('Preferences');
        expect(resources[7].path).toEqual('/preferences');
        expect(resources[7].interceptors).toEqual({
            audit: false,
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[7].healthcheck).toBeDefined();
        expect(resources[7].parameters).toBeUndefined();
        expect(resources[7].delete).toBeDefined();
    });

    it('tests that getResourceConfig() is setup correctly for retrieveInbox', function() {
        var resources = cdsWorkProductResource.getResourceConfig();

        expect(resources[8].name).toEqual('Inbox');
        expect(resources[8].path).toEqual('/inbox');
        expect(resources[8].interceptors).toEqual({
            audit: false,
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[8].healthcheck).toBeDefined();
        expect(resources[8].get).toBeDefined();
    });

});
