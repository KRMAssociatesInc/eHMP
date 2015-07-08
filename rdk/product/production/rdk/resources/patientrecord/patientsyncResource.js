 /*jslint node: true */
'use strict';
var rdk = require('../../rdk/rdk');
var expirePatient= require('./expirePatientDataResource');

function getResourceConfig(app) {
    var config = [
        expirePatientData(app),
        patientLoad(app),
        patientLoadPrioritized(app),
        patientLoadForced(app),
        patientClear(app),
        patientStatus(app),
        patientDataStatus(app),
        patientSyncStatusDetail(app),
        operationalStatus(app)
    ];
    config.healthcheck = {
        dependencies: ['patientrecord','authorization']
    };
    return config;
}

var expirePatientData = function() {
    return {
        name: 'expirepatientdata',
        path: '/expire',
        interceptors: {
            pep: false
        },
        parameters: expirePatient.parameters,
        apiDocs: expirePatient.apiDocs,
        post: expirePatient.setExpireOn,
        healthcheck: {
            dependencies: ['patientrecord','jdsSync']
        }
    };
};

var patientLoad = function(app) {
    return {
        name: 'load',
        path: '/load',
        interceptors: {
            pep: false
        },
        //healthcheck: [app.subsystems.jdsSync],
        get: app.subsystems.jdsSync.patientLoadEndpoint,
        apiDocs: {
            spec: {
                summary: '',
                notes: '',
                parameters: [
                    rdk.docs.commonParams.pid
                ],
                responseMessages: []
            }
        },
        healthcheck: {
            dependencies: ['patientrecord','jdsSync']
        }
    };
};

var patientLoadPrioritized = function(app) {
    return {
        name: 'loadPrioritized',
        path: '/load-prioritized',
        interceptors: {
            pep: false
        },
        //healthcheck: [app.subsystems.jdsSync],
        get: app.subsystems.jdsSync.patientLoadPrioritizedEndpoint,
        apiDocs: {
            spec: {
                summary: '',
                notes: '',
                parameters: [],
                responseMessages: []
            }
        },
        healthcheck: {
            dependencies: ['patientrecord','jdsSync']
        }
    };
};

var patientLoadForced = function(app) {
    return {
        name: 'loadForced',
        path: '/loadForced',
        interceptors: {
            pep: false
        },
        //healthcheck: [app.subsystems.jdsSync],
        get: app.subsystems.jdsSync.patientLoadForcedEndpoint,
        healthcheck: {
            dependencies: ['patientrecord','jdsSync']
        }
    };
};

var patientClear = function(app) {
    return {
        name: 'clear',
        path: '/clear',
        interceptors: {
            pep: false
        },
        get: app.subsystems.jdsSync.patientClearEndpoint,
        apiDocs: {
            spec: {
                summary: '',
                notes: '',
                parameters: [],
                responseMessages: []
            }
        },
        healthcheck: {
            dependencies: ['patientrecord','jdsSync']
        }
    };
};

var patientStatus = function(app) {
    return {
        name: 'status',
        path: '/status',
        interceptors: {
            operationalDataCheck: false,
            pep: false
        },
        get: app.subsystems.jdsSync.patientStatusEndpoint,
        apiDocs: {
            spec: {
                summary: '',
                notes: '',
                parameters: [],
                responseMessages: []
            }
        },
        healthcheck: {
            dependencies: ['patientrecord','jdsSync']
        }
    };
};

var patientDataStatus = function(app) {
    return {
        name: 'datastatus',
        path: '/data-status',
        interceptors: {
            operationalDataCheck: false,
            pep: false
        },
        get: app.subsystems.jdsSync.patientDataStatusEndpoint,
        apiDocs: {
            spec: {
                summary: '',
                notes: '',
                parameters: [],
                responseMessages: []
            }
        },
        healthcheck: {
            dependencies: ['patientrecord','jdsSync']
        }
    };
};

var patientSyncStatusDetail = function(app) {
    return {
        name: 'syncStatusDetail',
        path: '/status-detail',
        interceptors: {
            operationalDataCheck: false,
            pep: false
        },
        get: app.subsystems.jdsSync.patientSyncStatusDetailEndpoint,
        apiDocs: {
            spec: {
                summary: '',
                notes: '',
                parameters: [],
                responseMessages: []
            }
        },
        healthcheck: {
            dependencies: ['patientrecord','jdsSync']
        }
    };
};

var operationalStatus = function(app) {
    return {
        name: 'operationalstatus',
        path: '/operational-status',
        interceptors: {
            operationalDataCheck: false,
            pep: false
        },
        get: app.subsystems.jdsSync.operationalStatusEndpoint,
        apiDocs: {
            spec: {
                summary: '',
                notes: '',
                parameters: [],
                responseMessages: []
            }
        },
        healthcheck: {
            dependencies: ['patientrecord','jdsSync']
        }
    };
};

module.exports.getResourceConfig = getResourceConfig;
