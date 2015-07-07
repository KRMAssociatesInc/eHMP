/*jslint node: true */
'use strict';

var rdk = require('../../rdk/rdk');

exports.getResourceConfig = function() {
    return [{
        name: 'retrieveWorkProducts',
        path: '',
        get: require('./cdsWorkProduct').retrieveWorkProducts,
        parameters: {
            get: {
                startPeriod: {
                    required: false,
                },
                endPeriod: {
                    required: false,
                }
            }
        },
        apiDocs: {
            spec: {
                summary: '',
                notes: '',
                parameters: [
                    rdk.docs.swagger.paramTypes.query('date.start', '', 'string', false),
                    rdk.docs.swagger.paramTypes.query('date.end', '', 'string', false)
                ],
                responseMessages: []
            }
        },
        interceptors: {
            audit: false,
            authentication: false,
            operationalDataCheck: false,
            pep: false
        },
        healthcheck: function() {
            return true;
        }
    },
    {
        name: 'createWorkProduct',
        path: '',
        post: require('./cdsWorkProduct').createWorkProduct,
        apiDocs: {
            spec: {
                summary: '',
                notes: '',
                parameters: [],
                responseMessages: []
            }
        },
        interceptors: {
            audit: false,
            authentication: false,
            operationalDataCheck: false,
            pep: false
        },
        healthcheck: function() {
            return true;
        }
    },
    {
        name: 'retrieveWorkProduct',
        path: '/:id',
        get: require('./cdsWorkProduct').retrieveWorkProduct,
        apiDocs: {
            spec: {
                path: '/cds/work-product/{id}',
                summary: '',
                notes: '',
                parameters: [
                    rdk.docs.commonParams.id('path', 'work product', true)
                ],
                responseMessages: []
            }
        },
        interceptors: {
            audit: false,
            authentication: false,
            operationalDataCheck: false,
            pep: false
        },
        healthcheck: function() {
            return true;
        }
    },
    {
        name: 'updateWorkProduct',
        path: '/:id',
        put: require('./cdsWorkProduct').updateWorkProduct,
        apiDocs: {
            spec: {
                path: '/cds/work-product/{id}',
                summary: '',
                notes: '',
                parameters: [
                    rdk.docs.commonParams.id('path', 'work product', true)
                ],
                responseMessages: []
            }
        },
        interceptors: {
            audit: false,
            authentication: false,
            operationalDataCheck: false,
            pep: false
        },
        healthcheck: function() {
            return true;
        }
    },
    {
        name: 'deleteWorkProduct',
        path: '/:id',
        delete: require('./cdsWorkProduct').deleteWorkProduct,
        apiDocs: {
            spec: {
                path: '/cds/work-product/{id}',
                summary: '',
                notes: '',
                parameters: [
                    rdk.docs.swagger.paramTypes.path('id', 'work product id', 'string')
                ],
                responseMessages: []
            }
        },
        interceptors: {
            audit: false,
            authentication: false,
            operationalDataCheck: false,
            pep: false
        },
        healthcheck: function() {
            return true;
        }
    },
    {
        name: 'Preferences',
        path: '/preferences',
        get: require('./cdsWorkProduct').retrievePreferences,
        apiDocs: {
            spec: {
                summary: '',
                notes: '',
                parameters: [],
                responseMessages: []
            }
        },
        interceptors: {
            audit: false,
            operationalDataCheck: false,
            pep: false
        },
        healthcheck: function() {
            return true;
        }
    },
    {
        name: 'Preferences',
        path: '/preferences',
        put: require('./cdsWorkProduct').updatePreferences,
        apiDocs: {
            spec: {
                summary: '',
                notes: '',
                parameters: [],
                responseMessages: []
            }
        },
        interceptors: {
            audit: false,
            operationalDataCheck: false,
            pep: false
        },
        healthcheck: function() {
            return true;
        }
    },
    {
        name: 'Preferences',
        path: '/preferences',
        delete: require('./cdsWorkProduct').deletePreferences,
        apiDocs: {
            spec: {
                summary: '',
                notes: '',
                parameters: [],
                responseMessages: []
            }
        },
        interceptors: {
            audit: false,
            operationalDataCheck: false,
            pep: false
        },
        healthcheck: function() {
            return true;
        }
    },
    {
        name: 'Inbox',
        path: '/inbox',
        get: require('./cdsWorkProduct').retrieveInbox,
        apiDocs: {
            spec: {
                summary: '',
                notes: '',
                parameters: [],
                responseMessages: []
            }
        },
        interceptors: {
            audit: false,
            operationalDataCheck: false,
            pep: false
        },
        healthcheck: function() {
            return true;
        }
    }

    ];
};
