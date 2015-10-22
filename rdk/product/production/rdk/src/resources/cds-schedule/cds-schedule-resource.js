'use strict';

var interceptors = {
    audit: true,
    metrics: true,
    authentication: true,
    operationalDataCheck: false,
    pep: false,
    synchronize: false
};

exports.getResourceConfig = function() {
    return [{
        name: 'CDS-schedule-get',
        path: '/job',
        get: require('./cds-schedule').getJob,
        parameters: {
            get: {
                id: {
                    required: false,
                    description: 'unique id'

                },
                name: {
                    required: false,
                    description: 'user defined name'
                }
            }
        },
        apiDocs: require('./cds-schedule').apiDocs.get,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'CDS-schedule-post',
        path: '/job',
        post: require('./cds-schedule').postJob,
        apiDocs: require('./cds-schedule').apiDocs.post,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'CDS-schedule-put',
        path: '/job',
        put: require('./cds-schedule').putJob,
        parameters: {
            put: {
                id: {
                    required: false,
                    description: 'unique id'

                },
                name: {
                    required: false,
                    description: 'user defined name'
                }
            }
        },
        apiDocs: require('./cds-schedule').apiDocs.put,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'CDS-schedule-delete',
        path: '/job',
        delete: require('./cds-schedule').deleteJob,
        parameters: {
            delete: {
                id: {
                    required: true,
                    description: 'unique id'
                }
            }
        },
        apiDocs: require('./cds-schedule').apiDocs.delete,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }];
};
