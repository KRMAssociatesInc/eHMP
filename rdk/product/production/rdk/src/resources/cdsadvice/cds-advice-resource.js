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
        name: 'list',
        path: '/list',
        get: require('./get-cds-advice-list').getCDSAdviceList,
        parameters: {
            get: {
                pid: {
                    required: true,
                    description: 'Patient identifier'
                },
                use: {
                    required: true,
                    description: 'Rules invocation context'
                },
                readStatus: {
                    required: false,
                    description: 'Filters by this read status (all, read, status). Defaults to \'all\'.'
                }
            }
        },
        apiDocs: require('./get-cds-advice-list').apiDocs,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'detail',
        path: '/detail',
        get: require('./get-cds-advice-detail').getCDSAdviceDetail,
        parameters: {
            get: {
                pid: {
                    required: true,
                    description: 'Patient identifier'
                },
                id: {
                    required: true,
                    description: 'Advice ID'
                },
                use: {
                    required: true,
                    description: 'Rules invocation Context'
                }
            }
        },
        apiDocs: require('./get-cds-advice-detail').apiDocs,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'readStatus',
        path: '/:id/status/read/:value',
        put: require('./get-cds-advice-list').setReadStatus,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }];
};
