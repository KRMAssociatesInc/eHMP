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
        name: 'CDS-criteria-get',
        path: '/criteria',
        get: require('./criteria').getCriteria,
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
        apiDocs: require('./criteria').apiDocs.get,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    },{
        name: 'CDS-criteria-post',
        path: '/criteria',
        post: require('./criteria').postCriteria,
        apiDocs: require('./criteria').apiDocs.post,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    },{
        name: 'CDS-criteria-delete',
        path: '/criteria',
        delete: require('./criteria').deleteCriteria,
        parameters: {
            delete: {
                id: {
                    required: true,
                    description: 'unique id'
                }
            }
        },
        apiDocs: require('./criteria').apiDocs.delete,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'CDS-definition-get',
        path: '/definition',
        get: require('./definition').getDefinition,
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
        apiDocs: require('./definition').apiDocs.get,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'CDS-definition-post',
        path: '/definition',
        post: require('./definition').postDefinition,
        apiDocs: require('./definition').apiDocs.post,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'CDS-definition-delete',
        path: '/definition',
        delete: require('./definition').deleteDefinition,
        parameters: {
            delete: {
                id: {
                    required: true,
                    description: 'unique id'
                },
            }
        },
        apiDocs: require('./definition').apiDocs.delete,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'CDS-definition-copy',
        path: '/definition/copy',
        post: require('./definition').copyDefinition,
        parameters: {
            post: {
                id: {
                    required: false,
                    description: 'unique id'
                },
                name: {
                    required: false,
                    description: 'user defined name'
                },
                newname: {
                    required: true,
                    description: 'user defined new name'
                }
            }
        },
        apiDocs: require('./definition').apiDocs.copy,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'CDS-patientlist-get',
        path: '/list',
        get: require('./patient-list').getPatientlist,
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
        apiDocs: require('./patient-list').apiDocs.get,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'CDS-patientlist-post',
        path: '/list',
        post: require('./patient-list').postPatientlist,
        apiDocs: require('./patient-list').apiDocs.post,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'CDS-patientlist-delete',
        path: '/list',
        delete: require('./patient-list').deletePatientlist,
        parameters: {
            delete: {
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
        apiDocs: require('./patient-list').apiDocs.delete,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'CDS-patientlist-add',
        path: '/list/patients',
        post: require('./patient-list').addPatient,
        parameters: {
            post: {
                id: {
                    required: false,
                    description: 'unique id'
                },
                name: {
                    required: false,
                    description: 'user defined name'
                },
                pid: {
                    required: true,
                    description: 'patient identifier'
                }
            }
        },
        apiDocs: require('./patient-list').apiDocs.add,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'CDS-patientlist-remove',
        path: '/list/patients',
        delete: require('./patient-list').removePatient,
        parameters: {
            delete: {
                id: {
                    required: false,
                    description: 'unique id'
                },
                name: {
                    required: false,
                    description: 'user defined name'
                },
                pid: {
                    required: true,
                    description: 'patient identifier'
                }
            }
        },
        apiDocs: require('./patient-list').apiDocs.remove,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }, {
        name: 'CDS-patientlist-copy',
        path: '/list/copy',
        post: require('./patient-list').copyPatientlist,
        parameters: {
            post: {
                id: {
                    required: false,
                    description: 'unique id'
                },
                name: {
                    required: false,
                    description: 'user defined name'
                },
                newname: {
                    required: true,
                    description: 'user defined new name'
                }
            }
        },
        apiDocs: require('./patient-list').apiDocs.copy,
        interceptors: interceptors,
        healthcheck: function() {
            return true;
        }
    }];
};
