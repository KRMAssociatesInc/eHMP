'use strict';

module.exports.getResourceConfig = function() {
    return [{
        name: 'full-name',
        path: '/full-name',
        get: require('./full-name'),
        parameters: require('./full-name').parameters,
        apiDocs: require('./full-name').apiDocs,
        interceptors: {
            jdsFilter: true,
            pep: false,
            synchronize: false
        },
        healthcheck: {
                dependencies: ['mvi','jdsSync']
        }
    },
    {
        name: 'last5',
        path: '/last5',
        get: require('./last5'),
        parameters: require('./last5').parameters,
        apiDocs: require('./last5').apiDocs,
        // healthcheck: [app.subsystems.test-resource],
        //outerceptors: [],
        interceptors: {
            jdsFilter: true,
            pep: false,
            synchronize: false
        },
        healthcheck: {
                dependencies: ['mvi','jdsSync']
        }
    },
    {
        name: 'pid',
        path: '/pid',
        get: require('./pid'),
        parameters: require('./pid').parameters,
        apiDocs: require('./pid').apiDocs,
        // healthcheck: [app.subsystems.test-resource],
        //outerceptors: [],
        interceptors: {
            jdsFilter: true,
            pep: false,
            synchronize: false
        }
    }];
};
