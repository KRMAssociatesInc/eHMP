'use strict';

var rdk = require('../../core/rdk');
var VistaJS = require('../../VistaJS/VistaJS');
var getVistaRpcConfiguration = require('../../utils/rpc-config').getVistaRpcConfiguration;
var async = require('async');
var db = require('../../write/notes/notes-db');
var filemanDateUtil = require('../../utils/fileman-date-converter');
var _ = require('underscore');
var moment = require('moment');

// var errorMessage = 'There was an error processing your request. The error has been logged.';
// var errorVistaJSCallback = 'VistaJS RPC callback error: ';

// below: _ exports for unit testing only
module.exports._signNote = signNote;

function getResourceConfig() {
    return [{
        name: 'sign',
        path: '/sign',
        interceptors: {
            pep: false,
            synchronize: false
        },
        // parameters: {
        //     post: {
        //         pid: {
        //             required: true,
        //             description: 'Patient ID'
        //         }
        //     }
        // },
        apiDocs: {
            spec: {
                summary: 'Signs a note',
                notes: '',
                // parameters: [
                //     rdk.docs.commonParams.pid,
                // ],
                responseMessages: []
            }
        },
        description: {
            post: 'Signs a note'
        },
        post: signNote,
        healthcheck: [

                function() {
                    return true;
                }
            ]
            //permissions: ['sign-patient-note']
    }];
}

function signNote(req, res) {
    req.logger.info('perform sign note');
    var userSession,
        site, duz;

    try {
        userSession = req.session.user;
        site = userSession.site;
        duz = userSession.duz[site];
    } catch (e) {
        res.status(rdk.httpstatus.internal_server_error).rdkSend('Required authentication data is not present in request.');
        return;
    }

    var input = req.body.param;
    var signatureCode = input.signatureCode;
    var note = input.note;
    var pid = input.patientIEN;
    // var locationId = input.locationIEN;
    var rpcConfig = getVistaRpcConfiguration(req.app.config, req.session.user.site);
    rpcConfig.accessCode = userSession.accessCode;
    rpcConfig.verifyCode = userSession.verifyCode;
    rpcConfig.context = 'OR CPRS GUI CHART';
    var action = '';


    async.series([
            function checkActions(callback) {
                VistaJS.callRpc(req.logger, rpcConfig, 'TIU WHICH SIGNATURE ACTION', note.localId, function(error, result) {
                    if (result !== 'SIGNATURE' && result !== 'COSIGNATURE') {
                        error = {
                            message: 'SIGN ACTION NOT ALLOWED',
                            rpcError: result
                        };
                    } else {
                        action = result;
                    }
                    callback(error, result);
                });
            },
            function checkNote(callback) {
                var args = [];
                args.push(note.localId, action);
                VistaJS.callRpc(req.logger, rpcConfig, 'TIU AUTHORIZATION', args, function(error, result) {
                    if (parseInt(result) !== 1) {
                        error = {
                            message: 'NOT AUTHORIZED',
                            rpcError: result
                        };
                    }
                    callback(error, result);
                });
            },
            function lockNote(callback) {
                VistaJS.callRpc(req.logger, rpcConfig, 'TIU LOCK RECORD', note.localId, function(error, result) {
                    if (parseInt(result) !== 0) {
                        error = {
                            message: 'UNABLE TO LOCK RECORD',
                            rpcError: result
                        };
                    }
                    callback(error, result);
                });
            },
            function validateSignature(callback) {
                VistaJS.callRpc(req.logger, rpcConfig, 'ORWU VALIDSIG', signatureCode, function(error, result) {
                    if (parseInt(result) !== 1) {
                        error = {
                            message: 'SIGNATURE NOT VALID',
                            rpcError: result
                        };
                    }
                    callback(error, result);
                });
            },
            function uodateNedb(callback) {
                note.status = 'SIGNED';
                db.update({
                        pid: note.pid,
                        localId: note.localId
                    }, {
                        $set: note
                    }, {},
                    function(err, numReplace) {
                        var error;
                        if (err || numReplace !== 1) {
                            error = {
                                message: 'UNABLE TO UPDATE NEDB',
                                nedbError: err
                            };
                        }
                        callback(error, numReplace);
                    });
            },
            function updateVista(callback) {
                var rpcName = 'TIU UPDATE RECORD';
                var args = [];

                var vistaNote = getVistaObject(note);
                args.push(note.localId, vistaNote);

                VistaJS.callRpc(
                    req.logger,
                    rpcConfig,
                    rpcName,
                    args,
                    function(err, response) {
                        var error;
                        if (err) {
                            error = {
                                message: 'UNABLE TO UPDATE VISTA',
                                rpcError: response
                            };
                        }
                        callback(error, response);
                    });
            },
            function signNote(callback) {
                var rpcName = 'TIU SIGN RECORD';
                var args = [];
                args.push(note.localId, signatureCode);
                VistaJS.callRpc(
                    req.logger,
                    rpcConfig,
                    rpcName,
                    args,
                    function(err, response) {
                        if (!err) {
                            db.remove({
                                pid: note.pid,
                                localId: note.localId
                            }, {}, function(errorNedb, numRemoved) {
                                var error;
                                if (errorNedb || numRemoved !== 1) {
                                    error = {
                                        message: 'UNABLE TO DELETE ENTRY FROM NEDB',
                                        rpcError: errorNedb
                                    };
                                }
                                callback(error, response);
                            });
                        } else {
                            note.status = 'UNSIGNED';
                            db.update({
                                    pid: note.pid,
                                    localId: note.localId
                                }, {
                                    $set: note
                                }, {},
                                function(err, numReplace) {
                                    var error;
                                    if (err) {
                                        error = {
                                            message: 'UNABLE TO SIGN NOTE. UNABLE TO UPDATE NEDB',
                                            nedbError: err
                                        };
                                    } else {
                                        error = {
                                            message: 'UNABLE TO SIGN NOTE. UPDATED NEDB',
                                            nedbError: err
                                        };
                                    }
                                    callback(error, numReplace);
                                });
                        }
                        //callback(error, response);
                    });
            },
            function unlockNote(callback) {
                VistaJS.callRpc(req.logger, rpcConfig, 'TIU UNLOCK RECORD', note.localId, function(error, result) {
                    if (error) {
                        error = {
                            message: 'UNABLE TO UNLOCK RECORD',
                            rpcError: result
                        };
                    }
                    callback(error, result);
                });
            }
        ],
        function(error, result) {

            if (error) {
                req.logger.error(error);
                res.status(rdk.httpstatus.forbidden).rdkSend(error);
            } else {
                req.logger.info('Successfully signed note: ' + result);
                res.status(rdk.httpstatus.ok).rdkSend();
            }
        });


}



function getVistaObject(model) {
    var split;
    var noteObj = {};
    split = model.pid.split(';');
    noteObj['.02'] = _.last(split);
    split = model.authorUid.split(':');
    noteObj['1202'] = _.last(split);
    noteObj['1302'] = _.last(split);
    var dateformat = moment(model.entered.toString(), 'YYYYMMDDHHmmss');
    var vistaDate = filemanDateUtil.getFilemanDateTime(dateformat.toDate());
    noteObj['1301'] = vistaDate;
    noteObj['1205'] = '';
    if (model.text && model.text.length > 0 && model.text[0].content) {
        noteObj['\"TEXT\",1,0'] = model.text[0].content;
    }

    return noteObj;
}


module.exports.getResourceConfig = getResourceConfig;
