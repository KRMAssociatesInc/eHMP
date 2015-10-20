'use strict';

// This will be first implemented using nedb. TODO: Remove this comment once refactored to use ecrud.
var db = require('./notes-db');
var moment = require('moment');
var vistaWriter = require('./notes-vista-writer');
var _ = require('underscore');

module.exports.create = function(writebackContext, callback) {
    var logger = writebackContext.logger;
    writebackContext.model.entered = moment().format();
    db.insert(writebackContext.model, function(err, newDoc) {
        if (err) {
            logger.error({
                ecrudError: err
            }, 'Failed to write note to ecrud.');
            writebackContext.resourceId = writebackContext.model.localId;
            vistaWriter.delete(writebackContext, function(vistaErr) {
                if (vistaErr) {
                    logger.error({
                        vistaWriterError: vistaErr
                    }, 'Created VistA stub, failed to create ecrud record, failed to delete VistA stub.');
                    return callback({
                        error: 'Castastrophic failure. Review log.'
                    });
                }
            });
            logger.warn('Failed to write note to ecrud. Successfully deleted stub note from vista.');
            return callback(err);
        }

        writebackContext.vprResponse = {
            notes: newDoc
        };
        return callback(null);
    });
};

module.exports.update = function(writebackContext, callback) {
    var pid = _.last(writebackContext.pid.split(';'));
    var ien = writebackContext.resourceId;
    writebackContext.model.updated = moment().format();

    db.update({
            pid: pid,
            localId: ien
        }, {
            $set: writebackContext.model
        }, {},
        function(err, numReplace) {
            if (err) {
                return callback(err);
            } else if (!numReplace || numReplace === 'null' || numReplace === 0) {
                return callback('Note with IEN of ' + ien + ' not found for PID ' + pid);
            }
            return callback(null);
        }
    );
};

module.exports.read = function(writebackContext, callback) {
    var pid = _.last(writebackContext.pid.split(';'));
    var user = writebackContext.duz[writebackContext.siteHash];

    db.find({
        pid: pid,
        status: 'UNSIGNED',
        authorUid: user
    }, function(err, docs) {
        if (err) {
            return callback(err);
        }

        writebackContext.vprResponse = {
            notes: docs
        };
        return callback(null);
    });
};

module.exports.delete = function(writebackContext, callback) {
    var pid = _.last(writebackContext.pid.split(';'));
    var noteUid = writebackContext.resourceId;
    db.remove({
        pid: pid,
        status: 'UNSIGNED',
        localId: noteUid
    }, {}, function(err, numRemoved) {
        if (err) {
            return callback(err);
        }

        if (numRemoved === 1) {
            var vprModel = {
                'delete': true
            };
            writebackContext.vprResponse = vprModel;
            return callback(null);
        } else {
            // This message may need to change if the workflow changes; i.e. we delete from ecrud first.
            return callback({
                ecrudError: 'Removed note from VistA, but could not find note in ecrud.'
            });
            // return callback('Could not find note in ecrud.');
        }
    });
};
