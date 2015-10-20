'use strict';
var _ = require('lodash');
var rdk = require('../../core/rdk');

function getResourceConfig(app) {
    var config = [
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

var patientLoad = function(app) {
    return {
        name: 'load',
        path: '/load',
        interceptors: {
            pep: false,
            synchronize: false
        },
        //healthcheck: [app.subsystems.jdsSync],
        get: patientLoadEndpoint.bind(null, app),
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
            pep: false,
            synchronize: false
        },
        //healthcheck: [app.subsystems.jdsSync],
        get: patientLoadPrioritizedEndpoint.bind(null, app),
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
            pep: false,
            synchronize: false
        },
        //healthcheck: [app.subsystems.jdsSync],
        get: patientLoadForcedEndpoint.bind(null, app),
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
            pep: false,
            synchronize: false
        },
        get: patientClearEndpoint.bind(null, app),
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
            pep: false,
            synchronize: false
        },
        get: patientStatusEndpoint.bind(null, app),
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
            pep: false,
            synchronize: false
        },
        get: patientDataStatusEndpoint.bind(null, app),
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
            pep: false,
            synchronize: false
        },
        get: patientSyncStatusDetailEndpoint.bind(null, app),
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
            pep: false,
            synchronize: false
        },
        get: operationalStatusEndpoint.bind(null, app),
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

function patientLoadEndpoint(app, req, res) {
    var pid = req.param('pid') || req.param('dfn') || '';
    var immediate = (req.param('immediate') === 'true');
    app.subsystems.jdsSync.loadPatient(pid, immediate, req, toResponseCallback.bind(null, res));
}

function patientLoadPrioritizedEndpoint(app, req, res) {
    var pid = req.param('pid') || req.param('dfn') || '';
    var prioritySite = req.param('prioritySite') || '';
    app.subsystems.jdsSync.loadPatientPrioritized(pid, prioritySite, req, toResponseCallback.bind(null, res));
}

function patientLoadForcedEndpoint(app, req, res) {
    var pid = req.param('pid') || req.param('dfn') || '';
    var forcedSite = req.param('forcedSite') || '';
    var immediate = (req.param('immediate') === 'true');
    app.subsystems.jdsSync.loadPatientForced(pid, forcedSite, immediate, req, toResponseCallback.bind(null, res));
}

function patientClearEndpoint(app, req, res) {
    var pid = req.param('pid') || req.param('dfn') || '';
    app.subsystems.jdsSync.clearPatient(pid, req, toResponseCallback.bind(null, res));
}

function patientStatusEndpoint(app, req, res) {
    var pid = req.param('pid') || req.param('dfn') || '';
    app.subsystems.jdsSync.getPatientStatus(pid, req, toResponseCallback.bind(null, res));
}

function patientDataStatusEndpoint(app, req, res) {
    var pid = req.param('pid') || req.param('dfn') || '';
    app.subsystems.jdsSync.getPatientDataStatus(pid, req, toResponseCallback.bind(null, res));
}

function patientSyncStatusDetailEndpoint(app, req, res) {
    var pid = req.param('pid') || req.param('dfn') || '';
    app.subsystems.jdsSync.getPatientStatusDetail(pid, req, toResponseCallback.bind(null, res));
}

function operationalStatusEndpoint(app, req, res) {
    app.subsystems.jdsSync.getOperationalStatus(null, req, toResponseCallback.bind(null, res));
}

function toResponseCallback(res, error, result) {
    var status, response;
    if (!_.isUndefined(result) && !_.isUndefined(result.data) && !_.isUndefined(result.status)) {
        status = result.status;
        response = result.data;
    } else {
        status = _.isNumber(error) ? error : 500;
        if (result) {
            response = result;
        } else if (_.isString(error) || _.isObject(error)) {
            response = error;
        } else {
            response = {
                error: {
                    code: status,
                    message: 'There was an error processing your request. The error has been logged.'
                }
            };
        }
    }
    res.status(status).rdkSend(response);
}

module.exports.getResourceConfig = getResourceConfig;
