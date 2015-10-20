'use strict';

var readLabOrders = require('./get-lab-orders');
//Removed for future implementation.
//var createLabOrder = require('./setLabOrder');
//var updateLabOrder = require('./updateLabOrder');
//var deleteLabOrder = require('./deleteLabOrder');

var interceptors = {
    jdsFilter: true
};

function getResourceConfig() {
    return [{
        name: '',
        path: '',
        get: readLabOrders,
        interceptors: interceptors,
        healthcheck: {
            dependencies: ['patientrecord', 'authorization', 'jdsSync', 'jds', 'solr']
        },
        parameters: readLabOrders.parameters,
        apiDocs: readLabOrders.apiDocs,
        permissions: []
    }];
    /**
     * Commented out due to implementation at later date
        name: '',
        path: '',
        put: createLabOrder,
        interceptors: interceptors,
        healthcheck: {
            dependencies: ['jds', 'solr']
        },
        parameters: createLabOrder.parameters,
        permissions: ['add-patient-laborder']
    }, {
        name: '',
        path: '',
        post: updateLabOrder,
        interceptors: interceptors,
        healthcheck: {
            dependencies: ['jds', 'solr']
        },
        parameters: updateLabOrder.parameters,
        permissions: ['edit-patient-laborder']
    }, {
        name: '',
        path: '',
        'delete': deleteLabOrder,
        interceptors: interceptors,
        healthcheck: {
            dependencies: ['jds', 'solr']
        },
        parameters: deleteLabOrder.parameters,
        permissions: ['remove-patient-laborder']
    }];**/
}

module.exports.getResourceConfig = getResourceConfig;
