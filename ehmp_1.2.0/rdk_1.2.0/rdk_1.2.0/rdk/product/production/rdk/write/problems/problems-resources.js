'use strict';

var writebackWorkflow = require('../core/writeback-workflow');
var validateProblems = require('./problems-validator');
var writeProblemToVista = require('./problems-vista-writer');
var writeVprToJds = require('../core/jds-direct-writer');

module.exports.getResourceConfig = function() {
    return [{
        name: 'add',
        path: '',
        post: addProblems,
        interceptors: {
            operationalDataCheck: false
        },
        permissions: []  // TODO set permissions. See https://wiki.vistacore.us/display/VACORE/Writeback+Edition+Permissions
    }];
};

function addProblems(req, res) {
    var tasks = [
        validateProblems,
        writeProblemToVista,
        writeVprToJds
    ];
    writebackWorkflow(req, res, tasks);
}

var addProblem = {
    // VPR+ template model for add problem
};
