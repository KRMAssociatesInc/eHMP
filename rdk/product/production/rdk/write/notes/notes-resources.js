'use strict';

var writebackWorkflow = require('../core/writeback-workflow');
var validateNotes = require('./notes-validator');
var writeNoteToVista = require('./notes-vista-writer');
var writeVprToJds = require('../core/jds-direct-writer');

module.exports.getResourceConfig = function() {
    return [{
        name: 'add',
        path: '',
        post: addNotes,
        interceptors: {
            operationalDataCheck: false
        },
        permissions: []  // TODO set permissions. See https://wiki.vistacore.us/display/VACORE/Writeback+Edition+Permissions
    }];
};

function addNotes(req, res) {
    var tasks = [
        validateNotes,
        writeNoteToVista,
        writeVprToJds
    ];
    writebackWorkflow(req, res, tasks);
}

var addNote = {
    // VPR+ template model for add notes
};
