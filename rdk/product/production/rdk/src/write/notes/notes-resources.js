'use strict';

var writebackWorkflow = require('../core/writeback-workflow');
var validateNote = require('./notes-validator');
var writeNoteToVista = require('./notes-vista-writer');
var writeUnsignedNoteToEcrud = require('./notes-unsigned-ecrud-writer');
var writeVprToJds = require('../core/jds-direct-writer');
var getNoteTasks = require('./notes-tasks');
var db = require('./notes-db');

module.exports.getResourceConfig = function(app) {
    db.initialize(app);

    return [{
        name: 'add',
        path: '',
        post: addNote,
        interceptors: {
            operationalDataCheck: false,
            synchronize: false
        },
        permissions: [] // TODO set permissions. See https://wiki.vistacore.us/display/VACORE/Writeback+Edition+Permissions
    }, {
        name: 'update',
        path: '/:resourceId',
        put: updateNote,
        interceptors: {
            operationalDataCheck: false,
            synchronize: false
        },
        permissions: [] // TODO set permissions. See https://wiki.vistacore.us/display/VACORE/Writeback+Edition+Permissions
    }, {
        name: 'unsigned-delete',
        path: '/:resourceId',
        delete: deleteUnsignedNotes,
        interceptors: {
            operationalDataCheck: false,
            synchronize: false
        },
        permissions: [] // TODO set permissions. See https://wiki.vistacore.us/display/VACORE/Writeback+Edition+Permissions
    }, {
        name: 'unsigned-read',
        path: '',
        get: readUnsignedNotes,
        interceptors: {
            operationalDataCheck: false,
            synchronize: false
        },
        permissions: [] // TODO set permissions. See https://wiki.vistacore.us/display/VACORE/Writeback+Edition+Permissions
    }];
};

function addNote(req, res) {
    var tasks = [
        validateNote.unsigned,
        writeNoteToVista.unsigned,
        writeUnsignedNoteToEcrud.create,
        writeVprToJds
    ];
    writebackWorkflow(req, res, tasks);
}

function updateNote(req, res) {
    var tasks = [];
    tasks = tasks.concat(getNoteTasks.update(req.body));
    writebackWorkflow(req, res, tasks);
}

function deleteUnsignedNotes(req, res) {
    var tasks = [
        writeNoteToVista.delete,
        writeUnsignedNoteToEcrud.delete
    ];
    writebackWorkflow(req, res, tasks);
}

function readUnsignedNotes(req, res) {
    var tasks = [
        writeUnsignedNoteToEcrud.read
    ];
    writebackWorkflow(req, res, tasks);
}
