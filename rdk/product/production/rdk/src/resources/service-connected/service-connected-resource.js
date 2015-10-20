'use strict';

module.exports.getResourceConfig = function() {
    return [{
        name: 'serviceConnected',
        path: '/serviceconnectedrateddisabilities',
        get: require('./get-service-connected-and-rated-disabilities'),
        apiDocs: require('./get-service-connected-and-rated-disabilities').apiDocs,
        interceptors: {
            pep: true,
            operationalDataCheck: false,
            synchronize: true,
            convertPid: true
        },
        permissions: [],
        healthcheck: {
            dependencies: ['jds']
        }
    }, {
        name: 'scButtonSelection',
        path: '/serviceconnectedserviceexposurelist',
        get: require('./get-service-connected-and-service-exposure-list'),
        apiDocs: require('./get-service-connected-and-service-exposure-list').apiDocs,
        interceptors: {
            pep:true,
            operationalDataCheck: false,
            synchronize: true,
            convertPid: true
        },
        permissions: [],
        healthcheck: {
            dependencies: ['jds']
        }
    }];
};
