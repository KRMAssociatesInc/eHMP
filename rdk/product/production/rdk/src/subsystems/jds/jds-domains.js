'use strict';

var _ = require('underscore');

module.exports = (function() {
    var domains = {
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
    return {
        names: _.map(domains, function(value, key) {
            return key;
        }),
        indexes: _.map(domains, function(value, key) {
            return value;
        }),
        domains: _.map(domains, function(value, key) {
            return {
                name: key,
                index: value
            };
        }),
        nameForIndex: function(index) {
            return _.invert(domains)[index];
        },
        indexForName: function(name) {
            return domains[name];
        },
        domainsForIndex: function(index) {
            var matchingDomains = [];
            _.each(domains, function(value, key) {
                if(value === index) {
                    matchingDomains.push({
                        name: key,
                        index: value
                    });
                }
            });
            return matchingDomains;
        },
        domainForName: function(name) {
            // if (domains[name]) {
            //     return [{
            //         name: name,
            //         index: domains[name]
            //     }];
            // }
            //
            // return [];

            if(domains[name]) {
                return {
                    name: name,
                    index: domains[name]
                };
            }
        },
        hasName: function(name) {
            return _.some(domains, function(value, key) {
                return key === name;
            });
        },
        hasIndex: function(index) {
            return _.some(domains, function(value, key) {
                return value === index;
            });
        }
    };
})();
