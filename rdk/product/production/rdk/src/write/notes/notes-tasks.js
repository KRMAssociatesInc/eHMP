'use strict';

var writeVprToJds = require('../core/jds-direct-writer');

var noteTasks = {
    updateUnsigned: [
        require('./notes-validator').update,
        require('./notes-unsigned-ecrud-writer').update,
        require('./notes-vista-writer').update
    ],
    updateSigned: [
        require('./notes-validator').update,
        require('./notes-vista-writer').signed,
        writeVprToJds
    ],
    sign: [
        require('./notes-validator').update,
        require('./notes-unsigned-ecrud-writer').delete,
        require('./notes-vista-writer').sign,
        writeVprToJds
    ]
};

/**
 * @param model unvalidated VPR+ model
 * @returns {*} Array of tasks if applicable
 */
module.exports.update = function getUpdateNoteTasks(model) {
    // TODO assign taskName if there is an applicable task for the request

    var taskName = 'updateUnsigned';
    return noteTasks[taskName];
};
