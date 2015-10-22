'use strict';

var readRadiologyOrders = require('./get-radiology-orders');
var createRadiologyOrder = require('./set-radiology-order');
var updateRadiologyOrder = require('./update-radiology-order');
var deleteRadiologyOrder = require('./delete-radiology-order');

var interceptors = {
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
