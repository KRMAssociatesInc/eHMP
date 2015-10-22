'use strict';

var writebackWorkflow = require('../core/writeback-workflow');
var validateImmunizations = require('./immunizations-validator');
var writeImmunizationToVista = require('./immunizations-vista-writer');
var writeVprToJds = require('../core/jds-direct-writer');

module.exports.getResourceConfig = function() {
    return [{
        name: 'add',
        path: '',
        post: manageImmunizations,
        interceptors: {
            pep: false
        },
        permissions: ['add-patient-immunization', 'remove-patient-immunization']
    }];
};

function manageImmunizations(req, res) {
    var tasks = [
        validateImmunizations.create,
        writeImmunizationToVista.create,
        writeVprToJds
    ];
    writebackWorkflow(req, res, tasks);
}


