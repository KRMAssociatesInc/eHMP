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
        name: 'CDS-intent-get',
        path: '/registry',
        get: require('./cds-intent').getIntent,
        parameters: {
            get: {
                name: {
                    required: false,
                    description: 'intent name'

                },
                scope: {
                    required: false,
                    description: 'intent scope'
                },
                scopeId: {
                    required: false,
                    description: 'intent scope id'
                }
            }
        },
        apiDocs: require('./cds-intent').apiDocs.get,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'CDS-intent-post',
        path: '/registry',
        post: require('./cds-intent').postIntent,
        apiDocs: require('./cds-intent').apiDocs.post,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'CDS-intent-put',
        path: '/registry',
        put: require('./cds-intent').putIntent,
        parameters: {
            put: {
                name: {
                    required: true,
                    description: 'intent name'

                },
                scope: {
                    required: true,
                    description: 'intent scope'
                },
                scopeId: {
                    required: false,
                    description: 'intent scope id'
                }
            }
        },
        apiDocs: require('./cds-intent').apiDocs.put,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'CDS-intent-delete',
        path: '/registry',
        delete: require('./cds-intent').deleteIntent,
        parameters: {
            delete: {
                name: {
                    required: false,
                    description: 'intent name'

                },
                scope: {
                    required: false,
                    description: 'intent scope'
                },
                scopeId: {
                    required: false,
                    description: 'intent scope id'
                }
            }
        },
        apiDocs: require('./cds-intent').apiDocs.delete,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }];
};
