/*jslint node: true */
'use strict';

var rdk = require('../../core/rdk');
var VistaJS = require('../../VistaJS/VistaJS');
var getVistaRpcConfiguration = require('../../utils/rpc-config').getVistaRpcConfiguration;
var db = require('../../write/notes/notes-db');

var _ = require('underscore');
var STUB_MSG = 'This is a stub of an Unsigned note created in eHMP. Please edit the note in eHMP. Edits here will not be saved in eHMP and may be overwritten';


// var errorMessage = 'There was an error processing your request. The error has been logged.';
// var errorVistaJSCallback = 'VistaJS RPC callback error: ';

// below: _ exports for unit testing only
module.exports._createNote = createNote;

function getResourceConfig() {
    return [{
        name: 'create',
        path: '/create',
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
                summary: 'Creates a note',
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
        post: createNote,
        healthcheck: [

                function() {
                    return true;
                }
            ]
            //permissions: ['sign-patient-note']
    }];
}

function createNote(req, res) {
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
    var note = input.note;
    var pid = input.patientIEN;
    // var locationId = input.locationIEN;
    var rpcConfig = getVistaRpcConfiguration(req.app.config, req.session.user.site);
    rpcConfig.accessCode = userSession.accessCode;
    rpcConfig.verifyCode = userSession.verifyCode;
    rpcConfig.context = 'OR CPRS GUI CHART';



    var rpcName = 'TIU CREATE RECORD';
    VistaJS.callRpc(
        req.logger,
        rpcConfig,
        rpcName,
        getStub(note),
        function(err, response) {
            if (!err) {
                note.localId=response;
                db.insert(note, function(err, newDoc) {
                    if (err) {
                        res.status(rdk.httpstatus.forbidden).rdkSend('Nedb error: '+err);
                    } else {
                        db.find({
                            pid: pid,
                            status: 'UNSIGNED'
                        }, function(err, docs) {
                            if (!err) {
                                res.status(rdk.httpstatus.ok).rdkSend('Note:'+response);
                            }
                            else {
                                res.status(rdk.httpstatus.forbidden).rdkSend('Nedb find error '+err);
                            }
                        });
                    }
                });
            }
            else {
                res.status(rdk.httpstatus.forbidden).rdkSend('Vista insert: '+err);
            }
        });

}

function getStub(model) {
    var vistaStub = [];
    var noteObj = {};
    var split = model.pid.split(';');

    vistaStub.push(_.last(split));
    split = model.documentDefUid.split(':');
    vistaStub.push(_.last(split));
    vistaStub.push('', '', '');
    split = model.authorUid.split(':');
    noteObj['1202'] = _.last(split);
    noteObj['1301'] = '3150520.1732';
    noteObj['1205'] = '';
    split = STUB_MSG.split('. ');
    noteObj['\"TEXT\",1,0'] = split[0] + '.';
    noteObj['\"TEXT\",2,0'] = split[1] + '.';
    noteObj['\"TEXT\",3,0'] = split[2] + '.';

    vistaStub.push(noteObj);
    vistaStub.push('', '1');
    return vistaStub;
}



module.exports.getResourceConfig = getResourceConfig;
