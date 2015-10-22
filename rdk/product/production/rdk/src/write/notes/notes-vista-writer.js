'use strict';

var async = require('async');
var _ = require('underscore');
var VistaJS = require('../core/VistaJS');
var paramUtil = require('../../utils/param-converter');
var filemanDateUtil = require('../../utils/fileman-date-converter');
var RpcParameter = VistaJS.RpcParameter;
var STUB_MSG = 'This is a stub of an Unsigned note created in eHMP. Please edit the note in eHMP. Edits here will not be saved in eHMP and may be overwritten';
var VISTA_DELTE_ERR = 'You may not DELETE';
var DELETE_ERR_MSG = 'To delete a note you must be the author of it and have authorization.';

module.exports.unsigned = function(writebackContext, callback) {

    var rpcName = 'TIU CREATE RECORD';
    VistaJS.callRpc(
        writebackContext.logger,
        writebackContext.vistaConfig,
        rpcName,
        getStub(writebackContext.model),
        function(err, response) {
            // '^' in the response indicates an error
            if (err || response.indexOf('^') > -1) {
                return callback({
                    vistaError: {
                        err: err,
                        data: response
                    }
                });
            }
            addIds(writebackContext, response);
            return callback(null);
        }
    );
};

module.exports.update = function(writebackContext, callback) {

    var rpcName = 'TIU UPDATE RECORD';
    VistaJS.callRpc(
        writebackContext.logger,
        writebackContext.vistaConfig,
        rpcName,
        getUpdate(writebackContext),
        function(err, response) {
            // '^' in the response indicates an error
            if (err || response.indexOf('^') > -1 || response !== writebackContext.model.localId) {
                return callback({
                    vistaError: {
                        err: err,
                        data: response
                    }
                });
            }
            writebackContext.vprResponse = {
                success: 'Successfully updated note.'
            };
            return callback(null);
        }
    );
};

module.exports.sign = function(writebackContext, callback) {
    async.series([
        function sendDataToVista(callback) {
            var parameters = [];
            var rpcName = 'ORQPT MYRPC';
            parameters.push(new RpcParameter.literal('MYPARAM'));
            VistaJS.callRpc(
                writebackContext.logger,
                writebackContext.vistaConfig,
                rpcName,
                parameters,
                callback);
        }
    ], function(err, data) {
        if (err) {
            return callback({
                vistaError: {
                    err: err,
                    data: data
                }
            });
        }
        // var vprModel = null; // TODO set this by the VistA response
        var error = null; // TODO set error if trouble writing back
        return callback(error);
    });
};

module.exports.signed = function(writebackContext, callback) {
    async.series([
        function sendDataToVista(callback) {
            var parameters = [];
            var rpcName = 'ORQPT MYRPC';
            parameters.push(new RpcParameter.literal('MYPARAM'));
            VistaJS.callRpc(
                writebackContext.logger,
                writebackContext.vistaConfig,
                rpcName,
                parameters,
                callback);
        }
    ], function(err, data) {
        if (err) {
            return callback({
                vistaError: {
                    err: err,
                    data: data
                }
            });
        }
        // var vprModel = null; // TODO set this by the VistA response
        var error = null; // TODO set error if trouble writing back
        return callback(error);
    });
};

module.exports.delete = function(writebackContext, callback) {

    var rpcName = 'TIU DELETE RECORD';
    var parameters = [];
    parameters.push(writebackContext.resourceId, '');
    VistaJS.callRpc(
        writebackContext.logger,
        writebackContext.vistaConfig,
        rpcName,
        parameters,
        function(err, response) {
            if (err || response.indexOf(VISTA_DELTE_ERR) !== -1) {
                return callback({
                    vistaError: {
                        err: err ? err + DELETE_ERR_MSG : DELETE_ERR_MSG,
                        data: response
                    }
                });
            }
            writebackContext.model.localId = response;
            return callback(null);
        }
    );
};

function getStub(model) {
    var vistaStub = [];
    var noteObj = {};
    var split = model.pid.split(';');
    var encounter = encounterObj(model);

    vistaStub.push(_.last(split));
    split = model.documentDefUid.split(':');
    vistaStub.push(_.last(split));
    vistaStub.push('', '', '');
    split = model.authorUid.split(':');
    noteObj['1202'] = _.last(split);
    noteObj['1301'] = model.referenceDateTime ? filemanDateUtil.getFilemanDateTime(paramUtil.convertWriteBackInputDate(model.referenceDateTime).toDate()) : '';
    noteObj['1205'] = encounter.location ? encounter.location : '';
    split = STUB_MSG.split('. ');
    noteObj['\"TEXT\",1,0'] = split[0] + '.';
    noteObj['\"TEXT\",2,0'] = split[1] + '.';
    noteObj['\"TEXT\",3,0'] = split[2] + '.';

    vistaStub.push(noteObj);
    if (encounter.location) {
        vistaStub.push(encounter.location + ';' + encounter.dateTime + ';' + encounter.category);
    }
    vistaStub.push('', '1');
    return vistaStub;
}

function encounterObj(model) {
    var split = model.encounterUid ? model.encounterUid.split(';') : '';
    var location;
    var dateTime;
    var category;
    if (split.length > 1) {
        category = split[0];
        dateTime = split[1];
        location = split[2];
    } else if (model.encounterUid && model.encounterDateTime && model.locationUid) {
        category = split.toString().charAt(0);
        dateTime = filemanDateUtil.getFilemanDateTime(paramUtil.convertWriteBackInputDate(model.encounterDateTime).toDate());
        split = model.locationUid.split(':');
        location = _.last(split);
    }

    if (!category || !dateTime || !location) {
        return {};
    }

    return {
        location: location,
        dateTime: dateTime,
        category: category
    };
}

function getUpdate(writebackContext) {
    var model = writebackContext.model;
    var param = [];
    var noteObj = {};
    var split = model.documentDefUid.split(':');

    param.push(model.localId);
    noteObj['1301'] = model.referenceDateTime ? filemanDateUtil.getFilemanDateTime(paramUtil.convertWriteBackInputDate(model.referenceDateTime).toDate()) : '';
    noteObj['.01'] = _.last(split);
    param.push(noteObj);

    return param;
}

function addIds(writebackContext, localId) {
    var pid = _.last(writebackContext.pid.split(';'));
    writebackContext.model.noteUid = 'urn:va:document:' + writebackContext.siteHash + ':' + pid + ':' + localId;
    writebackContext.model.localId = localId;
}

module.exports._encounterObj = encounterObj;
module.exports._getStub = getStub;
