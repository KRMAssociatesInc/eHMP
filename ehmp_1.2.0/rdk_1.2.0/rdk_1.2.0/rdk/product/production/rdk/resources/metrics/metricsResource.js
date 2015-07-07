/*jslint node: true */
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
                }
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
        name: 'getOrigins',
        path: '/origins',
        get: require('./metrics').getOrigins,
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
        name: 'getDashboard',
        path: '/dashboard/:dashboardId',
        get: require('./metrics').getDashBoard,
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
        name: 'getUserDashboards',
        path: '/dashboards',
        get: require('./metrics').getUserDashBoards,
        parameters: {
            get: {
                userId: {
                    required: false
                }
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
        name: 'metricDefinitions',
        path: '/definitions',
        get: require('./metrics').getMetricDefinitions,
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
        name: 'createMetricDefinitions',
        path: '/definitions',
        post: require('./metrics').createMetricDefinitions,
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
        name: 'metricGroups',
        path: '/groups',
        get: require('./metrics').getMetricGroups,
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
        name: 'createMetricGroup',
        path: '/group',
        post: require('./metrics').createMetricGroup,
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
        name: 'updateMetricGroup',
        path: '/group',
        put: require('./metrics').updateMetricGroup,
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
        name: 'deleteMetricGroup',
        path: '/group/:metricGroupId',
        delete: require('./metrics').deleteMetricGroup,
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
        name: 'roles',
        path: '/roles',
        get: require('./metrics').getRoles,
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
        name: 'updateRoles',
        path: '/roles',
        post: require('./metrics').updateRoles,
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
        name: 'userRoles',
        path: '/userRoles',
        get: require('./metrics').getUserRoles,
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
        name: 'userRoles',
        path: '/userRoles',
        post: require('./metrics').updateUserRoles,
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
        name: 'createDashboard',
        path: '/dashboard',
        post: require('./metrics').createDashboard,
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
        name: 'deleteDashboard',
        path: '/dashboard/:dashboardId',
        delete: require('./metrics').deleteDashboard,
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
        name: 'updateDashboard',
        path: '/dashboard/:dashboardId',
        put: require('./metrics').updateDashboard,
        interceptors: {
            audit: false,
            authentication: false,
            operationalDataCheck: false,
            pep: false
        },
        healthcheck: function() {
            return true;
        }
    }

    ];
};
