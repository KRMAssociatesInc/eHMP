'use strict';

module.exports.getResourceConfig = function() {
    return [{
        name: 'list',
        path: '/list',
        get: require('./get-clinical-reminder-list'),
        parameters: require('./get-clinical-reminder-list').parameters,
        apiDocs: require('./get-clinical-reminder-list').apiDocs,
        interceptors: {
            pep: false,
            synchronize: false,
            convertPid: true
        },
        healthcheck: {
            dependencies: ['jds','solr','jdsSync']
        }
    }, {
        name: 'detail',
        path: '/detail',
        get: require('./get-clinical-reminder-detail'),
        parameters: require('./get-clinical-reminder-detail').parameters,
        apiDocs: require('./get-clinical-reminder-detail').apiDocs,
        interceptors: {
            pep: false,
            synchronize: false,
            convertPid: true
        },
        healthcheck: {
            dependencies: ['jds','solr','jdsSync']
        }
    }];
};
