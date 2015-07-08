/*jslint node: true */
'use strict';

var _ = require('underscore');
var Domains = require('../subsystems/jds/jdsDomains');

var domainMap = {
    'accession': 'accession',
    'patient': 'patient',
    'vital': 'vitalsign',
    'problem': 'problem',
    'allergy': 'allergy',
    'order': 'order',
    'treatment': 'treatment',
    'med': 'medication',
    'consult': 'consult',
    'procedure': 'procedure',
    'obs': 'observation',
    'lab': 'laboratory',
    'image': 'procedure',
    'surgery': 'procedure',
    'document': 'document',
    'mh': 'mentalhealth',
    'immunization': 'immunization',
    'pov': 'purposeofvisit',
    'skin': 'skintest',
    'exam': 'exam',
    'cpt': 'visitcptcode',
    'education': 'educationtopic',
    'factor': 'healthfactor',
    'appointment': 'encounter',
    'visit': 'encounter',
    'ptf': 'visittreatment',
    'rad': 'imaging',
    'newsfeed': 'news-feed',
    'document-view': 'docs-view',
    'vlerdocument': 'vlerdocument',
    'parent-documents': 'parent-documents'
};


describe('Domains', function() {
    it('verifies that all domain names are present', function() {
        expect(_.every(domainMap, function(value, key) {
            return Domains.hasName(key);
        })).toBe(true);
    });

    it('verifies that all domain indexes are present', function() {
        expect(_.every(domainMap, function(value) {
            return Domains.hasIndex(value);
        })).toBe(true);
    });

    it('verifies the list of names returned by names() is correct', function() {
        expect(_.every(Domains.names, function(value) {
            return value in domainMap;
        })).toBe(true);
    });

    it('verifies the list of indexes returned by indexes() is correct', function() {
        expect(_.every(Domains.indexes, function(dValue) {
            return _.some(domainMap, function(value) {
                return dValue === value;
            });
        })).toBe(true);
    });

    it('verifies that the domains are all present and correct', function() {
        expect(_.every(Domains.domains, function(value) {
            return value.name in domainMap && value.index === domainMap[value.name];
        })).toBe(true);
    });

    it('verifies that the number of domains in Domains is correct', function() {
        expect(Domains.domains.length).toBe(_.keys(domainMap).length);
    });

    it('verifies that the correct Domain is returned for a given name', function() {
        expect(_.every(domainMap, function(value, key) {
            return _.isEqual(Domains.domainForName(key), {
                name: key,
                index: value
            });
        })).toBe(true);
    });
});
