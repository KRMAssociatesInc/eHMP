/*jslint node: true*/
'use strict';

var rdk = require('../core/rdk');
var VistaJS = require('../VistaJS/VistaJS');
var getVistaRpcConfiguration = require('../utils/rpc-config').getVistaRpcConfiguration;

function getResourceConfig() {
    return [{
        name: 'test',
        path: '',
        get: runRpc,
        permissions: []
    }];
}

/**
* Runs the given RPC. Uses the site code that is stored in the user session.
*
* @param {Object} req - The default Express request.
* @param {Object} res - The default Express response.
*/
function runRpc(req, res) {
    req.logger.info('RPC testing endpoint called');

    var json = JSON.parse(req.param('payload'));

    VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site), json.rpc, json.params, function(error, response) {
        if (!error) {
            res.rdkSend(response);
            return;
        } else {
            res.status(rdk.httpstatus.internal_server_error).rdkSend('Returned Error Result:' + error + '\nPayload:\n' + JSON.stringify(json));
            return;
        }
    });
}

module.exports.getResourceConfig = getResourceConfig;
module.exports.runRpc = runRpc;
