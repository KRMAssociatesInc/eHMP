'use strict';

var writebackWorkflow = require('../core/writeback-workflow');
var validateVitals = require('./vitals-validator');
var writeVitalToVista = require('./vitals-vista-writer');
var writeVprToJds = require('../core/jds-direct-writer');
var rdk = require('../../core/rdk');

var vitalsWriteApiDocs = {};
vitalsWriteApiDocs.post = {
    spec: {
        summary: 'Add one or more new vitals for a patient in a single Vista',
        notes: '',
        parameters: [
            rdk.docs.swagger.paramTypes.path('pid', 'patient id', 'string', undefined, undefined),
            rdk.docs.swagger.paramTypes.body('NewVitals', 'new vitals for a patient to be saved in a single Vista', 'NewVitals', undefined, true)
        ],
        models: {
            NewVitals: {
                required: ['dateTime', 'enteredByIEN', 'locIEN', 'vitals'],
                properties: {
                    dateTime: {type: 'string', description: 'date/time vitals entered in yyyymmddHHMM format'},
                    localIEN: {type: 'string', description: 'IEN of clinic location where vitals where taken'},
                    vitals: {type: 'array', description: 'one or more vitals', items: {"$ref": 'Vital'}}
                }
            },
            Vital: {
                required: ['fileIEN', 'reading'],
                properties: {
                    fileIEN: {type: 'string', description: 'vital type'},
                    reading: {type: 'string', description: 'vital value'},
                    qualifiers: {type: 'array', description: 'zero or more qualifier IENs', items: {type: 'string'}}
                }
            }
        }
    }
};

vitalsWriteApiDocs.put = {
    spec: {
        path: '/:resourceId',
        summary: 'Update an existing patient vital',
        notes: '',
        parameters: [
            rdk.docs.swagger.paramTypes.path('pid', 'patient id', 'string', undefined, undefined),
            rdk.docs.swagger.paramTypes.path('resourceId', 'vital id', 'string', undefined, undefined),
            rdk.docs.swagger.paramTypes.body('UpdateVital', 'data used to update an existing vital for a patient in a single Vista', 'UpdateVital', undefined, true)
        ],
        models: {
            UpdateVital: {
                //need to add once defined
            }
        }
    }
};

module.exports.getResourceConfig = function() {
    return [{
        name: 'add',
        path: '',
        post: addVitals,
        apiDocs: vitalsWriteApiDocs.post,
        interceptors: {
            convertPid: true
        },
        permissions: ['add-patient-vital']
    }
        // TODO uncomment once we have the support for Vitals added in error
        // , {
        // name: 'update',
        // path: '/:resourceId',
        // put: updateVitals,
        // apiDocs: vitalsWriteApiDocs.post,
        // interceptors: {
        // synchronize: false
        // },
        // permissions: []
        // }

    ];
};

function addVitals(req, res) {
    var tasks = [
        validateVitals.create,
        writeVitalToVista.create,
        writeVprToJds
    ];
    writebackWorkflow(req, res, tasks);
}

function updateVitals(req, res) {
    var tasks = [
        validateVitals.update,
        writeVitalToVista.update,
        writeVprToJds
    ];
    writebackWorkflow(req, res, tasks);
}
