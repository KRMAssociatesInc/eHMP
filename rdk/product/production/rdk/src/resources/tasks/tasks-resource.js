'use strict';
var rdk = require('../../core/rdk');
var taskOperations = require('./task-operations-resource');
var process = require('./process-resource');

var apiDocs = {};
apiDocs.get = {
    spec: {
        summary: 'Get tasks for provider',
        notes: '',
        parameters: [],
        responseMessages: []
    }
};

apiDocs.getTasksByPatient = {
    spec: {
        summary: 'Get tasks for a given patient',
        notes: '',
        parameters: [
            rdk.docs.swagger.paramTypes.query('patientid', 'The patient identifier/ICN', 'string', true)
        ],
        responseMessages: []
    }
};

apiDocs.changeTaskState = {
    spec: {
        summary: 'Update task state',
        notes: '',
        parameters: [
            rdk.docs.swagger.paramTypes.query('taskid', 'task id', 'string', true),
            rdk.docs.swagger.paramTypes.query('state', 'new state(claim, start, complete etc)', 'string', true)
        ],
        responseMessages: []
    }
};

apiDocs.startProcess = {
    spec: {
        summary: 'Start process workflow',
        notes: '',
        parameters: [],
        responseMessages: []
    }
};

function getResourceConfig() {
    return [{
        name: 'tasks',
        path: '',
        get: taskOperations.getTasks,
        interceptors: {
            operationalDataCheck: false,
            pep: false,
            synchronize: false
        },
        description: 'Get a list of tasks for the current provider',
        parameters: {
            get: {}
        },
        permissions: [],
        apiDocs: apiDocs.get,
        healthcheck: {
            dependencies: ['jbpm']
        }
    }, {
        name: 'tasksbypatient',
        path: 'tasksbypatient',
        get: taskOperations.getTasksByPatient,
        interceptors: {
            operationalDataCheck: false,
            pep: false,
            synchronize: false
        },
        description: 'Get a list of tasks for a given patient ID',
        parameters: {
            get: {
                patientid: {
                    required: true,
                    description: 'Patient ID'
                }
            }
        },
        permissions: [],
        apiDocs: apiDocs.getTasksByPatient,
        healthcheck: {
            dependencies: ['jbpm']
        }
    }, {
        name: 'changestate',
        path: 'changestate',
        post: taskOperations.changeTaskState,
        interceptors: {
            operationalDataCheck: false,
            pep: false,
            synchronize: false
        },
        description: 'Change given task state',
        parameters: {
            post: {
                taskid: {
                    required: true,
                    description: 'Task ID'
                },
                state: {
                    required: true,
                    description: 'Task New State(claim, start, complete etc)'
                }
            }
        },
        permissions: [],
        apiDocs: apiDocs.changeTaskState,
        healthcheck: {
            dependencies: ['jbpm']
        }
    }, {
        name: 'startprocess',
        path: 'startprocess',
        post: process.startProcess,
        interceptors: {
            operationalDataCheck: false,
            pep: false,
            synchronize: false
        },
        description: 'Start a process instance',
        parameters: {},
        permissions: [],
        apiDocs: apiDocs.startProcess,
        healthcheck: {
            dependencies: ['jbpm']
        }
    }];
}

module.exports.getResourceConfig = getResourceConfig;
