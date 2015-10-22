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
        name: 'createWorkProduct',
        path: '/product',
        post: require('./cds-work-product').createWorkProduct,
        apiDocs: require('./cds-work-product').apiDocs.createWorkProduct,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'retrieveWorkProduct',
        path: '/product',
        get: require('./cds-work-product').retrieveWorkProduct,
        parameters: {
            get: {
                id: {
                    required: true,
                    description: 'work product id'

                }
            }
        },
        apiDocs: require('./cds-work-product').apiDocs.retrieveWorkProduct,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'updateWorkProduct',
        path: '/product',
        put: require('./cds-work-product').updateWorkProduct,
        parameters: {
            put: {
                id: {
                    required: true,
                    description: 'work product id'

                }
            }
        },
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'deleteWorkProduct',
        path: '/product',
        delete: require('./cds-work-product').deleteWorkProduct,
        parameters: {
            get: {
                id: {
                    required: true,
                    description: 'work product id'

                }
            }
        },
        apiDocs: require('./cds-work-product').apiDocs.deleteWorkProduct,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'retrieveSubscriptions',
        path: '/subscriptions',
        get: require('./cds-work-product').retrieveSubscriptions,
        apiDocs: require('./cds-work-product').apiDocs.retrieveSubscriptions,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'updateSubscriptions',
        path: '/subscriptions',
        put: require('./cds-work-product').updateSubscriptions,
        delete: require('./cds-work-product').deleteSubscriptions,
        apiDocs: require('./cds-work-product').apiDocs.updateSubscriptions,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'deleteSubscriptions',
        path: '/subscriptions',
        delete: require('./cds-work-product').deleteSubscriptions,
        apiDocs: require('./cds-work-product').apiDocs.deleteSubscriptions,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'Inbox',
        path: '/inbox',
        get: require('./cds-work-product').retrieveInbox,
        apiDocs: require('./cds-work-product').apiDocs.retrieveInbox,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }];
};
