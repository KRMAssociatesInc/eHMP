/*jslint node: true */
'use strict';

var _ = require('underscore');
var getOpData = require('./getOpData');
var count = 0;

module.exports.getResourceConfig = function() {
    return _.map(['vital', 'laboratory', 'medication'], function(opType) {
        var resource = {
            name: 'type-' + opType,
            path: '/' + opType,
            get: getOpData.bind(null, opType),
            parameters: getOpData.parameters,
            interceptors: getOpData.interceptors,
            healthcheck: {
                dependencies: ['patientrecord', 'jds', 'solr', 'jdsSync']
            }
        };

        //Only one apiDoc entry for all types. The types will appear as a drop-down list through
        //the use of rdk.docs.swagger.paramTypes.path in opDataResource.js
        if (count === 0) {
            count++;
            resource.apiDocs = getOpData.apiDocs;
        }
        return resource;

    });
};
