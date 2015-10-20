'use strict';

var rdk = require('../../core/rdk');
var VistaJS = require('../../VistaJS/VistaJS');
var getVistaRpcConfiguration = require('../../utils/rpc-config').getVistaRpcConfiguration;
var isNullish = require('../../utils/nullchecker').isNullish;
var errorVistaJSCallback = 'VistaJS RPC callback error: ';
var errorMessage = 'There was an error processing your request. The error has been logged.';

function getResourceConfig() {
    return [{
        path: '/serviceCategory',
        interceptors: {
            pep: false,
            synchronize: false
        },
        apiDocs: {
            spec: {
                summary: '',
                notes: '',
                responseMessages: []
            }
        },
        get: getvisitServiceCategory,
        healthcheck: [

            function() {
                return true;
            }
        ]
    }];
}

function getvisitServiceCategory(req, res) {

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

    var params = req.query;
    var locationId = params.locationIEN;
    var patientStatus = params.patientStatus;
    var rpcConfig = getVistaRpcConfiguration(req.app.config, req.session.user.site);
    rpcConfig.accessCode = userSession.accessCode;
    rpcConfig.verifyCode = userSession.verifyCode;
    rpcConfig.context = 'OR CPRS GUI CHART';

    if (isNullish(locationId) || isNullish(patientStatus)) {
        var error = {
            message: 'REQUEST NOT VALID'
        };

        req.logger.error(error);
        res.status(rdk.httpstatus.bad_request).rdkSend(error);
        return;
    }

    var args = [];
    args.push('A', locationId, patientStatus);
    VistaJS.callRpc(req.logger, rpcConfig, 'ORWPCE GETSVC', args, function(error, result) {
        if (error) {
            req.logger.error(errorVistaJSCallback + error);
            res.status(rdk.httpstatus.internal_server_error).rdkSend(error);
        } else {
            if (result) {
                var data = {
                    data: {
                        serviceCategory: result
                    }
                };
                req.logger.info('Successfully retrieved service category from VistA.');
                res.status(rdk.httpstatus.ok).rdkSend(data);
            } else {
                req.logger.error(errorVistaJSCallback + result);
                res.status(rdk.httpstatus.internal_server_error).rdkSend(errorMessage);
            }
        }
    });
}

module.exports.getResourceConfig = getResourceConfig;
module.exports._getvisitServiceCategory = getvisitServiceCategory;
