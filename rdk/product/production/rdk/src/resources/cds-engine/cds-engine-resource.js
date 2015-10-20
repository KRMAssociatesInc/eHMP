/*jslint node: true */
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
        name: 'CDS-engine-get',
        path: '/registry',
        get: require('./cds-engine').getCDSEngine,
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
        apiDocs: require('./cds-engine').apiDocs.get,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'CDS-engine-post',
        path: '/registry',
        post: require('./cds-engine').postCDSEngine,
        apiDocs: require('./cds-engine').apiDocs.post,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'CDS-engine-put',
        path: '/registry',
        put: require('./cds-engine').putCDSEngine,
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
        apiDocs: require('./cds-engine').apiDocs.put,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'CDS-engine-delete',
        path: '/registry',
        delete: require('./cds-engine').deleteCDSEngine,
        parameters: {
            delete: {
                id: {
                    required: true,
                    description: 'unique id'
                }
            }
        },
        apiDocs: require('./cds-engine').apiDocs.delete,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }];
};
