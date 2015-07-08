'use strict';

var writebackWorkflow = require('../core/writeback-workflow');
var validateImmunizations = require('./immunizations-validator');
var writeImmunizationToVista = require('./immunizations-vista-writer');
var writeVprToJds = require('../core/jds-direct-writer');

module.exports.getResourceConfig = function() {
    return [{
        name: 'add',
        path: '',
        post: addImmunizations,
        interceptors: {
            operationalDataCheck: false
        },
        permissions: []  // TODO set permissions. See https://wiki.vistacore.us/display/VACORE/Writeback+Edition+Permissions
    }];
};

function addImmunizations(req, res) {
    var tasks = [
        validateImmunizations,
        writeImmunizationToVista,
        writeVprToJds
    ];
    writebackWorkflow(req, res, tasks);
}

var addImmunization = {
    // VPR+ template model for add immunization
};
