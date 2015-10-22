'use strict';

var async = require('async');
var VistaJS = require('../../core/VistaJS');
var validate = require('./../utils/validation-util');
var _ = require('lodash');

/**
 * Converts a flag RPC's response to an boolean value.
 *
 * @param err Should be null unless an error occurred.
 * @param flag The value returned by the RPC.
 * @param callback The function to call when finished.
 */
function booleanizeFlag(err, flag, callback) {
    if (err) {
        return callback(err);
    }

    // Special case: we want to count '0' (the string) as falsy for these flags, but javascript doesn't.
    if (flag === '0') {
        return callback(null, false);
    }

    callback(null, !!flag);
};

/**
 * Calls the RPCs to get the flags for a progress note title.
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param ien The progress note title ien.
 * @param callback The function to call when finished.
 */
function getFlagsForProgressNoteTitle(logger, configuration, ien, callback) {
    if (validate.isStringNullish(ien)) {
        return callback('ien cannot be empty');
    }

    async.parallel({
        surgeryFlag: function(cb) {
            VistaJS.callRpc(logger, configuration, 'TIU IS THIS A SURGERY?', ien, function(err, result) {
                booleanizeFlag(err, result, cb);
            });
        },
        oneVisitFlag: function(cb) {
            VistaJS.callRpc(logger, configuration, 'TIU ONE VISIT NOTE?', ien, function(err, result) {
                booleanizeFlag(err, result, cb);
            });
        },
        prfFlag: function(cb) {
            VistaJS.callRpc(logger, configuration, 'TIU ISPRF', ien, function(err, result) {
                booleanizeFlag(err, result, cb);
            });
        },
        consultFlag: function(cb) {
            VistaJS.callRpc(logger, configuration, 'TIU IS THIS A CONSULT?', ien, function(err, result) {
                booleanizeFlag(err, result, cb);
            });
        }
    }, function(err, results) {
        if (err) {
            return callback(err);
        }

        var flags = {
            isSurgeryNote: results.surgeryFlag,
            isOneVisitNote: results.oneVisitFlag,
            isPrfNote: results.prfFlag,
            isConsultNote: results.consultFlag
        }
        callback(null, flags);
    });
}

module.exports.getProgressNoteTitlesFlags = getFlagsForProgressNoteTitle;
module.exports.fetch = function(logger, configuration, callback, params) {
    getFlagsForProgressNoteTitle(logger, configuration, _.get(params, 'ien'), callback);
};
