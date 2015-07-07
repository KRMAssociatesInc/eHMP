/*jslint node: true */
'use strict';

exports.getResourceConfig = function () {
    return [{
            name: 'list',
            path: '/list',
            get: require('./getCDSAdviceList').getCDSAdviceList,
            parameters: {
                get: {
                    pid: {
                        required: true,
                        description: 'Patient identifier'
                    },
                    use: {
                        required: true,
                        description: 'Rules invocation context'
                    }
                }
            },
            apiDocs: require('./getCDSAdviceList').apiDocs,
            interceptors: {
                pep: false
            },
            healthcheck: function () {
                return true;
            }
        },
        {
            name: 'detail',
            path: '/detail',
            get: require('./getCDSAdviceDetail').getCDSAdviceDetail,
            parameters: {
                get: {
                    pid: {
                        required: true,
                        description: 'Patient identifier'
                    },
                    'advice.id': {
                        required: true,
                        description: 'Advice ID'
                    },
                    use: {
                        required: true,
                        description: 'Rules invocation Context'
                    }
                }
            },
            apiDocs: require('./getCDSAdviceDetail').apiDocs,
            interceptors: {
                pep: false
            },
            healthcheck: function () {
                return true;
            }
        }];
};
