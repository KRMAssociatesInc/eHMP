'use strict';

var _ = require('underscore');
var getVisits = require('./get-visits');

module.exports.getResourceConfig = function () {
    return _.map(['providers', 'locations', 'appointments', 'admissions'], function(visitType) {
        return {
            name: visitType,
            path: '/' + visitType,
            get: getVisits.bind(null, visitType),
            parameters: getVisits.parameters[visitType],
            apiDocs: getVisits.apiDocs[visitType],
            interceptors: getVisits.interceptors[visitType],
            healthcheck: {
                dependencies: ['patientrecord','jds','solr','jdsSync']
            },
            permissions: getVisits.permissions[visitType]
        };
    });
};

