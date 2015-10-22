'use strict';

var _ = require('underscore');
var searchbytypeDomains = require('./domains');
var searchbytypeResource = require('./search-by-type-resource');

var domainMap = {
    'vital': 'vitalsign',
    'lab': 'laboratory',
    'immunization': 'immunization'
};

describe('Search by type Domains', function() {
    it('verifies that all search by type domain names are present', function() {
        expect(_.every(domainMap, function(value, key) {
            return searchbytypeDomains.hasName(key);
        })).to.be.true();
    });

    it('verifies that all search by type domain indexes are present', function() {
        expect(_.every(domainMap, function(value) {
            return searchbytypeDomains.hasIndex(value);
        })).to.be.true();
    });

    it('verifies the list of names returned by names() is correct', function() {
        expect(_.every(searchbytypeDomains.names(), function(value) {
            return value in domainMap;
        })).to.be.true();
    });

    it('verifies the list of indexes returned by indexes() is correct', function() {
        expect(_.every(searchbytypeDomains.indexes(), function(dValue) {
            return _.some(domainMap, function(value) {
                return dValue === value;
            });
        })).to.be.true();
    });

    it('verifies that the search by type domains are all present and correct', function() {
        expect(_.every(searchbytypeDomains.domains(), function(value) {
            return value.name in domainMap && value.index === domainMap[value.name];
        })).to.be.true();
    });

    it('verifies that the number of search by type domains in Domains is correct', function() {
        expect(searchbytypeDomains.domains().length).to.equal(_.keys(domainMap).length);
    });

    it('verifies that the correct search by type Domain is returned for a given name', function() {
        expect(_.every(domainMap, function(value, key) {
            return _.isEqual(searchbytypeDomains.domainForName(key), {
                name: key,
                index: value
            });
        })).to.be.true();
    });
});

describe('Search by type Resources', function() {
    it('tests that getResourceConfig() is setup correctly for search by type - lab', function() {
        var resources = searchbytypeResource.getResourceConfig();
        expect(resources.length).to.equal(3);

        expect(resources[0].name).to.equal('lab');
        expect(resources[0].index).to.equal('laboratory');
        expect(resources[0].path).to.equal('lab');
        expect(resources[0].healthcheck).not.to.be.undefined();
        expect(resources[0].parameters).not.to.be.undefined();
        expect(resources[0].get).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for search by type - immunization', function() {
        var resources = searchbytypeResource.getResourceConfig();
        expect(resources.length).to.equal(3);

        expect(resources[1].name).to.equal('immunization');
        expect(resources[1].index).to.equal('immunization');
        expect(resources[1].path).to.equal('immunization');
        expect(resources[1].healthcheck).not.to.be.undefined();
        expect(resources[1].parameters).not.to.be.undefined();
        expect(resources[1].get).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for search by type - vital', function() {
        var resources = searchbytypeResource.getResourceConfig();
        expect(resources.length).to.equal(3);

        expect(resources[2].name).to.equal('vital');
        expect(resources[2].index).to.equal('vitalsign');
        expect(resources[2].path).to.equal('vital');
        expect(resources[2].healthcheck).not.to.be.undefined();
        expect(resources[2].parameters).not.to.be.undefined();
        expect(resources[2].get).not.to.be.undefined();
    });
});
