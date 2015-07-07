/*jslint node: true */
'use strict';

var _ = require('underscore');
var searchbytypeDomains = require('../resources/searchbytype/Domains');
var searchbytypeResource = require('../resources/searchbytype/searchbytypeResource');

var domainMap = {
    'vital': 'vitalsign',
    'lab': 'laboratory',
    'immunization': 'immunization'
};

describe('Search by type Domains', function() {
    it('verifies that all search by type domain names are present', function() {
        expect(_.every(domainMap, function(value, key) {
            return searchbytypeDomains.hasName(key);
        })).toBe(true);
    });

    it('verifies that all search by type domain indexes are present', function() {
        expect(_.every(domainMap, function(value) {
            return searchbytypeDomains.hasIndex(value);
        })).toBe(true);
    });

    it('verifies the list of names returned by names() is correct', function() {
        expect(_.every(searchbytypeDomains.names(), function(value) {
            return value in domainMap;
        })).toBe(true);
    });

    it('verifies the list of indexes returned by indexes() is correct', function() {
        expect(_.every(searchbytypeDomains.indexes(), function(dValue) {
            return _.some(domainMap, function(value) {
                return dValue === value;
            });
        })).toBe(true);
    });

    it('verifies that the search by type domains are all present and correct', function() {
        expect(_.every(searchbytypeDomains.domains(), function(value) {
            return value.name in domainMap && value.index === domainMap[value.name];
        })).toBe(true);
    });

    it('verifies that the number of search by type domains in Domains is correct', function() {
        expect(searchbytypeDomains.domains().length).toBe(_.keys(domainMap).length);
    });

    it('verifies that the correct search by type Domain is returned for a given name', function() {
        expect(_.every(domainMap, function(value, key) {
            return _.isEqual(searchbytypeDomains.domainForName(key), {
                name: key,
                index: value
            });
        })).toBe(true);
    });
});

describe('Search by type Resources', function() {
    it('tests that getResourceConfig() is setup correctly for search by type - lab', function() {
        var resources = searchbytypeResource.getResourceConfig();
        expect(resources.length).toBe(3);

        expect(resources[0].name).toEqual('lab');
        expect(resources[0].index).toEqual('laboratory');
        expect(resources[0].path).toEqual('lab');
        expect(resources[0].interceptors).toEqual({
            synchronize: true
        });
        expect(resources[0].healthcheck).toBeDefined();
        expect(resources[0].parameters).toBeDefined();
        expect(resources[0].get).toBeDefined();
    });

    it('tests that getResourceConfig() is setup correctly for search by type - immunization', function() {
        var resources = searchbytypeResource.getResourceConfig();
        expect(resources.length).toBe(3);

        expect(resources[1].name).toEqual('immunization');
        expect(resources[1].index).toEqual('immunization');
        expect(resources[1].path).toEqual('immunization');
        expect(resources[1].interceptors).toEqual({
            synchronize: true
        });
        expect(resources[1].healthcheck).toBeDefined();
        expect(resources[1].parameters).toBeDefined();
        expect(resources[1].get).toBeDefined();
    });

    it('tests that getResourceConfig() is setup correctly for search by type - vital', function() {
        var resources = searchbytypeResource.getResourceConfig();
        expect(resources.length).toBe(3);

        expect(resources[2].name).toEqual('vital');
        expect(resources[2].index).toEqual('vitalsign');
        expect(resources[2].path).toEqual('vital');
        expect(resources[2].interceptors).toEqual({
            synchronize: true
        });
        expect(resources[2].healthcheck).toBeDefined();
        expect(resources[2].parameters).toBeDefined();
        expect(resources[2].get).toBeDefined();
    });
});
