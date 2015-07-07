/*jslint node: true */
'use strict';

module.exports.getResourceConfig = function() {
    return [{
        name: 'list',
        path: '/list',
        get: require('./getClinicalReminderList'),
        parameters: require('./getClinicalReminderList').parameters,
        apiDocs: require('./getClinicalReminderList').apiDocs,
        interceptors: {
            pep: false
        },
        healthcheck: {
            dependencies: ['jds','solr','jdsSync']
        }
    }, {
        name: 'detail',
        path: '/detail',
        get: require('./getClinicalReminderDetail'),
        parameters: require('./getClinicalReminderDetail').parameters,
        apiDocs: require('./getClinicalReminderDetail').apiDocs,
        interceptors: {
            pep: false
        },
        healthcheck: {
            dependencies: ['jds','solr','jdsSync']
        }
    }];
};
