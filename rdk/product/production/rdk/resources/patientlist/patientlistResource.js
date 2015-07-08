/*jslint node: true */
'use strict';

exports.getResourceConfig = function () {
    return [{
        name: 'Criteria',
        path: '/criteria',
        get: require('./criteria').getCriteria,
        post: require('./criteria').postCriteria,
        delete: require('./criteria').deleteCriteria,
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
            },
            delete: {
                id: {
                    required: true,
                    description: 'unique id'
                }
            }
        },
        interceptors: {
            operationalDataCheck: false,
            pep: false
        },
        healthcheck: function() {
            return true;
        }
    },
    {
        name: 'Definition',
        path: '/definition',
        get: require('./definition').getDefinition,
        post: require('./definition').postDefinition,
        delete: require('./definition').deleteDefinition,
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
            },
            delete: {
                id: {
                    required: true,
                    description: 'unique id'
                },
            }
        },
        interceptors: {
            operationalDataCheck: false,
            pep: false
        },
        healthcheck: function () {
            return true;
        }
    },
    {
        name: 'Patientlist',
        path: '/list',
        get: require('./patientlist').getPatientlist,
        post: require('./patientlist').postPatientlist,
        delete: require('./patientlist').deletePatientlist,
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
            },
            delete: {
                id: {
                    required: true,
                    description: 'unique id'
                },
            }
        },
        interceptors: {
            operationalDataCheck: false,
            pep: false
        },
        healthcheck: function () {
            return true;
        }
    },
    {
        name: 'PatientListAddRemove',
        path: '/list/patients',
        post: require('./patientlist').addPatient,
        delete: require('./patientlist').removePatient,
        parameters: {
            post: {
                id: {
                    required: true,
                    description: 'unique id'
                },
                pid: {
                    required: true,
                    description: 'patient identifier'
                }
            },
            delete: {
                id: {
                    required: true,
                    description: 'unique id'
                },
                pid: {
                    required: true,
                    description: 'patient identifier'
                }
            }
        },
        interceptors: {
            operationalDataCheck: false,
            pep: false
        },
        healthcheck: function () {
            return true;
        }
    }
    ];
};
