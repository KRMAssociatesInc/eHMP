/*jslint node: true */
'use strict';

var readRadiologyOrders = require('./getRadiologyOrders');
var createRadiologyOrder = require('./setRadiologyOrder');
var updateRadiologyOrder = require('./updateRadiologyOrder');
var deleteRadiologyOrder = require('./deleteRadiologyOrder');

var interceptors = {
    synchronize: true,
    jdsFilter: true
};

function getResourceConfig() {
    return [{
        name: '',
        path: '',
        get: readRadiologyOrders,
        interceptors: interceptors,
        healthcheck: {
            dependencies: ['jds', 'solr']
        },
        parameters: readRadiologyOrders.parameters,
        permissions: []
    }, {
        name: '',
        path: '',
        put: createRadiologyOrder,
        interceptors: interceptors,
        healthcheck: {
            dependencies: ['jds', 'solr']
        },
        parameters: createRadiologyOrder.parameters,
        permissions: ['add-patient-radiology']
    }, {
        name: '',
        path: '',
        post: updateRadiologyOrder,
        interceptors: interceptors,
        healthcheck: {
            dependencies: ['jds', 'solr']
        },
        parameters: updateRadiologyOrder.parameters,
        permissions: ['edit-patient-radiology']
    }, {
        name: '',
        path: '',
        'delete': deleteRadiologyOrder,
        interceptors: interceptors,
        healthcheck: {
            dependencies: ['jds', 'solr']
        },
        parameters: deleteRadiologyOrder.parameters,
        permissions: ['remove-patient-radiology']
    }];
}

module.exports.getResourceConfig = getResourceConfig;
