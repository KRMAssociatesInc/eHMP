'use strict';

var writebackWorkflow = require('../core/writeback-workflow');
var validateAllergies = require('./allergies-validator');
var writeAllergyToVista = require('./allergies-vista-writer');
var writeVprToJds = require('../core/jds-direct-writer');
var rdk = require('../../core/rdk');

var allergiesWriteApiDocs = {};
allergiesWriteApiDocs.post = {
    spec: {
        summary: 'Add a new allergy for a patient to single Vista',
        notes: '',
        parameters: [
            rdk.docs.swagger.paramTypes.path('pid', 'patient id', 'string', undefined, undefined),
            rdk.docs.swagger.paramTypes.body('NewAllergy', 'new allergy for a patient to be saved in a single Vista', 'NewAllergy', undefined, true)
        ],
        models: {
            NewAllergy: {
                required: ['dfn', 'eventDateTime', 'allergyName', 'natureOfReaction', 'historicalOrObserved'],
                properties: {
                    dfn: {type: 'string', description: ''},
                    eventDateTime: {type: 'string', description: ''},
                    allergyName: {type: 'string', description: ''},
                    natureOfReaction: {type: 'string', description: ''},
                    historicalOrObserved: {type: 'string', description: '', enum: ['o^OBSERVED', 'h^HISTORICAL']},
                    comment: {type: 'string', description: ''},
                    severity: {type: 'string', description: ''},
                    name: {type: 'string', description: ''},
                    IEN: {type: 'string', description: 'unique id of allergy in a single Vista'},
                    location: {type: 'string', description: ''},
                    observedDate: {type: 'string', description: ''},
                    symptoms: {type: 'array', description: 'zero or more symptoms of allergy', items : {"$ref" : 'Symptom'}}
                }
            },
            Symptom: {
                required: ['name', 'IEN'],
                properties: {
                    name: {type: 'string', description: 'name of symptom'},
                    IEN: {type: 'string', description: 'unique id of symptom in a single Vista'},
                    dateTime: {type: 'string', format: 'date-time', description: 'date/time symptom noticed in yyyymmddHHMM format'},
                    symptomDate: {type: 'string', format: 'date', description: 'date symptom noticed in mm/dd/yyyy format'},
                    symptomTime: {type: 'string', description: 'time symptom noticed in hh:mm a/p format'}
                }
            }
        }
    }
};

allergiesWriteApiDocs.put = {
    spec: {
        path: '/:resourceId',
        summary: 'Update an existing patient allergy',
        notes: '',
        parameters: [
            rdk.docs.swagger.paramTypes.path('pid', 'patient id', 'string', undefined, undefined),
            rdk.docs.swagger.paramTypes.path('resourceId', 'allergy id', 'string', undefined, undefined),
            rdk.docs.swagger.paramTypes.body('UpdateAllergy', 'data used to update an existing allergy for a patient in a single Vista', 'UpdateAllergy', undefined, true)
        ],
        models: {
            UpdateAllergy: {
                //need to add once defined
            }
        }
    }
};

module.exports.getResourceConfig = function() {
    return [{
        name: 'add',
        path: '',
        post: addAllergies,
        apiDocs: allergiesWriteApiDocs.post,
        interceptors: {
            operationalDataCheck: false,
            synchronize: false
        },
        permissions: []  // TODO set permissions. See https://wiki.vistacore.us/display/VACORE/Writeback+Edition+Permissions
    }, {
        name: 'update',
        path: '/:resourceId',
        put: updateAllergies,
        apiDocs: allergiesWriteApiDocs.put,
        interceptors: {
            operationalDataCheck: false,
            synchronize: false
        },
        permissions: []  // TODO set permissions. See https://wiki.vistacore.us/display/VACORE/Writeback+Edition+Permissions
    }];
};

function addAllergies(req, res) {
    var tasks = [
        validateAllergies.create,
        writeAllergyToVista.create,
        writeVprToJds
    ];
    writebackWorkflow(req, res, tasks);
}

function updateAllergies(req, res) {
    var tasks = [
        validateAllergies.update,
        writeAllergyToVista.update,
        writeVprToJds
    ];
    writebackWorkflow(req, res, tasks);
}

