'use strict';

var writebackWorkflow = require('../core/writeback-workflow');
var validateProblems = require('./problems-validator');
var writeProblemToVista = require('./problems-vista-writer');
var writeVprToJds = require('../core/jds-direct-writer');

module.exports.getResourceConfig = function () {
    return [{
        name: 'add',
        path: '',
        post: addProblems,
        interceptors: {
            operationalDataCheck: false,
            synchronize: false
        },
        permissions: [] // TODO set permissions. See https://wiki.vistacore.us/display/VACORE/Writeback+Edition+Permissions
    }, {
        name: 'update',
        path: '',
        put: updateProblems,
        interceptors: {
            operationalDataCheck: false,
            synchronize: false
        },
        permissions: [] // TODO set permissions. See https://wiki.vistacore.us/display/VACORE/Writeback+Edition+Permissions
    }];
};

function addProblems(req, res) {
    //res.status(200).rdkSend({status:'200', message: 'Hello Writeback'});
    var tasks = [
        validateProblems.create,
        writeProblemToVista.create,
        writeVprToJds
    ];
    writebackWorkflow(req, res, tasks);
}

function updateProblems(req, res) {
    var tasks = [
        validateProblems.update,
        writeProblemToVista.update,
        writeVprToJds
    ];
    writebackWorkflow(req, res, tasks);
}

var addProblem = {
    // VPR+ template model for add problem
};
