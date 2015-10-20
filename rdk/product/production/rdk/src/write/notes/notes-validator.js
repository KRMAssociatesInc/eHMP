'use strict';
var _ = require('underscore');

module.exports.unsigned = function(writebackContext, callback) {
    // TODO: more robust model validation.
    // probably need to add some path icn/pid to model patientIcn and pid validation
    var titleId = writebackContext.model.documentDefUid;
    var error = null;
    var logger = writebackContext.logger;

    // Add PID, author, status, and siteHash to the model
    writebackContext.model.pid = _.last(writebackContext.pid.split(';'));
    writebackContext.model.siteHash = writebackContext.siteHash;
    writebackContext.model.authorUid = writebackContext.duz[writebackContext.siteHash];
    writebackContext.model.status = 'UNSIGNED';

    if (!titleId) {
        error = 'documentDefUid is missing from the model. A title is needed to save a note.';
    } else if (!writebackContext.model.authorUid) {
        error = 'The user could not be determined from the session. Review log.';
        logger.error({
            duz: writebackContext.duz,
            site: writebackContext.siteHash
        }, 'Failed to get user\'s duz by siteHash.');
    }
    return setImmediate(callback, error);
};

module.exports.update = function(writebackContext, callback) {
    // TODO: more robust model validation.
    var pid = writebackContext.pid;
    var ien = writebackContext.resourceId;
    var error = null;

    // Add PID to the model for database lookup
    writebackContext.model.pid = _.last(writebackContext.pid.split(';'));

    if (!pid || !ien) {
        error = 'The note\'s IEN and patient\'s PID are needed to update a note.';
    }

    //Remove 'localId', 'authorUid', 'siteHash', and 'pid' from model so that they aren't overwritten.
    writebackContext.model.localId = ien;
    delete writebackContext.model.pid;
    delete writebackContext.model.siteHash;
    delete writebackContext.model.authorUid;
    return setImmediate(callback, error);
};

module.exports.signed = function(writebackContext, callback) {
    // TODO: validate signed notes

    var error = null; // set if there is an error validating
    return setImmediate(callback, error);
};
