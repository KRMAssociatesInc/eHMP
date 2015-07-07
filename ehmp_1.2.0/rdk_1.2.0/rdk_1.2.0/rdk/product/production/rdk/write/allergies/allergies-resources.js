'use strict';

var writebackWorkflow = require('../core/writeback-workflow');
var validateAllergies = require('./allergies-validator');
var writeAllergyToVista = require('./allergies-vista-writer');
var writeVprToJds = require('../core/jds-direct-writer');

module.exports.getResourceConfig = function() {
    return [{
        name: 'add',
        path: '',
        post: addAllergies,
        interceptors: {
            operationalDataCheck: false
        },
        permissions: []  // TODO set permissions. See https://wiki.vistacore.us/display/VACORE/Writeback+Edition+Permissions
    }];
};

function addAllergies(req, res) {
    var tasks = [
        validateAllergies,
        writeAllergyToVista,
        writeVprToJds
    ];
    writebackWorkflow(req, res, tasks);
}

var addAllergy = {
    // VPR+ template model for add allergy
};
