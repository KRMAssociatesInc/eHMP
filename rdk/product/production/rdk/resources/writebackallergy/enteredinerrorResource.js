/*jslint node: true*/
'use strict';

var rdk = require('../../rdk/rdk');
var VistaJS = require('../../VistaJS/VistaJS');
var filemanDateUtil = require('../../utils/filemanDateUtil');
var getVistaRpcConfiguration = require('../../utils/rpc/rpcUtil').getVistaRpcConfiguration;
var uidUtil = require('../../utils/uidUtil');

var saveParams = {
    put: {
        uid: {
            required: true,
            description: 'the UID for the allergy'
        },
        comments: {
            required: true,
            description: 'the comment entered when marking an allergy in error'
        }
    }
};

function getResourceConfig() {
    return [{
        name: 'save',
        path: '/save',
        parameters: saveParams,
        description: {
            put: 'Mark an allergy with the provided UID as "Entered in Error" with the provided comments.'
        },
        put: performWriteBack,
        interceptors: {
            synchronize: true
        },
        healthcheck: {
            dependencies: ['patientrecord', 'jds', 'solr', 'jdsSync', 'authorization']
        },
        permissions: ['remove-patient-allergy']
    }, {
        name: 'permission',
        path: '',
        description: {
            get: 'Check user authorization to mark allergies "Entered in Error"'
        },
        get: performPermissionCheck,
        interceptors: {
            synchronize: true
        },
        healthcheck: {
            dependencies: ['patientrecord', 'jds', 'solr', 'jdsSync', 'authorization']
        },
        permissions: []
    }];
}

function performWriteBack(req, res) {
    req.logger.info('perform write back for entered in error resource GET called');

    var input = req.body;
    var inputParam,
        rpcParams,
        dfn,
        uid;

    inputParam = makeJsonParams(input, res);

    if (inputParam === false) {
        res.send(rdk.httpstatus.internal_server_error, 'Invalid parameters.\n' + JSON.stringify(req.params));
        return;
    }

    if (!uidUtil.fromSite(inputParam.uid, req.session.user.site)) {
        res.send(rdk.httpstatus.precondition_failed, 'Updates can only be performed on the local site.\n');
        return;
    }

    uid = inputParam.uid.split(':');
    if (uid.length > 1) {
        dfn = uid[uid.length - 2];
        uid = uid[uid.length - 1];
    } else {
        res.send(rdk.httpstatus.internal_server_error, 'Invalid UID.');
        return;
    }

    rpcParams = {
        '"GMRAERR"': 'YES',
        '"GMRAERRBY"': req.session.user.duz[req.session.user.site],
        '"GMRAERRDT"': filemanDateUtil.getFilemanDateTime(new Date())
    };

    if (typeof inputParam.comments === 'string' && inputParam.comments.length) {
        rpcParams['"GMRAERRCMTS",0'] = '1';
        rpcParams['"GMRAERRCMTS",1'] = inputParam.comments;
    }

    var rpcConfig = getVistaRpcConfiguration(req.app.config, req.session.user.site);
    rpcConfig.accessCode = req.session.user.accessCode;
    rpcConfig.verifyCode = req.session.user.verifyCode;
    VistaJS.callRpc(req.logger, rpcConfig, 'ORWDAL32 SAVE ALLERGY', [uid, dfn, rpcParams], function(error, result) {
        if (!error) {
            res.send({
                'success': true,
                'result': result
            });
            return;
        } else {
            res.send(rdk.httpstatus.internal_server_error, 'RPC returned with error:' + error + '\nPARAMS:\n' + uid + '\n' + JSON.stringify(rpcParams));
            return;
        }
    });
}

function makeJsonParams(req, res) {
    var jsonString = req;

    var jsonParam = jsonString.param;

    if (typeof jsonParam !== 'undefined') {
        if (typeof jsonParam.comments === 'undefined') {
            res.send(rdk.httpstatus.internal_server_error, '"comments" parameter not found in JSON.');
            return false;
        } else if (typeof jsonParam.uid === 'undefined') {
            res.send(rdk.httpstatus.internal_server_error, '"uid" parameter not found in JSON.');
            return false;
        } else {
            return jsonParam;
        }
    } else {
        if (typeof jsonString.comments !== 'undefined') {
            if (typeof jsonString.uid !== 'undefined') {
                return {
                    'comments': jsonString.comments,
                    'uid': jsonString.uid
                };
            } else {
                res.send(rdk.httpstatus.internal_server_error, '"uid" parameter not found in query string.');
                return false;
            }
        } else {
            res.send(rdk.httpstatus.internal_server_error, '"comments" parameter not found in query string.');
            return false;
        }
    }

    return false;
}

function performPermissionCheck(req, res) {
    req.logger.info('perform permission check for entered in error resource GET called');

    var rpcConfig = getVistaRpcConfiguration(req.app.config, req.session.user.site);
    rpcConfig.accessCode = req.session.user.accessCode;
    rpcConfig.verifyCode = req.session.user.verifyCode;
    VistaJS.callRpc(req.logger, rpcConfig, 'ORWDAL32 CLINUSER', [], function(error, result) {
        if (!error) {
            res.send(result);
        } else {
            res.send(rdk.httpstatus.internal_server_error, 'RPC returned with error:' + error);
        }
    });
}

module.exports.getResourceConfig = getResourceConfig;
module.exports.performPermissionCheck = performPermissionCheck;
module.exports.performWriteBack = performWriteBack;
