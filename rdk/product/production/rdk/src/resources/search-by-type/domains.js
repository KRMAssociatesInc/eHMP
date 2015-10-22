/* copied version of patientrecord/Domain.js */
'use strict';

var _ = require('underscore');

module.exports = (function() {
    var domains = {
        'lab': 'laboratory',
        'immunization': 'immunization',
        'vital': 'vitalsign'
    };

    return {
        names: function() {
            return _.map(domains, function(value, key) {
                return key;
            });
        },

        indexes: function() {
            return _.map(domains, function(value) {
                return value;
            });
        },

        domains: function() {
            return _.map(domains, function(value, key) {
                return {
                    name: key,
                    index: value
                };
            });
        },

        domainsForIndex: function(index) {
            var matchingDomains = [];
            _.each(domains, function(value, key) {
                if (value === index) {
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

            if (domains[name]) {
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
            return _.some(domains, function(value) {
                return value === index;
            });
        }
    };
})();
