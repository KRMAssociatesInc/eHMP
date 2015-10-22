'use strict';

var writebackWorkflow = require('../core/writeback-workflow');
var validateEncounter = require('./encounters-validator');
var writeEncounterToVista = require('./encounters-vista-writer');
var writeVprToJds = require('../core/jds-direct-writer');

module.exports.getResourceConfig = function() {
    return [{
        name: 'add',
        path: '',
        post: addEncounter,
        interceptors: {
            operationalDataCheck: false,
            synchronize: false
        },
        permissions: [] // TODO set permissions. See https://wiki.vistacore.us/display/VACORE/Writeback+Edition+Permissions
    }, {
        name: 'update',
        path: '/:resourceId',
        put: updateEncounter,
        interceptors: {
            operationalDataCheck: false,
            synchronize: false
        },
        permissions: [] // TODO set permissions. See https://wiki.vistacore.us/display/VACORE/Writeback+Edition+Permissions
    }];
};

function addEncounter(req, res) {
    var tasks = [
        validateEncounter.create,
        writeEncounterToVista.create,
        writeVprToJds
    ];
    writebackWorkflow(req, res, tasks);
}

function updateEncounter(req, res) {
    var tasks = [
        validateEncounter.update,
        writeEncounterToVista.update,
        writeVprToJds
    ];
    writebackWorkflow(req, res, tasks);
}
