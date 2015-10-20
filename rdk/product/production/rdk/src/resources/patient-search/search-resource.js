'use strict';

module.exports.getResourceConfig = function() {
    return [{
        name: 'global-search',
        path: '/global',
        post: require('./global-search').getGlobalSearch,
        interceptors: {
            operationalDataCheck: false,
            pep: false,
            synchronize: false
        },
        parameters: {
            post: {
                lname: {
                    required: true,
                    description: 'patient last name',
                    regex: '/^[- ,a-zA-Z\']+$/'
                },
                fname: {
                    required: false,
                    description: 'patient first name',
                    regex: '/^[- ,a-zA-Z\']+$/'
                },
                ssn: {
                    required: false,
                    description: 'patient full social security number',
                    regex: '/^(\\d{3})-?(\\d{2})-?(\\d{4})$/'
                },
                dob: {
                    required: false,
                    description: 'patient date of birth in mm/dd/yyyy format',
                    regex: '/^(\\d{1,2})\/(\\d{1,2})\/(\\d{4})$/'
                }
            }
        },
        apiDocs: require('./global-search').apiDocs,
        healthcheck: {
            dependencies: ['mvi']
        }
    }, {
        name: 'mvi-patient-sync',
        // path: undefined,  // use swagger apiDocs path
        post: require('./patient-sync').getPatient,
        interceptors: {
            operationalDataCheck: false,
            pep: false,
            synchronize: false
        },
        parameters: {
            post: {
                id: {
                    required: true,
                    description: 'patient\'s mvi id'
                },
                demographics: {
                    familyName: {
                        required: false,
                        description: 'patient\'s last name'
                    },
                    fullName: {
                        required: false,
                        description: 'patient\'s full name in first middle last order'
                    },
                    displayName: {
                        required: false,
                        description: 'patient\'s full name in last,first middle order'
                    },
                    givenName: {
                        required: false,
                        description: 'patient\'s first and middle names'
                    },
                    genderName: {
                        required: false,
                        description: 'gender of patient'
                    },
                    genderCode: {
                        required: false,
                        description: 'gender code of patient'
                    },
                    ssn: {
                        required: false,
                        description: 'patient\'s full ssn'
                    },
                    dob: {
                        required: false,
                        description: 'date of birth in yyyymmdd format'
                    }
                }
            }
        },
        apiDocs: require('./patient-sync').apiDocs,
        healthcheck: {
            dependencies: ['mvi']
        }
    }, {
        name: 'default-search',
        path: '/cprs',
        get: require('./default-search').getMyCPRS,
        apiDocs: require('./default-search').apiDocs,
        interceptors: {
            operationalDataCheck: false,
            pep: false,
            synchronize: false
        },
        healthcheck: {
            dependencies: ['mvi']
        }
    }];
};
