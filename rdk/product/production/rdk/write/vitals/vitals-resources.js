'use strict';

var writebackWorkflow = require('../core/writeback-workflow');
var validateVitals = require('./vitals-validator');
var writeVitalToVista = require('./vitals-vista-writer');
var writeVprToJds = require('../core/jds-direct-writer');

module.exports.getResourceConfig = function() {
    return [{
        name: 'add',
        path: '',
        post: addVitals,
        interceptors: {
            operationalDataCheck: false
        },
        permissions: []  // TODO set permissions. See https://wiki.vistacore.us/display/VACORE/Writeback+Edition+Permissions
    }];
};

function addVitals(req, res) {
    var tasks = [
        validateVitals,
        writeVitalToVista,
        writeVprToJds
    ];
    writebackWorkflow(req, res, tasks);
}

var addVital = {
    // VPR+ template model for add vital
};
