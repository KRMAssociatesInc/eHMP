'use strict';

exports.getResourceConfig = function() {
    return [{
            name: 'metricSearch',
            path: '/metrics',
            get: require('./metrics').getMetricSearch,
            parameters: {
                get: {
                    metricId: {
                        required: true
                    },
                    startPeriod: {
                        required: true,
                    },
                    endPeriod: {
                        required: false,
                    },
                    granularity: {
                        required: false,
                    },
                    origin: {
                        required: false,
                    },
                    invocationType: {
                        required: false,
                    }
                }
            },
            interceptors: {
                audit: true,
                authentication: true,
                operationalDataCheck: false,
                pep: false,
                synchronize: false
            },
            healthcheck: function() {
                return true;
            }
        },


        {
            name: 'getConfig',
            path: '/config',
            get: require('./metrics').getConfig,
            interceptors: {
                audit: true,
                authentication: true,
                operationalDataCheck: false,
                pep: false,
                synchronize: false
            },
            healthcheck: function() {
                return true;
            }
        },


        {
            name: 'getDashboard',
            path: '/dashboard/:dashboardId',
            get: require('./metrics').getDashBoard,
            interceptors: {
            audit: true,
                authentication: true,
                operationalDataCheck: false,
                pep: false,
                synchronize: false
            },
            healthcheck: function() {
                return true;
            }
        }, {
            name: 'getUserDashboards',
            path: '/dashboards/:userIdParam',
            get: require('./metrics').getUserDashBoards,
            parameters: {
                get: {
                    userId: {
                        required: false
                    }
                }
            },
            interceptors: {
                audit: true,
                authentication: true,
                operationalDataCheck: false,
                pep: false,
                synchronize: false
            },
            healthcheck: function() {
                return true;
            }
        },


        {
            name: 'metricDefinitions',
            path: '/definitions',
            get: require('./metrics').getMetricDefinitions,
            interceptors: {
                audit: true,
                authentication: true,
                operationalDataCheck: false,
                pep: false,
                synchronize: false
            },
            healthcheck: function() {
                return true;
            }
        }, {
            name: 'createMetricDefinitions',
            path: '/definitions',
            post: require('./metrics').createMetricDefinitions,
            interceptors: {
                audit: true,
                authentication: true,
                operationalDataCheck: false,
                pep: false,
                synchronize: false
            },
            healthcheck: function() {
                return true;
            }
        }, {
            name: 'deleteMetricDefinition',
            path: '/definitions/:definitionId',
            delete: require('./metrics').deleteMetricDefinition,
            interceptors: {
                audit: true,
                authentication: true,
                operationalDataCheck: false,
                pep: false,
                synchronize: false
            },
            healthcheck: function() {
                return true;
            }
        },

        {
            name: 'metricGroups',
            path: '/groups',
            get: require('./metrics').getMetricGroups,
            interceptors: {
                audit: true,
                authentication: true,
                operationalDataCheck: false,
                pep: false,
                synchronize: false
            },
            healthcheck: function() {
                return true;
            }
        }, {
            name: 'createMetricGroup',
            path: '/groups',
            post: require('./metrics').createMetricGroup,
            interceptors: {
                audit: true,
                authentication: true,
                operationalDataCheck: false,
                pep: false,
                synchronize: false
            },
            healthcheck: function() {
                return true;
            }
        }, {
            name: 'updateMetricGroup',
            path: '/groups',
            put: require('./metrics').updateMetricGroup,
            interceptors: {
                audit: true,
                authentication: true,
                operationalDataCheck: false,
                pep: false,
                synchronize: false
            },
            healthcheck: function() {
                return true;
            }
        }, {
            name: 'deleteMetricGroup',
            path: '/groups/:metricGroupId',
            delete: require('./metrics').deleteMetricGroup,
            interceptors: {
                audit: true,
                authentication: true,
                operationalDataCheck: false,
                pep: false,
                synchronize: false
            },
            healthcheck: function() {
                return true;
            }
        },


        {
            name: 'roles',
            path: '/roles',
            get: require('./metrics').getRoles,
            interceptors: {
                audit: true,
                authentication: true,
                operationalDataCheck: false,
                pep: false,
                synchronize: false
            },
            healthcheck: function() {
                return true;
            }
        }, {
            name: 'updateRoles',
            path: '/roles',
            put: require('./metrics').updateRoles,
            interceptors: {
                audit: true,
                authentication: true,
                operationalDataCheck: false,
                pep: false,
                synchronize: false
            },
            healthcheck: function() {
                return true;
            }
        },


        {
            name: 'userRoles',
            path: '/userRoles',
            get: require('./metrics').getUserRoles,
            interceptors: {
                audit: true,
                authentication: true,
                operationalDataCheck: false,
                pep: false,
                synchronize: false
            },
            healthcheck: function() {
                return true;
            }
        }, {
            name: 'userRoles',
            path: '/userRoles',
            put: require('./metrics').updateUserRoles,
            interceptors: {
                audit: true,
                authentication: true,
                operationalDataCheck: false,
                pep: false,
                synchronize: false
            },
            healthcheck: function() {
                return true;
            }
        },

        {
            name: 'createDashboard',
            path: '/dashboard',
            post: require('./metrics').createDashboard,
            interceptors: {
                audit: true,
                authentication: true,
                operationalDataCheck: false,
                pep: false,
                synchronize: false
            },
            healthcheck: function() {
                return true;
            }
        }, {
            name: 'deleteDashboard',
            path: '/dashboard/:dashboardId',
            delete: require('./metrics').deleteDashboard,
            interceptors: {
                audit: true,
                authentication: true,
                operationalDataCheck: false,
                pep: false,
                synchronize: false
            },
            healthcheck: function() {
                return true;
            }
        }, {
            name: 'updateDashboard',
            path: '/dashboard/:dashboardId',
            put: require('./metrics').updateDashboard,
            interceptors: {
                audit: true,
                authentication: true,
                operationalDataCheck: false,
                pep: false,
                synchronize: false
            },
            healthcheck: function() {
                return true;
            }
        }

    ];
};
