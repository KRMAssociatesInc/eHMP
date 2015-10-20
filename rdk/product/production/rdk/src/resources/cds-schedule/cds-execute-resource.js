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

exports.getResourceConfig = function () {
    return [{
        name: 'CDS-execute-get',
        path: '/request',
        get: require('./cds-execute').getCDSExecute,
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
        apiDocs: require('./cds-execute').apiDocs.get,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'CDS-execute-post',
        path: '/request',
        post: require('./cds-execute').postCDSExecute,
        apiDocs: require('./cds-execute').apiDocs.post,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'CDS-execute-put',
        path: '/request',
        put: require('./cds-execute').putCDSExecute,
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
        apiDocs: require('./cds-execute').apiDocs.put,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'CDS-execute-delete',
        path: '/request',
        delete: require('./cds-execute').deleteCDSExecute,
        parameters: {
            delete: {
                id: {
                    required: true,
                    description: 'unique id'
                }
            }
        },
        apiDocs: require('./cds-execute').apiDocs.delete,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }];
};
