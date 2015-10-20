'use strict';

var _ = require('underscore');
var getOpData = require('./get-op-data');

module.exports.getResourceConfig = function() {
    return _.map(['vital', 'laboratory', 'medication'], function(opType) {
        var resource = {
            name: 'type-' + opType,
            path: '/' + opType,
            get: getOpData.bind(null, opType),
            parameters: getOpData.parameters,
            apiDocs: getOpData.apiDocs,
            interceptors: getOpData.interceptors,
            healthcheck: {
                dependencies: ['patientrecord', 'jds', 'solr', 'jdsSync']
            }
        };

        return resource;

    });
};
